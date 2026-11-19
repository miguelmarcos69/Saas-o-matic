# Esqueleto de un recurso

Ilustra la forma con un recurso neutro, `item`. No contiene requisitos del reto. Las firmas son la convención; los cuerpos son mínimos. Comprueba el tipado con la versión instalada al implementar.

## 1. `CustomError` (`domain/errors/custom.error.ts`)
```ts
export type ErrorDetail = { field: string; code: string; message: string };

export class CustomError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly details: ErrorDetail[] = [],
  ) {
    super(message);
  }

  static validation(details: ErrorDetail[]): CustomError {
    return new CustomError('VALIDATION_ERROR', MENSAJE_VALIDACION, details); // texto: lo elige el autor
  }
}
```

## 2. Traductor de issues de Zod (`domain/dtos/zod-issues.ts`)
```ts
import type { z } from 'zod';

type Issue = z.ZodError['issues'][number];

const codeOf = (issue: Issue): StableCode => {
  switch (issue.code) {
    case 'invalid_type': return issue.input === undefined ? 'REQUIRED' : 'INVALID_TYPE'; // exige reportInput
    case 'too_small': return 'TOO_SMALL';
    case 'too_big': return 'TOO_BIG';
    case 'invalid_format': return 'INVALID_FORMAT';
    case 'unrecognized_keys': return 'UNKNOWN_FIELD'; // el nombre del campo está en issue.keys (sin comprobar)
    default: return 'INVALID_VALUE'; // los `custom` los define cada spec
  }
};

export const toDetails = (issues: Issue[]): ErrorDetail[] =>
  issues.map((issue) => {
    const code = codeOf(issue);
    return { field: issue.path.map(String).join('.'), code, message: MESSAGES[code] }; // MESSAGES: los textos los elige el autor
  }); // `issue.input` no se copia a ninguna parte
```

## 3. DTO (`domain/dtos/items/create-item.dto.ts`)
```ts
import { z } from 'zod';

const schema = z.strictObject({ name: z.string().trim().min(1) });

export class CreateItemDto {
  private constructor(readonly name: string) {}

  static create(body: unknown): [CustomError, undefined] | [undefined, CreateItemDto] {
    const result = schema.safeParse(body, { reportInput: true });
    if (!result.success) return [CustomError.validation(toDetails(result.error.issues)), undefined];
    return [undefined, new CreateItemDto(result.data.name)];
  }
}
```

## 4. Entidad y puertos (`domain/`)
```ts
export interface ItemEntity { readonly id: number; readonly name: string; readonly createdAt: string }

export interface ItemDatasource { create(dto: CreateItemDto): Promise<ItemEntity> }
export interface ItemRepository { create(dto: CreateItemDto): Promise<ItemEntity> }
```

## 5. Caso de uso (`domain/use-cases/item/create-item.ts`)
```ts
export class CreateItem {
  constructor(private readonly repository: ItemRepository) {}
  execute(dto: CreateItemDto): Promise<ItemEntity> { return this.repository.create(dto); }
}
```

## 6. Datasource y repositorio (`infrastructure/`)
```ts
export class SqliteItemDatasource implements ItemDatasource {
  async create(dto: CreateItemDto): Promise<ItemEntity> {
    try {
      const info = db.prepare('INSERT INTO items (name) VALUES (?)').run(dto.name);
      const row = db.prepare('SELECT id, name, created_at FROM items WHERE id = ?').get(info.lastInsertRowid) as ItemRow;
      return toEntity(row); // fila snake_case → entidad camelCase: único sitio
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        throw new CustomError('CONFLICT', MENSAJE_CONFLICTO); // código de dominio: lo define la spec
      }
      throw error; // lo no reconocido sale como INTERNAL_ERROR
    }
  }
}

export class ItemRepositoryImp implements ItemRepository {
  constructor(private readonly datasource: ItemDatasource) {}
  create(dto: CreateItemDto) { return this.datasource.create(dto); }
}
```

## 7. Controlador (`presentation/items/controller.ts`)
```ts
import { toHttpError } from '../middlewares/error-handler';

export class ItemController {
  constructor(private readonly repository: ItemRepository) {}

  create = async (req: Request, res: Response) => {
    try {
      const [error, dto] = CreateItemDto.create(req.body);
      if (error) return this.handleError(error, res);
      const item = await new CreateItem(this.repository).execute(dto); // un caso de uso por petición
      res.status(/* estado del contrato de la spec */ 201).json(item);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  private handleError = (error: unknown, res: Response) => {
    const { status, body } = toHttpError(error); // la tabla code → estado vive en error-handler.ts
    res.status(status).json(body);
  };
}
```

## 8. `routes.ts` (`presentation/items/routes.ts`): la composición
```ts
export class ItemRoutes {
  static get routes(): Router {
    const datasource = new SqliteItemDatasource();
    const repository = new ItemRepositoryImp(datasource);
    const controller = new ItemController(repository);
    const router = Router();
    router.post('/', controller.create); // el prefijo lo monta presentation/routes.ts (por decidir)
    return router;
  }
}
```

## 9. Tests
Unitario del caso de uso, con un repositorio falso (sin base de datos ni Express):
```ts
it('devuelve la entidad del repositorio', async () => {
  const repository: ItemRepository = { create: async (dto) => ({ id: 1, name: dto.name, createdAt: 'fecha' }) };
  const [, dto] = CreateItemDto.create({ name: 'a' });
  expect(await new CreateItem(repository).execute(dto!)).toMatchObject({ id: 1, name: 'a' });
});
```
Integración de un endpoint (`presentation/items/routes.spec.ts`), con SQLite `:memory:`:
```ts
beforeEach(() => { db.exec('DELETE FROM items'); }); // tablas vaciadas antes de cada caso

it('responde VALIDATION_ERROR con details si falta un campo', async () => {
  const res = await post('/items', {}); // cliente HTTP de tests por decidir (fase 6)
  expect(res.status).toBe(400);
  expect(res.body.error.details[0]).toMatchObject({ field: 'name', code: 'REQUIRED' });
});
```
