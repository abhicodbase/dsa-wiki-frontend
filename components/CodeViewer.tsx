"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check } from "lucide-react";
import styles from "./CodeViewer.module.css";

interface Props {
    code: string;
    language?: string;
}

export default function CodeViewer({ code, language = "cpp" }: Props) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <span className={styles.lang}>C++</span>
                <button
                    className={`${styles.copyBtn} ${copied ? styles.copiedBtn : ""}`}
                    onClick={handleCopy}
                >
                    {copied ? <Check size={13} /> : <Copy size={13} />}
                    {copied ? "Copied!" : "Copy"}
                </button>
            </div>
            <SyntaxHighlighter
                language={language}
                style={vscDarkPlus}
                customStyle={{
                    margin: 0,
                    background: "transparent",
                    padding: "20px",
                    fontSize: "0.85rem",
                }}
                className={styles.pre}
            >
                {code}
            </SyntaxHighlighter>
        </div>
    );
}
