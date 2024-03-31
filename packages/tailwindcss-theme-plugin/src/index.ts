import plugin from 'tailwindcss/plugin';
import { ThemePalleteInput } from './types';
import { resolveThemedVariables } from './theamed-variables-resolver';
import { resolveThemeColorConfig } from './color-config-resolver';
import { CSSRuleObject } from 'tailwindcss/types/config';
import { themeKeys } from './utils';

interface ThemePluginInput {
  pallete: ThemePalleteInput
  cssVarPrefix?: string
}

export const themePlugin = plugin.withOptions<ThemePluginInput>(
  // generating theme utilities
  ({ pallete, cssVarPrefix }) => {
    return ({ theme, addBase, addUtilities }) => {
      const variableValues = themeKeys.reduce((acc, themeKey) => {
        acc[themeKey] = resolveThemedVariables(pallete, themeKey, cssVarPrefix)
        return acc
      }, {}) as CSSRuleObject

      Object.entries(variableValues).forEach(([themeKey, themeVariablesValues]) => {
        addBase({
          [`@media (prefers-color-scheme: ${themeKey})`]: {
            ':root': themeVariablesValues
          }
        })
        addUtilities({
          [`.theme-${themeKey}`]: themeVariablesValues
        })
      })

    }
  },
  // generating theme variables
  ({ pallete, cssVarPrefix }: ThemePluginInput) => {

    const colors = resolveThemeColorConfig(
      pallete.colors,
      pallete.generate,
      cssVarPrefix
    )

    return {
      theme: {
        colors
      }
    }
  }
)


