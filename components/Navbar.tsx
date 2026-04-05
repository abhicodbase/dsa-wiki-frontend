"use client";

import styles from "./Navbar.module.css";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function NavbarContent() {
    const searchParams = useSearchParams();
    const currentTopic = searchParams.get("topic") || "All Problems";
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

                <div className={styles.mascotWrap} title="Byte, your study companion">
                    <svg width="72" height="82" viewBox="0 0 72 82" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <ellipse cx="36" cy="79" rx="16" ry="3" fill="#0f0e0c" opacity="0.10" />
                        <ellipse cx="36" cy="56" rx="18" ry="20" fill="#f5e6c8" stroke="#0f0e0c" strokeWidth="1.4" />
                        <path d="M24 52 Q36 45 48 52 L46 72 Q36 76 26 72 Z" fill="#1a4a7a" stroke="#0f0e0c" strokeWidth="1.2" />
                        <path d="M28 52 L26 44" stroke="#1a4a7a" strokeWidth="3" strokeLinecap="round" />
                        <path d="M44 52 L46 44" stroke="#1a4a7a" strokeWidth="3" strokeLinecap="round" />
                        <rect x="31" y="57" width="10" height="8" rx="1" fill="none" stroke="#f5e6c8" strokeWidth="0.8" opacity="0.6" />
                        <line x1="36" y1="57" x2="36" y2="53" stroke="#e8b84b" strokeWidth="1.5" strokeLinecap="round" />
                        <polygon points="36,51 35,53 37,53" fill="#8b1a1a" />
                        <ellipse cx="36" cy="32" rx="17" ry="18" fill="#f5e6c8" stroke="#0f0e0c" strokeWidth="1.4" />
                        <path d="M22 26 Q20 16 25 14 Q24 20 28 19" fill="#3a2a10" stroke="#0f0e0c" strokeWidth="0.8" />
                        <path d="M36 15 Q36 8 40 9 Q38 15 42 14" fill="#3a2a10" stroke="#0f0e0c" strokeWidth="0.8" />
                        <path d="M46 20 Q50 12 53 16 Q49 18 50 23" fill="#3a2a10" stroke="#0f0e0c" strokeWidth="0.8" />
                        <path d="M20 28 Q19 20 24 16 Q30 12 36 12 Q44 12 49 17 Q53 21 52 28" fill="#3a2a10" stroke="#0f0e0c" strokeWidth="1" />
                        <circle cx="28" cy="33" r="9" fill="#b8860b" stroke="#0f0e0c" strokeWidth="1.3" />
                        <circle cx="44" cy="33" r="9" fill="#b8860b" stroke="#0f0e0c" strokeWidth="1.3" />
                        <path d="M37 33 Q36 31 35 33" stroke="#0f0e0c" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                        <path d="M19 30 Q17 33 19 36" stroke="#b8860b" strokeWidth="2" strokeLinecap="round" fill="none" />
                        <path d="M53 30 Q55 33 53 36" stroke="#b8860b" strokeWidth="2" strokeLinecap="round" fill="none" />
                        <circle cx="28" cy="33" r="6.5" fill="#c8e8ff" opacity="0.85" stroke="#0f0e0c" strokeWidth="0.6" />
                        <circle cx="44" cy="33" r="6.5" fill="#c8e8ff" opacity="0.85" stroke="#0f0e0c" strokeWidth="0.6" />
                        <circle cx="25.5" cy="30.5" r="1.5" fill="white" opacity="0.7" />
                        <circle cx="41.5" cy="30.5" r="1.5" fill="white" opacity="0.7" />
                        <circle cx="28" cy="33" r="2" fill="#1a1816" />
                        <circle cx="44" cy="33" r="2" fill="#1a1816" />
                        <circle cx="28.6" cy="32.4" r="0.5" fill="white" />
                        <circle cx="44.6" cy="32.4" r="0.5" fill="white" />
                        <ellipse cx="36" cy="39" rx="2" ry="1.2" fill="#e8c89a" stroke="#c8a870" strokeWidth="0.5" />
                        <path d="M30 43 Q36 48 42 43" stroke="#0f0e0c" strokeWidth="1.3" strokeLinecap="round" fill="none" />
                        <path d="M32 43.5 Q36 47 40 43.5" fill="white" stroke="none" />
                        <line x1="36" y1="43.5" x2="36" y2="46.5" stroke="#e8c89a" strokeWidth="0.6" />
                        <ellipse cx="19.5" cy="33" rx="3" ry="4" fill="#f5e6c8" stroke="#0f0e0c" strokeWidth="1.2" />
                        <ellipse cx="52.5" cy="33" rx="3" ry="4" fill="#f5e6c8" stroke="#0f0e0c" strokeWidth="1.2" />
                        <ellipse cx="19.5" cy="33" rx="1.5" ry="2.5" fill="#e8c09a" />
                        <ellipse cx="52.5" cy="33" rx="1.5" ry="2.5" fill="#e8c09a" />
                        <path d="M18 55 Q10 52 8 60 Q9 66 14 65" fill="#f5e6c8" stroke="#0f0e0c" strokeWidth="1.3" />
                        <rect x="2" y="58" width="14" height="18" rx="1" fill="#fdfaf3" stroke="#0f0e0c" strokeWidth="1" />
                        <line x1="5" y1="63" x2="13" y2="63" stroke="#1a4a7a" strokeWidth="0.8" />
                        <line x1="5" y1="66" x2="13" y2="66" stroke="#1a4a7a" strokeWidth="0.8" />
                        <line x1="5" y1="69" x2="10" y2="69" stroke="#1a4a7a" strokeWidth="0.8" />
                        <path d="M54 55 Q62 48 65 44 Q68 41 66 39 Q64 37 62 40 Q61 36 59 37 Q58 33 56 35 Q55 31 53 33 Q51 35 52 40 L54 55Z" fill="#f5e6c8" stroke="#0f0e0c" strokeWidth="1.2" />
                        <line x1="62" y1="40" x2="63" y2="42" stroke="#c8a870" strokeWidth="0.6" />
                        <line x1="60" y1="38" x2="61" y2="40" stroke="#c8a870" strokeWidth="0.6" />
                        <ellipse cx="28" cy="75" rx="7" ry="4" fill="#1a3a5a" stroke="#0f0e0c" strokeWidth="1.2" />
                        <ellipse cx="44" cy="75" rx="7" ry="4" fill="#1a3a5a" stroke="#0f0e0c" strokeWidth="1.2" />
                        <path d="M54 10 Q54 4 62 4 Q70 4 70 10 Q70 16 62 16 L58 20 L60 16 Q54 16 54 10Z" fill="#fdfaf3" stroke="#0f0e0c" strokeWidth="1" />
                        <text x="62" y="12" fontSize="7" textAnchor="middle" fill="#8b1a1a" fontFamily="Georgia,serif" fontStyle="italic">&lt;/&gt;</text>
                    </svg>
                    <div className={styles.mascotName}>Byte</div>
                </div>

                <div className={styles.mastheadRight}>
                    <div className={styles.editionLine}>Daily Practice Edition</div>
                    <div className={styles.editionNum}>Est. 2024</div>
                </div>
            </div>
            <div className={styles.navStrip}>
                {navItems.map((item) => (
                    <Link
                        key={item}
                        href={item === "All Problems" ? "/" : `/?topic=${item}`}
                        className={`${styles.navItem} ${currentTopic === item ? styles.navItemActive : ""}`}
                    >
                        {item}
                    </Link>
                ))}
            </div>
        </header>
    );
}

export default function Navbar() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <NavbarContent />
        </Suspense>
    );
}
