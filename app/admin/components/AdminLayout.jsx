

import { useEffect, useRef, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }) {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);
    const pathname = usePathname();
    const sidebarRef = useRef(null);

    useEffect(() => {
        toggle();   
    }, [pathname]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    return (
        <main className="flex relative">
            <div className="hidden md:block">
                <Sidebar />
            </div>
            <div 
            ref={sidebarRef}
            className={`fixed md:hidden  ${isOpen ? 'translate-x-0' : '-translate-x-[250px]'} ease-in-out transition-all duration-300 z-50`}>
                <Sidebar />
            </div>
            <section className="flex-1 flex flex-col">
                <Header toggle={toggle} />
                <section className="flex-1">{children}</section>
            </section>
        </main>
    );
}
