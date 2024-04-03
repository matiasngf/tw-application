"use client";

import Lenis from "@studio-freight/lenis";
import ReactLenis from "@studio-freight/react-lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { useFrame } from "@/hooks/use-frame";
import { useApp } from "@/hooks/use-app";

type LenisRef = {
  wrapper?: HTMLElement;
  content?: HTMLElement;
  lenis?: Lenis;
};

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(useGSAP);

export const LenisProvider = ({ children }: { children: JSX.Element }) => {
  const lenisRef = useRef<LenisRef | null>(null);
  const setWindowSize = useApp((s) => s.setWindowSize);

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined")
      return;

    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    const resizeCallback = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    document.addEventListener("resize", resizeCallback);

    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);

    return () => {
      gsap.ticker.remove(update);
      document.removeEventListener("resize", resizeCallback);
    };
  }, []);

  return (
    <ReactLenis root ref={lenisRef} autoRaf={false}>
      {children}
    </ReactLenis>
  );
};
