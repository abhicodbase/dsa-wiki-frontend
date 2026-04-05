export type ProblemStatus = 'solved' | 'attempted' | 'none';

export interface ProgressMap {
    [slug: string]: ProblemStatus;
}

const STORAGE_KEY = 'algo_times_progress';

export const getProgress = (): ProgressMap => {
    if (typeof window === 'undefined') return {};
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
};

export const updateProgress = (slug: string, status: ProblemStatus) => {
    if (typeof window === 'undefined') return;
    const progress = getProgress();
    if (status === 'none') {
        delete progress[slug];
    } else {
        progress[slug] = status;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));

    // Trigger a custom event so other components can listen for updates
    window.dispatchEvent(new Event('progressupdate'));
};
