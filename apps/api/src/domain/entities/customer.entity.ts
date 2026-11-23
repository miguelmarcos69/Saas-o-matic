// Cliente guardado, tal como lo devuelve el repositorio (spec 002, R-02).
// createdAt es el created_at de la base, en UTC ISO 8601.
export interface CustomerEntity {
  readonly id: number;
  readonly companyName: string;
  readonly taxId: string;
  readonly email: string;
  readonly country: string;
  readonly plan: string;
  readonly createdAt: string;
}
