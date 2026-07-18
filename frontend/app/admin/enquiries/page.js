"use client";

import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api/enquiries";

export default function EnquiriesPage() {

  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEnquiries();
  }, []);

  const loadEnquiries = async () => {

    try {

      const token = localStorage.getItem("muthuAdminToken");

      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setEnquiries(data.enquiries);
      }

      setLoading(false);

    } catch (error) {

      console.log(error);
      setLoading(false);

    }

  };

  const deleteEnquiry = async (id) => {

    if (!confirm("Delete this enquiry?")) return;

    const token = localStorage.getItem("muthuAdminToken");

    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    alert(data.message);

    if (data.success) {
      loadEnquiries();
    }

  };

  return (

    <div className="container mx-auto px-6 py-8">

      <h1 className="text-3xl font-bold mb-8">
        Customer Enquiries
      </h1>

      {loading ? (

        <h2>Loading...</h2>

      ) : enquiries.length === 0 ? (

        <h2>No Enquiries Found</h2>

      ) : (

        <div className="overflow-auto">

          <table className="w-full border">

            <thead className="bg-pink-600 text-white">

              <tr>

                <th className="p-3">Name</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Email</th>
                <th className="p-3">Message</th>
                <th className="p-3">Date</th>
                <th className="p-3">Action</th>

              </tr>

            </thead>

            <tbody>

              {enquiries.map((item) => (

                <tr
                  key={item._id}
                  className="border-b"
                >

                  <td className="p-3">{item.name}</td>

                  <td className="p-3">
                    {item.phone}
                  </td>

                  <td className="p-3">
                    {item.email}
                  </td>

                  <td className="p-3">
                    {item.message}
                  </td>

                  <td className="p-3">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>

                  <td className="p-3">

                    <button
                      onClick={() => deleteEnquiry(item._id)}
                      className="bg-red-600 text-white px-4 py-2 rounded"
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>

  );

}