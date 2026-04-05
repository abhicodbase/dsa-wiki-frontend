const GITHUB_REPO_OWNER = "abhicodbase";
const GITHUB_REPO_NAME = "dsa-wiki";
const BRANCH = "main";
const BASE_URL = `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents`;
const RAW_BASE_URL = `https://raw.githubusercontent.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/${BRANCH}`;

export type Difficulty = "Easy" | "Medium" | "Hard";
export type Category = "String" | "Array" | "Graphs" | "LinkedList" | "DP";

// Infer categories from slug keywords
function inferCategories(slug: string): Category[] {
  const s = slug.toLowerCase();
  const cats: Category[] = [];
  if (s.includes("palindrom") || s.includes("string") || s.includes("word") || s.includes("ladder") || s.includes("anagram") || s.includes("substring")) cats.push("String");
  if (s.includes("array") || s.includes("sorted") || s.includes("rain") || s.includes("trapping") || s.includes("median") || s.includes("two-sum") || s.includes("subarray")) cats.push("Array");
  if (s.includes("island") || s.includes("graph") || s.includes("path") || s.includes("word-ladder") || s.includes("ladder")) cats.push("Graphs");
  if (s.includes("list") || s.includes("merge") || s.includes("linked")) cats.push("LinkedList");
  if (s.includes("palindrom") || s.includes("longest") || s.includes("coin") || s.includes("knapsack") || s.includes("trapping")) cats.push("DP");
  return cats.length > 0 ? [...new Set(cats)] : [];
}

// Infer difficulty from slug keywords
function inferDifficulty(slug: string): Difficulty {
  const hard = ["median-of-two-sorted-arrays", "merge-k-sorted-lists", "trapping-rain-water", "word-ladder"];
  const easy = ["two-sum"];
  if (hard.includes(slug)) return "Hard";
  if (easy.includes(slug)) return "Easy";
  return "Medium";
}

export interface Approach {
  name: string;
  description: string;
  code: string;
  timeComplexity: string;
  spaceComplexity: string;
}

export interface Resource {
  name: string;
  url: string;
}

export interface Problem {
  slug: string;
  title: string;
  difficulty: Difficulty;
  categories: Category[];
  description: string;
  complexity?: {
    time: string;
    space: string;
  };
  approaches: Approach[];
  resources: Resource[];
  visualImage?: string;
}

async function fetchGitHub(url: string) {
  const isDev = process.env.NODE_ENV === "development";
  const res = await fetch(url, {
    next: { revalidate: isDev ? 0 : 300 }, // No cache in dev, 5 min in prod
    headers: {
      Accept: "application/vnd.github.v3+json",
      // Authorization: `token ${process.env.GITHUB_TOKEN}`
    },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function fetchProblems(): Promise<Problem[]> {
  const contents = await fetchGitHub(BASE_URL);
  if (!contents || !Array.isArray(contents)) return [];

  const problemFolders = contents.filter((item: any) => item.type === "dir" && item.name !== "frontend");

  const problems = await Promise.all(
    problemFolders.map(async (folder: any) => {
      const slug = folder.name as string;
      return {
        slug,
        title: slug
          .split("-")
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
        difficulty: inferDifficulty(slug),
        categories: inferCategories(slug),
        description: "",
        complexity: { time: "O(n)", space: "O(1)" }, // Defaults
        approaches: [],
        resources: [],
      };
    })
  );

  return problems;
}

export async function fetchProblemDetails(slug: string): Promise<Problem | null> {
  const folderUrl = `${BASE_URL}/${slug}`;
  const contents = await fetchGitHub(folderUrl);
  if (!contents || !Array.isArray(contents)) return null;

  const readme = contents.find((f: any) => f.name.toLowerCase() === "readme.md");
  const cppFiles = contents.filter((f: any) => f.name.endsWith(".cpp"));
  const conceptImg = contents.find((f: any) => f.name === "concept.png");

  let readmeText = "";
  if (readme) {
    const res = await fetch(readme.download_url);
    readmeText = await res.text();
  }

  const approaches: Approach[] = await Promise.all(
    cppFiles.map(async (file: any) => {
      const res = await fetch(file.download_url);
      const code = await res.text();
      return {
        name: file.name.replace(".cpp", "").split("_").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
        description: `Implementation from ${file.name}`,
        code,
        timeComplexity: "O(? )",
        spaceComplexity: "O(? )",
      };
    })
  );

  // Simple parsing of README for metadata if possible
  const titleMatch = readmeText.match(/# (.*)/);
  const title = titleMatch ? titleMatch[1].replace(" - Explanation", "") : slug;

  let description = readmeText.split("---")[0] || "No description available.";

  // Transform relative image paths to absolute GitHub RAW URLs
  // Matches ![alt](path.png) or <img src="path.png">
  description = description.replace(
    /!\[(.*?)\]\((?!http)(.*?)\)/g,
    (match, alt, path) => `![${alt}](${RAW_BASE_URL}/${slug}/${path})`
  );
  description = description.replace(
    /<img\s+[^>]*src=["'](?!http)([^"']+)["'][^>]*>/g,
    (match, path) => match.replace(path, `${RAW_BASE_URL}/${slug}/${path}`)
  );

  return {
    slug,
    title,
    difficulty: "Medium", // Could parse from README
    categories: [], // Could parse from README
    description,
    complexity: {
      time: approaches[0]?.timeComplexity || "O(n)",
      space: approaches[0]?.spaceComplexity || "O(1)",
    },
    approaches,
    resources: [], // Could parse from README
    visualImage: conceptImg ? `${RAW_BASE_URL}/${slug}/concept.png` : undefined,
  };
}
