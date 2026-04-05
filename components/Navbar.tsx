import styles from "./Navbar.module.css";
import Link from "next/link";
import { GitFork } from "lucide-react";

export default function Navbar() {
    return (
        <nav className={styles.nav}>
            <Link href="/" className={styles.navLogo}>
                <div className={styles.logoIcon}>&lt;/&gt;</div>
                DSA Practice Hub
            </Link>
            <div className={styles.navRight}>
                <Link href="/" className={styles.navLink}>
                    Problems
                </Link>
                <a
                    href="https://github.com/abhicodbase/dsa-wiki"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.githubBtn}
                >
                    <GitFork size={14} />
                    GitHub
                </a>
            </div>
        </nav>
    );
}
