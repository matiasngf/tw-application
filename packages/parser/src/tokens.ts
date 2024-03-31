export const jsToEmoji: Record<string, string> = {
  // custom
  'console.log': '📣',
  'Math': '📐',
  // typescript
  'interface': '💀',
  'type': '🔧',
  // common
  'from': '🗺️',
  'function': '🤖',
  'return': '👈',
  'if': '🤔',
  'true': '👍',
  'false': '👎',
  'else': '🤷',
  'throw': '🔥',
  'typeof': '🧐',
  'const': '💿',
  'let': '💽',
  'var': '💾',
  'static': '🔒',
  'private': '🙈',
  'public': '🙉',
  'await': '⌛',
  'try': '🏒',
  'catch': '🥅',
  'while': '🏃',
  'abstract': '🎨',
  'break': '🙅‍',
  'case': '⚠',
  'continue': '👇',
  'delete': '❌',
  'finally': '🔚',
  'for': '🔃',
  'implements': '🔨',
  'new': '🍼',
  'null': '⚫',
  'package': '📦',
  'protected': '🙊',
  'short': 'short',
  'super': '🦸‍♂️',
  'switch': '🔀',
  'synchronized': '👯‍♂️',
  'this': '👆',
  'throws': '🥏',
  'void': '👻',
  'import': '⬇',
  'export': '⬆',
  'in': '🔍',
  'eval': '🚨',
  'arguments': 'arguments',
  'boolean': 'boolean',
  'byte': 'byte',
  'char': 'char',
  'class': 'class',
  'debugger': 'debugger',
  'default': 'default',
  'do': 'do',
  'double': 'double',
  'enum': 'enum',
  'extends': 'extends',
  'final': 'final',
  'float': 'float',
  'goto': 'goto',
  'instanceof': 'instanceof',
  'int': 'int',
  'long': 'long',
  'native': 'native',
  'transient': 'transient',
  'volatile': 'volatile',
  'with': 'with',
  'yield': 'yield'
}

export const emojiToJs = (() => {
  const result: Record<string, string> = {}
  for (const key in jsToEmoji) {
    result[jsToEmoji[key]] = key
  }
  return result
})()


