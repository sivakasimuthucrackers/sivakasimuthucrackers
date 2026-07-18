import {
  FaCertificate,
  FaFileInvoice,
  FaHeadset,
  FaShippingFast,
  FaTags,
} from "react-icons/fa";

const items = [
  {
    number: "01",
    icon: FaCertificate,
    title: "Premium Quality",
    text: "Carefully selected crackers from trusted Sivakasi manufacturers.",
  },
  {
    number: "02",
    icon: FaTags,
    title: "Factory Direct Price",
    text: "Competitive wholesale and retail pricing from our latest catalogue.",
  },
  {
    number: "03",
    icon: FaShippingFast,
    title: "Safe Packing",
    text: "Careful packing and delivery coordination for eligible locations.",
  },
  {
    number: "04",
    icon: FaFileInvoice,
    title: "GST Billing",
    text: "Registered business with GSTIN 33CFNPM5329G3Z9.",
  },
  {
    number: "05",
    icon: FaHeadset,
    title: "Customer Support",
    text: "Quick assistance through phone and WhatsApp for your orders.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="relative overflow-hidden bg-black py-20 text-white">
      <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-pink-600/15 blur-3xl" />

      <div className="container relative z-10 mx-auto px-5">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="font-bold uppercase tracking-[4px] text-pink-500">
            Our Benefits
          </p>
          <h2 className="mt-3 text-3xl font-black md:text-5xl">
            Why Choose Us?
          </h2>
          <p className="mt-4 leading-7 text-gray-400">
            Reliable products, transparent pricing and responsive customer
            support for a better shopping experience.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {items.map(({ number, icon: Icon, title, text }) => (
            <article
              key={title}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-7 text-center shadow-xl transition duration-500 hover:-translate-y-3 hover:border-pink-500"
            >
              <span className="absolute right-4 top-2 text-6xl font-black text-white/5">
                {number}
              </span>

              <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-600 to-orange-500 text-2xl shadow-lg transition duration-500 group-hover:rotate-6 group-hover:scale-110">
                <Icon />
              </div>

              <h3 className="mt-6 text-xl font-black">{title}</h3>
              <p className="mt-3 leading-7 text-gray-400">{text}</p>

              <div className="mx-auto mt-6 h-1 w-12 rounded-full bg-pink-500 transition-all duration-500 group-hover:w-24" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
