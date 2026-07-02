import type { Property } from './data';

const KEY = 'immopro_favorites';

export function getFavorites(): Property[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch (e) {
    return [];
  }
}

export function toggleFavorite(property: Property): boolean {
  let favs = getFavorites();
  const exists = favs.findIndex((f) => f.id === property.id);
  if (exists !== -1) {
    favs.splice(exists, 1);
  } else {
    favs.unshift(property);
  }
  localStorage.setItem(KEY, JSON.stringify(favs));
  window.dispatchEvent(new CustomEvent('favorites-updated'));
  return exists === -1;
}

export function removeFavorite(id: string): void {
  let favs = getFavorites();
  const index = favs.findIndex((f) => f.id === id);
  if (index !== -1) {
    favs.splice(index, 1);
    localStorage.setItem(KEY, JSON.stringify(favs));
    window.dispatchEvent(new CustomEvent('favorites-updated'));
  }
}

export function isFavorited(id: string): boolean {
  return getFavorites().some((f) => f.id === id);
}