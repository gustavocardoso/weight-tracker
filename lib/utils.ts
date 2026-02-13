import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: string | Date): string {
  if (typeof date === 'string') {
    // Parse date as local date, not UTC
    const [year, month, day] = date.split('T')[0].split('-');
    const d = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return d.toLocaleDateString('pt-BR');
  }
  return date.toLocaleDateString('pt-BR');
}

export function formatWeight(weight: number): string {
  return `${weight.toFixed(1)} kg`;
}
