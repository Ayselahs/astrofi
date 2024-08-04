import React, { useState } from "react";
import Link from "next/link";
import sidebar from "@/styles/Sidebar.module.css"
import Image from "next/image";

const Sidebar = () => {

    const [menuOpen, setMenuOpen] = useState(false)
    const toggleMenu = () => {
        setMenuOpen(!menuOpen)
    }

    return (
        <aside className={`${sidebar.sidebar} ${menuOpen ? sidebar.open : ''}`}>
            <div className={sidebar.header}>
                <Image src='/Logo 1.png'
                    alt=''
                    className={sidebar.logo} width={100}
                    height={100} />

                <button className={sidebar.hamburger} onClick={toggleMenu}>
                    <Image src="/container.png" alt="Menu" className={sidebar.hamburgerIcon} width={100}
                        height={100} />

                </button>
            </div>
            <nav className={sidebar.nav}>

                <div className={sidebar.list}>
                    <h2 className={sidebar.title}>Main Menu</h2>
                    <Link href="/dashboard" className={sidebar.item}>Dashboard</Link>
                    <Link href="/history" className={sidebar.item}>History</Link>
                    <Link href="/profile" className={sidebar.item}>Profile</Link>
                    <h2 className={sidebar.title}>Playlist</h2>
                    <Link href="/likedTracks" className={sidebar.item}>Loved Songs</Link>
                </div>

            </nav>
        </aside >

    )
}

export default Sidebar;

