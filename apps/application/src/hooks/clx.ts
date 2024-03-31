import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge'

export const clx = (...inputs: ClassValue[]) => twMerge(clsx(...inputs))


// Comments and strings should not be transpiled
// function const export
/** function const export */
"const export"
