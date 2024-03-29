import { emojiToJs, jsToEmoji } from "./tokens";
import { getKeywordsRegex, matchReplace } from "./utils";

/** Parse a source code form EmoJs to node */
export const parse = (source: string, reverse = false) => {
  const result = [];
  let tmpSource = source

  const tokens = reverse ? emojiToJs : jsToEmoji;

  const matchers = {
    space: /(^[\s\t\n\r]+)/,
    multiLineComment: /^\/\*(?:(?!\*\/).|[\n\r])+\*\//,
    singleLineComment: /^\/\/.*/,
    stringDobleQuote: /^"(?:[^"\\]|\\.)*"/,
    stringSingleQuote: /^'(?:[^'\\]|\\.)*'/,
    templateLiteral: /^`(?:[^'\\]|\\.)*`/,
    keyword: getKeywordsRegex(tokens),
    identifier: /^[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*/,
  }

  const matchersEntries = Object.entries(matchers);
  while (tmpSource.length) {
    let foundToken = false
    for (const [type, matcher] of matchersEntries) {
      const extractedMatch = matchReplace(matcher, tmpSource);
      if (extractedMatch) {
        const [value, newSource] = extractedMatch;
        tmpSource = newSource;
        result.push({
          type,
          value,
        })
        foundToken = true;
        break;
      }
    }
    if (!foundToken) {
      const token = tmpSource.charAt(0);
      tmpSource = tmpSource.slice(1);
      result.push({
        type: 'puntctuator',
        value: token,
      })
    }
  }
  return result;
}
