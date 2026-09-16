export function coverUrl(cover?: string): string | undefined {
  if (!cover) return undefined;
  if (cover.startsWith('http') || cover.startsWith('/')) return cover;
  return `/images/${cover}`;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatMonthYear(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
  });
}
