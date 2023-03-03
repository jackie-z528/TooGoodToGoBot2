export const getEnvString = (variable: string, fallback: string): string =>
  process.env[variable] ?? fallback;
