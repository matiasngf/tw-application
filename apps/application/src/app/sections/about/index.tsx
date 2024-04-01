"use client";

import Content from "./who.mdx";

export const About = () => {
  return (
    <div className="container pt-0">
      <div className="prose-container prose max-w-[550px] my-6 text-center">
        <p>
          Hi! First of all, thanks for taking the time to read my job
          application. There must be a lot of talented individuals applying to
          join this amazing place, so I'll try to be concise. I hope you find my
          profile interesting or, at least, have some fun like I did when
          creating this page.
        </p>
      </div>
      <div className="mt-48 prose-container prose">
        <Content />
      </div>
    </div>
  );
};
