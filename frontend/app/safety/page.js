import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaFireExtinguisher,
  FaChild,
} from "react-icons/fa";

export const metadata = {
  title: "Safety Instructions | Sivakasi Muthu Crackers",
  description:
    "Read important cracker safety guidelines before using fireworks.",
};

const safetyTips = [
  "Always burst crackers in an open outdoor area.",
  "Keep a bucket of water and sand nearby.",
  "Children should always be supervised by adults.",
  "Wear cotton clothes while bursting crackers.",
  "Maintain a safe distance after lighting crackers.",
  "Never relight a cracker that failed to ignite.",
  "Store crackers away from heat and direct sunlight.",
  "Dispose of used crackers only after confirming they are completely extinguished.",
];

export default function SafetyPage() {
  return (
    <main className="min-h-screen bg-[#080808] py-16">
      <div className="container">

        <div className="text-center max-w-4xl mx-auto">

          <p className="uppercase tracking-[4px] font-bold text-pink-500">
            Celebrate Responsibly
          </p>

          <h1 className="text-5xl font-black mt-4">
            Safety Instructions
          </h1>

          <p className="mt-6 text-gray-400 leading-8">
            Your safety is our priority. Please follow these important
            safety precautions while enjoying fireworks with your family.
          </p>

        </div>

        <div className="grid lg:grid-cols-2 gap-8 mt-14">

          <div className="rounded-3xl bg-white/5 border border-white/10 p-8">

            <div className="flex items-center gap-3 mb-6">

              <FaCheckCircle className="text-green-500 text-3xl"/>

              <h2 className="text-3xl font-black">
                Do's
              </h2>

            </div>

            <ul className="space-y-5">

              {safetyTips.map((tip) => (

                <li
                  key={tip}
                  className="flex gap-3 items-start"
                >

                  <FaCheckCircle className="mt-1 text-green-500"/>

                  <span className="text-gray-300">
                    {tip}
                  </span>

                </li>

              ))}

            </ul>

          </div>

          <div className="rounded-3xl bg-white/5 border border-white/10 p-8">

            <div className="flex items-center gap-3 mb-6">

              <FaExclamationTriangle className="text-yellow-500 text-3xl"/>

              <h2 className="text-3xl font-black">
                Don'ts
              </h2>

            </div>

            <ul className="space-y-5">

              <li className="flex gap-3">
                <FaExclamationTriangle className="mt-1 text-yellow-500"/>
                Never burst crackers inside the house.
              </li>

              <li className="flex gap-3">
                <FaExclamationTriangle className="mt-1 text-yellow-500"/>
                Do not hold lit crackers in your hand.
              </li>

              <li className="flex gap-3">
                <FaExclamationTriangle className="mt-1 text-yellow-500"/>
                Never throw crackers towards people or animals.
              </li>

              <li className="flex gap-3">
                <FaExclamationTriangle className="mt-1 text-yellow-500"/>
                Avoid wearing synthetic or loose clothing.
              </li>

              <li className="flex gap-3">
                <FaExclamationTriangle className="mt-1 text-yellow-500"/>
                Never experiment with fireworks.
              </li>

              <li className="flex gap-3">
                <FaExclamationTriangle className="mt-1 text-yellow-500"/>
                Keep crackers away from infants and pets.
              </li>

            </ul>

          </div>

        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-12">

          <div className="rounded-2xl bg-pink-600/10 border border-pink-500/20 p-6">

            <FaChild className="text-4xl text-pink-500"/>

            <h3 className="text-2xl font-black mt-4">
              Adult Supervision
            </h3>

            <p className="mt-3 text-gray-300 leading-7">
              Children should always burst crackers only under
              the supervision of responsible adults.
            </p>

          </div>

          <div className="rounded-2xl bg-green-600/10 border border-green-500/20 p-6">

            <FaFireExtinguisher className="text-4xl text-green-500"/>

            <h3 className="text-2xl font-black mt-4">
              Emergency Preparedness
            </h3>

            <p className="mt-3 text-gray-300 leading-7">
              Keep water, sand and a first-aid kit nearby while
              bursting crackers.
            </p>

          </div>

        </div>

      </div>
    </main>
  );
}