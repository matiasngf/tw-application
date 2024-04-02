"use client";

import { clx } from "@/hooks/clx";
import { Eye } from "./eye";
import s from "./hero.module.css";
import { useLenis } from "@studio-freight/react-lenis";
import { useRef } from "react";

const name = "Matías González Fernández".split("");

const headerOffset = 5;

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
      if (l.scroll > containerRef.current.offsetTop) {
        titleRef.current.style.setProperty("position", "fixed");
        // titleRef.current.style.setProperty("top", `${headerOffset}px`);
        headerContainerRef.current.style.setProperty("opacity", "1");
      } else {
        titleRef.current.style.setProperty("position", "absolute");
        // titleRef.current.style.setProperty("top", "0");
        headerContainerRef.current.style.setProperty("opacity", "0");
      }
    }
  });

  return (
    <div ref={containerRef} className="relative text-title text-scale-3xl/7xl">
      <span aria-hidden className="hero-spacer whitespace-pre">
        {" "}
      </span>
      <header
        ref={headerContainerRef}
        className="opacity-0 transition-opacity fixed top-0 z-[900] w-full h-[1.2em] border-b-foreground-300"
      >
        <div
          className={clx(
            "absolute inset-0 backdrop-blur-sm opacity-0",
            s["header-mask"]
          )}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background/0 to-[2px] to-background"></div>
      </header>
      <div
        ref={titleRef}
        className="h-[1.2em] top-0 absolute will-change-transform w-full z-[1000]"
      >
        <h1 className="h-[1.2em] absolute top-1/2 -translate-y-1/2 overflow-hidden will-change-transform w-full text-scale-3xl/7xl z-[1000]">
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
