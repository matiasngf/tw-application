import gsap from "gsap";
import { useEffect } from "react";

export function useFrame(
  callback: (time: number) => void,
  deps: any[] = []
) {
  useEffect(() => {
    gsap.ticker.add(callback);
  }, deps);
};
