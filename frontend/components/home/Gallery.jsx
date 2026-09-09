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
      <section
        style={{
          background: "#050505",
          color: "#ffffff",
          padding: "70px 20px",
          textAlign: "center",
        }}
      >
        Loading gallery...
      </section>
    );
  }

  if (!items.length) {
    return null;
  }

  return (
    <section
      id="gallery"
      style={{
        background:
          "radial-gradient(circle at top, rgba(236,0,122,0.08), transparent 35%), #050505",
        color: "#ffffff",
        padding: "76px 20px 84px",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1280px",
          margin: "0 auto",
        }}
      >
        {/* Section Heading */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "42px",
          }}
        >
          <div
            style={{
              display: "inline-block",
              color: "#ec007a",
              fontSize: "13px",
              fontWeight: "800",
              letterSpacing: "2.5px",
              textTransform: "uppercase",
              marginBottom: "10px",
            }}
          >
            Our Moments
          </div>

          <h2
            style={{
              margin: 0,
              color: "#ffffff",
              fontSize: "clamp(30px, 4vw, 44px)",
              lineHeight: 1.15,
              fontWeight: "800",
              letterSpacing: "-0.5px",
            }}
          >
            Gallery
          </h2>

          <div
            style={{
              width: "58px",
              height: "4px",
              borderRadius: "999px",
              background: "#ec007a",
              margin: "15px auto 0",
            }}
          />

          <p
            style={{
              margin: "16px auto 0",
              maxWidth: "680px",
              color: "#aeb4bf",
              fontSize: "16px",
              lineHeight: 1.7,
            }}
          >
            Explore photos and videos from Sivakasi Muthu Crackers.
          </p>
        </div>

        {/* Gallery Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
            gap: "24px",
            alignItems: "start",
          }}
        >
          {items.map((item) => {
            const mediaUrl = item.mediaUrl || item.image;

            return (
              <article
                key={item._id}
                style={{
                  background: "#101010",
                  border: "1px solid rgba(255,255,255,0.09)",
                  borderRadius: "18px",
                  overflow: "hidden",
                  boxShadow: "0 14px 35px rgba(0,0,0,0.28)",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "16 / 10",
                    background: "#000000",
                    overflow: "hidden",
                  }}
                >
                  {item.resourceType === "video" ? (
                    <video
                      src={mediaUrl}
                      controls
                      preload="metadata"
                      playsInline
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "block",
                        objectFit: "cover",
                        background: "#000000",
                      }}
                    />
                  ) : (
                    <img
                      src={mediaUrl}
                      alt={item.title || "Muthu Crackers Gallery"}
                      loading="lazy"
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "block",
                        objectFit: "cover",
                      }}
                    />
                  )}
                </div>

                {(item.title || item.description) && (
                  <div
                    style={{
                      padding: "20px",
                    }}
                  >
                    {item.title && (
                      <h3
                        style={{
                          margin: 0,
                          color: "#ffffff",
                          fontSize: "19px",
                          fontWeight: "700",
                          lineHeight: 1.35,
                        }}
                      >
                        {item.title}
                      </h3>
                    )}

                    {item.description && (
                      <p
                        style={{
                          margin: item.title ? "9px 0 0" : 0,
                          color: "#9da3ae",
                          fontSize: "14px",
                          lineHeight: 1.65,
                        }}
                      >
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
