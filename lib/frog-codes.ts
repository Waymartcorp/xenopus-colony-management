/**
 * Frog code generation utilities.
 *
 * Public codes are globally unique identifiers for frogs in the format:
 *   XL-YYYY-NNNN (e.g., XL-2025-0042)
 *
 * Local IDs are institution-specific and user-defined (e.g., "Rack2-F3").
 */

// TODO: Generate sequential codes per organization
// TODO: Ensure uniqueness via Supabase unique constraint
// TODO: Support bulk code pre-generation for shipments

const CODE_PREFIX = "XL";

export function generatePublicCode(year: number, sequence: number): string {
  const paddedSequence = String(sequence).padStart(4, "0");
  return `${CODE_PREFIX}-${year}-${paddedSequence}`;
}

export function parsePublicCode(code: string): {
  prefix: string;
  year: number;
  sequence: number;
} | null {
  const match = code.match(/^([A-Z]+)-(\d{4})-(\d+)$/);
  if (!match) return null;
  return {
    prefix: match[1],
    year: parseInt(match[2], 10),
    sequence: parseInt(match[3], 10),
  };
}

export function validatePublicCode(code: string): boolean {
  return /^[A-Z]+-\d{4}-\d{4,}$/.test(code);
}

export async function getNextSequence(
  _organizationId: string,
  _year: number
): Promise<number> {
  // TODO: Query Supabase for max sequence in org+year, return next
  return 1;
}
