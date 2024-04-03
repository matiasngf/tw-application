"use client";

import { useLenis } from "@studio-freight/react-lenis";
import Content from "./why.mdx";
import { useCallback, useEffect, useRef } from "react";
import { Group } from "three";
import { useApp } from "@/hooks/use-app";
import { webGlTunnel } from "@/three/inner-scene";
import { Cats } from "@/three/components/cats";
import { useFrame } from "@/hooks/use-frame";

export const Why = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const groupRef = useRef<Group | null>(null);

  const repositionCallback = useCallback(() => {
    const container = containerRef.current;
    const catsGroup = groupRef.current;
    if (
      container === null ||
      typeof window === "undefined" ||
      catsGroup === null
    )
      return;

    const hrArr = container.querySelectorAll("hr");
    if (hrArr.length === 0) return;
    const hr = hrArr[0] as HTMLHRElement;

    const rect = hr.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    const windowHeight = window.innerHeight;
    const left = rect.left;

    const width = rect.width / window.innerHeight / 1.5;

    const relativeTop = top / windowHeight;
    catsGroup.position.y = -relativeTop;

    const relativeLeft = (window.innerWidth / 2 - left) / window.innerHeight;

    catsGroup.position.x = -relativeLeft;
    catsGroup.scale.set(width, width, width);
  }, []);

  useFrame(() => {
    repositionCallback();
  }, [repositionCallback]);

  return (
    <div ref={containerRef} className="container pt-0">
      <div className="prose-container prose">
        <Content />
      </div>
      <webGlTunnel.In>
        <Cats ref={groupRef} />
      </webGlTunnel.In>
    </div>
  );
};
