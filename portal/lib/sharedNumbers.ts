const FOUR_DIGITS = /^\d{4}$/;

/** Keeps up to three valid, unique four-digit values in their URL order. */
export function parseLuckyNumbers(value: string | null): string[] {
  if (value === null) return [];
  const numbers: string[] = [];
  for (const candidate of value.split(",")) {
    const number = candidate.trim();
    if (FOUR_DIGITS.test(number) && !numbers.includes(number)) numbers.push(number);
    if (numbers.length === 3) break;
  }
  return numbers;
}

export function makeLuckyUrl(origin: string, pathname: string, numbers: string[]) {
  const url = new URL(pathname, origin);
  url.searchParams.set("lucky", numbers.join(","));
  return url.toString();
}