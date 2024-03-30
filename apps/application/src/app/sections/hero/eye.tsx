import { useFrame } from "@/hooks/use-frame";
import { useMouse } from "@/hooks/use-mouse";
import { rotateVector2 } from "@/lib/math/rotate-vec";
import { valueRemap } from "@/lib/math/value-remap";
import { useCallback, useMemo, useRef, useState } from "react";
import { Vector2 } from "three";
import s from "./hero.module.css";
import { lerp } from "@/lib/math/lerp";
import { clx } from "@/hooks/clx";

export const Eye = () => {
  const eyePosTarget = useRef({ x: 0, y: 0 });
  const eyePos = useRef({ x: 0, y: 0 });

  const mouseStartedRef = useRef(false);

  const dotContainerRef = useRef<HTMLSpanElement | null>(null);
  const dotRef = useRef<HTMLSpanElement | null>(null);

  const mouseRef = useMouse({
    lerp: 1,
    onStart: () => (mouseStartedRef.current = true),
  });

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

    if (!dotContainer || !dot || !mouseStartedRef.current) return;
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

    eyePosTarget.current.x = toMouseVec.x;
    eyePosTarget.current.y = toMouseVec.y;

    //lerp current position to target position
    eyePos.current.x = lerp(eyePos.current.x, eyePosTarget.current.x, 0.1);
    eyePos.current.y = lerp(eyePos.current.y, eyePosTarget.current.y, 0.1);

    dot.style.setProperty("--translate-x", `${eyePos.current.x}em`);
    dot.style.setProperty("--translate-y", `${eyePos.current.y}em`);
  });

  return (
    <span
      style={
        {
          "--blink": 0, // 0 closed, 1 open
          "--weight": "calc(800 - var(--blink) * 200)", // font ranges from 400 to 800
          fontVariationSettings: '"wght" var(--weight)',
        } as unknown as React.CSSProperties
      }
      className="eye-container w-[0.72em] inline-block relative"
    >
      o
      <span
        ref={dotContainerRef}
        className="block absolute w-[0.7em] h-[0.68em] top-[0.32em] left-0"
      >
        <span ref={dotRef} className={s.dot}>
          <span className={clx(s["dot-shape"], "dot-shape")}></span>
        </span>
      </span>
    </span>
  );
};
