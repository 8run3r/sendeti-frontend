import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { ToastProvider } from "@/components/ui/Toast";
import { ScrollProgressBar } from "@/components/marketing/ScrollProgressBar";
import { ExitIntentPopup } from "@/components/marketing/ExitIntentPopup";
import { SocialProofToast } from "@/components/marketing/SocialProofToast";

export const metadata: Metadata = {
  title: "SEN DETÍ — všetko pre úsmev a radosť detí",
  description: "Prémiový detský e-shop. Obliečky, oblečenie, hračky a všetko ostatné pre šťastné detstvo.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sk">
      <body>
        <ScrollProgressBar />
        <Header />
        <main>{children}</main>
        <Footer />
        <CartDrawer />
        <ToastProvider />
        <ExitIntentPopup />
        <SocialProofToast />
      </body>
    </html>
  );
}
