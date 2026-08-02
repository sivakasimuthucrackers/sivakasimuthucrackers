"use client";

import { useEffect, useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
} from "react-icons/fa";

const API_URL = "https://muthu-crackers-backend.onrender.com/api/gallery";

export default function Gallery() {
  const [gallery, setGallery] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGallery() {
      try {
        const response = await fetch(`${API_URL}/active`);
        const data = await response.json();

        if (data.success) {
          setGallery(data.galleryItems || []);
        }
      } catch (error) {
        console.error("Unable to load gallery:", error);
      } finally {
        setLoading(false);
      }
    }

    loadGallery();
  }, []);

  const closeModal = () => {
    setSelectedIndex(null);
  };

  const showPrevious = (event) => {
    event.stopPropagation();

    setSelectedIndex((current) =>
      current === 0 ? gallery.length - 1 : current - 1
    );
  };

  const showNext = (event) => {
    event.stopPropagation();

    setSelectedIndex((current) =>
      current === gallery.length - 1 ? 0 : current + 1
    );
  };

  const mobileGallery = gallery.slice(0, 4);

  return (
    <section className="relative overflow-hidden bg-[#080808] py-10 text-white md:py-20">
      <div className="absolute -left-32 bottom-0 h-64 w-64 rounded-full bg-purple-600/20 blur-3xl md:h-80 md:w-80" />

      <div className="absolute -right-32 top-0 h-64 w-64 rounded-full bg-pink-600/20 blur-3xl md:h-80 md:w-80" />

      <div className="container relative z-10 mx-auto px-4 md:px-5">
        <div className="mx-auto mb-6 max-w-3xl text-center md:mb-12">
          <p className="text-xs font-bold uppercase tracking-[4px] text-pink-500 md:text-base">
            Our Moments
          </p>

          <h2 className="mt-2 text-2xl font-black md:mt-3 md:text-5xl">
            Gallery
          </h2>

          <p className="mt-3 text-sm leading-6 text-gray-400 md:mt-4 md:text-base">
            Explore colourful moments and collections from Sivakasi Muthu
            Crackers.
          </p>
        </div>

        {loading && (
          <>
            <div className="grid grid-cols-2 gap-3 md:hidden">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[145px] animate-pulse rounded-2xl border border-white/10 bg-white/5"
                />
              ))}
            </div>

            <div className="hidden auto-rows-[220px] gap-5 sm:grid-cols-2 md:grid lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse rounded-3xl border border-white/10 bg-white/5"
                />
              ))}
            </div>
          </>
        )}

        {!loading && gallery.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center md:p-10">
            <p className="text-4xl">📷</p>

            <h3 className="mt-3 text-lg font-black">
              Gallery Coming Soon
            </h3>

            <p className="mt-2 text-sm text-gray-400">
              Customer photos and celebration moments will be added soon.
            </p>
          </div>
        )}

        {!loading && gallery.length > 0 && (
          <>
            {/* Mobile compact 2 × 2 grid */}
            <div className="grid grid-cols-2 gap-3 md:hidden">
              {mobileGallery.map((item, index) => (
                <button
                  type="button"
                  key={item._id}
                  onClick={() => setSelectedIndex(index)}
                  className="group relative h-[145px] overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-left shadow-lg"
                >
                  <img
                    src={item.image}
                    alt={item.title || "Gallery image"}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 p-3">
                    <h3 className="line-clamp-1 text-xs font-black">
                      {item.title || "Muthu Crackers"}
                    </h3>
                  </div>
                </button>
              ))}
            </div>

            {/* Desktop gallery */}
            <div className="hidden auto-rows-[220px] gap-5 md:grid md:grid-cols-2 lg:grid-cols-4">
              {gallery.map((item, index) => (
                <button
                  type="button"
                  key={item._id}
                  onClick={() => setSelectedIndex(index)}
                  className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 text-left shadow-xl transition duration-500 hover:-translate-y-2 hover:border-pink-500 ${
                    index % 5 === 0 ? "row-span-2" : ""
                  }`}
                >
                  <img
                    src={item.image}
                    alt={item.title || "Gallery image"}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />

                  <div className="absolute inset-x-0 bottom-0 translate-y-2 p-5 transition duration-500 group-hover:translate-y-0">
                    <h3 className="text-lg font-black">
                      {item.title || "Muthu Crackers"}
                    </h3>

                    {item.description && (
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-300">
                        {item.description}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {selectedIndex !== null && gallery[selectedIndex] && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
          onClick={closeModal}
        >
          <button
            type="button"
            aria-label="Close gallery"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-lg text-white transition hover:bg-pink-600 md:right-5 md:top-5 md:h-12 md:w-12 md:text-xl"
            onClick={closeModal}
          >
            <FaTimes />
          </button>

          {gallery.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous image"
                className="absolute left-2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-pink-600 md:left-8 md:h-12 md:w-12"
                onClick={showPrevious}
              >
                <FaChevronLeft />
              </button>

              <button
                type="button"
                aria-label="Next image"
                className="absolute right-2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-pink-600 md:right-8 md:h-12 md:w-12"
                onClick={showNext}
              >
                <FaChevronRight />
              </button>
            </>
          )}

          <div
            className="max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={gallery[selectedIndex].image}
              alt={gallery[selectedIndex].title || "Gallery image"}
              className="max-h-[75vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl md:rounded-3xl"
            />

            <div className="mt-4 text-center">
              <h3 className="text-lg font-black md:text-xl">
                {gallery[selectedIndex].title}
              </h3>

              {gallery[selectedIndex].description && (
                <p className="mt-2 text-sm text-gray-400 md:text-base">
                  {gallery[selectedIndex].description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
