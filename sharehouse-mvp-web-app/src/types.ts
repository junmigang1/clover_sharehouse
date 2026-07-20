export interface Member {
  id: string;
  name: string;
  room: string;
  color: string;
  emoji?: string;
  role?: string;
  joined?: string;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  author: string;
  date: string;
  pinned?: boolean;
  tag?: "공지" | "긴급" | "생활";
}

export interface ExpenseItem {
  id: string;
  title: string;
  category: "월세" | "공과금" | "생활용품" | "인터넷" | "관리";
  total: number;
  perPerson: number;
  dueDate: string;
  paidMemberIds: string[];
  icon: string;
}

export interface ScheduleItem {
  id: string;
  title: string;
  when: string;
  place?: string;
  kind: "청소" | "회의" | "수거" | "수리";
}

export interface Chore {
  id: string;
  title: string;
  assigneeId: string;
  done: boolean;
  cycle: string;
}

export type CommunityCategory =
  | "전체"
  | "자유"
  | "생활팁"
  | "동네추천"
  | "투표"
  | "모임";

export interface PollOption {
  label: string;
  votes: number;
}

export interface Post {
  id: string;
  category: Exclude<CommunityCategory, "전체">;
  title: string;
  body: string;
  author: string;
  authorColor: string;
  time: string;
  likes: number;
  comments: number;
  liked?: boolean;
  poll?: PollOption[];
  eventDate?: string;
}

export interface Comment {
  id: string;
  author: string;
  authorColor: string;
  body: string;
  time: string;
}

export type MarketCategory =
  | "전체"
  | "책상"
  | "의자"
  | "침구"
  | "주방"
  | "가전";

export interface MarketItem {
  id: string;
  category: Exclude<MarketCategory, "전체">;
  title: string;
  price: number;
  seller: string;
  sellerColor: string;
  room: string;
  time: string;
  condition: string;
  emoji: string;
  bg: string;
  desc: string;
  status: "판매중" | "예약중" | "거래완료";
}

export interface AITool {
  id: string;
  title: string;
  desc: string;
  icon: string;
  accent: "green" | "amber" | "coral" | "violet";
  inputLabel: string;
  placeholder: string;
  sampleInput: string;
}
