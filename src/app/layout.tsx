import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: {
    default: "Moaz Mohamed | Digital Product Designer & Software Engineer",
    template: "%s | Moaz Mohamed",
  },
  description:
    "I design, develop and launch modern websites, mobile applications, brands and smart IoT systems. Passionate about creating premium digital experiences.",
  keywords: [
    "Moaz Mohamed",
    "UI/UX Designer",
    "Software Engineer",
    "Web Developer",
    "Flutter Developer",
    "Brand Designer",
    "IoT Developer",
    "Portfolio",
  ],
  authors: [{ name: "Moaz Mohamed" }],
  creator: "Moaz Mohamed",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Moaz Mohamed | Digital Product Designer & Software Engineer",
    description:
      "I design, develop and launch modern websites, mobile applications, brands and smart IoT systems.",
    siteName: "Moaz Mohamed Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Moaz Mohamed | Digital Product Designer & Software Engineer",
    description:
      "I design, develop and launch modern websites, mobile applications, brands and smart IoT systems.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Moaz Mohamed",
  jobTitle: "Digital Product Designer & Software Engineer",
  description:
    "I design, develop and launch modern websites, mobile applications, brands and smart IoT systems.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://moazmohamed.com",
  sameAs: [
    "https://github.com/moazmohamed",
    "https://linkedin.com/in/moazmohamed",
    "https://behance.net/moazmohamed",
  ],
  knowsAbout: [
    "UI/UX Design",
    "Web Development",
    "Mobile Development",
    "Brand Identity",
    "IoT Systems",
    "Embedded Systems",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased overflow-x-hidden`}
      suppressHydrationWarning
    >
      <body className="noise min-h-full flex flex-col bg-background text-foreground overflow-x-hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
