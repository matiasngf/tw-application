import "@/styles/globals.css";
import { LenisProvider } from "./lenis-provider";
import Script from "next/script";

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

        <Script
          strategy="afterInteractive"
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-67RGZPG93B"
        ></Script>
        <Script
          id="gtag"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-67RGZPG93B');`,
          }}
        ></Script>
      </head>

      <body className="bg-background" suppressHydrationWarning>
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
