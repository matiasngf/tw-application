import { RecursiveKeyValuePair, ResolvableTo } from "tailwindcss/types/config"

export type ThemeKey = 'light' | 'dark'

export type ThemeType = 'light' | 'dark'

export type PalleteResult = ResolvableTo<RecursiveKeyValuePair<string, string>>

export type ColorShadeKey =
  50 |
  100 |
  200 |
  300 |
  400 |
  500 |
  600 |
  700 |
  800 |
  900 |
  950

export type ColorShades<T = string> = Record<ColorShadeKey, T>

export type ColorRelativeKey =
  '-10' |
  '-20' |
  '-30' |
  '-40' |
  '-50' |
  '-60' |
  '-70' |
  '-80' |
  '-90' |
  '-100' |
  10 |
  20 |
  30 |
  40 |
  50 |
  60 |
  70 |
  80 |
  90 |
  100

export type ColorRelatives<T = string> = Record<ColorRelativeKey, T>

export type TheamedVariable<T> = Record<ThemeKey, T>

export interface GenerativeOptions {
  shades?: boolean
  contrast?: boolean
}

export interface ThemeColorBase {
  custom?: {
    [key: string]: TheamedVariable<string>
  }
  generate?: GenerativeOptions
}

export type ThemeColor = ThemeColorBase & TheamedVariable<string>

export interface ThemeColorsInput {
  [key: string]: string | ThemeColor
}

export interface ThemePalleteInput {
  generate?: GenerativeOptions
  colors: ThemeColorsInput
}

// Example
export const groundColor: ThemeColor = {
  dark: "#000",
  light: "#fff",
  custom: {
    hover: {
      dark: "#222",
      light: "#ccc",
    },
  },
  generate: {
    shades: true,
    contrast: true
  }
}
