export function calculateROI(spend: number, leads: number, closingRate: number, ltv: number) {
  if (spend < 0 || leads < 0 || closingRate < 0 || ltv < 0) {
    throw new Error('Values must be positive');
  }

  const costPerLead = spend / (leads || 1);
  const customers = Math.floor(leads * (closingRate / 100));
  const revenue = customers * ltv;
  const profit = revenue - spend;
  const roas = revenue / (spend || 1);

  return {
    costPerLead,
    customers,
    revenue,
    profit,
    roas: roas.toFixed(2),
    isProfitable: profit > 0
  };
}
