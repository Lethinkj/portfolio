export type TagVariant =
  | "three"
  | "websockets"
  | "react"
  | "redis"
  | "gray"
  | "html"
  | "css"
  | "javascript"
  | "node"
  | "next"
  | "kubernetes"
  | "postgresql"
  | "ogl"
  | "glsl"
  | "arduino"
  | "c"
  | "embedded"
  | "robotics"
  | "supabase"
  | "vercel";

export const tagLabels = {
  three: "Three.js",
  websockets: "WebSockets",
  react: "React",
  redis: "Redis",
  gray: "Gray",
  html: "HTML",
  css: "CSS",
  javascript: "JavaScript",
  node: "Node.js",
  next: "Next.js",
  kubernetes: "Kubernetes",
  postgresql: "PostgreSQL",
  ogl: "OGL.js",
  glsl: "GLSL",
  arduino: "Arduino",
  c: "C/C++",
  embedded: "Embedded C",
  robotics: "Robotics",
  supabase: "Supabase",
  vercel: "Vercel",
} as const satisfies Record<TagVariant, string>;
