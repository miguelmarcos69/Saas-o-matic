// Id de la ruta del detalle que la API acepta: entero canónico entre 1 y MAX_SAFE_INTEGER
// (spec 004: R-128; D-09, que lo hace coincidir con la D-04 de la API).
export function isCanonicalCustomerId(idText: string): boolean {
  return /^[1-9][0-9]*$/.test(idText) && Number(idText) <= Number.MAX_SAFE_INTEGER;
}
