import { useFrame } from "@/hooks/use-frame";
import { useMouse } from "@/hooks/use-mouse";
import { rotateVector2 } from "@/lib/math/rotate-vec";
import { valueRemap } from "@/lib/math/value-remap";
import { useCallback, useMemo, useRef, useState } from "react";
import { Vector2 } from "three";
import s from "./hero.module.css";
import gsap from "gsap";

export const Eye = () => {
  const [eyeContainer, setEyeContainer] = useState<HTMLSpanElement | null>(
    null
  );
  const dotContainerRef = useRef<HTMLSpanElement | null>(null);
  const dotRef = useRef<HTMLSpanElement | null>(null);

  const onMouseStart = useCallback(() => {
    const dot = dotRef.current;
    if (!dot || !eyeContainer) return;

    gsap.to(eyeContainer, {
      "--blink": 1,
      duration: 0.3,
      delay: 0.7,
      ease: "power2.out",
    });
  }, [eyeContainer]);

  const mouseRef = useMouse({ lerp: 0.5, onStart: onMouseStart });

  const {
    mouseVec,
    windowVec,
    centerVec,
    toMouseVec,
    toMouseDir,
    rotationAngle,
  } = useMemo(
    () => ({
      mouseVec: new Vector2(),
      windowVec: new Vector2(),
      centerVec: new Vector2(),
      toMouseVec: new Vector2(),
      toMouseDir: new Vector2(), // normalized direction to mouse
      rotationAngle: rotateVector2(new Vector2(0, 1), -33).normalize(), //33 deg vector
    }),
    []
  );

  useFrame(() => {
    const dotContainer = dotContainerRef.current;
    const dot = dotRef.current;

    if (!dotContainer || !dot) return;
    mouseVec.set(mouseRef.current.x, mouseRef.current.y);
    windowVec.set(window.innerWidth, window.innerHeight);
    const rect = dotContainer.getBoundingClientRect();
    centerVec.set(rect.left + rect.width / 2, rect.top + rect.height / 2);

    toMouseVec.copy(mouseVec.sub(centerVec).divide(windowVec).divideScalar(4));
    toMouseDir.copy(toMouseVec).normalize();

    // limit the eye into an oval shape
    let ovalFactor = Math.abs(rotationAngle.dot(toMouseDir));
    ovalFactor = valueRemap(ovalFactor, 0, 1, 0.07, 0.12);

    if (toMouseVec.x < 0) {
      toMouseVec.x = Math.max(toMouseVec.x, -ovalFactor);
    } else {
      toMouseVec.x = Math.min(toMouseVec.x, ovalFactor);
    }

    if (toMouseVec.y < 0) {
      toMouseVec.y = Math.max(toMouseVec.y, -ovalFactor);
    } else {
      toMouseVec.y = Math.min(toMouseVec.y, ovalFactor);
    }

    dot.style.setProperty("--translate-x", `${toMouseVec.x}em`);
    dot.style.setProperty("--translate-y", `${toMouseVec.y}em`);
  }, [mouseRef, dotContainerRef]);

  return (
    <span
      ref={setEyeContainer}
      style={
        {
          "--blink": 0, // 0 closed, 1 open
          "--weight": "calc(800 - var(--blink) * 200)", // font ranges from 400 to 800
          fontVariationSettings: '"wght" var(--weight)',
        } as unknown as React.CSSProperties
      }
      className="w-[0.72em] inline-block relative "
    >
      o
      <span
        ref={dotContainerRef}
        className="block absolute w-[0.7em] h-[0.68em] top-[0.32em] left-0"
      >
        <span ref={dotRef} className={s.dot}>
          <span className={s["dot-shape"]}></span>
        </span>
      </span>
    </span>
  );
};
