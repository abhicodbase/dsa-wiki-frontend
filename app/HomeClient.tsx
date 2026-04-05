"use client";

import { useState } from "react";
import { Problem, Category } from "@/lib/github";
import ProblemCard from "@/components/ProblemCard";
import styles from "./Home.module.css";

const ALL_CATEGORIES: ("All" | Category)[] = [
    "All",
    "Array",
    "String",
    "Graphs",
    "DP",
    "LinkedList",
];

export default function HomeClient({ initialProblems }: { initialProblems: Problem[] }) {
    const [activeFilter, setActiveFilter] = useState<"All" | Category>("All");

    const filtered =
        activeFilter === "All"
            ? initialProblems
            : initialProblems.filter((p) => p.categories.includes(activeFilter as Category));

    return (
        <div className="container">
            <section className={styles.hero}>
                <div className={styles.heroBadge}>
                    <div className={styles.badgeDot}></div>
                    Live from GitHub · C++ solutions
                </div>
                <h1 className={styles.heroTitle}>Master data structures & algorithms</h1>
                <p className={styles.heroSub}>
                    A curated problem set fetched directly from{" "}
                    <a
                        className={styles.heroLink}
                        href="https://github.com/abhicodbase/dsa-wiki"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        github.com/abhicodbase/dsa-wiki
                    </a>
                    . Work through problems, explore solutions, build intuition.
                </p>

                <div className={styles.statsRow}>
                    <div className={styles.statCard}>
                        <div className={styles.statNum}>{initialProblems.length}</div>
                        <div className={styles.statLabel}>Problems</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statNum}>C++</div>
                        <div className={styles.statLabel}>Language</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statNum}>0%</div>
                        <div className={styles.statLabel}>Solved</div>
                    </div>
                </div>
            </section>

            <div className={styles.sectionLabel}>Filter by topic</div>
            <div className={styles.filters}>
                {ALL_CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        className={`${styles.filterPill} ${activeFilter === cat ? styles.filterPillActive : ""}`}
                        onClick={() => setActiveFilter(cat as typeof activeFilter)}
                    >
                        {cat === "All" ? "All" : cat}
                    </button>
                ))}
            </div>

            <div className={styles.problemsList}>
                {filtered.length === 0 ? (
                    <div className={styles.emptyState}>No problems found.</div>
                ) : (
                    filtered.map((problem, i) => (
                        <ProblemCard key={problem.slug} problem={problem} index={i} />
                    ))
                )}

                {/* Placeholder row from HTML */}
                <div className={styles.placeholderRow}>
                    {/* We can skip this or add as a decorative element if needed */}
                </div>
            </div>
        </div>
    );
}
