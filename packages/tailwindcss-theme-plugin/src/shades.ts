import chroma, { Color } from 'chroma-js'
import { ColorShades, PalleteResult, ThemeType } from './types'
import { shadeKeys } from './utils'

export const generateContrastColor = (color: Color): Color => {
  const colorLuminance = chroma(color).luminance()
  return colorLuminance > 0.5 ? chroma('black') : chroma('white')
}

const easeOutQuad = (t: number) => t * (2 - t)

const easeOutCubic = (t: number) => {
  t -= 1;
  return t * t * t + 1;
}

export const generateColorShades = (
  color: Color,
  mode: ThemeType
) => {

  const shades = {}

  const colorGradient = generateChromaGradient(color)

  shadeKeys.forEach(shadeKey => {
    // invert shade sampling in case of light mode
    const shadeValue = mode === 'dark' ? shadeKey : 1000 - shadeKey
    const sampleValueDiff = easeOutQuad(shadeValue / 1000) * 1000 - shadeValue
    const sampleValue = shadeValue - sampleValueDiff / 3
    shades[shadeKey] = colorGradient(sampleValue)
  })

  return shades as ColorShades<Color>
}

const generateChromaGradient = (
  color: Color,
  roundLuminance = false
) => {
  const realColorLuminance = chroma(color).luminance() * 10

  // Rounded color position (0 to 1000)
  const roundedColorLuminance = Math.round(realColorLuminance) * 100

  const colorDomain = roundLuminance ? roundedColorLuminance : realColorLuminance * 100

  return chroma
    .scale(["black", color, "white"])
    .mode('hsl')
    .domain([0, colorDomain, 1000])
}
