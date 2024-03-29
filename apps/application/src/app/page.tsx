import { Hero } from "./sections/hero";
import { About } from "./sections/about";
import { Why } from "./sections/why";
import { ThreeCanvas } from "@/three/canvas";

export default function Page() {
  return (
    <div>
      <ThreeCanvas />
      <main className="relative">
        <Hero>
          <About />
        </Hero>
        <Why />
      </main>
    </div>
  );
}
