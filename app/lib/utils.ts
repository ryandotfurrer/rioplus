import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Define the types of WoW classes for better type safety
export type WowClass = 
  | "Death Knight" 
  | "Demon Hunter" 
  | "Druid" 
  | "Evoker" 
  | "Hunter" 
  | "Mage" 
  | "Monk" 
  | "Paladin" 
  | "Priest" 
  | "Rogue" 
  | "Shaman" 
  | "Warlock" 
  | "Warrior";

// Color scheme type for better organization
export type ClassColorScheme = {
  original: string;  // Original WoW color
  light: string;     // WCAG-accessible for light mode
  dark: string;      // WCAG-accessible for dark mode
};

// Combined class colors with all variants
export const classColors: Record<WowClass, ClassColorScheme> = {
  "Death Knight": {
    original: "#C41F3B",
    light: "#A01930",
    dark: "#FF5D79"
  },
  "Demon Hunter": {
    original: "#A330C9",
    light: "#7D1E9E",
    dark: "#D976FF"
  },
  "Druid": {
    original: "#FF7D0A",
    light: "#C25A00",
    dark: "#FFA048"
  },
  "Evoker": {
    original: "#33937F",
    light: "#006B59",
    dark: "#4EDBBA"
  },
  "Hunter": {
    original: "#ABD473",
    light: "#4B721F",
    dark: "#C4E67A"
  },
  "Mage": {
    original: "#69CCF0",
    light: "#0077B5",
    dark: "#7DE0FF"
  },
  "Monk": {
    original: "#00FF96",
    light: "#008E59",
    dark: "#5FFFCD"
  },
  "Paladin": {
    original: "#F58CBA",
    light: "#C73A89",
    dark: "#FFB0DC"
  },
  "Priest": {
    original: "#FFFFFF",
    light: "#6A6A6A", // Darker grey for light mode
    dark: "#FFFFFF"
  },
  "Rogue": {
    original: "#FFF569",
    light: "#8F8700",
    dark: "#FFFF8F"
  },
  "Shaman": {
    original: "#0070DE",
    light: "#0052B3",
    dark: "#59A9FF"
  },
  "Warlock": {
    original: "#9482C9",
    light: "#6836AD",
    dark: "#C6ACFF"
  },
  "Warrior": {
    original: "#C79C6E",
    light: "#7E5522",
    dark: "#FFD19A"
  }
};

/**
 * Returns a Tailwind CSS class for a WoW class color
 * Handles both light and dark mode with WCAG-accessible colors
 */
export function getClassColorClass(className: string): string {
  // Map class names to their specific tailwind classes
  const classNameToColorClass: Record<string, string> = {
    "Death Knight": "text-[#A01930] dark:text-[#FF5D79]",
    "Demon Hunter": "text-[#7D1E9E] dark:text-[#D976FF]",
    "Druid": "text-[#C25A00] dark:text-[#FFA048]",
    "Evoker": "text-[#006B59] dark:text-[#4EDBBA]",
    "Hunter": "text-[#4B721F] dark:text-[#C4E67A]",
    "Mage": "text-[#0077B5] dark:text-[#7DE0FF]",
    "Monk": "text-[#008E59] dark:text-[#5FFFCD]",
    "Paladin": "text-[#C73A89] dark:text-[#FFB0DC]",
    "Priest": "text-[#6A6A6A] dark:text-[#FFFFFF]",
    "Rogue": "text-[#8F8700] dark:text-[#FFFF8F]",
    "Shaman": "text-[#0052B3] dark:text-[#59A9FF]",
    "Warlock": "text-[#6836AD] dark:text-[#C6ACFF]",
    "Warrior": "text-[#7E5522] dark:text-[#FFD19A]",
  };
  
  // Return the specific class or fall back to default text color
  return classNameToColorClass[className] || "text-foreground";
}

/**
 * Get a specific variant of a class color (original, light, or dark)
 */
export function getClassColor(className: WowClass, variant: keyof ClassColorScheme = 'original'): string {
  return classColors[className][variant];
}

export type Faction = 'Alliance' | 'Horde' | 'Neutral';

export const factionColors: Record<Faction, ClassColorScheme> = {
  Alliance: {
    original: "#0070DE",
    light: "#0052B3",     // WCAG-accessible for light mode
    dark: "#59A9FF"       // WCAG-accessible for dark mode
  },
  Horde: {
    original: "#C41F3B",
    light: "#A01930",     // WCAG-accessible for light mode
    dark: "#FF5D79"       // WCAG-accessible for dark mode
  },
  Neutral: {
    original: "#E6CC80",
    light: "#9E8B48",     // WCAG-accessible for light mode
    dark: "#FFE0A3"       // WCAG-accessible for dark mode
  }
};

/**
 * Returns a Tailwind CSS class for a faction color
 */
export function getFactionColorClass(faction: string): string {
  // Map faction names to their specific tailwind classes
  const factionToColorClass: Record<string, string> = {
    "Alliance": "text-[#0052B3] dark:text-[#59A9FF]",
    "Horde": "text-[#A01930] dark:text-[#FF5D79]",
    "Neutral": "text-[#9E8B48] dark:text-[#FFE0A3]",
  };
  
  return factionToColorClass[faction] || "text-foreground";
}
