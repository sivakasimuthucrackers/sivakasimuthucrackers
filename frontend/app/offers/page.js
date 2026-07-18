import Link from "next/link";
import {
  FaGift,
  FaPercentage,
  FaTruck,
  FaWhatsapp,
} from "react-icons/fa";

const WHATSAPP_NUMBER = "917010400258";

export const metadata = {
  title: "Festival Offers | Sivakasi Muthu Crackers",
  description:
    "Latest Diwali festival offers from Sivakasi Muthu Crackers.",
};

const offers = [
  {
    title: "Up to 80% Discount",
    description:
      "Factory direct pricing on selected crackers and gift boxes.",
    icon: FaPercentage,
  },
  {
    title: "Family Combo Packs",
    description:
      "Special combo packs designed for families and kids.",
    icon: FaGift,
  },
  {
    title: "Bulk & Wholesale Orders",
    description:
      "Special pricing for bulk purchases and dealers.",
    icon: FaTruck,
  },
];

export default function OffersPage() {
  return (
    <main className="min-h-screen bg-[#080808] py-16">
      <div className="container">

        <div className="mx-auto max-w-4xl text-center">

          <p className="font-bold uppercase tracking-[4px] text-pink-500">
            Diwali Special
          </p>

          <h1 className="mt-3 text-4xl font-black md:text-6xl">
            Festival Offers
          </h1>

          <p className="mt-6 text-gray-400 leading-8">
            Celebrate this festive season with premium quality crackers
            directly from Sivakasi at attractive factory prices.
          </p>

        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {offers.map(({ title, description, icon: Icon }) => (

            <div
              key={title}
              className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center"
            >

              <Icon className="mx-auto text-5xl text-pink-500" />

              <h2 className="mt-6 text-2xl font-black">
                {title}
              </h2>

              <p className="mt-4 leading-7 text-gray-400">
                {description}
              </p>

            </div>

          ))}

        </div>

        <div className="mt-16 rounded-3xl bg-gradient-to-r from-pink-700 to-pink-500 p-10 text-center">

          <h2 className="text-3xl font-black">
            Get the Latest Price List
          </h2>

          <p className="mx-auto mt-4 max-w-2xl">
            Contact us today for the latest price list, stock availability
            and wholesale offers.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">

            <Link
              href="/price-list"
              className="rounded-xl bg-white px-6 py-4 font-bold text-pink-600 hover:bg-gray-100"
            >
              Download Price List
            </Link>

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl bg-green-500 px-6 py-4 font-bold hover:bg-green-600"
            >
              <FaWhatsapp />
              WhatsApp Order
            </a>

          </div>

        </div>

      </div>
    </main>
  );
}