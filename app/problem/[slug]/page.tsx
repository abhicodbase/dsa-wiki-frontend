import { fetchProblemDetails, fetchProblems } from "@/lib/github";
import { notFound } from "next/navigation";
import ProblemClient from "./ProblemClient";

export async function generateStaticParams() {
  const problems = await fetchProblems();
  return problems.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const problem = await fetchProblemDetails(slug);
  if (!problem) return { title: "Not Found" };
  return {
    title: `${problem.title} | DSA Wiki`,
    description: problem.description.slice(0, 160),
  };
}

export default async function ProblemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const problem = await fetchProblemDetails(slug);
  if (!problem) notFound();
  return <ProblemClient problem={problem} />;
}
