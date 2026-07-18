"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  FaBoxOpen,
  FaChartBar,
  FaClipboardList,
  FaEnvelope,
  FaFileExcel,
  FaFileInvoiceDollar,
  FaFolderOpen,
  FaHome,
  FaImage,
  FaSignOutAlt,
  FaSlidersH,
  FaUserFriends,
} from "react-icons/fa";

const menuItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: FaChartBar },
  { name: "Products", href: "/admin/products", icon: FaBoxOpen },
  { name: "Categories", href: "/admin/categories", icon: FaFolderOpen },
  { name: "Orders", href: "/admin/orders", icon: FaClipboardList },
  { name: "Customers", href: "/admin/customers", icon: FaUserFriends },
  { name: "Enquiries", href: "/admin/enquiries", icon: FaEnvelope },
  { name: "Banners", href: "/admin/banners", icon: FaImage },
  { name: "Gallery", href: "/admin/gallery", icon: FaImage },
  { name: "Reports", href: "/admin/reports", icon: FaFileInvoiceDollar },
  { name: "Settings", href: "/admin/settings", icon: FaSlidersH },
  { name: "Import Excel", href: "/admin/import", icon: FaFileExcel },
];

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  function logout() {
    localStorage.removeItem("muthuAdminToken");
    localStorage.removeItem("muthuAdminDetails");
    router.push("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#080808] text-white lg:flex">
      <aside className="border-b border-white/10 bg-black lg:fixed lg:inset-y-0 lg:left-0 lg:w-72 lg:border-b-0 lg:border-r">
        <div className="flex h-full flex-col">
          <div className="border-b border-white/10 p-6">
            <p className="text-sm font-bold uppercase tracking-[4px] text-pink-500">
              Sivakasi
            </p>
            <h1 className="mt-2 text-2xl font-black">Muthu Crackers</h1>
            <p className="mt-1 text-sm text-gray-500">Admin Panel</p>
          </div>

          <nav className="grid gap-2 overflow-y-auto p-4 sm:grid-cols-3 lg:flex lg:flex-1 lg:flex-col">
            {menuItems.map(({ name, href, icon: Icon }) => {
              const active = pathname.startsWith(href);

              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 font-bold transition ${
                    active
                      ? "bg-pink-600 text-white"
                      : "text-gray-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon />
                  {name}
                </Link>
              );
            })}
          </nav>

          <div className="grid gap-3 border-t border-white/10 p-4 sm:grid-cols-2 lg:block lg:space-y-3">
            <Link
              href="/"
              className="flex items-center justify-center gap-3 rounded-xl border border-white/10 px-4 py-3 font-bold text-gray-300 transition hover:border-pink-500 hover:text-pink-500 lg:justify-start"
            >
              <FaHome />
              View Website
            </Link>

            <button
              type="button"
              onClick={logout}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-red-600 px-4 py-3 font-bold transition hover:bg-red-700 lg:justify-start"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1 lg:ml-72">
        <header className="border-b border-white/10 bg-black/80 px-5 py-5 backdrop-blur lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500">Sivakasi Muthu Crackers</p>
              <h2 className="text-xl font-black">Administration</h2>
            </div>

            <div className="rounded-full border border-pink-500/30 bg-pink-500/10 px-5 py-2 text-sm font-bold text-pink-400">
              GSTIN: 33CFNPM5329G3Z9
            </div>
          </div>
        </header>

        <div>{children}</div>
      </div>
    </div>
  );
}
