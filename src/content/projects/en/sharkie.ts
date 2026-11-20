import sharkie0 from "../../../assets/images/projects/sharkie/sharkie-0.webp";

import type { ProjectContent } from "../../types";

export default {
  title: "AuraRiddle",
  theme: "dark",
  tags: ["next", "supabase", "websockets", "vercel"],
  videoBorder: false,
  live: "https://aurariddle.vercel.app/",
  description:
    "AuraRiddle is a real-time word guessing game where players join events and race to be the fastest.<br/><br/>Admin creates events with word questions, players fill letter boxes in real-time, and a live leaderboard tracks scores. Built with Next.js, Supabase & deployed on Vercel.",
  components: [
    {
      type: "media",
      props: {
        type: "image",
        src: sharkie0,
        alt: "AuraRiddle Homepage",
        caption: "Homepage",
      },
    },
  ],
} as const satisfies ProjectContent;
