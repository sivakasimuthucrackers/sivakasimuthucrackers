import Link from "next/link";
import {
  FaCheckCircle,
  FaIndustry,
  FaShieldAlt,
  FaTruck,
  FaWhatsapp,
} from "react-icons/fa";

const WHATSAPP_NUMBER = "917010400258";

export const metadata = {
  title: "About Us | Sivakasi Muthu Crackers",
  description:
    "Learn about Sivakasi Muthu Crackers, our factory-direct prices, quality products and customer service.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#080808] py-16">
      <div className="container">
        <div className="mx-auto max-w-4xl text-center">
          <p className="font-bold uppercase tracking-[4px] text-pink-500">
            About Our Company
          </p>

          <h1 className="mt-3 text-4xl font-black md:text-6xl">
            Sivakasi Muthu Crackers
          </h1>

          <p className="mt-6 leading-8 text-gray-300">
            Sivakasi Muthu Crackers supplies quality crackers, gift boxes,
            family combo packs and festival products directly from Sivakasi.
            We serve retail and wholesale customers with competitive prices
            and dependable service.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: FaIndustry,
              title: "Factory Direct",
              text: "Products supplied directly from Sivakasi.",
            },
            {
              icon: FaShieldAlt,
              title: "Quality Assured",
              text: "Carefully selected products from trusted manufacturers.",
            },
            {
              icon: FaTruck,
              title: "Reliable Delivery",
              text: "Order support and delivery coordination for customers.",
            },
            {
              icon: FaCheckCircle,
              title: "Wide Collection",
              text: "Sparklers, flower pots, rockets, gift boxes and combos.",
            },
          ].map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center"
            >
              <Icon className="mx-auto text-4xl text-pink-500" />

              <h2 className="mt-4 text-xl font-black">{title}</h2>

              <p className="mt-3 leading-7 text-gray-400">{text}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 rounded-3xl border border-pink-500/20 bg-gradient-to-r from-pink-950 to-black p-8 text-center md:p-12">
          <h2 className="text-3xl font-black">
            Need product or wholesale details?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-gray-300">
            Contact us for the latest price list, available products,
            festival offers and delivery information.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-4">
            <Link
              href="/products"
              className="rounded-lg bg-pink-600 px-6 py-4 font-bold hover:bg-pink-700"
            >
              View Products
            </Link>

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg bg-green-500 px-6 py-4 font-bold hover:bg-green-600"
            >
              <FaWhatsapp />
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}