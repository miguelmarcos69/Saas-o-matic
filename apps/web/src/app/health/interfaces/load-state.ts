// Estado de una lectura remota (principio 7): carga, datos o error.
// Nace en health/; pasa a shared/interfaces/ cuando lo use una segunda funcionalidad (frontend-conventions).
export type LoadState<T> =
  | { readonly status: 'loading' }
  | { readonly status: 'data'; readonly data: T }
  | { readonly status: 'error'; readonly message: string };
