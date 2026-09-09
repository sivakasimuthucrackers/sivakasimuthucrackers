"use client";

import { useEffect, useState } from "react";

const API_URL =
  "https://muthu-crackers-backend.onrender.com/api/gallery/active";

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const response = await fetch(API_URL, {
          cache: "no-store",
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setItems(data.galleryItems || []);
        }
      } catch (error) {
        console.error("Gallery load error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadGallery();
  }, []);

  if (loading) {
    return (
      <section className="py-12 px-4">
        <p className="text-center">Loading gallery...</p>
      </section>
    );
  }

  if (!items.length) {
    return null;
  }

  return (
    <section className="py-12 md:py-16 px-4 md:px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-pink-600">
            Our Moments
          </p>

          <h2 className="text-3xl md:text-4xl font-bold mt-2">
            Gallery
          </h2>

          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            Explore photos and videos from Sivakasi Muthu Crackers.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => {
            const mediaUrl = item.mediaUrl || item.image;

            return (
              <article
                key={item._id}
                className="rounded-2xl overflow-hidden bg-white shadow-md border"
              >
                <div className="aspect-[4/3] bg-gray-100">
                  {item.resourceType === "video" ? (
                    <video
                      src={mediaUrl}
                      controls
                      preload="metadata"
                      playsInline
                      className="w-full h-full object-cover bg-black"
                    />
                  ) : (
                    <img
                      src={mediaUrl}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {(item.title || item.description) && (
                  <div className="p-4">
                    {item.title && (
                      <h3 className="font-bold text-lg">
                        {item.title}
                      </h3>
                    )}

                    {item.description && (
                      <p className="text-gray-600 text-sm mt-1">
                        {item.description}
                      </p>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
