import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import SiteChrome from "@/components/layout/SiteChrome";
import BlastIntro from "@/components/BlastIntro";

export const metadata = {
  title: "Sivakasi Muthu Crackers",
  description:
    "Premium quality crackers, gift boxes and festival combo packs directly from Sivakasi.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <SiteChrome>{children}</SiteChrome>
        </CartProvider>
      </body>
    </html>
  );
}
