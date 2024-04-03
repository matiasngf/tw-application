"use client";

import type { MDXComponents } from "mdx/types";
import { SectionTitle } from "./components/section-title";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    h2: (props) => {
      return <SectionTitle {...props} />;
    },
    a: (props) => {
      return (
        <a target="_blank" rel="noopener noreferrer" {...props}>
          {props.children}
        </a>
      );
    },
  };
}
