export const safeStringCompare = (
  value: string | number | null | undefined,
  filter: string,
): boolean => {
  if (value === null || value === undefined) return false;
  const stringValue = typeof value === "number" ? value.toString() : value;
  return stringValue.toLowerCase().includes(filter.toLowerCase());
};
