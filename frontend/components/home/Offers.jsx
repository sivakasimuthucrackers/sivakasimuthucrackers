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

export default function Offers() {
  return (
    <section className="relative overflow-hidden bg-[#050505] py-20 text-white">
      <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-pink-600/20 blur-3xl" />
      <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-orange-500/20 blur-3xl" />

      <div className="container relative z-10 mx-auto px-5">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="font-bold uppercase tracking-[4px] text-pink-500">
            Special Discounts
          </p>
          <h2 className="mt-3 text-3xl font-black md:text-5xl">
            Festival Offers
          </h2>
          <p className="mt-4 leading-7 text-gray-400">
            Choose the right package for your family, event or wholesale
            requirement.
          </p>
        </div>

        <div className="grid gap-7 md:grid-cols-3">
          {offers.map((offer) => {
            const Icon = offer.icon;

            return (
              <article
                key={offer.title}
                className={`group relative overflow-hidden rounded-[32px] bg-gradient-to-br ${offer.gradient} p-[1px] shadow-2xl transition duration-500 hover:-translate-y-3`}
              >
                <div className="relative h-full overflow-hidden rounded-[31px] bg-black/75 p-7 backdrop-blur-xl">
                  <div className="absolute -right-8 -top-8 text-9xl opacity-10 transition duration-500 group-hover:rotate-12 group-hover:scale-125">
                    {offer.emoji}
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center justify-between gap-4">
                      <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[2px] text-white/90">
                        {offer.label}
                      </span>

                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-xl text-black shadow-lg transition duration-300 group-hover:rotate-6 group-hover:scale-110">
                        <Icon />
                      </div>
                    </div>

                    <div className="mt-7 text-7xl transition duration-500 group-hover:-translate-y-2 group-hover:scale-110">
                      {offer.emoji}
                    </div>

                    <h3 className="mt-6 text-3xl font-black">{offer.title}</h3>
                    <p className="mt-3 min-h-20 leading-7 text-white/75">
                      {offer.description}
                    </p>

                    <div className="mt-6 space-y-3">
                      {offer.items.map((item) => (
                        <p
                          key={item}
                          className="flex items-center gap-3 text-white/90"
                        >
                          <FaCheckCircle className="shrink-0 text-yellow-300" />
                          {item}
                        </p>
                      ))}
                    </div>

                    <Link
                      href="/products"
                      className="mt-8 block rounded-xl bg-white px-5 py-4 text-center font-black text-black transition hover:bg-yellow-300"
                    >
                      Explore Products
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/price-list"
            className="inline-flex items-center gap-2 rounded-xl border border-pink-500 px-6 py-3 font-black text-pink-500 transition hover:bg-pink-500 hover:text-white"
          >
            <FaTags />
            Latest Price List
          </Link>

          <a
            href="https://wa.me/917010400258"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-6 py-3 font-black text-white shadow-lg transition hover:-translate-y-1 hover:bg-green-600"
          >
            <FaWhatsapp />
            Ask for Bulk Price
          </a>
        </div>
      </div>
    </section>
  );
}
