// src/context/ChildSettingsContext.tsx
import { createContext, useContext, useState, useMemo, useCallback, type ReactNode } from "react";
import type { AvatarType } from "../types/students";

export type ChildSettings = {
  childName: string;
  maxNumber: 5 | 10; // כרגע 5 או 10
  sessionLength: 5 | 7 | 10; // כמה תרגילים בסשן
  showHints: boolean;
  animationsEnabled: boolean;
  soundsEnabled: boolean;
  autoPlayLessonAudio: boolean; // השמעה אוטומטית של הסבר לפני כל תרגיל
  selectedExamId?: string; // מזהה מבחן שנבחר ע"י הורה
  // מידע על התלמיד הנבחר
  studentId?: string; // מזהה התלמיד
  studentAvatar?: AvatarType; // סוג האווטר
  studentColor?: string; // צבע מותאם אישית
  studentPhotoUrl?: string; // URL לתמונת התלמיד (base64 או URL)
};

const defaultSettings: ChildSettings = {
  childName: "ילד",
  maxNumber: 5,
  sessionLength: 5,
  showHints: true,
  animationsEnabled: false,
  soundsEnabled: true,
  autoPlayLessonAudio: true, // ברירת מחדל: השמעה אוטומטית של הסבר לפני תרגיל
};

type ChildSettingsContextType = {
  settings: ChildSettings;
  setSettings: (s: ChildSettings) => void;
};

const ChildSettingsContext = createContext<ChildSettingsContextType | null>(
  null
);

export function ChildSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<ChildSettings>(() => {
    // נטען מה-localStorage אם קיים
    try {
      const stored = localStorage.getItem("easymath-child-settings");
      if (stored) {
        return JSON.parse(stored) as ChildSettings;
      }
    } catch {
      // נתעלם משגיאות
    }
    return defaultSettings;
  });

  const handleSetSettings = useCallback((newSettings: ChildSettings) => {
    setSettings(newSettings);
    try {
      localStorage.setItem(
        "easymath-child-settings",
        JSON.stringify(newSettings)
      );
    } catch {
      // אם הדפדפן חוסם – לא נורא
    }
  }, []);

  const contextValue = useMemo(
    () => ({ settings, setSettings: handleSetSettings }),
    [settings, handleSetSettings]
  );

  return (
    <ChildSettingsContext.Provider value={contextValue}>
      {children}
    </ChildSettingsContext.Provider>
  );
}

export function useChildSettings() {
  const ctx = useContext(ChildSettingsContext);
  if (!ctx) {
    throw new Error("useChildSettings must be used within ChildSettingsProvider");
  }
  return ctx;
}
