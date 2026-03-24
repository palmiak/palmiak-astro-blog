const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export function u(path: string): string {
  return `${base}${path}`;
}
