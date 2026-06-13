"use client";

import { useState, useEffect } from "react";
import { Problem } from "@/lib/github";
import { getProgress, updateProgress, ProblemStatus } from "@/lib/progress";
import CodeViewer from "@/components/CodeViewer";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "./Problem.module.css";

export default function ProblemClient({ problem }: { problem: Problem }) {
    const [activeTab, setActiveTab] = useState<'problem' | 'solution' | 'explain' | 'notes' | 'demo'>('problem');
    const [activeApproach, setActiveApproach] = useState(0);
    const [activeDemoIndex, setActiveDemoIndex] = useState(0);
    const [problemStatus, setProblemStatus] = useState<ProblemStatus>('none');

    useEffect(() => {
        const progress = getProgress();
        setProblemStatus(progress[problem.slug] || 'none');
        setActiveTab('problem');
        setActiveApproach(0);
        setActiveDemoIndex(0);
    }, [problem.slug]);

    const handleStatusChange = (status: ProblemStatus) => {
        updateProgress(problem.slug, status);
        setProblemStatus(status);
    };
    const approach = problem.approaches[activeApproach];
    const currentDemo = problem.demos && problem.demos.length > 0 
        ? (problem.demos[activeDemoIndex] || problem.demos[0]) 
        : null;

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
                    {problem.demos && problem.demos.length > 0 && (
                        <button
                            className={`${styles.ptab} ${activeTab === 'demo' ? styles.ptabActive : ''}`}
                            onClick={() => setActiveTab('demo')}
                        >
                            Interactive Demo
                        </button>
                    )}
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
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{problem.description}</ReactMarkdown>
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
                {/* INTERACTIVE DEMO TAB */}
                {activeTab === 'demo' && problem.demos && problem.demos.length > 0 && (
                    <div id="tab-demo">
                        {problem.demos.length > 1 && (
                            <div style={{ marginBottom: '20px', display: 'flex', gap: '8px', borderBottom: '1px solid var(--rule-light)' }}>
                                {problem.demos.map((d, i) => (
                                    <button
                                        key={i}
                                        className={`${styles.ptab} ${activeDemoIndex === i ? styles.ptabActive : ""}`}
                                        onClick={() => setActiveDemoIndex(i)}
                                        style={{ flex: 'none', padding: '8px 16px' }}
                                    >
                                        {d.name}
                                    </button>
                                ))}
                            </div>
                        )}
                        <div style={{ width: '100%', border: '1px solid var(--rule-light)', borderRadius: '6px', overflow: 'hidden', background: '#fff' }}>
                            <iframe
                                srcDoc={`
                                    <!DOCTYPE html>
                                    <html>
                                        <head>
                                            <style>
                                                :root {
                                                    --color-border-secondary: rgba(15, 14, 12, 0.12);
                                                    --color-text-primary: #0f0e0c;
                                                    --color-background-secondary: #ede8dc;
                                                    --color-text-secondary: #3a3730;
                                                    --color-border-tertiary: rgba(15, 14, 12, 0.12);
                                                    --border-radius-md: 4px;
                                                }
                                                body {
                                                    margin: 0;
                                                    padding: 10px;
                                                    background: transparent;
                                                    color: #0f0e0c;
                                                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                                                }
                                            </style>
                                        </head>
                                        <body>
                                            ${currentDemo ? currentDemo.code : ""}
                                        </body>
                                    </html>
                                `}
                                style={{ width: '100%', height: '560px', border: 'none' }}
                                sandbox="allow-scripts allow-same-origin"
                                title={currentDemo ? currentDemo.name : "Interactive Demo"}
                            />
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
