import type { Position } from '../../types/position';

const POSITION_STORAGE_KEY = 'powerUpPosition';

export function savePosition(position: Position): void {
    try {
        localStorage.setItem(POSITION_STORAGE_KEY, JSON.stringify(position));
    } catch (error) {
        console.error('Failed to save PowerUp position:', error);
    }
}

export function loadPosition(): Position | null {
    try {
        const savedPosition = localStorage.getItem(POSITION_STORAGE_KEY);
        return savedPosition ? JSON.parse(savedPosition) : null;
    } catch (error) {
        console.error('Failed to load PowerUp position:', error);
        return null;
    }
}

export function formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}