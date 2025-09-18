import React, { createContext, useContext, useEffect } from 'react';
import { useWorkshopSettings, type WorkshopSettings } from '@/hooks/useWorkshopSettings';

interface WorkshopSettingsContextType {
  settings: WorkshopSettings;
  loading: boolean;
  saveSettings: (settings: WorkshopSettings) => Promise<boolean>;
  updateSettings: (settings: WorkshopSettings) => void;
}

const WorkshopSettingsContext = createContext<WorkshopSettingsContextType | undefined>(undefined);

export function WorkshopSettingsProvider({ children }: { children: React.ReactNode }) {
  const workshopSettings = useWorkshopSettings();

  // Apply theme changes to document
  useEffect(() => {
    if (!workshopSettings.loading) {
      const { theme, primary_color, secondary_color } = workshopSettings.settings;
      
      // Apply theme class
      document.documentElement.className = theme;
      
      // Convert hex to HSL and apply CSS variables
      const hexToHsl = (hex: string) => {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0, s = 0, l = (max + min) / 2;

        if (max !== min) {
          const d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
          }
          h /= 6;
        }

        return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
      };

      const primaryHsl = hexToHsl(primary_color);
      const secondaryHsl = hexToHsl(secondary_color);

      document.documentElement.style.setProperty('--primary', primaryHsl);
      document.documentElement.style.setProperty('--secondary', secondaryHsl);
    }
  }, [workshopSettings.settings, workshopSettings.loading]);

  return (
    <WorkshopSettingsContext.Provider value={workshopSettings}>
      {children}
    </WorkshopSettingsContext.Provider>
  );
}

export function useWorkshopSettingsContext() {
  const context = useContext(WorkshopSettingsContext);
  if (context === undefined) {
    throw new Error('useWorkshopSettingsContext must be used within a WorkshopSettingsProvider');
  }
  return context;
}