import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { GlobalAuthModal } from "../components/GlobalAuthModal";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Asombro Pizza | Premium Delivery & Experience",
  description: "Disfruta el sabor auténtico de Asombro Pizza. Pizzas premium, burgers artesanales, alitas, cervezas y más. ¡Pide online para delivery o reserva tu lugar!",
  keywords: ["pizza", "delivery", "burgers", "alitas", "asombro pizza", "comida a domicilio"],
  openGraph: {
    title: "Asombro Pizza | Premium Delivery & Experience",
    description: "La mejor pizza de la ciudad con ingredientes premium. ¡Pide ahora!",
    url: "https://asombropizza.com",
    siteName: "Asombro Pizza",
    images: [
      {
        url: "/lo asombro.png",
        width: 1200,
        height: 630,
        alt: "Asombro Pizza Logo",
      },
    ],
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Asombro Pizza | Premium Delivery",
    description: "Pizzas, Burgers y Alitas Premium. ¡Pide online!",
    images: ["/lo asombro.png"],
  },
  icons: {
    icon: "/lo asombro.png",
    apple: "/lo asombro.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable} font-sans h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground bg-[var(--color-bg)]">
        {children}
        <GlobalAuthModal />
      </body>
    </html>
  );
}
