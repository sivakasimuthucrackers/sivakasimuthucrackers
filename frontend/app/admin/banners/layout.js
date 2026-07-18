import AdminShell from "@/components/admin/AdminShell";

export const metadata = {
  title: "Admin Panel | Sivakasi Muthu Crackers",
};

export default function AdminLayout({ children }) {
  return <AdminShell>{children}</AdminShell>;
}