import { Boat, Fish, Trophy, Users } from "@phosphor-icons/react/ssr";

const ACTIVITY_ACCENTS = ["text-accent", "text-accent-teal", "text-accent-gold", "text-accent"];
const ACTIVITY_ICONS = [Boat, Fish, Trophy, Users];

export function getActivityStyle(index: number) {
  return {
    accent: ACTIVITY_ACCENTS[index % ACTIVITY_ACCENTS.length],
    Icon: ACTIVITY_ICONS[index % ACTIVITY_ICONS.length],
  };
}
