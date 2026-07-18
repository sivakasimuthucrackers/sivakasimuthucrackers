"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
  FaDownload,
  FaWhatsapp,
} from "react-icons/fa";

const slides = [
  {
    baseName: "bg-1",
    badge: "Diwali 2026 Special Sale",
    title: "Celebrate Diwali With",
    highlight: "Muthu Crackers",
    description:
      "Premium Sivakasi crackers at factory-direct prices for joyful family celebrations.",
  },
  {
    baseName: "bg-2",
    badge: "Family Celebration",
    title: "Create Bright",
    highlight: "Festival Memories",
    description:
      "A colourful collection of sparklers, gift boxes, fancy items and family packs.",
  },
  {
    baseName: "bg-3",
    badge: "Premium Quality",
    title: "Light Up Every",
    highlight: "Happy Moment",
    description:
      "Carefully selected crackers with quick phone and WhatsApp order assistance.",
  },
  {
    baseName: "bg-4",
    badge: "Factory Direct Price",
    title: "Celebrate Together",
    highlight: "Save More",
    description:
      "Shop family combos, kids packs and festival collections at attractive prices.",
  },
  {
    baseName: "bg-5",
    badge: "Up To 80% Discount",
    title: "Sivakasi's Colourful",
    highlight: "Fireworks Collection",
    description:
      "Browse the latest catalogue and choose the perfect crackers for your celebration.",
  },
];

const extensions = ["jpg", "jpeg", "png", "webp"];

function HeroImage({ baseName, alt, active }) {
  const [extensionIndex, setExtensionIndex] = useState(0);
  const [failed, setFailed] = useState(false);

  const handleError = () => {
    if (extensionIndex < extensions.length - 1) {
      setExtensionIndex((current) => current + 1);
    } else {
      setFailed(true);
    }
  };

  return (
    <div
      className="absolute inset-0"
      style={{
        opacity: active ? 1 : 0,
        transform: active ? "scale(1)" : "scale(1.05)",
        transition: "opacity 1s ease-in-out, transform 5s ease-out",
        zIndex: active ? 1 : 0,
      }}
    >
      {!failed && (
        <img
          src={`/images/hero/${baseName}.${extensions[extensionIndex]}`}
          alt={alt}
          className="h-full w-full object-cover"
          onError={handleError}
        />
      )}

      {failed && (
        <div className="h-full w-full bg-gradient-to-r from-pink-950 via-red-900 to-orange-800" />
      )}
    </div>
  );
}

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentSlide((current) => (current + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  const previousSlide = () => {
    setCurrentSlide((current) =>
      current === 0 ? slides.length - 1 : current - 1
    );
  };

  const nextSlide = () => {
    setCurrentSlide((current) => (current + 1) % slides.length);
  };

  const slide = slides[currentSlide];

  return (
    <section className="relative min-h-[540px] overflow-hidden bg-black text-white md:min-h-[590px]">
      {slides.map((item, index) => (
        <HeroImage
          key={item.baseName}
          baseName={item.baseName}
          alt={item.highlight}
          active={index === currentSlide}
        />
      ))}

      <div className="absolute inset-0 z-[2] bg-gradient-to-r from-black/90 via-black/60 to-black/25" />
      <div className="absolute inset-0 z-[2] bg-gradient-to-t from-black/65 via-transparent to-black/20" />

      <div className="pointer-events-none absolute inset-0 z-[3]">
        <span className="hero-particle left-[8%] top-[18%]" />
        <span className="hero-particle left-[24%] top-[72%] delay-1" />
        <span className="hero-particle left-[68%] top-[55%] delay-2" />
        <span className="hero-particle right-[10%] top-[20%] delay-3" />
      </div>

      <div className="container relative z-10 mx-auto flex min-h-[540px] items-center px-16 py-14 md:min-h-[590px] md:px-20">
        <div key={currentSlide} className="hero-content max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-300/40 bg-yellow-400/15 px-4 py-2 text-xs font-black uppercase tracking-[1.5px] text-yellow-300 backdrop-blur-md">
            <span>🎆</span>
            {slide.badge}
          </div>

          <p className="mt-5 text-xs font-black uppercase tracking-[4px] text-pink-400 sm:text-sm">
            Sivakasi Factory Direct
          </p>

          <h1 className="mt-3 text-3xl font-black leading-[1.08] sm:text-4xl md:text-5xl">
            {slide.title}
            <span className="mt-1 block bg-gradient-to-r from-pink-500 via-orange-400 to-yellow-300 bg-clip-text text-transparent">
              {slide.highlight}
            </span>
          </h1>

          <p className="mt-5 max-w-lg text-base leading-7 text-gray-200">
            {slide.description}
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/products"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-600 to-orange-500 px-5 py-3 font-black text-white shadow-xl transition hover:-translate-y-1"
            >
              Shop Now
              <FaArrowRight className="transition group-hover:translate-x-1" />
            </Link>

            <Link
              href="/price-list"
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/70 bg-black/25 px-5 py-3 font-black text-white backdrop-blur-md transition hover:bg-white hover:text-black"
            >
              <FaDownload />
              Price List
            </Link>

            <a
              href="https://wa.me/917010400258"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-green-500 px-5 py-3 font-black text-white shadow-xl transition hover:bg-green-600"
            >
              <FaWhatsapp className="text-xl" />
              WhatsApp Order
            </a>
          </div>

          <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs font-bold text-white/85 sm:text-sm">
            <span>✓ Premium Quality</span>
            <span>✓ Factory Direct Price</span>
            <span>✓ GST Billing</span>
            <span>✓ Quick Support</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        aria-label="Previous slide"
        onClick={previousSlide}
        className="absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/35 text-white backdrop-blur-md transition hover:bg-pink-600"
      >
        <FaChevronLeft />
      </button>

      <button
        type="button"
        aria-label="Next slide"
        onClick={nextSlide}
        className="absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/35 text-white backdrop-blur-md transition hover:bg-pink-600"
      >
        <FaChevronRight />
      </button>

      <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2.5">
        {slides.map((item, index) => (
          <button
            type="button"
            key={item.baseName}
            aria-label={`Show slide ${index + 1}`}
            onClick={() => setCurrentSlide(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "w-9 bg-pink-500"
                : "w-2.5 bg-white/45 hover:bg-white/80"
            }`}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes heroContentIn {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes particleFloat {
          0%,
          100% {
            opacity: 0.3;
            transform: translateY(0) scale(0.85);
          }
          50% {
            opacity: 1;
            transform: translateY(-20px) scale(1.15);
          }
        }

        .hero-content {
          animation: heroContentIn 0.7s ease-out both;
        }

        .hero-particle {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 9999px;
          background: #facc15;
          box-shadow: 0 0 16px 6px rgba(250, 204, 21, 0.4);
          animation: particleFloat 3.5s ease-in-out infinite;
        }

        .delay-1 {
          animation-delay: 0.8s;
        }

        .delay-2 {
          animation-delay: 1.6s;
        }

        .delay-3 {
          animation-delay: 2.4s;
        }
      `}</style>
    </section>
  );
}
