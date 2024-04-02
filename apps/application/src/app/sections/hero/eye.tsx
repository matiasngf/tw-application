import { useFrame } from "@/hooks/use-frame";
import { useMouse } from "@/hooks/use-mouse";
import { rotateVector2 } from "@/lib/math/rotate-vec";
import { valueRemap } from "@/lib/math/value-remap";
import { useMemo, useRef } from "react";
import { Vector2 } from "three";
import s from "./hero.module.css";
import { lerp } from "@/transpiled/lerp.emojs";
import { clx } from "@/hooks/clx";

const getEllipseBoundry = (xScale: number, direction: Vector2) => {
  const theta = Math.atan2(direction.y, direction.x);

  const r =
    xScale / Math.sqrt(Math.cos(theta) ** 2 + (xScale * Math.sin(theta)) ** 2);

  return r;
};

const degToRad = (deg: number) => (deg * Math.PI) / 180;

const eyeAngle = -33;
const eyeAngleRadians = degToRad(eyeAngle);
const center = new Vector2(0, 0);

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

    toMouseVec.copy(
      mouseVec.sub(centerVec).divideScalar(window.innerWidth).divideScalar(4)
    );
    toMouseDir.copy(toMouseVec).normalize();

    // modify length
    const length = toMouseVec.length();
    const newL = Math.pow(length, 0.5);
    toMouseVec.normalize().multiplyScalar(newL);

    // limit the eye into an oval shape
    const ovalLimit =
      getEllipseBoundry(
        0.6,
        toMouseDir.rotateAround(center, -eyeAngleRadians)
      ) * 0.13;
    toMouseVec.clampLength(0, ovalLimit);

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
