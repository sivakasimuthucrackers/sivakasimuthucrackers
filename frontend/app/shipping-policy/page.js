export const metadata = {
  title: "Shipping Policy | Sivakasi Muthu Crackers",
};

export default function ShippingPolicyPage() {
  return (
    <main className="min-h-screen bg-[#080808] py-16">
      <div className="container max-w-4xl">
        <p className="font-bold uppercase tracking-[4px] text-pink-500">
          Shipping Information
        </p>

        <h1 className="mt-3 text-4xl font-black md:text-6xl">
          Shipping Policy
        </h1>

        <div className="mt-10 space-y-8 rounded-3xl border border-white/10 bg-white/5 p-8 text-gray-300">

          <section>
            <h2 className="text-2xl font-black text-white">
              1. Delivery Locations
            </h2>

            <p className="mt-3 leading-8">
              We deliver crackers to eligible locations as permitted by
              transport regulations and local government guidelines.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white">
              2. Delivery Time
            </h2>

            <p className="mt-3 leading-8">
              Delivery time depends on your location, transport availability,
              seasonal demand and order volume.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white">
              3. Shipping Charges
            </h2>

            <p className="mt-3 leading-8">
              Shipping charges are calculated based on the delivery location,
              order quantity and transport provider.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white">
              4. Order Tracking
            </h2>

            <p className="mt-3 leading-8">
              Customers can contact us by phone or WhatsApp to know the
              current delivery status.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white">
              5. Contact Details
            </h2>

            <div className="mt-3 space-y-2">
              <p>
                Opp AJ Polytechnic College,
                Near Sankari Mahal,
                Sattur - Sivakasi Road,
                Konampatti
              </p>

              <p>Phone : +91 96003 33302</p>

              <p>WhatsApp : +91 70104 00258</p>

              <p>Email : sivakasimuthucrackers@gmail.com</p>

              <p>GSTIN : 33CFNPM5329G3Z9</p>

            </div>

          </section>

        </div>
      </div>
    </main>
  );
}