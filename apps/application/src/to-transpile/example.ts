export function isString(str: string | number): boolean {
  if (typeof str === 'string') {
    return true;
  } else {
    return false;
  }

}


// Comments and strings should not be transpiled ej:
// export, function, const
"export function const"
