import { isCanonicalCustomerId } from './customer-id';

// spec 004: id canónico de la ruta del detalle (D-09; C-128, parte de la función; R-128).
describe('isCanonicalCustomerId', () => {
  it.each(['abc', '0', '01', '9007199254740992'])('«%s» → false (spec 004: C-128)', (idText) => {
    expect(isCanonicalCustomerId(idText)).toBe(false);
  });

  it.each(['1', '9007199254740991'])('«%s» → true', (idText) => {
    expect(isCanonicalCustomerId(idText)).toBe(true);
  });
});
