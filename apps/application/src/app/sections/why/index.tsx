import { SectionTitle } from "@/components/section-title";

export const Why = () => {
  return (
    <div className="container pt-0">
      <SectionTitle className="mt-32">why</SectionTitle>
      <div className="prose-container py-16">
        <p>
          <i>
            My goal here is to answer two key questions: why am I interested in
            this position?, and why do I think I'm a good fit for it?
          </i>
        </p>
        <p>
          I really like it when a tool simplifies work. That's why, whenever I
          create new components or APIs, I aim to make them easy for other
          developers (including my future self) to use.
        </p>
        <p>
          One recent tool I've been polishing is the{" "}
          <a
            href="https://www.npmjs.com/package/tailwindcss-text-scale"
            target="_blank"
          >
            tailwindcss-text-scale
          </a>{" "}
          plugin. Its goal is to let users scale typography between screen
          breakpoints by adding classNames like{" "}
          <code className="whitespace-nowrap">text-scale-lg/4xl</code>.
        </p>
        <p>
          I like to experiment when I can. For example, a while ago, I started
          playing with Webpack loaders and Code generation to create a
          NextJs-like framework for express APIs called{" "}
          <a href="https://www.npmjs.com/package/carpincho" target="_blank">
            Carpincho
          </a>
          . It is not a finished product but a <b>solid POC</b> (hey, It even
          supports route parameters!).
        </p>
        <p>
          I also love writing; I usually post on my experiments page and also
          write case studies. I encourage you to read{" "}
          <a
            href="https://matiasgf.dev/experiments/shaders-plants"
            target="_blank"
          >
            "Growing plants with code"
          </a>
          , where I go through creating a procedural plant that grows on scroll,
          and{" "}
          <a
            href="https://basement.studio/blog/kidsuper-world-bringing-paints-to-life-with-r3f"
            target="_blank"
          >
            "Kidsuper World: bringing paints to life with r3f."
          </a>
        </p>
      </div>
    </div>
  );
};
