import Link from "next/link";
import {
  FaCheckCircle,
  FaGift,
  FaTags,
  FaWhatsapp,
} from "react-icons/fa";

const offers = [
  {
    title: "Gift Boxes",
    label: "Family Favourite",
    description:
      "Colourful assortments designed for complete family celebrations.",
    gradient: "from-pink-600 via-fuchsia-700 to-purple-950",
    icon: FaGift,
    emoji: "🎁",
    items: [
      "Multiple size options",
      "Family-friendly collections",
      "Factory-direct pricing",
    ],
  },
  {
    title: "Family Combo Packs",
    label: "Festival Special",
    description:
      "Ready-to-order combinations with popular crackers for every age group.",
    gradient: "from-orange-500 via-red-600 to-pink-950",
    icon: FaTags,
    emoji: "🎆",
    items: [
      "Selected product combinations",
      "Ideal for family celebrations",
      "Latest catalogue prices",
    ],
  },
  {
    title: "Wholesale Orders",
    label: "Bulk Enquiry",
    description:
      "Special assistance for dealers, retailers, events and large orders.",
    gradient: "from-yellow-500 via-orange-600 to-red-950",
    icon: FaWhatsapp,
    emoji: "📦",
    items: [
      "Retail and dealer support",
      "GST billing available",
      "WhatsApp order assistance",
    ],
  },
];

function OfferCard({ offer, mobile = false }) {
  const Icon = offer.icon;
  const visibleItems = mobile ? offer.items.slice(0, 2) : offer.items;

  return (
    <article
      className={`group relative overflow-hidden bg-gradient-to-br ${offer.gradient} p-[1px] shadow-2xl transition duration-500 ${
        mobile
          ? "min-w-[285px] snap-start rounded-3xl hover:-translate-y-2"
          : "rounded-[32px] hover:-translate-y-3"
      }`}
    >
      <div
        className={`relative h-full overflow-hidden bg-black/75 backdrop-blur-xl ${
          mobile ? "rounded-[23px] p-5" : "rounded-[31px] p-7"
        }`}
      >
        <div
          className={`absolute -right-8 -top-8 opacity-10 transition duration-500 group-hover:rotate-12 group-hover:scale-125 ${
            mobile ? "text-7xl" : "text-9xl"
          }`}
        >
          {offer.emoji}
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between gap-3">
            <span
              className={`rounded-full border border-white/20 bg-white/10 font-black uppercase text-white/90 ${
                mobile
                  ? "px-3 py-1.5 text-[10px] tracking-[1.5px]"
                  : "px-4 py-2 text-xs tracking-[2px]"
              }`}
            >
              {offer.label}
            </span>

            <div
              className={`flex items-center justify-center rounded-2xl bg-white text-black shadow-lg transition duration-300 group-hover:rotate-6 group-hover:scale-110 ${
                mobile ? "h-11 w-11 text-base" : "h-14 w-14 text-xl"
              }`}
            >
              <Icon />
            </div>
          </div>

          <div
            className={`transition duration-500 group-hover:-translate-y-1 group-hover:scale-105 ${
              mobile ? "mt-4 text-5xl" : "mt-7 text-7xl"
            }`}
          >
            {offer.emoji}
          </div>

          <h3
            className={`font-black ${
              mobile ? "mt-4 text-2xl" : "mt-6 text-3xl"
            }`}
          >
            {offer.title}
          </h3>

          <p
            className={`text-white/75 ${
              mobile
                ? "mt-2 min-h-[48px] text-sm leading-6"
                : "mt-3 min-h-20 leading-7"
            }`}
          >
            {offer.description}
          </p>

          <div className={mobile ? "mt-4 space-y-2" : "mt-6 space-y-3"}>
            {visibleItems.map((item) => (
              <p
                key={item}
                className={`flex items-center gap-2 text-white/90 ${
                  mobile ? "text-sm" : ""
                }`}
              >
                <FaCheckCircle className="shrink-0 text-yellow-300" />
                {item}
              </p>
            ))}
          </div>

          <Link
            href="/products"
            className={`block rounded-xl bg-white text-center font-black text-black transition hover:bg-yellow-300 ${
              mobile ? "mt-5 px-4 py-3 text-sm" : "mt-8 px-5 py-4"
            }`}
          >
            Explore Products
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function Offers() {
  return (
    <section className="relative overflow-hidden bg-[#050505] py-10 text-white md:py-20">
      <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-pink-600/20 blur-3xl" />
      <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-orange-500/20 blur-3xl" />

      <div className="container relative z-10 mx-auto px-4 md:px-5">
        <div className="mx-auto mb-6 max-w-3xl text-center md:mb-12">
          <p className="text-xs font-bold uppercase tracking-[4px] text-pink-500 md:text-base">
            Special Discounts
          </p>

          <h2 className="mt-2 text-2xl font-black md:mt-3 md:text-5xl">
            Festival Offers
          </h2>

          <p className="mt-3 text-sm leading-6 text-gray-400 md:mt-4 md:text-base md:leading-7">
            Choose the right package for your family, event or wholesale
            requirement.
          </p>
        </div>

        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 md:hidden">
          {offers.map((offer) => (
            <OfferCard key={offer.title} offer={offer} mobile />
          ))}
        </div>

        <div className="hidden gap-7 md:grid md:grid-cols-3">
          {offers.map((offer) => (
            <OfferCard key={offer.title} offer={offer} />
          ))}
        </div>

        <div className="mt-7 flex flex-wrap justify-center gap-3 md:mt-10 md:gap-4">
          <Link
            href="/price-list"
            className="inline-flex items-center gap-2 rounded-xl border border-pink-500 px-5 py-2.5 text-sm font-black text-pink-500 transition hover:bg-pink-500 hover:text-white md:px-6 md:py-3 md:text-base"
          >
            <FaTags />
            Latest Price List
          </Link>

          <a
            href="https://wa.me/917010400258"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-5 py-2.5 text-sm font-black text-white shadow-lg transition hover:-translate-y-1 hover:bg-green-600 md:px-6 md:py-3 md:text-base"
          >
            <FaWhatsapp />
            Ask for Bulk Price
          </a>
        </div>
      </div>
    </section>
  );
}
