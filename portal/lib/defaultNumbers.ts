/**
 * Edit this list to change the number offered when a visitor opens the portal
 * without a `lucky` URL parameter. Values must remain four digits.
 */
export const DEFAULT_NUMBERS = ["0000", "2222", "4444", "8888", "9999"] as const;

export function pickDefaultNumber() {
  return DEFAULT_NUMBERS[Math.floor(Math.random() * DEFAULT_NUMBERS.length)];
}