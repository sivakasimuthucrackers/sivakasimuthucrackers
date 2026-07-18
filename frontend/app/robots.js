export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/checkout",
        "/cart",
      ],
    },
    sitemap:
      "https://www.sivakasimuthucrackers.com/sitemap.xml",
  };
}