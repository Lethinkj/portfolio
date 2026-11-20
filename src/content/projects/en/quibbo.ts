import quibbo0 from "../../../assets/images/projects/quibbo/quibbo-0.webp";

import type { ProjectContent } from "../../types";

export default {
  title: "BashXCode",
  theme: "light",
  tags: ["react", "node", "supabase", "postgresql"],
  videoBorder: true,
  live: "https://bashxcode.vercel.app",
  description:
    "An interactive coding platform built with React, Node.js, and Supabase (Postgres).<br/><br/>Features real-time code execution, syntax highlighting, and collaborative tools for competitive programmers. Deployed on Vercel.",
  components: [
    {
      type: "media",
      props: {
        type: "image",
        src: quibbo0,
        alt: "BashXCode Platform",
        caption: "Platform Overview",
      },
    },
  ],
} as const satisfies ProjectContent;
