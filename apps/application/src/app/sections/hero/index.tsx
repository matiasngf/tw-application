"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { PropsWithChildren, useCallback, useState } from "react";
import pointerSrc from "@/assets/pointer.png";
import Image from "next/image";
import { HeroTitle } from "./hero-title";
import { useLenis } from "@studio-freight/react-lenis";

export function Hero({ children }: PropsWithChildren) {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  const lenis = useLenis();

  const handleHandClick = useCallback(() => {
    lenis?.scrollTo("h1");
  }, [lenis]);

  useGSAP(
    () => {
      const introTl = gsap.timeline();
      introTl.to("h1 span.letter", {
        "--tw-translate-y": "0%",
        stagger: 0.02,
        duration: 0.5,
        ease: "power2.out",
      });

      introTl.to(
        "hr",
        {
          "--tw-scale-x": "100%",
          duration: 0.5,
          ease: "power2.out",
        },
        "-=0.5"
      );

      introTl.to(
        "h2",
        {
          opacity: 1,
          duration: 0.5,
        },
        "-=0.3"
      );

      introTl.to(
        ".pointer-container",
        {
          opacity: 1,
          duration: 0.5,
        },
        "-=0.3"
      );

      introTl.to(".eye-container", {
        "--blink": 1,
        duration: 0.3,
        delay: 0.0,
        ease: "power2.out",
      });

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "50px top",
          end: "300px top",
          toggleActions: "restart none none reverse",
        },
      });

      scrollTl.to(".pointer-container img", {
        autoAlpha: 0,
        duration: 0.1,
      });

      scrollTl.to(
        "h1",
        {
          "--text-scale-max": 2,
          "--text-scale-min": 1.2,
          duration: 0.7,
          ease: "power2.inOut",
        },
        "0"
      );

      scrollTl.to(
        ".content-container",
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.7,
          ease: "power2.inOut",
        },
        "0"
      );

      scrollTl.fromTo(
        "h2",
        {
          "--ty": 0,
        },
        {
          "--ty": 5,
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
        <div className="grid gap-6 grid-cols-1 mx-auto text-center w-full">
          <HeroTitle />
          <hr className="w-40 scale-x-0 mx-auto" />
          <h2 className="font-serif text-xl my-2 font-bold text-foreground-800 opacity-0 translate-y-[calc(var(--ty,0)*1vh)]">
            tailwindcss job application
          </h2>
        </div>
      </div>
      <button
        onClick={handleHandClick}
        className="pointer-container fixed bottom-4 left-1/2 -translate-x-1/2 mix-blend-multiply opacity-0"
      >
        <Image
          className="rotate-90 -translate-y-full"
          alt=""
          src={pointerSrc}
          width={80}
        />
      </button>
      <div className="mt-[10vh] relative content-container invisible opacity-0">
        {children}
      </div>
    </div>
  );
}
