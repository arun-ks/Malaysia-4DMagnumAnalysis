export const PRIZE_TYPES = ["1", "2", "3", "C", "S"] as const;
export type PrizeType = (typeof PRIZE_TYPES)[number];
export type ResultTuple = [date: string, drawId: string, prizeType: PrizeType];

export interface HistoryData {
  schemaVersion: number;
  generatorVersion: string;
  generatedAt: string;
  updatedThrough: string;
  earliestResult: string;
  sourceRowCount: number;
  recordCount: number;
  duplicateRowsRemoved: number;
  uniqueNumberCount: number;
  sourceSha256: string;
  numbers: Record<string, ResultTuple[]>;
}

export interface ResultPoint {
  number: string;
  date: string;
  drawId: string;
  prizeType: PrizeType;
  daysSincePrevious: number | null;
}

export function normalizeNumber(value: string): string | null {
  const digits = value.replace(/\D/g, "");
  if (!digits || digits.length > 4) return null;
  return digits.padStart(4, "0");
}

export function daysBetween(later: string, earlier: string): number {
  return Math.round((Date.parse(later) - Date.parse(earlier)) / 86_400_000);
}

export function buildPoints(
  data: HistoryData,
  numbers: string[],
  selectedPrizes: ReadonlySet<PrizeType>,
  fromDate: string,
  toDate: string,
): ResultPoint[] {
  return numbers.flatMap((number) => {
    const matching = (data.numbers[number] ?? []).filter((item) => selectedPrizes.has(item[2]));
    return matching
      .map((item, index) => ({
        number,
        date: item[0],
        drawId: item[1],
        prizeType: item[2],
        daysSincePrevious: index ? daysBetween(item[0], matching[index - 1][0]) : null,
      }))
      .filter((point) => point.date >= fromDate && point.date <= toDate);
  });
}
