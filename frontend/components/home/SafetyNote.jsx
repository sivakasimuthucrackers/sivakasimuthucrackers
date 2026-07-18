import Link from "next/link";
import {
  FaChild,
  FaExclamationTriangle,
  FaShieldAlt,
  FaTint,
} from "react-icons/fa";

const tips = [
  {
    icon: FaChild,
    title: "Adult Supervision",
    text: "Children should always be supervised by responsible adults.",
  },
  {
    icon: FaTint,
    title: "Keep Water Ready",
    text: "Keep a bucket of water or sand nearby before lighting fireworks.",
  },
  {
    icon: FaShieldAlt,
    title: "Use Open Areas",
    text: "Light crackers only in safe, open and permitted locations.",
  },
];

export default function SafetyNote() {
  return (
    <section className="relative overflow-hidden bg-[#080808] py-20 text-white">
      <div className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-yellow-500/10 blur-3xl" />
      <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-orange-500/10 blur-3xl" />

      <div className="container relative z-10 mx-auto px-5">
        <div className="overflow-hidden rounded-[34px] border border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 via-orange-500/10 to-pink-500/10 p-8 shadow-2xl md:p-12">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.3fr]">
            <div>
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-yellow-400 text-3xl text-black shadow-xl">
                <FaShieldAlt />
              </div>

              <p className="mt-7 font-black uppercase tracking-[4px] text-yellow-400">
                Celebrate Responsibly
              </p>

              <h2 className="mt-3 text-3xl font-black md:text-5xl">
                Safety Comes First
              </h2>

              <p className="mt-5 max-w-xl leading-8 text-gray-300">
                Follow basic safety precautions to make every celebration
                joyful, secure and memorable for everyone.
              </p>

              <Link
                href="/safety"
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-7 py-4 font-black text-black transition hover:-translate-y-1 hover:bg-yellow-300"
              >
                <FaExclamationTriangle />
                Read Safety Tips
              </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              {tips.map(({ icon: Icon, title, text }) => (
                <article
                  key={title}
                  className="group rounded-3xl border border-white/10 bg-black/30 p-6 text-center backdrop-blur-md transition duration-500 hover:-translate-y-2 hover:border-yellow-400"
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400 text-xl text-black transition duration-300 group-hover:rotate-6 group-hover:scale-110">
                    <Icon />
                  </div>

                  <h3 className="mt-5 font-black">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-gray-400">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
