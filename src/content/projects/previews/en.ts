import thumbnailCubeWar from "../../../assets/thumbnails/cubewar.webp";
import thumbnailQuibbo from "../../../assets/thumbnails/quibbo.webp";
import thumbnailSharkie from "../../../assets/thumbnails/sharkie.webp";

import type { ProjectPreview } from "../../types";

export default [
  {
    title: "Arduino Autonomous Car",
    slug: "cubewar",
    thumbnail: thumbnailCubeWar,
    description: "Self-driving robotics project",
  },
  {
    title: "BashXCode",
    slug: "quibbo",
    thumbnail: thumbnailQuibbo,
    description: "Full-stack coding platform",
  },
  {
    title: "AuraRiddle",
    slug: "sharkie",
    thumbnail: thumbnailSharkie,
    description: "Real-time word guessing game",
  },
] as const satisfies ProjectPreview[];
