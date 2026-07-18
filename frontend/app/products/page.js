import ProductList from "@/components/products/ProductList";

export const metadata = {
  title: "Products | Sivakasi Muthu Crackers",
};

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-[#080808] py-16">
      <div className="container">
        <div className="mb-10 text-center">
          <p className="font-bold uppercase tracking-[4px] text-pink-500">
            Factory Direct Price
          </p>

          <h1 className="mt-3 text-4xl font-black md:text-6xl">
            Our Products
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-gray-400">
            Explore our complete cracker catalogue.
          </p>
        </div>

        <ProductList />
      </div>
    </main>
  );
}