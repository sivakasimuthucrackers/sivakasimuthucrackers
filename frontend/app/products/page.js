import ProductList from "@/components/products/ProductList";

export const metadata = {
  title: "Products | Sivakasi Muthu Crackers",
};

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-[#080808] py-6 md:py-12">
      <div className="container">
        <div className="mb-4 text-center md:mb-8">
          <p className="font-bold uppercase tracking-[4px] text-pink-500">
            Factory Direct Price
          </p>

          <h1 className="mt-2 text-3xl font-black md:text-5xl">
            Our Products
          </h1>

          <p className="mx-auto mt-2 max-w-2xl text-sm text-gray-400 md:mt-4 md:text-base">
            Explore our complete cracker catalogue.
          </p>
        </div>

        <ProductList />
      </div>
    </main>
  );
}
