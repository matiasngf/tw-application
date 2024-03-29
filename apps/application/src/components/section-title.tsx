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
      className={clx("flex items-center space-x-0 justify-center", className)}
    >
      <hr className="w-full grow-1 shrink-1 border-t-1 border-gray-800 hidden relative top-4" />
      <h2 className="text-scale-2xl/8xl tracking-tighter font-normal text-[#484D2A] shrink-0 grow-0 font-serif leading-none pb-2">
        {children}
      </h2>
      <hr className="w-full grow-1 shrink-1 border-t-1 border-gray-800 hidden relative top-4" />
    </div>
  );
};
