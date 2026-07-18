export const metadata = {
  title: "Privacy Policy | Sivakasi Muthu Crackers",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#080808] py-16">
      <div className="container max-w-4xl">
        <p className="font-bold uppercase tracking-[4px] text-pink-500">
          Privacy Information
        </p>

        <h1 className="mt-3 text-4xl font-black md:text-6xl">
          Privacy Policy
        </h1>

        <div className="mt-10 space-y-8 rounded-3xl border border-white/10 bg-white/5 p-8 text-gray-300">
          <section>
            <h2 className="text-2xl font-black text-white">
              1. Information We Collect
            </h2>

            <p className="mt-3 leading-8">
              We may collect your name, mobile number, email address,
              delivery address, enquiry details and order information when
              you contact us or place an order.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white">
              2. How We Use Your Information
            </h2>

            <p className="mt-3 leading-8">
              Your information is used to process enquiries, confirm orders,
              coordinate delivery, provide customer support and communicate
              important updates regarding your order.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white">
              3. Data Protection
            </h2>

            <p className="mt-3 leading-8">
              We take reasonable steps to protect customer information from
              unauthorized access, misuse, loss or disclosure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white">
              4. Sharing of Information
            </h2>

            <p className="mt-3 leading-8">
              We do not sell or rent customer information. Information may
              be shared only when required for delivery, payment,
              legal compliance or business operations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white">
              5. Cookies and Website Usage
            </h2>

            <p className="mt-3 leading-8">
              The website may use basic browser storage or cookies to
              remember cart items and improve the shopping experience.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white">
              6. Contact Us
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