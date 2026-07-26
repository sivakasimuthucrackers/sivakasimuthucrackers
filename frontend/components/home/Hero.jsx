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

  function handleError() {
    if (extensionIndex < extensions.length - 1) {
      setExtensionIndex((current) => current + 1);
    } else {
      setFailed(true);
    }
  }

  return (
    <div
      className="absolute inset-0"
      style={{
        opacity: active ? 1 : 0,
        transform: active ? "scale(1)" : "scale(1.04)",
        transition:
          "opacity 1s ease-in-out, transform 5s ease-out",
        zIndex: active ? 1 : 0,
      }}
    >
      {!failed ? (
        <img
          src={`/images/hero/${baseName}.${extensions[extensionIndex]}`}
          alt={alt}
          className="h-full w-full object-cover object-center"
          onError={handleError}
        />
      ) : (
        <div className="h-full w-full bg-gradient-to-r from-pink-950 via-red-900 to-orange-800" />
      )}
    </div>
  );
}

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentSlide(
        (current) => (current + 1) % slides.length
      );
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  function previousSlide() {
    setCurrentSlide((current) =>
      current === 0 ? slides.length - 1 : current - 1
    );
  }

  function nextSlide() {
    setCurrentSlide(
      (current) => (current + 1) % slides.length
    );
  }

  const slide = slides[currentSlide];

  return (
    <section className="relative min-h-[460px] overflow-hidden bg-black text-white sm:min-h-[540px] md:min-h-[590px]">
      {slides.map((item, index) => (
        <HeroImage
          key={item.baseName}
          baseName={item.baseName}
          alt={item.highlight}
          active={index === currentSlide}
        />
      ))}

      <div className="absolute inset-0 z-[2] bg-gradient-to-r from-black/90 via-black/65 to-black/20" />

      <div className="absolute inset-0 z-[2] bg-gradient-to-t from-black/75 via-transparent to-black/20" />

      <div className="pointer-events-none absolute inset-0 z-[3]">
        <span className="hero-particle left-[8%] top-[18%]" />
        <span className="hero-particle left-[24%] top-[72%] delay-1" />
        <span className="hero-particle left-[68%] top-[55%] delay-2" />
        <span className="hero-particle right-[10%] top-[20%] delay-3" />
      </div>

      <div className="container relative z-10 mx-auto flex min-h-[460px] items-center px-6 py-8 sm:min-h-[540px] sm:px-16 sm:py-12 md:min-h-[590px] md:px-20 md:py-14">
        <div
          key={currentSlide}
          className="hero-content max-w-md md:max-w-xl"
        >
          <div className="inline-flex max-w-[260px] items-center gap-2 rounded-full border border-yellow-300/40 bg-yellow-400/15 px-3 py-1.5 text-[11px] font-black uppercase leading-4 tracking-[1.2px] text-yellow-300 backdrop-blur-md sm:max-w-none sm:text-xs">
            <span>🎆</span>
            <span>{slide.badge}</span>
          </div>

          <p className="mt-3 text-[11px] font-black uppercase tracking-[3px] text-pink-400 sm:text-sm sm:tracking-[4px]">
            Sivakasi Factory Direct
          </p>

          <h1 className="mt-2 text-[22px] font-black leading-tight sm:mt-3 sm:text-4xl md:text-5xl">
            {slide.title}

            <span className="mt-1 block bg-gradient-to-r from-pink-500 via-orange-400 to-yellow-300 bg-clip-text text-transparent">
              {slide.highlight}
            </span>
          </h1>

          <p className="mt-2 max-w-md text-sm leading-6 text-gray-200 sm:text-base md:max-w-lg md:text-lg">
            {slide.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-3 sm:mt-7">
            <Link
              href="/products"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-600 to-orange-500 px-4 py-2.5 text-sm font-black text-white shadow-xl transition hover:-translate-y-1 sm:px-5 sm:py-3 sm:text-base"
            >
              Shop Now

              <FaArrowRight className="transition group-hover:translate-x-1" />
            </Link>

            <Link
              href="/price-list"
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/70 bg-black/25 px-4 py-2.5 text-sm font-black text-white backdrop-blur-md transition hover:bg-white hover:text-black sm:px-5 sm:py-3 sm:text-base"
            >
              <FaDownload />
              Price List
            </Link>

            <a
              href="https://wa.me/917010400258"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-2 rounded-full bg-green-500 px-5 py-3 font-black text-white shadow-xl transition hover:bg-green-600 md:inline-flex"
            >
              <FaWhatsapp className="text-xl" />
              WhatsApp Order
            </a>
          </div>

          <div className="mt-7 hidden flex-wrap gap-x-5 gap-y-2 text-xs font-bold text-white/85 md:flex md:text-sm">
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
        className="absolute left-2 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/35 text-white backdrop-blur-md transition hover:bg-pink-600 md:flex"
      >
        <FaChevronLeft />
      </button>

      <button
        type="button"
        aria-label="Next slide"
        onClick={nextSlide}
        className="absolute right-2 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/35 text-white backdrop-blur-md transition hover:bg-pink-600 md:flex"
      >
        <FaChevronRight />
      </button>

      <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {slides.map((item, index) => (
          <button
            type="button"
            key={item.baseName}
            aria-label={`Show slide ${index + 1}`}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "w-8 bg-pink-500"
                : "w-2 bg-white/45 hover:bg-white/80"
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

        @media (max-width: 640px) {
          .hero-content {
            text-align: center;
            margin: 0 auto;
          }

          .hero-content > div:first-child {
            margin-left: auto;
            margin-right: auto;
          }

          .hero-content > div:nth-child(5) {
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
}