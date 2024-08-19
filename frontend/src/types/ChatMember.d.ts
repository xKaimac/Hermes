import type { Friend } from "./Friend";

export interface ChatMember extends Friend {
  role: string;
  memberSince: number;
}
