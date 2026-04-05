"use client";

import { useState, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Problem, fetchProblemDetails } from "@/lib/github";
import ProblemCard from "@/components/ProblemCard";
import ProblemPanel from "@/components/ProblemPanel";
import { getProgress, ProgressMap } from "@/lib/progress";
import styles from "./Home.module.css";

function HomeContent({ initialProblems }: { initialProblems: Problem[] }) {
    const searchParams = useSearchParams();
    const [topic, setTopic] = useState(searchParams.get("topic") || "All Problems");
    const [hiddenDiffs, setHiddenDiffs] = useState<Set<string>>(new Set());
    const [progress, setProgress] = useState<ProgressMap>({});
    const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);

    useEffect(() => {
        setTopic(searchParams.get("topic") || "All Problems");
    }, [searchParams]);

    const toggleDiff = (diff: string) => {
        const next = new Set(hiddenDiffs);
        if (next.has(diff)) next.delete(diff);
        else next.add(diff);
        setHiddenDiffs(next);
    };

    useEffect(() => {
        const loadProgress = () => setProgress(getProgress());
        loadProgress();
        window.addEventListener('progressupdate', loadProgress);
        return () => window.removeEventListener('progressupdate', loadProgress);
    }, []);

    const filteredByTopic = topic === "All Problems"
        ? initialProblems
        : initialProblems.filter(p => p.categories.some(cat => cat.toLowerCase() === topic.toLowerCase()));

    const filtered = filteredByTopic.filter(p => !hiddenDiffs.has(p.difficulty));

    const totalProblems = initialProblems.length;
    const solvedCount = Object.values(progress).filter(s => s === 'solved').length;
    const inProgressCount = Object.values(progress).filter(s => s === 'attempted').length;

    useEffect(() => {
        if (selectedProblem && (!selectedProblem.approaches || selectedProblem.approaches.length === 0)) {
            const loadFullDetails = async () => {
                setFetchError(null);
                try {
                    const full = await fetchProblemDetails(selectedProblem.slug);
                    if (full) {
                        setSelectedProblem(full);
                    } else {
                        setFetchError("Failed to load problem details.");
                    }
                } catch (e) {
                    setFetchError("Error fetching from GitHub.");
                }
            };
            loadFullDetails();
        }
    }, [selectedProblem?.slug]);

    const handleSelect = (p: Problem) => {
        // Clear previous selection logic if any, but React state handles it.
        // We set to skeletal first, then useEffect fetches.
        setSelectedProblem(p);
        setIsPanelOpen(true);
    };

    return (
        <div className={`${styles.app} ${isPanelOpen ? styles.panelOpen : ''}`}>
            <div className={styles.main}>
                <div style={{
                    paddingBottom: '60px',
                    margin: isPanelOpen ? '0 32px' : '0 auto',
                    maxWidth: isPanelOpen ? '100%' : 'var(--col)',
                    transition: 'all 0.35s ease-in-out'
                }}>
                    {/* HERO SECTION */}
                    <section className={styles.hero}>
                        <div className={styles.heroColumns}>
                            <div className={styles.heroLeft}>
                                <span className={styles.kicker}>✦ Live from GitHub</span>
                                <h1 className={styles.heroHeadline}>Master <em>Data Structures</em> & Algorithms, One Problem at a Time</h1>
                                <p className={styles.heroDeck}>
                                    A curated practice journal fetching C++ solutions directly from{" "}
                                    <a href="https://github.com/abhicodbase/dsa-wiki" target="_blank" rel="noopener noreferrer">
                                        github.com/abhicodbase/dsa-wiki
                                    </a>.
                                    Click any problem to read, study, and get an AI-powered explanation.
                                </p>
                            </div>
                            <div className={styles.colDivider}></div>
                            <div className={styles.heroRight}>
                                <div className={styles.statGrid}>
                                    <div className={styles.statCell}>
                                        <div className={styles.statCellVal}>{totalProblems}</div>
                                        <div className={styles.statCellLbl}>Problems</div>
                                    </div>
                                    <div className={styles.statCell}>
                                        <div className={styles.statCellVal}>{solvedCount}</div>
                                        <div className={styles.statCellLbl}>Solved</div>
                                    </div>
                                    <div className={styles.statCell}>
                                        <div className={styles.statCellVal}>{inProgressCount}</div>
                                        <div className={styles.statCellLbl}>In Progress</div>
                                    </div>
                                    <div className={styles.statCell}>
                                        <div className={styles.statCellVal}>C++</div>
                                        <div className={styles.statCellLbl}>Language</div>
                                    </div>
                                </div>
                                <div className={styles.progressSection}>
                                    <div className={styles.progressLabelRow}>
                                        <span>Progress</span>
                                        <span>{solvedCount} of {totalProblems}</span>
                                    </div>
                                    <div className={styles.progressTrack}>
                                        <div className={styles.progressFill} style={{ width: `${(solvedCount / totalProblems) * 100}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* FILTER BAR */}
                    <div className={styles.filterBar}>
                        <span className={styles.filterLabel}>Difficulty</span>
                        <div className={styles.diffTags}>
                            <button
                                className={`${styles.dtag} ${styles.easy} ${hiddenDiffs.has('Easy') ? styles.off : ''}`}
                                onClick={() => toggleDiff('Easy')}
                            >
                                Easy
                            </button>
                            <button
                                className={`${styles.dtag} ${styles.medium} ${hiddenDiffs.has('Medium') ? styles.off : ''}`}
                                onClick={() => toggleDiff('Medium')}
                            >
                                Medium
                            </button>
                            <button
                                className={`${styles.dtag} ${styles.hard} ${hiddenDiffs.has('Hard') ? styles.off : ''}`}
                                onClick={() => toggleDiff('Hard')}
                            >
                                Hard
                            </button>
                        </div>
                    </div>

                    {/* PROBLEMS TABLE */}
                    <div className={styles.problemsSection}>
                        <div className={styles.sectionRule}>
                            <div className={styles.sectionRuleLine}></div>
                            <div className={styles.sectionRuleLabel}>{topic}</div>
                            <div className={styles.sectionRuleLine}></div>
                        </div>
                        <table className={styles.probTable}>
                            <thead>
                                <tr>
                                    <th style={{ width: '36px' }}>#</th>
                                    <th></th>
                                    <th>Title</th>
                                    <th style={{ textAlign: 'right' }}>Difficulty</th>
                                    <th style={{ width: '20px' }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} style={{ padding: '24px 0', color: 'var(--ink3)', fontStyle: 'italic', fontSize: '13px' }}>
                                            No problems match the current filter.
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((problem, i) => (
                                        <ProblemCard
                                            key={problem.slug}
                                            problem={problem}
                                            index={i}
                                            status={progress[problem.slug] || 'none'}
                                            isSelected={selectedProblem?.slug === problem.slug}
                                            onSelect={() => handleSelect(problem)}
                                        />
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <ProblemPanel
                problem={selectedProblem}
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
                error={fetchError}
            />
        </div>
    );
}

export default function HomeClient({ initialProblems }: { initialProblems: Problem[] }) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <HomeContent initialProblems={initialProblems} />
        </Suspense>
    );
}
