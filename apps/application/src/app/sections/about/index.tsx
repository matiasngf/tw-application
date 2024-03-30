import { SectionTitle } from "@/components/section-title";

import TEDxTeamSrc from "@/assets/TEDx-hcdn-team.jpg";
import Image from "next/image";

export const About = () => {
  return (
    <div className="container pt-0">
      <div className="prose-container max-w-[550px] my-6 text-center">
        <p>
          Hi! First of all, thanks for taking the time to read my job
          application. There must be a lot of talented individuals applying to
          join this amazing place, so I'll try to be concise. I hope you find my
          profile interesting or, at least, have some fun like I did when
          creating this page.
        </p>
      </div>
      <SectionTitle className="mt-[30vh]">who</SectionTitle>
      <div className="prose-container py-16">
        <p>
          My name is Matias Gonzalez Fernandez. I am a developer based in{" "}
          <b>Buenos Aires, Argentina</b> (UTC-3). I live with my girlfriend and
          three adorable cats. I have a degree in graphic design. I have also
          been a developer for a couple of years. I am always trying to find the
          sweet spot between the two worlds.
        </p>
        <p>
          My journey into web development began back in <b>2015</b> while
          working in Human Resources at the{" "}
          <a href="https://www.hcdn.gob.ar/" target="_blank">
            National Congress
          </a>
          . I remember learning PHP because I wanted to automate some repetitive
          tasks at work. It's been an incredible journey since then!
        </p>
        <p>
          Back then, I also volunteered at{" "}
          <a href="https://atomiclab.org/EN/index.html" target="_blank">
            Atomic Lab
          </a>
          , which prints 3D <b>prostheses</b> for kids. They needed help with an
          ASP.NET project's front end, so I learned how to use Razor to make the
          UI. After that, I switched to working with React, Webpack, Styled
          Components, and eventually, Tailwind. For many years, I was used to
          building with PHP as a backend that served a React app to the front
          end until NextJs arrived.
        </p>
        <p>
          <b>Volunteering</b> was a crucial part of my career; I learned the
          most about teamwork at TEDx. I helped organize some TEDx events in
          Argentina. In 2017, I led{" "}
          <a href="https://www.ted.com/tedx/events/22230" target="_blank">
            TEDxHCDN
          </a>
          , an event held at the Congress. I built a beautiful production team
          and gathered some fantastic speakers.
        </p>
        <figure className="relative">
          <div className="font-bold absolute text-background left-[54%] top-[31%] -rotate-45">
            {"←"} me!
          </div>
          <Image
            alt="Team and speakers of TEDxHCDN"
            src={TEDxTeamSrc}
            width={1000}
            className="max-w-full"
          />
          <figcaption>Production team and speakers of TEDxHCDN.</figcaption>
        </figure>
        <p>
          After several years as a developer at the Congress, I took the lead on
          a team of five. Our main goal was to digitalize many internal
          processes previously handled on paper. We prototyped, tested, and
          conducted user interviews to ensure a smooth transition with the best
          UX possible. Additionally, I played a key role in interviewing and
          hiring these team members.
        </p>
        <p>
          Nowadays, I'm working as a Creative developer at{" "}
          <a href="https://basement.studio/" target="_blank">
            Basement Studio
          </a>
          , where we use WebGL, Gap, NextJs, and, of course, tailwindcss to
          create awesome web experiences.
        </p>
      </div>
    </div>
  );
};
