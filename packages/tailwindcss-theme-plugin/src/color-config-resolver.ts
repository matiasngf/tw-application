import { GenerativeOptions, PalleteResult, ThemeColorsInput } from './types';
import { RecursiveKeyValuePair, ResolvableTo } from 'tailwindcss/types/config';
import { camelToKebabCase, resolveGenerativeParams, resolvePrefix, shadeKeys } from './utils';

/**
 * Generates color config passed to the tailwind theme,
 * the colors are linked to the CSS variables.
 */
export const resolveThemeColorConfig = (
  colors: ThemeColorsInput,
  globalGenerateOptions: GenerativeOptions = {},
  cssVarPrefix?: string
): ResolvableTo<RecursiveKeyValuePair<string, string>> => {

  const prefix = resolvePrefix(cssVarPrefix)

  return Object.entries(colors).reduce((acc, [colorKey, color]) => {

    const colorName = camelToKebabCase(colorKey)
    const colorGenerateOptions = typeof color === 'string' ? {} : color.generate
    const customVariants = typeof color === 'string' ? undefined : color.custom
    // merge global and color config
    const colorConfig = resolveGenerativeParams(
      globalGenerateOptions,
      colorGenerateOptions
    )

    acc[colorName] = {
      DEFAULT: `rgb(var(--${prefix}${colorName}-rgb) / <alpha-value>)`
    }

    if (colorConfig.shades) {
      acc[colorName] = {
        ...acc[colorName],
        ...generateShadedNames(`${prefix}${colorName}`)
      }
    }

    if (colorConfig.contrast) {
      acc[colorName].contrast = `rgb(var(--${prefix}${colorName}-contrast-rgb) / <alpha-value>)`
    }

    if (customVariants) {
      Object.keys(customVariants).forEach(variantKey => {
        acc[colorName][variantKey] = `rgb(var(--${prefix}${colorName}-${variantKey}-rgb) / <alpha-value>)`
      })
    }

    return acc

  }, {})
}

const generateShadedNames = (colorName: string): PalleteResult => {
  return shadeKeys.reduce((acc, shadeKey) => {
    const shadeKeyString = shadeKey.toString()
    acc[shadeKeyString] = `rgb(var(--${colorName}-${shadeKey}-rgb) / <alpha-value>)`
    return acc
  }, {})
}
