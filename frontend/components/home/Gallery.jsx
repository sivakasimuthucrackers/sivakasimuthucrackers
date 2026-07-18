"use client";

import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";

const API_URL = "http://localhost:5000/api/gallery";

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

  const closeModal = () => setSelectedIndex(null);

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

  return (
    <section className="relative overflow-hidden bg-[#080808] py-20 text-white">
      <div className="absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-purple-600/20 blur-3xl" />
      <div className="absolute -right-32 top-0 h-80 w-80 rounded-full bg-pink-600/20 blur-3xl" />

      <div className="container relative z-10 mx-auto px-5">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="font-bold uppercase tracking-[4px] text-pink-500">
            Our Moments
          </p>
          <h2 className="mt-3 text-3xl font-black md:text-5xl">Gallery</h2>
          <p className="mt-4 text-gray-400">
            Explore colourful moments and collections from Sivakasi Muthu
            Crackers.
          </p>
        </div>

        {loading && (
          <p className="text-center text-gray-400">Loading gallery...</p>
        )}

        {!loading && gallery.length === 0 && (
          <p className="text-center text-gray-400">
            Gallery images will be available soon.
          </p>
        )}

        {!loading && gallery.length > 0 && (
          <div className="grid auto-rows-[220px] gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {gallery.map((item, index) => (
              <button
                type="button"
                key={item._id}
                onClick={() => setSelectedIndex(index)}
                className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 text-left shadow-xl transition duration-500 hover:-translate-y-2 hover:border-pink-500 ${
                  index % 5 === 0 ? "sm:row-span-2" : ""
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
            className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-xl text-white transition hover:bg-pink-600"
            onClick={closeModal}
          >
            <FaTimes />
          </button>

          {gallery.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous image"
                className="absolute left-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-pink-600 md:left-8"
                onClick={showPrevious}
              >
                <FaChevronLeft />
              </button>

              <button
                type="button"
                aria-label="Next image"
                className="absolute right-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-pink-600 md:right-8"
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
              className="max-h-[78vh] w-auto rounded-3xl object-contain shadow-2xl"
            />

            <div className="mt-4 text-center">
              <h3 className="text-xl font-black">
                {gallery[selectedIndex].title}
              </h3>
              {gallery[selectedIndex].description && (
                <p className="mt-2 text-gray-400">
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
