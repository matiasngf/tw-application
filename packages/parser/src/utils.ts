export const getKeywordsRegex = (keywords: Record<string, string>) => {
  let keywordsRegRaw = '';
  Object.values(keywords).forEach((keyword, i) => {
    if (i !== 0) {
      keywordsRegRaw += `|(?:${keyword})`;
    } else {
      keywordsRegRaw += `(?:${keyword})`;
    }
  });
  keywordsRegRaw = `^(?:${keywordsRegRaw})(?!\\w)`;

  const keywordsRegex = new RegExp(keywordsRegRaw);
  return keywordsRegex
}

export const matchReplace = (regexp: RegExp, str: string, replace = '') => {
  const match = regexp.exec(str);
  if (!match) {
    return null;
  }
  return [match[0], str.replace(regexp, replace)];
}

export const mergeTokens = (tokens: { value: string }[]) => {
  let source = '';
  for (const token of tokens) {
    source += token.value;
  }
  return source;
}

export const reverseTokens = (tokens: Record<string, string>): Record<string, string> => {
  const reversedTokens: Record<string, string> = {};
  Object.entries(tokens).forEach(([key, value]) => {
    reversedTokens[value] = key;
  });
  return reversedTokens;
}
