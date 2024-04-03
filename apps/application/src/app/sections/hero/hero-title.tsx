"use client";

import { clx } from "@/hooks/clx";
import { Eye } from "./eye";
import s from "./hero.module.css";
import { useLenis } from "@studio-freight/react-lenis";
import { useRef } from "react";
import { GithubIcon } from "@/components/github";

const name = "Matías González Fernández".split("");

export const HeroTitle = () => {
  const containerRef = useRef<HTMLHeadingElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const headerContainerRef = useRef<HTMLDivElement | null>(null);

  useLenis((l) => {
    if (
      containerRef.current &&
      titleRef.current &&
      headerContainerRef.current
    ) {
      const headerBg =
        headerContainerRef.current.querySelector<HTMLDivElement>(".header-bg");
      if (!headerBg) return;
      if (l.scroll > containerRef.current.offsetTop) {
        titleRef.current.style.setProperty("position", "fixed");
        titleRef.current.style.setProperty("width", "initial");
        headerBg.style.setProperty("opacity", "1");
      } else {
        titleRef.current.style.setProperty("position", "absolute");
        titleRef.current.style.removeProperty("width");
        headerBg.style.setProperty("opacity", "0");
      }
    }
  });

  return (
    <div
      ref={containerRef}
      className="relative text-title text-scale-3xl/7xl flex flex-col items-center"
    >
      <span aria-hidden className="hero-spacer whitespace-pre">
        {" "}
      </span>
      <header
        ref={headerContainerRef}
        className="fixed top-0 z-[900] w-full h-[1.5em] md:h-[1.2em]"
      >
        <div className="header-bg opacity-0 transition-opacity absolute inset-0 bg-gradient-to-t from-background/0 to-[2px] to-background"></div>
        <div className="absolute inset-0 z-[1500]">
          <GithubIcon className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 w-6 lg:w-7" />
        </div>
      </header>
      <div
        ref={titleRef}
        className="h-[1.5em] md:h-[1.2em] top-0 absolute will-change-transform w-full z-[1000]"
      >
        <h1 className="h-[1.2em] relative top-1/2 -translate-y-1/2 overflow-hidden will-change-transform w-full text-scale-3xl/7xl z-[1000]">
          <span className="">
            {name.map((letter, index) => (
              <span
                className={clx(
                  s["letter-container"],
                  "letter relative inline-block translate-y-[120%] top-[0.1em] whitespace-pre"
                )}
                key={index}
              >
                {letter === "o" ? <Eye /> : letter}
              </span>
            ))}
          </span>
        </h1>
      </div>
    </div>
  );
};
