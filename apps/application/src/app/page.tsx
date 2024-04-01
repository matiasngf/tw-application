import { Hero } from "./sections/hero";
import { About } from "./sections/about";
import { Why } from "./sections/why";
import { ThreeCanvas } from "@/three/canvas";
import { What } from "./sections/what";

export default function Page() {
  return (
    <div>
      <ThreeCanvas />
      <main className="relative space-y-32 pb-32">
        <Hero>
          <About />
        </Hero>
        <Why />
        <What />
      </main>
    </div>
  );
}
