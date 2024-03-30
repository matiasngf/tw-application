import { lerp } from '@/lib/math/lerp';
import gsap from 'gsap';
import { useEffect, useRef } from 'react';

export interface UseMouseParams {
  lerp?: number;
  onStart?: () => void;
}

export const useMouse = ({ lerp: lerpValue = 1, onStart }: UseMouseParams) => {
  const mouseTargetRef = useRef({ x: 0, y: 0 });
  const mouseRef = useRef({ x: 0, y: 0 });

  const isFirstRef = useRef(true);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent): void => {
      if (isFirstRef.current) {
        mouseRef.current.x = e.clientX;
        mouseRef.current.y = e.clientY;
        isFirstRef.current = false;
        if (onStart) {
          onStart();
        }
      }
      mouseTargetRef.current = { x: e.clientX, y: e.clientY };

      if (lerpValue === 1) {
        mouseRef.current.x = e.clientX;
        mouseRef.current.y = e.clientY;
      }
    };

    let lastTime = 0;

    const frameHandler: FrameRequestCallback = (time): void => {

      const delta = time - lastTime;

      const relativeLerp = Math.min(1, (lerpValue * delta * 10));

      mouseRef.current.x = lerp(
        mouseRef.current.x,
        mouseTargetRef.current.x,
        relativeLerp,
      );
      mouseRef.current.y = lerp(
        mouseRef.current.y,
        mouseTargetRef.current.y,
        relativeLerp,
      );
      lastTime = time;
    };

    if (lerpValue !== 1) {
      gsap.ticker.add(frameHandler);
    }

    window.addEventListener('mousemove', onMouseMove);

    return (): void => {
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [mouseRef, mouseTargetRef, lerpValue]);

  return mouseRef;
};
