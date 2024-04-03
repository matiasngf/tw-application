import { clx } from "@/hooks/clx";
import { PropsWithChildren } from "react";

export interface SectionTitleProps {
  className?: string;
}

export const SectionTitle = ({
  className,
  children,
}: PropsWithChildren<SectionTitleProps>) => {
  return (
    <div
      className={clx(
        "mb-16 flex items-center space-x-[0.628318em] justify-center text-scale-3xl/5xl",
        className
      )}
    >
      <hr className="!my-0 relative" />
      <h2
        className="relative -top-[0.1em] mb-0 text-[1em] tracking-tighter font-normal
      font-serif leading-none text-center text-foreground-800"
      >
        {children}
      </h2>
      <hr className="!my-0 relative" />
    </div>
  );
};
