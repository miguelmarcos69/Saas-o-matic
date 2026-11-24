import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ExchangeRates, exchangeRatesSchema } from '../schemas/exchange-rates';

const EXCHANGE_RATES_URL = 'https://open.er-api.com/v6/latest/EUR';

// Único servicio con HttpClient para los tipos de cambio (spec 005: R-17, R-18, R-19; D-06).
// Solo hace la petición y la valida con el esquema; no guarda estado.
@Injectable({ providedIn: 'root' })
export class ExchangeRatesApi {
  private readonly http = inject(HttpClient);

  // Si el cuerpo no supera el esquema, `parse` lanza y el observable termina en error.
  fetch(): Observable<ExchangeRates> {
    return this.http
      .get<unknown>(EXCHANGE_RATES_URL)
      .pipe(map((body) => exchangeRatesSchema.parse(body)));
  }
}
