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
  { id: "m1", name: "박지나", room: "201호", color: "#8b5cf6", emoji: "지", role: "하우스 리더", joined: "12개월" },
  { id: "m2", name: "이민우", room: "202호", color: "#f59e0b", emoji: "민", role: "정산 담당", joined: "8개월" },
  { id: "m3", name: "김서연", room: "203호", color: "#06b6d4", emoji: "서", role: "커뮤니티", joined: "6개월" },
  { id: "m4", name: "최다니엘", room: "301호", color: "#fb7185", emoji: "다", role: "마켓 담당", joined: "10개월" },
  { id: "m5", name: "정하나", room: "302호", color: "#22c55e", emoji: "하", role: "비품 담당", joined: "3개월" },
  { id: "me", name: "한유빈", room: "303호", color: "#7c3aed", emoji: "유", role: "입주자", joined: "8개월" },
];

export const me = members[5];

export function memberById(id: string): Member {
  return members.find((member) => member.id === id) ?? me;
}

export const cleaningRotation: { day: string; memberId: string; area: string }[] = [
  { day: "월", memberId: "m1", area: "주방 정리" },
  { day: "화", memberId: "m2", area: "욕실" },
  { day: "수", memberId: "m3", area: "거실" },
  { day: "목", memberId: "me", area: "분리수거" },
  { day: "금", memberId: "m4", area: "현관과 계단" },
  { day: "토", memberId: "m5", area: "세탁실" },
  { day: "일", memberId: "m1", area: "냉장고 점검" },
];

export const todayCleaner = memberById("me");
export const todayArea = "분리수거";
