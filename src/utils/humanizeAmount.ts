export function sevenDigit(number: number | string): string {
  const numStr = number.toString();
  const [integer, decimal = ''] = numStr.split('.');

  if (!decimal) return integer;

  const precisionMap: Record<number, number> = {
    0: 8,
    1: 7,
    2: 6,
    3: 5,
    4: 4,
    5: 3,
    6: 2,
  };

  const precision = precisionMap[integer.length] ?? 0;

  if (precision > 0) {
    const sliced = `${integer}.${decimal.slice(0, precision)}`;
    const num = parseFloat(sliced);
    return Number.isInteger(num) ? integer : num.toFixed(2);
  }

  return integer;
}

function humanizeAmount(amount: number | string, big: boolean = false): string {
  const num = typeof amount === 'number' ? amount : parseFloat(amount);

  if (isNaN(num) || num === 0) return '0';
  if (num < 0.000001) return amount.toString();

  if (big) {
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}m`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}k`;
  }

  return formatNumberWithCommas(sevenDigit(num));
}

function formatNumberWithCommas(number: string): string {
  const [integer, decimal] = number.split('.');
  return decimal
    ? `${integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${decimal}`
    : integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export default humanizeAmount;
