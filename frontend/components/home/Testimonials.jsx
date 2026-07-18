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
    <section className="relative overflow-hidden bg-black py-20 text-white">
      <div className="absolute left-1/2 top-10 h-80 w-80 -translate-x-1/2 rounded-full bg-pink-600/20 blur-3xl" />

      <div className="container relative z-10 mx-auto px-5">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="font-bold uppercase tracking-[4px] text-pink-500">
            Customer Feedback
          </p>
          <h2 className="mt-3 text-3xl font-black md:text-5xl">
            What Our Customers Say
          </h2>
        </div>

        <div className="mx-auto max-w-4xl">
          {reviews.map((item, index) => (
            <article
              key={`${item.name}-${item.place}`}
              className={`relative rounded-[32px] border bg-gradient-to-br from-white/10 to-white/5 p-8 text-center shadow-2xl transition duration-700 md:p-12 ${
                index === activeIndex
                  ? "block translate-y-0 border-pink-500 opacity-100"
                  : "hidden translate-y-4 border-white/10 opacity-0"
              }`}
            >
              <FaQuoteLeft className="absolute left-8 top-8 text-5xl text-pink-500/20" />

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-pink-600 to-orange-500 text-3xl font-black shadow-xl">
                {item.initial}
              </div>

              <div className="mt-6 flex justify-center gap-1 text-yellow-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar key={star} />
                ))}
              </div>

              <p className="mx-auto mt-7 max-w-2xl text-lg leading-9 text-gray-200 md:text-xl">
                “{item.review}”
              </p>

              <div className="mt-7">
                <h3 className="text-xl font-black">{item.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{item.place}</p>
              </div>
            </article>
          ))}

          <div className="mt-7 flex justify-center gap-3">
            {reviews.map((item, index) => (
              <button
                type="button"
                key={item.name}
                aria-label={`Show review ${index + 1}`}
                onClick={() => setActiveIndex(index)}
                className={`h-3 rounded-full transition-all duration-300 ${
                  activeIndex === index
                    ? "w-10 bg-pink-500"
                    : "w-3 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
