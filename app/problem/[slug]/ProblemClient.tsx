"use client";

import { useState, useEffect } from "react";
import { Problem } from "@/lib/github";
import { getProgress, updateProgress, ProblemStatus } from "@/lib/progress";
import CodeViewer from "@/components/CodeViewer";
import ReactMarkdown from "react-markdown";
import styles from "./Problem.module.css";

export default function ProblemClient({ problem }: { problem: Problem }) {
    const [activeTab, setActiveTab] = useState<'problem' | 'solution' | 'explain' | 'notes'>('problem');
    const [activeApproach, setActiveApproach] = useState(0);
    const [problemStatus, setProblemStatus] = useState<ProblemStatus>('none');

    useEffect(() => {
        const progress = getProgress();
        setProblemStatus(progress[problem.slug] || 'none');
    }, [problem.slug]);

    const handleStatusChange = (status: ProblemStatus) => {
        updateProgress(problem.slug, status);
        setProblemStatus(status);
    };
    const approach = problem.approaches[activeApproach];

    const diffClass = problem.difficulty.toLowerCase();

    return (
        <div className={styles.page}>
            <div className={styles.panel}>
                <div className={styles.panelMasthead}>
                    <span className={styles.panelSectionTag}>Problem · #{problem.slug.slice(0, 2)}</span>
                    <h1 className={styles.panelHeadline}>{problem.title}</h1>
                </div>

                <div className={styles.panelTabs}>
                    <button
                        className={`${styles.ptab} ${activeTab === 'problem' ? styles.ptabActive : ''}`}
                        onClick={() => setActiveTab('problem')}
                    >
                        Problem
                    </button>
                    <button
                        className={`${styles.ptab} ${activeTab === 'solution' ? styles.ptabActive : ''}`}
                        onClick={() => setActiveTab('solution')}
                    >
                        Solution
                    </button>
                    <button
                        className={`${styles.ptab} ${activeTab === 'explain' ? styles.ptabActive : ''}`}
                        onClick={() => setActiveTab('explain')}
                    >
                        AI Explain
                    </button>
                    <button
                        className={`${styles.ptab} ${activeTab === 'notes' ? styles.ptabActive : ''}`}
                        onClick={() => setActiveTab('notes')}
                    >
                        Notes
                    </button>
                </div>

                <div className={styles.panelBody}>
                    {/* PROBLEM TAB */}
                    {activeTab === 'problem' && (
                        <div id="tab-problem">
                            <div className={styles.panelBadges}>
                                <span className={`${styles.diffPill} ${styles[diffClass] || ''}`}>{problem.difficulty}</span>
                                <span className={styles.panelComplexity}>
                                    {problem.complexity?.time || 'O(n)'} · {problem.complexity?.space || 'O(1)'}
                                </span>
                            </div>
                            <span className={styles.colKicker}>Description</span>
                            <div className={styles.panelBodyText}>
                                <ReactMarkdown>{problem.description}</ReactMarkdown>
                            </div>
                            <hr className={styles.panelRule} />
                            <span className={styles.colKicker}>Difficulty Context</span>
                            <p className={styles.panelBodyText}>
                                This problem is categorized as <strong>{problem.difficulty}</strong>.
                                It requires understanding of <em>{problem.categories.join(', ') || 'fundamental algorithms'}</em>.
                            </p>
                            <div className={styles.statusRow}>
                                <button
                                    className={`${styles.sbtn} ${problemStatus === 'solved' ? styles.sbtnSolved : ''}`}
                                    onClick={() => handleStatusChange('solved')}
                                >
                                    ✓ Solved
                                </button>
                                <button
                                    className={`${styles.sbtn} ${problemStatus === 'attempted' ? styles.sbtnAttempted : ''}`}
                                    onClick={() => handleStatusChange('attempted')}
                                >
                                    - Attempted
                                </button>
                                <button
                                    className={styles.sbtn}
                                    onClick={() => handleStatusChange('none')}
                                >
                                    ✕ Reset
                                </button>
                            </div>
                        </div>
                    )}

                    {/* SOLUTION TAB */}
                    {activeTab === 'solution' && (
                        <div id="tab-solution">
                            {problem.approaches.length > 1 && (
                                <div style={{ marginBottom: '20px', display: 'flex', gap: '8px', borderBottom: '1px solid var(--rule-light)' }}>
                                    {problem.approaches.map((a, i) => (
                                        <button
                                            key={i}
                                            className={`${styles.ptab} ${activeApproach === i ? styles.ptabActive : ""}`}
                                            onClick={() => setActiveApproach(i)}
                                            style={{ flex: 'none', padding: '8px 16px' }}
                                        >
                                            {a.name || `Approach ${i + 1}`}
                                        </button>
                                    ))}
                                </div>
                            )}
                            <div className={styles.panelBodyText}>
                                <p style={{ marginBottom: '14px' }}>{approach?.description || 'Optimal solution implementation in C++.'}</p>
                                <CodeViewer code={approach?.code || ''} />
                            </div>
                        </div>
                    )}

                    {/* EXPLAIN TAB */}
                    {activeTab === 'explain' && (
                        <div id="tab-explain">
                            <div className={styles.explainLede}>
                                <p>
                                    <span className={styles.dropCap}>A</span>sk the editor for a plain-English walkthrough of this solution — the approach, the key insight, and why it works.
                                </p>
                                <button className={styles.runBtn}>Run the explainer</button>
                            </div>
                        </div>
                    )}

                    {/* NOTES TAB */}
                    {activeTab === 'notes' && (
                        <div id="tab-notes">
                            <span className={styles.colKicker} style={{ marginTop: 0 }}>Your notes</span>
                            <textarea className={styles.notesArea} placeholder="Your approach, observations, questions..."></textarea>
                            <button className={styles.notesSave}>Save</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
