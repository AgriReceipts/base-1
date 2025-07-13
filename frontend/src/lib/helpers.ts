export function formatMoney(val: number) {
  const absVal = Math.abs(val);
  const prefix = val < 0 ? '-' : '';

  if (absVal >= 100000) return `${prefix}₹${(absVal / 100000).toFixed(1)}L`;
  if (absVal >= 1000) return `${prefix}₹${(absVal / 1000).toFixed(1)}K`;
  if (absVal >= 1) return `${prefix}₹${absVal.toFixed(0)}`;
  return `${prefix}₹${absVal}`; // For values < 1 (e.g. 0.52)
}
