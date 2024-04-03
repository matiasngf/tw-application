import { Subscribable, subscribable } from "@/lib/math/subscribable";
import { create } from "zustand";

export interface WindowSize {
  width: number;
  height: number;
}

type WindowSubscribeCallback = (size: WindowSize) => void;

type WindowSubscribable = Subscribable<WindowSubscribeCallback>;

export interface AppStore {
  /** Current window size. Will cause a re-render when used */
  windowSize: WindowSize;
  /** Current window size. Will not cause a re-render when used */
  windowSizeRef: WindowSize;
  setWindowSize: (size: WindowSize) => void;
  onWindowResize: WindowSubscribable["addCallback"];
  removeWindowResize: WindowSubscribable["removeCallback"];
}

export const useApp = create<AppStore>((set, get) => {
  const windowSubscribe = subscribable<WindowSubscribeCallback>();

  const setWindowSize = (newSize: WindowSize) => {
    set({ windowSize: newSize });
    const wSize = get().windowSizeRef;
    wSize.width = newSize.width;
    wSize.height = newSize.height;
    windowSubscribe.getCallbacks().forEach((cb) => cb(wSize));
  };

  return {
    windowSize: { width: 1, height: 1 },
    windowSizeRef: { width: 1, height: 1 },
    setWindowSize,
    onWindowResize: windowSubscribe.addCallback,
    removeWindowResize: windowSubscribe.removeCallback,
  } as const satisfies AppStore;
});
