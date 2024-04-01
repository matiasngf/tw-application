"use client";

import { SectionTitle } from "@/components/section-title";

import Content from "./why.mdx";

export const Why = () => {
  return (
    <div className="container pt-0">
      <div className="prose-container prose">
        <Content />
      </div>
    </div>
  );
};
