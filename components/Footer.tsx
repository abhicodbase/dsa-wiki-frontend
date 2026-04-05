import styles from "./Footer.module.css";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerLine}></div>
            <div className={styles.footerContent}>
                <span>&copy; {new Date().getFullYear()} The Algorithm Times · Daily Practice Edition</span>
                <div className={styles.footerLinks}>
                    <a href="https://github.com/abhicodbase/dsa-wiki" target="_blank" rel="noopener noreferrer">GitHub</a>
                    <a href="#">Privacy</a>
                    <a href="#">Terms</a>
                </div>
            </div>
        </footer>
    );
}
