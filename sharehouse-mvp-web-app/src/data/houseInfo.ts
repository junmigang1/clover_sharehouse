import type { HouseInfoItem } from "../types";

/** 공유 메모장형 집 정보 — 누구나 항목 추가·수정 가능 */
export const houseInfoItems: HouseInfoItem[] = [
  {
    id: "hi1",
    category: "생활규칙",
    title: "조용한 시간",
    body: "밤 11시 ~ 오전 8시. 통화는 이어폰, 공용공간 소음 자제해주세요.",
    author: "운영자",
    updatedAt: "7월 1일",
    pinned: true,
  },
  {
    id: "hi2",
    category: "생활규칙",
    title: "주방 마감 규칙",
    body: "사용 후 30분 내 설거지. 음식물 쓰레기는 바로 버려주세요. 인덕션 전원 확인 필수.",
    author: "정하나",
    updatedAt: "7월 10일",
  },
  {
    id: "hi3",
    category: "쓰레기·재활용",
    title: "분리수거 요일",
    body: "일반: 월·수·금 저녁 9시 이전\n재활용(종이·플라스틱): 화·목\n음식물: 매일 가능 (현관 앞 통)",
    author: "운영자",
    updatedAt: "6월 15일",
    pinned: true,
  },
  {
    id: "hi4",
    category: "동네정보",
    title: "편의시설",
    body: "편의점: CU 도보 2분 (24시간), 세탁: 문워시 3번 출구 5분 (대형기 있음), 마트: 홈플러스 익스프레스 8분",
    author: "최다니엘",
    updatedAt: "7월 3일",
  },
  {
    id: "hi5",
    category: "동네정보",
    title: "맛집 추천",
    body: "가성비 점심: 명동칼국수 (6,000원), 카페: 온더레코드 (조용함), 편의 음식: 본죽 배달 가능",
    author: "김서연",
    updatedAt: "7월 12일",
  },
  {
    id: "hi6",
    category: "긴급연락",
    title: "긴급 연락처",
    body: "건물 관리실: 02-1234-5678 (평일 9~18시)\n긴급수리: 010-9999-0000 (24시간)\n운영자: 카카오톡 @nestsupport",
    author: "운영자",
    updatedAt: "6월 1일",
    pinned: true,
  },
];

export const INFO_CATEGORIES: HouseInfoItem["category"][] = [
  "생활규칙", "동네정보", "쓰레기·재활용", "긴급연락"
];

export function addHouseInfoItem(item: HouseInfoItem) {
  houseInfoItems.unshift(item);
}

export function updateHouseInfoItem(id: string, patch: Partial<HouseInfoItem>) {
  const idx = houseInfoItems.findIndex(i => i.id === id);
  if (idx >= 0) houseInfoItems[idx] = { ...houseInfoItems[idx], ...patch };
}
