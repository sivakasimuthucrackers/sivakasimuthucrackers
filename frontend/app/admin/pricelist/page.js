"use client";

import { useState } from "react";

export default function PriceListPage() {

  const [pdf, setPdf] = useState("");
  const [saved, setSaved] = useState(false);

  const savePriceList = () => {

    localStorage.setItem("priceList", pdf);

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);

  };

  return (

    <div className="container mx-auto px-6 py-8">

      <h1 className="text-3xl font-bold mb-6">
        Price List Management
      </h1>

      <div className="bg-white rounded-xl shadow-lg p-6">

        <label className="font-semibold">
          PDF URL / File Path
        </label>

        <input
          type="text"
          value={pdf}
          onChange={(e)=>setPdf(e.target.value)}
          placeholder="/price-list/price-list.pdf"
          className="border rounded-lg w-full mt-3 p-3"
        />

        <button
          onClick={savePriceList}
          className="mt-5 bg-pink-600 text-white px-6 py-3 rounded-lg"
        >
          Save
        </button>

        {saved && (

          <p className="text-green-600 mt-4 font-semibold">
            Price List Updated Successfully
          </p>

        )}

      </div>

    </div>

  );

}