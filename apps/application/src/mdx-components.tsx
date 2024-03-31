"use client";

import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    a: (props) => {
      return (
        <a target="_blank" rel="noopener noreferrer" {...props}>
          {props.children}
        </a>
      );
    },
  };
}
