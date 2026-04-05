"use client";

import styles from "./ProblemCard.module.css";
import { Problem } from "@/lib/github";
import { ProblemStatus } from "@/lib/progress";

interface Props {
  problem: Problem;
  index: number;
  status: ProblemStatus;
  isSelected?: boolean;
  onSelect: () => void;
}

export default function ProblemCard({ problem, index, status, isSelected, onSelect }: Props) {
  const diffClass = problem.difficulty.toLowerCase();

  return (
    <tr
      className={`${styles.probRow} ${isSelected ? styles.active : ''} ${status !== 'none' ? styles[status] : ''}`}
      onClick={onSelect}
    >
      <td className={styles.probNumCell}>{String(index + 1).padStart(2, "0")}</td>
      <td style={{ paddingRight: 0, width: '24px', verticalAlign: 'middle' }}>
        <span className={`${styles.checkCircle} ${status !== 'none' ? styles[status] : ''}`}>
          {status === 'solved' && '✓'}
          {status === 'attempted' && '·'}
        </span>
      </td>
      <td className={styles.probTitleCell}>
        <span className={styles.probTitleLink}>{problem.title}</span>
        <span className={styles.probByline}>
          {problem.categories.length > 0 ? problem.categories[0] : 'General'} · {problem.complexity?.time || 'O(n)'} · {problem.complexity?.space || 'O(1)'}
        </span>
      </td>
      <td style={{ textAlign: 'right', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
        <span className={`${styles.diffPill} ${styles[diffClass]}`}>{problem.difficulty}</span>
      </td>
      <td className={styles.probArrowCell}>
        <button className={styles.readBtn}>READ</button>
      </td>
    </tr>
  );
}
