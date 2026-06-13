"use client";

import { useState, useEffect, useCallback } from "react";
import { Problem } from "@/lib/github";
import { getProgress, updateProgress, ProblemStatus } from "@/lib/progress";
import CodeViewer from "@/components/CodeViewer";
import Mermaid from "@/components/Mermaid";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Maximize2, Minimize2, X } from "lucide-react";
import styles from "./ProblemPanel.module.css";

interface ProblemPanelProps {
    problem: Problem | null;
    isOpen: boolean;
    isExpanded: boolean;
    onToggleExpand: () => void;
    onClose: () => void;
    isLoading?: boolean;
    error?: string | null;
}

export default function ProblemPanel({ problem, isOpen, isExpanded, onToggleExpand, onClose, error }: ProblemPanelProps) {
    const [activeTab, setActiveTab] = useState<'problem' | 'solution' | 'explain' | 'notes' | 'demo'>('problem');
    const [activeApproach, setActiveApproach] = useState(0);
    const [activeDemoIndex, setActiveDemoIndex] = useState(0);
    const [problemStatus, setProblemStatus] = useState<ProblemStatus>('none');
    const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
    const [lightboxAlt, setLightboxAlt] = useState<string>('');

    useEffect(() => {
        if (problem) {
            const progress = getProgress();
            setProblemStatus(progress[problem.slug] || 'none');
            setActiveTab('problem');
            setActiveApproach(0);
            setActiveDemoIndex(0);
        }
    }, [problem]);

    const openLightbox = useCallback((src: string, alt: string) => {
        setLightboxSrc(src);
        setLightboxAlt(alt);
    }, []);

    const closeLightbox = useCallback(() => {
        setLightboxSrc(null);
        setLightboxAlt('');
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && lightboxSrc) {
                closeLightbox();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [lightboxSrc, closeLightbox]);

    // Custom image renderer for ReactMarkdown — makes every image clickable
    const MarkdownImage = useCallback(({ src, alt }: { src?: string; alt?: string }) => {
        if (!src) return null;
        return (
            <span className={styles.imgWrapper}>
                <img
                    src={src}
                    alt={alt || ''}
                    className={styles.mdImage}
                    onClick={() => openLightbox(src, alt || '')}
                    title="Click to enlarge"
                />
                <span className={styles.imgHint}>🔍 Click to enlarge</span>
            </span>
        );
    }, [openLightbox]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const markdownComponents: any = {
        code({ node: _node, className, children, ...props }: { node?: unknown; className?: string; children?: React.ReactNode; [key: string]: unknown }) {
            const match = /language-(\w+)/.exec(className || '');
            const isMermaid = match && match[1] === 'mermaid';
            if (isMermaid) {
                return <Mermaid chart={String(children).replace(/\n$/, '')} />;
            }
            return <code className={className} {...(props as React.HTMLAttributes<HTMLElement>)}>{children}</code>;
        },
        img: MarkdownImage,
    };


    const handleStatusChange = (status: ProblemStatus) => {
        if (problem) {
            updateProgress(problem.slug, status);
            setProblemStatus(status);
        }
    };

    if (!problem) return null;

    const isSkeletal = !problem.description || (problem.approaches && problem.approaches.length === 0);
    const approach = problem.approaches?.[activeApproach];
    const currentDemo = problem.demos && problem.demos.length > 0
        ? (problem.demos[activeDemoIndex] || problem.demos[0])
        : null;
    const diffClass = problem.difficulty?.toLowerCase() || 'medium';

    return (
        <>
        {/* Image Lightbox Modal */}
        {lightboxSrc && (
            <div
                className={styles.lightboxOverlay}
                onClick={closeLightbox}
                role="dialog"
                aria-modal="true"
                aria-label={`Full size image: ${lightboxAlt}`}
            >
                <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
                    <button
                        className={styles.lightboxClose}
                        onClick={closeLightbox}
                        title="Close (Esc)"
                        aria-label="Close image viewer"
                    >
                        <X size={20} />
                    </button>
                    {lightboxAlt && (
                        <p className={styles.lightboxCaption}>{lightboxAlt}</p>
                    )}
                    <img
                        src={lightboxSrc}
                        alt={lightboxAlt}
                        className={styles.lightboxImage}
                    />
                </div>
            </div>
        )}
        <aside className={`${styles.panel} ${isOpen ? styles.open : ''} ${isExpanded ? styles.expanded : ''}`}>
            <div className={styles.panelMasthead}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className={styles.mastheadGroup}>
                        <span className={styles.panelSectionTag}>Problem · #{problem.slug.slice(0, 2)}</span>
                        <h1 className={styles.panelHeadline}>{problem.title}</h1>
                    </div>
                    <div className={styles.panelActionGroup}>
                        <button
                            className={styles.expandBtn}
                            onClick={onToggleExpand}
                            title={isExpanded ? 'Reduce' : 'Expand Focus'}
                        >
                            {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                        </button>
                        <button
                            className={styles.panelClose}
                            onClick={onClose}
                            title="Close Panel"
                        >
                            <X size={18} />
                        </button>
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
                                <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm]}>
                                    {problem.description}
                                </ReactMarkdown>
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
                                className={`${styles.sbtn} ${problemStatus === 'blocker' ? styles.sbtnBlocker : ''}`}
                                onClick={() => handleStatusChange('blocker')}
                            >
                                ! Blocker
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
                        <div className={styles.panelBodyText}>
                            <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm]}>
                                {problem.explanation || "No explanation available."}
                            </ReactMarkdown>
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
        </>
    );
}
