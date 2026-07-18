import { FaPhoneAlt, FaWhatsapp } from "react-icons/fa";

export default function WhatsAppCTA() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-pink-700 via-orange-600 to-yellow-500 py-16 text-white">
      <div className="absolute -left-16 -top-16 h-56 w-56 rounded-full border-[35px] border-white/10" />
      <div className="absolute -bottom-24 right-10 h-64 w-64 rounded-full bg-white/10 blur-2xl" />

      <div className="container relative z-10 mx-auto px-5">
        <div className="rounded-[32px] border border-white/20 bg-black/20 p-8 shadow-2xl backdrop-blur-md md:p-12">
          <div className="flex flex-col items-center justify-between gap-8 text-center md:flex-row md:text-left">
            <div className="max-w-2xl">
              <p className="font-bold uppercase tracking-[4px] text-white/80">
                Need Assistance?
              </p>

              <h2 className="mt-3 text-3xl font-black md:text-5xl">
                Place Your Order Through WhatsApp
              </h2>

              <p className="mt-4 text-lg leading-8 text-white/90">
                Send your product list for availability, pricing, delivery and
                wholesale assistance.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row md:flex-col lg:flex-row">
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
