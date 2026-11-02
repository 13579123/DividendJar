// 标准化浮点数
export function normalizeFloat(num: number): string {
  if (num > 100000) {
    return (num / 10000).toFixed(2).toString() + "万"
  }
  return num.toFixed(2).toString()
}