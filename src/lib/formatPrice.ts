export function formatPrice(price: number): string {
  return price.toFixed(2).replace(".", ",") + " €";
}
export function formatDiscount(original: number, sale: number): number {
  return Math.round(((original - sale) / original) * 100);
}
