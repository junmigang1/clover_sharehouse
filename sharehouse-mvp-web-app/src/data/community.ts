import type { Comment, Post } from "../types";

export const posts: Post[] = [
  {
    id: "p2",
    category: "생활팁",
    title: "10분이면 끝나는 주방 마감 체크리스트 만들었어요",
    body: "상판, 싱크대, 음식물 쓰레기, 인덕션까지 포함했어요. 저녁 먹고 바로 하기에도 짧고, 모두 이해하기 쉽게 정리했습니다.",
    author: "정하나",
    authorColor: "#22c55e",
    time: "1시간 전",
    likes: 24,
    comments: 8,
  },
  {
    id: "p3",
    category: "모임",
    title: "일요일 루프탑 저녁 같이 먹어요",
    body: "저는 파스타랑 레모네이드 준비할게요. 댓글에 가져올 수 있는 메뉴를 적어 주면 메뉴가 겹치지 않을 것 같아요.",
    author: "김서연",
    authorColor: "#06b6d4",
    time: "어제",
    likes: 31,
    comments: 12,
    eventDate: "7월 26일 일요일 오후 7:00",
  },
  {
    id: "p4",
    category: "동네추천",
    title: "근처 야간 세탁 카페 추천",
    body: "3번 출구 쪽 문워시는 대형 세탁기, 카드 결제, 앉을 자리까지 있어서 좋아요. 밤 10시 이후에는 꽤 조용합니다.",
    author: "최다니엘",
    authorColor: "#fb7185",
    time: "7월 18일",
    likes: 15,
    comments: 3,
  },
  {
    id: "p5",
    category: "자유",
    title: "현관에 검은 우산 맡겨뒀어요",
    body: "손잡이에 작은 은색 스티커가 붙어 있습니다. 공용 바구니에 넣어뒀으니 주인분 가져가세요.",
    author: "이민우",
    authorColor: "#f59e0b",
    time: "7월 17일",
    likes: 7,
    comments: 2,
  },
  {
    id: "p6",
    category: "투표",
    title: "이번 달 공용 비품은 어디서 주문할까요?",
    body: "배송비와 가격을 비교해 봤을 때 쿠팡 정기배송과 동네 마트 공동구매 중 하나를 고르면 좋을 것 같아요.",
    author: "이민우",
    authorColor: "#f59e0b",
    time: "7월 16일",
    likes: 11,
    comments: 4,
    poll: [
      { label: "쿠팡 정기배송", votes: 8 },
      { label: "동네 마트 공동구매", votes: 6 },
      { label: "필요할 때마다 구매", votes: 3 },
    ],
  },
];

export const commentsByPost: Record<string, Comment[]> = {
  p2: [
    { id: "c3", author: "박지나", authorColor: "#8b5cf6", body: "좋아요. 주방에 붙여두고 공지에도 올릴게요.", time: "45분 전" },
  ],
  p6: [
    { id: "c4", author: "한유빈", authorColor: "#7c3aed", body: "정기배송이면 매번 정산하기 편할 것 같아요.", time: "7월 16일" },
  ],
};
