import Link from "next/link";
import styles from "./ProblemCard.module.css";
import { Problem } from "@/lib/github";

interface Props {
  problem: Problem;
  index: number;
}

export default function ProblemCard({ problem, index }: Props) {
  const diffClass =
    problem.difficulty === "Easy"
      ? "badge-easy"
      : problem.difficulty === "Medium"
        ? "badge-medium"
        : "badge-hard";

  return (
    <Link href={`/problem/${problem.slug}`} className={styles.problemRow}>
      <div className={styles.probLeft}>
        <span className={styles.probNum}>#{String(index + 1).padStart(2, "0")}</span>
        <div>
          <span className={styles.probTitle}>{problem.title}</span>
          {problem.categories.length > 0 && (
            <span className={styles.probTag}>{problem.categories[0]}</span>
          )}
        </div>
      </div>
      <div className={styles.probRight}>
        <span className={`badge ${diffClass}`}>{problem.difficulty}</span>
        <span className={styles.probArrow}>→</span>
      </div>
    </Link>
  );
}
