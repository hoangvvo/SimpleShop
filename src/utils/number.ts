export const defaultFormatLongNumberSeperator = " ";

export function formatLongNumber(
  x: number,
  seperator = defaultFormatLongNumberSeperator
) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, seperator);
}
