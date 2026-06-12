import { Injectable, signal, effect } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private isDarkModeSignal = signal<boolean>(false);
  private STORAGE_KEY = 'theme_preference';

  isDarkMode = this.isDarkModeSignal.asReadonly();

  constructor() {
    this.loadThemePreference();
    effect(() => {
      this.applyTheme(this.isDarkModeSignal());
    });
  }

  private loadThemePreference(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored !== null) {
      this.isDarkModeSignal.set(stored === 'dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.isDarkModeSignal.set(prefersDark);
    }
  }

  private applyTheme(isDark: boolean): void {
    if (isDark) {
      document.body.classList.add('dark-theme');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.body.classList.remove('dark-theme');
      document.documentElement.style.colorScheme = 'light';
    }
  }

  toggleTheme(): void {
    const newValue = !this.isDarkModeSignal();
    this.isDarkModeSignal.set(newValue);
    localStorage.setItem(this.STORAGE_KEY, newValue ? 'dark' : 'light');
  }

  setDarkMode(isDark: boolean): void {
    this.isDarkModeSignal.set(isDark);
    localStorage.setItem(this.STORAGE_KEY, isDark ? 'dark' : 'light');
  }
}
