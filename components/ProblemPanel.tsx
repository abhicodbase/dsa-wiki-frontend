"use client";

import { useState, useEffect } from "react";
import { Problem } from "@/lib/github";
import { getProgress, updateProgress, ProblemStatus } from "@/lib/progress";
import CodeViewer from "@/components/CodeViewer";
import ReactMarkdown from "react-markdown";
import styles from "./ProblemPanel.module.css";

interface ProblemPanelProps {
    problem: Problem | null;
    isOpen: boolean;
    onClose: () => void;
    isLoading?: boolean;
    error?: string | null;
}

export default function ProblemPanel({ problem, isOpen, onClose, error }: ProblemPanelProps) {
    const [activeTab, setActiveTab] = useState<'problem' | 'solution' | 'explain' | 'notes'>('problem');
    const [activeApproach, setActiveApproach] = useState(0);
    const [problemStatus, setProblemStatus] = useState<ProblemStatus>('none');
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        if (problem) {
            const progress = getProgress();
            setProblemStatus(progress[problem.slug] || 'none');
            setActiveTab('problem');
            setActiveApproach(0);
        }
    }, [problem]);

    const handleStatusChange = (status: ProblemStatus) => {
        if (problem) {
            updateProgress(problem.slug, status);
            setProblemStatus(status);
        }
    };

    if (!problem) return null;

    const isSkeletal = !problem.description || (problem.approaches && problem.approaches.length === 0);
    const approach = problem.approaches?.[activeApproach];
    const diffClass = problem.difficulty?.toLowerCase() || 'medium';

    return (
        <aside className={`${styles.panel} ${isOpen ? styles.open : ''} ${isExpanded ? styles.expanded : ''}`}>
            <div className={styles.panelMasthead}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <span className={styles.panelSectionTag}>Problem · #{problem.slug.slice(0, 2)}</span>
                        <h1 className={styles.panelHeadline}>{problem.title}</h1>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <button className={styles.expandBtn} onClick={() => setIsExpanded(!isExpanded)}>
                            {isExpanded ? 'REDUCE' : 'EXPAND'}
                        </button>
                        <button className={styles.closeTextBtn} onClick={onClose}>CLOSE</button>
                        <button className={styles.panelClose} onClick={onClose}>✕</button>
                    </div>
                </div>
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
                    Explanation
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
                            {error ? (
                                <div className={styles.errorState}>
                                    ✕ {error}
                                </div>
                            ) : isSkeletal ? (
                                <div className={styles.loadingState}>
                                    <span className={styles.spinner}></span> Consulting GitHub...
                                </div>
                            ) : (
                                <ReactMarkdown>{problem.description}</ReactMarkdown>
                            )}
                        </div>
                        {!isSkeletal && <hr className={styles.panelRule} />}
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
                            {isSkeletal ? (
                                <div className={styles.loadingState}>
                                    <span className={styles.spinner}></span> Fetching code...
                                </div>
                            ) : (
                                <>
                                    <p style={{ marginBottom: '14px' }}>{approach?.description || 'Optimal solution implementation in C++.'}</p>
                                    <CodeViewer code={approach?.code || ''} />
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* EXPLAIN TAB */}
                {activeTab === 'explain' && (
                    <div id="tab-explain">
                        <div className={styles.panelBodyText}>
                            <ReactMarkdown>{problem.explanation || "No explanation available."}</ReactMarkdown>
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
        </aside>
    );
}
