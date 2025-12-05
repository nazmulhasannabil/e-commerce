import { signOut } from "firebase/auth";
import { BrainIcon, ChartNoAxesGantt, LayoutDashboard, PackageOpen, ShieldCheck, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { auth } from "@/lib/firebase";


export default function Sidebar() {
    const menuItems = [
        { name: "Dashboard", href: "/admin", icon: <LayoutDashboard className="w-5 h-5" /> },
        { name: "Products", href: "/admin/products", icon: <PackageOpen className="w-5 h-5" /> },
        { name: "Category", href: "/admin/category", icon: <ChartNoAxesGantt className="w-5 h-5" /> },
        { name: "Brands", href: "/admin/brands", icon: <BrainIcon className="w-5 h-5" /> },
        { name: "Orders", href: "/admin/orders", icon: <ShoppingCart className="w-5 h-5" /> },
        { name: "Customers", href: "/admin/customers", icon: <User className="w-5 h-5" /> },
        { name: "Admins", href: "/admin/admins", icon: <ShieldCheck className="w-5 h-5" /> },
    ];
    return (
        <div className="h-screen bg-white p-4 overflow-hidden flex gap-8 flex-col border-r border-gray-200">
            <h1 className="text-2xl font-bold cursor-pointer">Online <span className="text-orange-500">Shop</span></h1>

            <div className="flex-1 flex flex-col gap-5">
                {menuItems.map((item, key) => (
                    <Tab item={item} key={key} />
                ))}
            </div>
            <button
                onClick={async() => {
                    try {
                        await toast.promise(signOut(auth), {
                            loading: "Logging out...",
                            success: "Logged out successfully!",
                            error: "Failed to log out!",
                        });
                    } catch (error) {
                        toast(error.message)
                    }
                }}
                className="w-full">
                Logout
            </button>
        </div>
    );
}

function Tab({ item }) {
    const pathname = usePathname();
    const isSelected = pathname === item.href;
    return <Link
        key={item.name}
        href={item.href}
        className={`text-gray-900 hover:bg-orange-300 flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold transition-colors ease-in-out ${isSelected ? 'bg-orange-500 text-white hover:bg-orange-700' : 'bg-white text-gray-900'}`}
    >
        {item.icon}
        {item.name}
    </Link>
}