export default function BrandSection() {
  const brands = [
    {
      name: "Vadi Vel",
      image: "/images/brands/Vadivel.png",
      imageClass: "max-h-12",
    },
    {
      name: "Star Vel",
      image: "/images/brands/StarVel.png",
      imageClass: "max-h-12",
    },
    {
      name: "Wow Star",
      image: "/images/brands/Wowstar.png",
      imageClass: "max-h-12",
    },
    {
      name: "Bodhi Leaf",
      image: "/images/brands/BodhiLeaf.png",
      imageClass: "max-h-12",
    },
    {
      name: "Daddy's",
      image: "/images/brands/Daddys.png",
      imageClass: "max-h-12",
    },
  ];

  return (
    <section className="bg-[#080808] py-8 md:py-12">
      <div className="container mx-auto px-4">

        <div className="rounded-3xl border border-pink-500/20 bg-white/5 p-6">

          <p className="text-center text-xs font-bold uppercase tracking-[5px] text-pink-500">
            TRUSTED BRANDED CRACKERS
          </p>

          <h2 className="mt-3 text-center text-3xl font-black leading-tight text-white md:text-4xl">
            Original Branded Products
            <br />
            Available
          </h2>

          <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-5">

            {brands.map((brand) => (
              <div
                key={brand.name}
                className="flex h-20 items-center justify-center rounded-xl border border-white/10 bg-transparent transition duration-300 hover:border-pink-500 hover:bg-white/5 hover:scale-105 md:h-24"
              >
                <img
                  src={brand.image}
                  alt={brand.name}
                  className={`max-h-full max-w-[80%] object-contain ${brand.imageClass}`}
                />
              </div>
            ))}

          </div>

          <p className="mx-auto mt-8 max-w-2xl text-center text-sm leading-7 text-gray-400 md:text-base">
            We stock original branded Sivakasi crackers from trusted
            manufacturers.
          </p>

        </div>

      </div>
    </section>
  );
}
