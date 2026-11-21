import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";

import ProviderComponent from "@/components/providerComponent/provider-component";
import Footer from "@/components/common/footer";

const ibmPlexSansHeading = localFont({ src: [
  { path: "../asset/fonts/IBM-Plex-Sans-400.ttf", weight: "400" },
  { path: "../asset/fonts/IBM-Plex-Sans-500.ttf", weight: "500" },
  { path: "../asset/fonts/IBM-Plex-Sans-700.ttf", weight: "700" },
], variable: "--font-heading", display: "swap" });
const roboto = localFont({ src: [
  { path: "../asset/fonts/Roboto-400.ttf", weight: "400" },
  { path: "../asset/fonts/Roboto-500.ttf", weight: "500" },
  { path: "../asset/fonts/Roboto-700.ttf", weight: "700" },
], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  title: { default: "FreshCart | Your Everyday Favorites", template: "%s | FreshCart" },
  description: "Shop fashion, electronics, groceries and your favorite brands at FreshCart.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("h-full antialiased font-sans", roboto.variable, ibmPlexSansHeading.variable)}
    >
      <body>
    <ProviderComponent>
      <main id="main-content" className="min-h-[65vh]">{children}</main>
      <Footer />
    </ProviderComponent>
      </body>
    </html>
  );
}
