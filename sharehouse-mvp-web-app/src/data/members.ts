import type { Member } from "../types";

export const house = {
  name: "네스트허브 연남",
  address: "서울 마포구 연희로 12",
  members: 6,
  rooms: 6,
  since: "2024.03",
  wifi: "NestHub_5G",
  wifiPw: "purplehome24!",
};

export const members: Member[] = [
  { id: "m1", lifestyle: { sleep: 2, clean: 5, quiet: 2, social: 3, guests: 2 }, name: "박지나", room: "201호", color: "#8b5cf6", emoji: "지", role: "하우스 리더", joined: "12개월" },
  { id: "m2", lifestyle: { sleep: 3, clean: 3, quiet: 3, social: 3, guests: 3 }, name: "이민우", room: "202호", color: "#f59e0b", emoji: "민", role: "정산 담당", joined: "8개월" },
  { id: "m3", lifestyle: { sleep: 4, clean: 3, quiet: 4, social: 5, guests: 4 }, name: "김서연", room: "203호", color: "#06b6d4", emoji: "서", role: "커뮤니티", joined: "6개월" },
  { id: "m4", lifestyle: { sleep: 3, clean: 4, quiet: 3, social: 4, guests: 3 }, name: "최다니엘", room: "301호", color: "#fb7185", emoji: "다", role: "마켓 담당", joined: "10개월" },
  { id: "m5", lifestyle: { sleep: 2, clean: 4, quiet: 2, social: 2, guests: 1 }, name: "정하나", room: "302호", color: "#22c55e", emoji: "하", role: "비품 담당", joined: "3개월" },
  { id: "me", lifestyle: { sleep: 2, clean: 4, quiet: 3, social: 4, guests: 2 }, name: "한유빈", room: "303호", color: "#7c3aed", emoji: "유", role: "입주자", joined: "8개월" },
];

export const me = members[5];

export function memberById(id: string): Member {
  return members.find((member) => member.id === id) ?? me;
}

export const cleaningRotation: { id: string; day: string; memberId: string; area: string }[] = [
  { id: "r1", day: "월", memberId: "m1", area: "주방 정리" },
  { id: "r2", day: "화", memberId: "m2", area: "욕실" },
  { id: "r3", day: "수", memberId: "m3", area: "거실" },
  { id: "r4", day: "목", memberId: "me", area: "분리수거" },
  { id: "r5", day: "금", memberId: "m4", area: "현관과 계단" },
  { id: "r6", day: "토", memberId: "m5", area: "세탁실" },
  { id: "r7", day: "일", memberId: "m1", area: "냉장고 점검" },
];

export const todayCleaner = memberById("me");
export const todayArea = "분리수거";

/** 청소 완료 여부 — key 는 cleaningRotation 의 id. 홈 집안일 체크와 로테이션 표가 공유한다 */
export const cleaningDoneState: Record<string, boolean> = {};

/** 현재 입주자들의 생활습관 평균 — 임대인 매물 편집에서 AI 추천값으로 사용 */
export function calcAverageLifestyle(): { sleep: number; clean: number; quiet: number; social: number; guests: number } {
  const ls = members.filter(m => m.lifestyle).map(m => m.lifestyle!);
  if (!ls.length) return { sleep: 3, clean: 3, quiet: 3, social: 3, guests: 3 };
  const keys: ("sleep"|"clean"|"quiet"|"social"|"guests")[] = ["sleep", "clean", "quiet", "social", "guests"];
  const result = {} as { sleep: number; clean: number; quiet: number; social: number; guests: number };
  keys.forEach(k => {
    result[k] = Math.round((ls.reduce((sum, l) => sum + l[k], 0) / ls.length) * 10) / 10;
  });
  return result;
}
