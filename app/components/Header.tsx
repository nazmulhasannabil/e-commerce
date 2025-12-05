import Link from "next/link";

export default function Header() {
    const navlink = [
        { name: "Home", link: "/" },
        { name: "About", link: "/about" },
        { name: "Contact", link: "/contact" }
    ];
    return (
        <nav className="flex items-center justify-between px-20 py-4">
            <h1 className="text-2xl font-bold cursor-pointer">Online <span className="text-orange-500">Shop</span></h1>
            <div>
                {navlink.map((item) => {
                    return (
                        <Link href={item.link} key={item.name}>
                            <button className="px-4 py-2 font-semibold text-gray-900 hover:text-gray-700 cursor-pointer">
                                {item.name}
                            </button>
                        </Link>
                    );
                })}
            </div>
            <Link href="/login">
                <button className="px-4 py-2 cursor-pointer bg-orange-500 text-white rounded-full hover:bg-orange-600">
                    Login
                </button>
            </Link>
        </nav>
    );
}