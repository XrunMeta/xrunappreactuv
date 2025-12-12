

export const filterAsciiPrintable = (value: string): string => {
  return value.replace(/[^\x20-\x7E]/g, '');
};

