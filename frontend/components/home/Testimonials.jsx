"use client";

import { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaExternalLinkAlt,
  FaGoogle,
  FaQuoteLeft,
  FaStar,
} from "react-icons/fa";

const GOOGLE_REVIEWS_URL =
  "https://maps.app.goo.gl/PkjgREw9GKr2fRKh6?g_st=ac";

const reviews = [
  {
    name: "Google Customer",
    place: "Verified Google Review",
    initial: "G",
    review:
      "Mr. Karthi offered the best price, and there were lots of collections available.",
  },
  {
    name: "Google Customer",
    place: "Verified Google Review",
    initial: "G",
    review:
      "Crackers are very good quality and available at very low prices.",
  },
  {
    name: "Google Customer",
    place: "Verified Google Review",
    initial: "G",
    review:
      "Children were very happy, and there was a lot of variety available.",
  },
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % reviews.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const activeReview = reviews[activeIndex];

  return (
    <section className="relative overflow-hidden bg-black py-9 text-white md:py-16">
      <div className="absolute left-1/2 top-8 h-48 w-48 -translate-x-1/2 rounded-full bg-pink-600/20 blur-3xl md:h-72 md:w-72" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/25 bg-yellow-400/10 px-3 py-1.5 text-xs font-black text-yellow-300">
            <FaGoogle />
            5.0 Google Rating
          </div>

          <p className="mt-4 text-xs font-bold uppercase tracking-[4px] text-pink-500">
            Real Customer Feedback
          </p>

          <h2 className="mt-2 text-2xl font-black leading-tight md:text-5xl">
            Trusted by 57+ Happy Customers
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-400 md:text-base">
            Genuine reviews from our Google Business Profile.
          </p>
        </div>

        <div className="mx-auto mt-6 max-w-2xl md:mt-9">
          <article className="relative rounded-2xl border border-pink-500/40 bg-gradient-to-br from-white/10 to-white/5 p-5 shadow-2xl md:rounded-3xl md:p-8">
            <FaQuoteLeft className="absolute left-4 top-4 text-2xl text-pink-500/20 md:left-6 md:top-6 md:text-4xl" />

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-lg font-black text-blue-500 shadow-lg md:h-14 md:w-14 md:text-xl">
                  <FaGoogle />
                </div>

                <div>
                  <p className="text-sm font-black md:text-base">
                    {activeReview.name}
                  </p>

                  <div className="mt-1 flex items-center gap-1 text-[11px] font-bold text-green-400 md:text-xs">
                    <FaCheckCircle />
                    {activeReview.place}
                  </div>
                </div>
              </div>

              <span className="rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-gray-300">
                Google
              </span>
            </div>

            <div className="mt-4 flex gap-1 text-sm text-yellow-400 md:mt-5 md:text-base">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar key={star} />
              ))}
            </div>

            <p className="mt-4 text-base leading-7 text-gray-100 md:text-xl md:leading-9">
              “{activeReview.review}”
            </p>
          </article>

          <div className="mt-4 flex justify-center gap-2">
            {reviews.map((item, index) => (
              <button
                key={`${item.review}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Show review ${index + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  activeIndex === index
                    ? "h-2.5 w-8 bg-pink-500"
                    : "h-2.5 w-2.5 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
            <div className="flex justify-center gap-1 text-sm text-yellow-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar key={star} />
              ))}
            </div>

            <p className="mt-2 text-sm font-black">
              5.0 from 57 Google Reviews
            </p>

            <a
              href={GOOGLE_REVIEWS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-black text-black transition hover:-translate-y-0.5 hover:bg-gray-100"
            >
              View All Google Reviews
              <FaExternalLinkAlt className="text-xs" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
