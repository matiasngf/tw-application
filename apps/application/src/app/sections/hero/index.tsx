"use client";

import { clx } from "@/hooks/clx";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { PropsWithChildren, useState } from "react";
import s from "./hero.module.css";
import pointerSrc from "@/assets/pointer.png";
import Image from "next/image";
import { Eye } from "./eye";

const name = "Matías González Fernández".split("");

export function Hero({ children }: PropsWithChildren) {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline();
      tl.to("h1 span.letter", {
        "--tw-translate-y": "0%",
        stagger: 0.02,
        duration: 0.5,
        ease: "power2.out",
      });

      tl.to(
        "hr",
        {
          "--tw-scale-x": "100%",
          duration: 0.5,
          ease: "power2.out",
        },
        "-=0.45"
      );

      tl.to("h2", {
        opacity: 1,
        duration: 0.5,
      });

      tl.to(
        ".pointer-container",
        {
          opacity: 1,
          duration: 0.5,
        },
        "-=0.2"
      );

      tl.to(".eye-container", {
        "--blink": 1,
        duration: 0.3,
        delay: 0.7,
        ease: "power2.out",
      });

      const revealTl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "50px top",
          end: "300px top",
          toggleActions: "restart none none reverse",
        },
      });

      revealTl.to(".pointer-container img", {
        autoAlpha: 0,
        duration: 0.1,
      });

      revealTl.to(
        "h1",
        {
          "--text-scale-max": 2,
          "--text-scale-min": 1.2,
          duration: 0.7,
          ease: "power2.inOut",
        },
        "0"
      );

      revealTl.to(
        ".about-container",
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.7,
          ease: "power2.inOut",
        },
        "0"
      );
    },
    {
      scope: container!,
      dependencies: [container],
    }
  );

  return (
    <div ref={setContainer}>
      <div className="mx-auto pt-[40vh] flex items-center cursor-default">
        <div className="grid gap-6 grid-cols-1 mx-auto text-center">
          <h1 className="relative text-title text-scale-3xl/7xl overflow-hidden will-change-transform">
            {name.map((letter, index) => (
              <span
                className={clx(
                  s["letter-container"],
                  "letter relative inline-block translate-y-[120%] top-[0.2em] whitespace-pre"
                )}
                key={index}
              >
                {letter === "o" ? <Eye /> : letter}
              </span>
            ))}
          </h1>
          <hr className="w-40 scale-x-0 mx-auto" />
          <h2 className="font-serif text-xl my-2 font-bold text-foreground-800 opacity-0">
            tailwindcss job application
          </h2>
        </div>
      </div>
      <div className="pointer-container fixed bottom-4 left-1/2 -translate-x-1/2 mix-blend-multiply opacity-0">
        <Image
          className="rotate-90 -translate-y-full"
          alt=""
          src={pointerSrc}
          width={80}
        />
      </div>
      <div className="about-container invisible opacity-0 translate-y-[0px]">
        {children}
      </div>
    </div>
  );
}
