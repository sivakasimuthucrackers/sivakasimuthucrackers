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
    text: "Children should always be supervised by adults.",
  },
  {
    icon: FaTint,
    title: "Keep Water Ready",
    text: "Keep water or sand nearby before lighting fireworks.",
  },
  {
    icon: FaShieldAlt,
    title: "Use Open Areas",
    text: "Use only safe and open permitted locations.",
  },
];

export default function SafetyNote() {
  return (
    <section className="relative overflow-hidden bg-[#080808] py-10 text-white md:py-20">

      <div className="absolute -left-24 top-0 h-64 w-64 rounded-full bg-yellow-500/10 blur-3xl" />
      <div className="absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl" />

      <div className="container relative z-10 mx-auto px-4 md:px-5">

        <div className="overflow-hidden rounded-3xl border border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 via-orange-500/10 to-pink-500/10 p-5 shadow-2xl md:p-12">

          {/* Mobile */}
          <div className="md:hidden">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400 text-2xl text-black shadow-lg">
              <FaShieldAlt />
            </div>

            <p className="mt-4 text-center text-[11px] font-black uppercase tracking-[3px] text-yellow-400">
              Celebrate Responsibly
            </p>

            <h2 className="mt-2 text-center text-2xl font-black">
              Safety Comes First
            </h2>

            <p className="mx-auto mt-3 max-w-sm text-center text-sm leading-6 text-gray-300">
              Follow basic safety precautions to enjoy a safe and happy Diwali.
            </p>

            <div className="mt-5 grid grid-cols-1 gap-3">

              {tips.map(({ icon: Icon, title, text }) => (
                <article
                  key={title}
                  className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/30 p-3"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-400 text-black">
                    <Icon />
                  </div>

                  <div>
                    <h3 className="text-sm font-black">
                      {title}
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-gray-400">
                      {text}
                    </p>
                  </div>
                </article>
              ))}

            </div>

            <Link
              href="/safety"
              className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 text-sm font-black text-black transition hover:bg-yellow-300"
            >
              <FaExclamationTriangle />
              Read Safety Tips
            </Link>

          </div>

          {/* Desktop */}
          <div className="hidden items-center gap-10 lg:grid lg:grid-cols-[1fr_1.3fr]">

            <div>

              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-yellow-400 text-3xl text-black shadow-xl">
                <FaShieldAlt />
              </div>

              <p className="mt-7 font-black uppercase tracking-[4px] text-yellow-400">
                Celebrate Responsibly
              </p>

              <h2 className="mt-3 text-5xl font-black">
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
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400 text-xl text-black">
                    <Icon />
                  </div>

                  <h3 className="mt-5 font-black">
                    {title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-gray-400">
                    {text}
                  </p>

                </article>
              ))}

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
