// utils/dateHelpers.ts
export function getFinancialYearRange(financialYearStart: number) {
  return [
    {year: financialYearStart, month: {gte: 4, lte: 12}}, // April–Dec
    {year: financialYearStart + 1, month: {gte: 1, lte: 3}}, // Jan–Mar
  ];
}

export function getCurrentFinancialYearStart(): number {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1; // 0-indexed

  return month >= 4 ? year : year - 1;
}
