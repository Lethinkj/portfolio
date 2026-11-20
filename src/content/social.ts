export const social = [
  { url: "mailto:kjlethin24@gmail.com", name: "mail" },
  { url: "https://github.com/lethin-kj", name: "github" },
  { url: "https://www.linkedin.com/in/lethin-k-j-510674293", name: "linkedin" },
  { url: "https://www.instagram.com/lethin_04/", name: "instagram" },
] as const satisfies { url: string; name: "mail" | "github" | "instagram" | "linkedin" | "x" }[];
