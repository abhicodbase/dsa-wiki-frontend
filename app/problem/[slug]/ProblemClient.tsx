"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink, ChevronRight, Clock, Database } from "lucide-react";
import { Problem } from "@/lib/github";
import CodeViewer from "@/components/CodeViewer";
import ReactMarkdown from "react-markdown";
import styles from "./Problem.module.css";

export default function ProblemClient({ problem }: { problem: Problem }) {
    const [activeApproach, setActiveApproach] = useState(0);
    const approach = problem.approaches[activeApproach];

    const diffClass =
        problem.difficulty === "Easy"
            ? "badge-easy"
            : problem.difficulty === "Medium"
                ? "badge-medium"
                : "badge-hard";

    return (
        <div className={styles.page}>
            <div className="container">
                {/* Breadcrumb */}
                <nav className={styles.breadcrumb}>
                    <Link href="/">Problems</Link>
                    <ChevronRight size={14} className={styles.breadcrumbSep} />
                    <span className={styles.breadcrumbCurrent}>{problem.title}</span>
                </nav>

                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.headerTop}>
                        <span className={`badge ${diffClass}`}>{problem.difficulty}</span>
                        {problem.categories.map((cat) => (
                            <span key={cat} className="tag">
                                {cat}
                            </span>
                        ))}
                    </div>
                    <h1 className={styles.problemTitle}>{problem.title}</h1>
                    <div className={styles.descriptionBox}>
                        <ReactMarkdown>{problem.description}</ReactMarkdown>
                    </div>
                </div>

                {/* Visual Concept */}
                {problem.visualImage && (
                    <div style={{ marginBottom: 48 }}>
                        <p className={styles.sectionTitle}>Visual Concept</p>
                        <div className={styles.visualContainer}>
                            <Image
                                src={problem.visualImage}
                                alt="Visual Concept"
                                fill
                                style={{ objectFit: "contain", padding: "20px" }}
                            />
                        </div>
                    </div>
                )}

                {/* Approaches */}
                {problem.approaches.length > 0 && (
                    <div className={styles.approachSection}>
                        <p className={styles.sectionTitle}>
                            {problem.approaches.length > 1 ? "Solutions & Approaches" : "Solution Approach"}
                        </p>

                        {problem.approaches.length > 1 && (
                            <div className={styles.tabList}>
                                {problem.approaches.map((a, i) => (
                                    <button
                                        key={i}
                                        className={`${styles.tab} ${activeApproach === i ? styles.tabActive : ""}`}
                                        onClick={() => setActiveApproach(i)}
                                    >
                                        {a.name}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className={styles.approachPanel}>
                            {approach && (
                                <>
                                    <div className={styles.approachInfo}>
                                        <p className={styles.approachDesc}>{approach.description}</p>
                                        <div className={styles.complexityGrid}>
                                            <div className={styles.complexityCard}>
                                                <p className={styles.complexityLabel}>Time Complexity</p>
                                                <p className={styles.complexityValue}>{approach.timeComplexity}</p>
                                            </div>
                                            <div className={styles.complexityCard}>
                                                <p className={styles.complexityLabel}>Space Complexity</p>
                                                <p className={styles.complexityValue}>{approach.spaceComplexity}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <CodeViewer code={approach.code} />
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* Resources */}
                {problem.resources.length > 0 && (
                    <div className={styles.resourcesSection}>
                        <p className={styles.sectionTitle}>External Resources</p>
                        <div className={styles.resourceGrid}>
                            {problem.resources.map((r) => (
                                <a
                                    key={r.url}
                                    href={r.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.resourceLink}
                                >
                                    <ExternalLink size={14} />
                                    {r.name}
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
