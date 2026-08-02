import {
  FaHeadset,
  FaShieldAlt,
  FaTags,
  FaTruck,
} from "react-icons/fa";

const features = [
  {
    icon: FaTruck,
    title: "Delivery Support",
    text: "Delivery coordination for eligible locations",
  },
  {
    icon: FaShieldAlt,
    title: "Quality Assured",
    text: "Carefully selected Sivakasi products",
  },
  {
    icon: FaTags,
    title: "Factory Direct Price",
    text: "Up to 80% discount on selected products",
  },
  {
    icon: FaHeadset,
    title: "Quick Support",
    text: "Phone and WhatsApp order assistance",
  },
];

export default function Features() {
  return (
    <section className="bg-[#090909] py-7 text-white md:py-12">
      <div className="container">
        {/* Mobile compact layout */}
        <div className="grid grid-cols-2 gap-3 md:hidden">
          {features.map(({ icon: Icon, title, text }) => (
            <article
              key={title}
              className="rounded-2xl border border-pink-500/20 bg-gradient-to-br from-white/10 to-white/5 p-3 text-center shadow-lg"
            >
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-pink-600 text-base">
                <Icon />
              </div>

              <h3 className="mt-2 text-sm font-black leading-5">
                {title}
              </h3>

              <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-gray-400">
                {text}
              </p>
            </article>
          ))}
        </div>

        {/* Desktop layout */}
        <div className="hidden gap-5 md:grid md:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, text }) => (
            <article
              key={title}
              className="group flex items-center gap-4 rounded-2xl border border-pink-500/20 bg-gradient-to-br from-white/10 to-white/5 p-6 shadow-lg transition duration-300 hover:-translate-y-2 hover:border-pink-500"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-pink-600 text-xl transition group-hover:scale-110">
                <Icon />
              </div>

              <div>
                <h3 className="font-black">
                  {title}
                </h3>

                <p className="mt-1 text-sm leading-6 text-gray-400">
                  {text}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
