import type { Metadata, Viewport } from "next";
import { Instrument_Sans } from "next/font/google";
import { site } from "@/content/site";
import { AuthProvider } from "@/features/auth/context/AuthProvider";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${site.shortName}: Training, Certification & Employment`,
    template: `%s | ${site.shortName}`,
  },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    title: "From Skills to Sustainable Employment.",
    description: site.description,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#132620",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={instrumentSans.variable}>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
