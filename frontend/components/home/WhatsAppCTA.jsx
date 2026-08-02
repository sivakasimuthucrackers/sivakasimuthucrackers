import {
  FaPhoneAlt,
  FaWhatsapp,
} from "react-icons/fa";

export default function WhatsAppCTA() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-pink-700 via-orange-600 to-yellow-500 py-8 text-white md:py-16">
      <div className="absolute -left-12 -top-12 h-40 w-40 rounded-full border-[24px] border-white/10 md:-left-16 md:-top-16 md:h-56 md:w-56 md:border-[35px]" />

      <div className="absolute -bottom-20 right-6 h-44 w-44 rounded-full bg-white/10 blur-2xl md:-bottom-24 md:right-10 md:h-64 md:w-64" />

      <div className="container relative z-10 mx-auto px-4 md:px-5">
        {/* Mobile compact CTA */}
        <div className="rounded-2xl border border-white/20 bg-black/20 p-5 text-center shadow-2xl backdrop-blur-md md:hidden">
          <p className="text-[11px] font-bold uppercase tracking-[3px] text-white/80">
            Need Assistance?
          </p>

          <h2 className="mt-2 text-2xl font-black leading-tight">
            Order Through WhatsApp
          </h2>

          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-white/90">
            Send your product list for price, availability and delivery help.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <a
              href="tel:+919600333302"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white px-3 py-3 text-sm font-black text-white transition hover:bg-white hover:text-black"
            >
              <FaPhoneAlt />
              Call
            </a>

            <a
              href="https://wa.me/917010400258"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 px-3 py-3 text-sm font-black text-white shadow-lg transition hover:bg-green-600"
            >
              <FaWhatsapp className="text-lg" />
              WhatsApp
            </a>
          </div>

          <p className="mt-3 text-xs font-semibold text-white/80">
            Call: 96003 33302 · WhatsApp: 70104 00258
          </p>
        </div>

        {/* Desktop original-style CTA */}
        <div className="hidden rounded-[32px] border border-white/20 bg-black/20 p-8 shadow-2xl backdrop-blur-md md:block md:p-12">
          <div className="flex items-center justify-between gap-8 text-left">
            <div className="max-w-2xl">
              <p className="font-bold uppercase tracking-[4px] text-white/80">
                Need Assistance?
              </p>

              <h2 className="mt-3 text-5xl font-black">
                Place Your Order Through WhatsApp
              </h2>

              <p className="mt-4 text-lg leading-8 text-white/90">
                Send your product list for availability, pricing, delivery and
                wholesale assistance.
              </p>
            </div>

            <div className="flex flex-col gap-4 lg:flex-row">
              <a
                href="tel:+919600333302"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white px-7 py-4 font-black text-white transition hover:-translate-y-1 hover:bg-white hover:text-black"
              >
                <FaPhoneAlt />
                96003 33302
              </a>

              <a
                href="https://wa.me/917010400258"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center gap-3 rounded-full bg-green-500 px-8 py-4 text-lg font-black text-white shadow-2xl transition hover:-translate-y-1 hover:bg-green-600"
              >
                <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-green-400/40" />

                <FaWhatsapp className="text-2xl transition group-hover:scale-125" />

                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
