import "@/styles/globals.css";
import { LenisProvider } from "./lenis-provider";

export default function Layout({ children }: { children: JSX.Element }) {
  return (
    <html>
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/kge0vdc.css?8" />
        {/* FAVICON */}
        <link rel="icon" href="/favicon.png" />

        {/* META */}
        <meta
          name="description"
          content="Matías González Fernández's Job application website"
        />
        <meta
          name="title"
          content="Matías González Fernández | Job application"
        />
        <meta name="author" content="Matías González Fernández" />
        <title>Matías González Fernández | Job application</title>
      </head>

      <body className="bg-background" suppressHydrationWarning>
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
