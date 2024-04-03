import { Hero } from "./sections/hero";
import { About } from "./sections/about";
import { Why } from "./sections/why";
import { ThreeCanvas } from "@/three/canvas";
import { What } from "./sections/what";
import { Conclusion } from "./sections/conclusion";

export default function Page() {
  return (
    <div>
      <ThreeCanvas />
      <main className="relative space-y-56 pb-32">
        <Hero>
          <About />
        </Hero>
        <Why />
        <What />
        <Conclusion />
      </main>
    </div>
  );
}
