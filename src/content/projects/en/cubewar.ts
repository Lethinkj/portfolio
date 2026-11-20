import cubewar0 from "../../../assets/images/projects/cubewar/cubewar-0.webp";

import type { ProjectContent } from "../../types";

export default {
  title: "Arduino Autonomous Car",
  theme: "dark",
  tags: ["arduino", "c", "embedded", "robotics"],
  videoBorder: false,
  description:
    "A self-driving robotic car built with Arduino, ultrasonic sensors, and motor drivers.<br/><br/>Features autonomous obstacle avoidance, line-following capabilities, and real-time sensor feedback processing — entirely hardware and embedded C.",
  components: [
    {
      type: "media",
      props: {
        type: "image",
        src: cubewar0,
        alt: "Arduino Car Build",
        caption: "Hardware Build",
      },
    },
  ],
} as const satisfies ProjectContent;
