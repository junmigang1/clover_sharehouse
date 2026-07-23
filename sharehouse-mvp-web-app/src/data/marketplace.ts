import type { MarketItem } from "../types";

export const marketItems: MarketItem[] = [
  {
    id: "mkt1",
    category: "책상",
    title: "화이트 스탠딩 책상 120cm",
    price: 65000,
    seller: "최다니엘",
    sellerColor: "#fb7185",
    room: "네스트허브 연남",
    time: "10분 전",
    condition: "상태 좋음",
    emoji: "책상",
    bg: "linear-gradient(135deg,#ede9fe,#f8fafc)",
    desc: "케이블 트레이가 있는 화이트 스탠딩 책상입니다. 오른쪽 모서리에 작은 사용감이 있고, 집을 나가면서 넘깁니다. 집 안에서 바로 인수 가능해요.",
    status: "판매중",
  },
  {
    id: "mkt2",
    category: "의자",
    title: "인체공학 의자",
    price: 38000,
    seller: "박지나",
    sellerColor: "#8b5cf6",
    room: "네스트허브 연남",
    time: "1시간 전",
    condition: "양호",
    emoji: "의자",
    bg: "linear-gradient(135deg,#e0f2fe,#ffffff)",
    desc: "높이와 틸트 조절이 가능한 편한 의자입니다. 세팅용으로 가져가기 좋아요.",
    status: "예약중",
  },
  {
    id: "mkt3",
    category: "주방",
    title: "3.5L 에어프라이어",
    price: 0,
    seller: "정하나",
    sellerColor: "#22c55e",
    room: "네스트허브 연남",
    time: "어제",
    condition: "사용감 있음",
    emoji: "주방",
    bg: "linear-gradient(135deg,#dcfce7,#fff7ed)",
    desc: "함께 나눕니다. 작동은 잘 되고, 바스켓 코팅에 작은 스크래치가 있어요.",
    status: "판매중",
  },
  {
    id: "mkt4",
    category: "침구",
    title: "퀸 사이즈 매트리스 토퍼",
    price: 27000,
    seller: "이민우",
    sellerColor: "#f59e0b",
    room: "네스트허브 연남",
    time: "7월 18일",
    condition: "거의 새것",
    emoji: "침구",
    bg: "linear-gradient(135deg,#fef3c7,#f5f3ff)",
    desc: "커버 씌워 두 달 정도 사용한 메모리폼 토퍼입니다. 세탁 후 압축팩에 보관 중입니다.",
    status: "거래완료",
  },
  {
    id: "mkt5",
    category: "가전",
    title: "소형 가습기",
    price: 15000,
    seller: "김서연",
    sellerColor: "#06b6d4",
    room: "네스트허브 연남",
    time: "7월 17일",
    condition: "양호",
    emoji: "가습",
    bg: "linear-gradient(135deg,#ccfbf1,#eef2ff)",
    desc: "책상이나 침대 옆에 두기 좋은 작은 가습기입니다. USB-C 전원이고 밤에도 조용합니다.",
    status: "판매중",
  },
];

export function addMarketItem(item: MarketItem) {
  marketItems.unshift(item);
}

export function updateMarketStatus(id: string, status: MarketItem["status"]) {
  const item = marketItems.find(i => i.id === id);
  if (item) item.status = status;
}
