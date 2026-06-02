export function formatPrice(value: unknown): string {
  const num = Number(value);
  return `R$ ${(isNaN(num) ? 0 : num).toFixed(2).replace('.', ',')}`;
}
