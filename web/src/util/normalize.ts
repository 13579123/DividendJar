// 标准化浮点数
export function normalizeFloat(num: number, fixed: number = 2): string {
  function formatDecimalWithCommas(num: number) {
    let parts = num.toFixed(fixed).toString().split(".");
    parts[0] = (parts[0] || "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }
  if (num > 1000000) return formatDecimalWithCommas((num / 10000)) + "万"
  return formatDecimalWithCommas(num)
}