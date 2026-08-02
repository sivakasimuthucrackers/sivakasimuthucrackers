"use client";

import { useEffect, useState } from "react";
import { FaQuoteLeft, FaStar } from "react-icons/fa";

const reviews = [
  {
    name: "Karthik R.",
    place: "Coimbatore",
    initial: "K",
    review:
      "Very good product variety, clear pricing and quick WhatsApp assistance.",
  },
  {
    name: "Priya S.",
    place: "Madurai",
    initial: "P",
    review:
      "The catalogue was easy to understand and the order support was helpful.",
  },
  {
    name: "Suresh Kumar",
    place: "Trichy",
    initial: "S",
    review:
      "Good collection of crackers and family packs at attractive prices.",
  },
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % reviews.length);
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden bg-black py-10 md:py-20 text-white">

      <div className="absolute left-1/2 top-6 h-48 w-48 -translate-x-1/2 rounded-full bg-pink-600/20 blur-3xl md:h-80 md:w-80" />

      <div className="container relative z-10 mx-auto px-4">

        <div className="mx-auto mb-6 max-w-3xl text-center md:mb-12">

          <p className="text-xs font-bold uppercase tracking-[4px] text-pink-500">
            Customer Feedback
          </p>

          <h2 className="mt-2 text-2xl font-black leading-tight md:mt-3 md:text-5xl">
            What Our
            <br />
            Customers Say
          </h2>

        </div>

        <div className="mx-auto max-w-3xl">

          {reviews.map((item, index) => (

            <article
              key={`${item.name}-${item.place}`}
              className={`relative rounded-3xl border bg-gradient-to-br from-white/10 to-white/5 p-5 text-center shadow-2xl transition duration-700 md:p-10 ${
                index === activeIndex
                  ? "block border-pink-500 opacity-100"
                  : "hidden border-white/10 opacity-0"
              }`}
            >

              <FaQuoteLeft className="absolute left-5 top-5 text-3xl text-pink-500/20 md:left-8 md:top-8 md:text-5xl" />

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-pink-600 to-orange-500 text-2xl font-black shadow-xl md:h-20 md:w-20 md:text-3xl">
                {item.initial}
              </div>

              <div className="mt-4 flex justify-center gap-1 text-sm text-yellow-400 md:mt-5 md:text-base">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar key={star} />
                ))}
              </div>

              <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-gray-200 md:mt-7 md:text-xl md:leading-9">
                “{item.review}”
              </p>

              <div className="mt-5 md:mt-7">
                <h3 className="text-lg font-black md:text-2xl">
                  {item.name}
                </h3>

                <p className="mt-1 text-xs text-gray-500 md:text-sm">
                  {item.place}
                </p>
              </div>

            </article>

          ))}

          <div className="mt-5 flex justify-center gap-2 md:mt-7 md:gap-3">
            {reviews.map((item, index) => (
              <button
                key={item.name}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Review ${index + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  activeIndex === index
                    ? "h-2.5 w-8 bg-pink-500"
                    : "h-2.5 w-2.5 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
