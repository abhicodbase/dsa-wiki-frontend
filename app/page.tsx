import { fetchProblems } from "@/lib/github";
import HomeClient from "./HomeClient";

export default async function Home() {
  const problems = await fetchProblems();
  return <HomeClient initialProblems={problems} />;
}
