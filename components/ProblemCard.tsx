"use client";

import { useRouter } from "next/navigation";
import styles from "./ProblemCard.module.css";
import { Problem } from "@/lib/github";

interface Props {
  problem: Problem;
  index: number;
}

export default function ProblemCard({ problem, index }: Props) {
  const router = useRouter();

  const diffClass = problem.difficulty.toLowerCase();

  return (
    <tr className={styles.probRow} onClick={() => router.push(`/problem/${problem.slug}`)}>
      <td className={styles.probNumCell}>{String(index + 1).padStart(2, "0")}</td>
      <td style={{ paddingRight: 0, width: '24px', verticalAlign: 'middle' }}>
        <span className={styles.checkCircle}></span>
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
