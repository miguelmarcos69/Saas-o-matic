// Estado de una lectura remota (principio 7): carga, datos o error.
// Movido de health/ a shared/ en la spec 005 (Decisión 2026-11-23 #12), como fija architecture.md.
export type LoadState<T> =
  | { readonly status: 'loading' }
  | { readonly status: 'data'; readonly data: T }
  | { readonly status: 'error'; readonly message: string };
