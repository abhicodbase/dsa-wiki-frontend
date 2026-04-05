"use client";

import styles from "./Navbar.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
    const pathname = usePathname();
    const [dateStr, setDateStr] = useState("");

    useEffect(() => {
        setDateStr(new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }) + ' · Vol. I, No. 1');
    }, []);

    const navItems = ["All Problems", "Array", "String", "Graphs", "DP", "Linked List"];

    return (
        <header className={styles.masthead}>
            <div className={styles.mastheadTop}>
                <span>{dateStr}</span>
                <span>
                    <a href="https://github.com/abhicodbase/dsa-wiki" target="_blank" rel="noopener noreferrer">
                        github.com/abhicodbase/dsa-wiki
                    </a> · C++ Edition
                </span>
            </div>
            <div className={styles.mastheadMain}>
                <Link href="/" className={styles.nameplate}>
                    The Algorithm Times
                </Link>
                <div className={styles.mastheadRight}>
                    <div className={styles.editionLine}>Daily Practice Edition</div>
                    <div className={styles.editionNum}>Est. 2024</div>
                </div>
            </div>
            <div className={styles.navStrip}>
                {navItems.map((item) => (
                    <button
                        key={item}
                        className={`${styles.navItem} ${pathname === "/" && item === "All Problems" ? styles.navItemActive : ""}`}
                    >
                        {item}
                    </button>
                ))}
            </div>
        </header>
    );
}
