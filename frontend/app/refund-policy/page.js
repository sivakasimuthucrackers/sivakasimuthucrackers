export const metadata = {
  title: "Refund Policy | Sivakasi Muthu Crackers",
};

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-[#080808] py-16">
      <div className="container max-w-4xl">
        <p className="font-bold uppercase tracking-[4px] text-pink-500">
          Refund Information
        </p>

        <h1 className="mt-3 text-4xl font-black md:text-6xl">
          Refund and Cancellation Policy
        </h1>

        <div className="mt-10 space-y-8 rounded-3xl border border-white/10 bg-white/5 p-8 text-gray-300">
          <section>
            <h2 className="text-2xl font-black text-white">
              1. Order Cancellation
            </h2>

            <p className="mt-3 leading-8">
              Customers may request order cancellation before the order is
              confirmed, packed or handed over for delivery. Cancellation
              requests after dispatch may not be accepted.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white">
              2. Refund Eligibility
            </h2>

            <p className="mt-3 leading-8">
              Refunds may be considered only when an order cannot be fulfilled,
              payment has been received twice, or the ordered products are
              unavailable and no suitable replacement is accepted.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white">
              3. Damaged Products
            </h2>

            <p className="mt-3 leading-8">
              Customers must report visible transport damage immediately after
              receiving the order and provide clear photos or videos. Claims
              will be reviewed based on transport and product conditions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white">
              4. Non-Returnable Products
            </h2>

            <p className="mt-3 leading-8">
              Fireworks and cracker products are generally non-returnable once
              delivered because of safety, handling and transport restrictions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white">
              5. Refund Processing
            </h2>

            <p className="mt-3 leading-8">
              Approved refunds will be processed using the original payment
              method or another mutually agreed method. Processing time may
              depend on the bank or payment provider.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white">
              6. Contact Details
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