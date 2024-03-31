import { ColorShadeKey, GenerativeOptions, ThemeKey } from './types';

export const camelToKebabCase = str => str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);

export const resolvePrefix = (prefix?: string) => prefix ? `${prefix}-` : ''

/** Merge global and local params for each color */
export const resolveGenerativeParams = (
  glovalColorConfig: GenerativeOptions = {},
  colorConfig: GenerativeOptions = {}
) => {
  return {
    ...glovalColorConfig,
    ...colorConfig
  }
}

export const shadeKeys: ColorShadeKey[] = [
  50,
  100,
  200,
  300,
  400,
  500,
  600,
  700,
  800,
  900,
  950
]

/** The name of the themes */
export const themeKeys: ThemeKey[] = [
  'dark',
  'light',
]
