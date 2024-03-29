import "@/styles/globals.css";
import { LenisProvider } from "./lenis-provider";

export default function Layout({ children }: { children: JSX.Element }) {
  return (
    <html>
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/kge0vdc.css?8" />
      </head>

      <body suppressHydrationWarning className="bg-background">
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
