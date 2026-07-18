export const metadata = {
  title: "Terms and Conditions | Sivakasi Muthu Crackers",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#080808] py-16">
      <div className="container max-w-4xl">
        <p className="font-bold uppercase tracking-[4px] text-pink-500">
          Legal Information
        </p>

        <h1 className="mt-3 text-4xl font-black md:text-6xl">
          Terms and Conditions
        </h1>

        <div className="mt-10 space-y-8 rounded-3xl border border-white/10 bg-white/5 p-8 text-gray-300">
          <section>
            <h2 className="text-2xl font-black text-white">
              1. Product Availability
            </h2>
            <p className="mt-3 leading-8">
              All orders are subject to product availability. Product
              prices and stock may change without prior notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white">
              2. Order Confirmation
            </h2>
            <p className="mt-3 leading-8">
              Orders placed through WhatsApp or the website are confirmed
              only after availability, delivery charges and payment details
              are verified by our team.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white">
              3. Pricing
            </h2>
            <p className="mt-3 leading-8">
              The displayed prices are based on the latest available price
              list. Final pricing will be confirmed before payment.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white">
              4. Delivery
            </h2>
            <p className="mt-3 leading-8">
              Delivery availability, charges and timelines depend on the
              destination and applicable transport regulations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white">
              5. Safety
            </h2>
            <p className="mt-3 leading-8">
              Customers must follow all safety instructions, local laws and
              age restrictions when handling and using fireworks products.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white">
              6. Business Information
            </h2>
            <div className="mt-3 space-y-2 leading-8">
              <p>
                Opp AJ Polytechnic College, Near Sankari Mahal,
                Sattur - Sivakasi Road, Konampatti
              </p>
              <p>Phone: +91 96003 33302</p>
              <p>WhatsApp: +91 70104 00258</p>
              <p>Email: sivakasimuthucrackers@gmail.com</p>
              <p>GSTIN: 33CFNPM5329G3Z9</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}