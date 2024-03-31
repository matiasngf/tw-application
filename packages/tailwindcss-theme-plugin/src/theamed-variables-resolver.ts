import chroma from 'chroma-js';
import { ThemeKey, ThemePalleteInput } from './types';
import { camelToKebabCase, resolveGenerativeParams, resolvePrefix } from './utils';
import { CSSRuleObject } from 'tailwindcss/types/config';
import { generateColorShades, generateContrastColor } from './shades';

/** Genrate the variable values for each theme. */
export const resolveThemedVariables = (
  pallete: ThemePalleteInput,
  themeKey: ThemeKey,
  cssVarPrefix?: string
): CSSRuleObject => {

  const {
    colors,
    generate: globalGenerateOptions = {}
  } = pallete

  const prefix = resolvePrefix(cssVarPrefix)

  const theamedVariables: CSSRuleObject = {}

  Object.entries(colors).forEach(([colorKey, colorConfig]) => {
    const colorHex = typeof colorConfig === 'string' ? colorConfig : colorConfig[themeKey]
    const color = chroma(colorHex)
    const colorName = camelToKebabCase(colorKey)
    const colorGenenativeCustomOptions = typeof colorConfig === 'string' ? {} : colorConfig.generate
    const customVariants = typeof colorConfig === 'string' ? undefined : colorConfig.custom
    // merge global and color config
    const colorGenerativeConfig = resolveGenerativeParams(
      globalGenerateOptions,
      colorGenenativeCustomOptions
    )

    theamedVariables[`--${prefix}${colorName}-rgb`] = color.rgb().join(' ')
    theamedVariables[`--${prefix}${colorName}`] = color.hex()

    if (colorGenerativeConfig.contrast) {
      const contrastColor = generateContrastColor(color)
      theamedVariables[`--${prefix}${colorName}-contrast-rgb`] = contrastColor.rgb().join(' ')
      theamedVariables[`--${prefix}${colorName}-contrast`] = contrastColor.hex()
    }

    if (colorGenerativeConfig.shades) {
      const shades = generateColorShades(color, themeKey)
      Object.entries(shades).forEach(([shadeKey, shadeValue]) => {
        theamedVariables[`--${prefix}${colorName}-${shadeKey}-rgb`] = shadeValue.rgb().join(' ')
        theamedVariables[`--${prefix}${colorName}-${shadeKey}`] = shadeValue.hex()
      })
    }

    if (customVariants) {
      Object.entries(customVariants).forEach(([variantKey, variantColorConfig]) => {
        const variantColorHex = variantColorConfig[themeKey]
        const variantColor = chroma(variantColorHex)
        theamedVariables[`--${prefix}${colorName}-${variantKey}-rgb`] = variantColor.rgb().join(' ')
        theamedVariables[`--${prefix}${colorName}-${variantKey}`] = variantColor.hex()
      })
    }

  })

  return theamedVariables
}
