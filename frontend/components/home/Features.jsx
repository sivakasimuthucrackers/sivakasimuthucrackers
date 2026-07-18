import { FaHeadset, FaShieldAlt, FaTags, FaTruck } from "react-icons/fa";

const features = [
  { icon: FaTruck, title: "Delivery Support", text: "Delivery coordination for eligible locations" },
  { icon: FaShieldAlt, title: "Quality Assured", text: "Carefully selected Sivakasi products" },
  { icon: FaTags, title: "Factory Direct Price", text: "Up to 80% discount on selected products" },
  { icon: FaHeadset, title: "Quick Support", text: "Phone and WhatsApp order assistance" },
];

export default function Features() {
  return (
    <section className="bg-[#090909] py-12">
      <div className="container grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {features.map(({ icon: Icon, title, text }) => (
          <div key={title} className="group flex items-center gap-4 rounded-2xl border border-pink-500/20 bg-gradient-to-br from-white/10 to-white/5 p-6 shadow-lg transition duration-300 hover:-translate-y-2 hover:border-pink-500">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-pink-600 text-xl transition group-hover:scale-110"><Icon /></div>
            <div><h3 className="font-black">{title}</h3><p className="mt-1 text-sm leading-6 text-gray-400">{text}</p></div>
          </div>
        ))}
      </div>
    </section>
  );
}
