export interface Member {
  id: string;
  name: string;
  room: string;
  color: string;
  emoji?: string;
  role?: string;
  joined?: string;
  lifestyle?: { sleep: number; clean: number; quiet: number; social: number; guests: number };
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  author: string;
  date: string;
  pinned?: boolean;
  tag?: "공지" | "긴급" | "생활";
  anonymous?: boolean; // 작성자를 "익명" 으로 표시
}

/** 익명 건의함 게시글 — 같은 집 안에서만 공유 */
export interface AnonPost {
  id: string;
  body: string;
  date: string;
  reactions: Record<"공감" | "해결해줘" | "나도", number>;
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
  /** 대응하는 청소 로테이션 항목 id — 완료 체크가 로테이션 표에 반영된다 */
  rotationId?: string;
}

export type CommunityCategory =
  | "전체"
  | "자유"
  | "생활팁"
  | "동네추천"
  | "투표"
  | "모임"
  | "맛집추천";

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
  | "가전"
  | "기타";

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
  alerting?: boolean; // 구매 재촉 알림 활성화 여부
  /** 업로드한 사진 (data URL). 없으면 카테고리 플레이스홀더를 보여준다 */
  photos?: string[];
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

/* ===================== 하우스 탐색 · 생활습관 신뢰 레이어 ===================== */

/** 생활습관 축 (집 집계값과 내 성향을 같은 척도로 비교) */
export type LifestyleAxisKey = "sleep" | "clean" | "quiet" | "social" | "guests";

export interface LifestyleAxis {
  key: LifestyleAxisKey;
  label: string; // 예: "생활 리듬"
  left: string; // 값 1 라벨
  right: string; // 값 5 라벨
}

/** 주기별 익명 집계 후기 (실시간 개인 별점이 아니라 기간 단위 집계) */
export interface ReviewPeriod {
  period: string; // "2025 상반기"
  responses: number; // 익명 응답 수
  satisfaction: number; // 0~100 종합 만족도
  scores: { label: string; value: number }[]; // 청결/소음/소통/규칙 준수 등 0~100
  quote?: string; // 대표 익명 코멘트 (요약)
}

export interface House {
  id: string;
  name: string;
  station: string; // "홍대입구역"
  stationMins: number; // 도보 분
  commuteMins: number; // 기본 통근 허브까지 분 (목업)
  monthlyCost: number; // 월 예상 비용(원)
  deposit: number; // 보증금(만원)
  genderPolicy: "여성전용" | "남성전용" | "혼성";
  ageRange: string; // "20대 중심"
  jobMix: string; // "직장인·대학원생"
  memberCount: number;
  avgTenureMonths: number; // 평균 거주 기간(개월)
  lifestyle: Record<LifestyleAxisKey, number>; // 1~5 집계값
  smoking: "비흡연" | "실외흡연" | "허용";
  pet: "불가" | "가능" | "환영";
  vibeTags: string[]; // ["조용·집중", "느슨한 교류"]
  emoji: string;
  bg: string;
  reviews: ReviewPeriod[]; // 최신이 배열 앞
  desc: string;
  rooms: RoomInfo[];
  viewCount: number; // 현재 조회 중인 입주자 수
  likeCount: number; // 찜한 사람 수
}

/** 구하는 사람의 생활습관 · 조건 */
export interface MyLifestyle {
  axes: Record<LifestyleAxisKey, number>; // 내 성향 1~5
  noSmoke: boolean; // 비흡연 하우스 선호
  commuteHub: string; // 통근 목적지
  set: boolean; // 사용자가 설정을 마쳤는지
}

/* ===================== 임대인 모드 ===================== */

export type ApplicantStatus = "검토 전" | "투어 요청" | "투어 완료" | "입주 확정" | "미적합";

/** 입주 신청자 — 집이 사람을 검증하는 쪽 (상호 검증의 반대편) */
export interface Applicant {
  id: string;
  name: string; // 표시명 (성 + 이니셜)
  ageGroup: string;
  job: string;
  houseId: string;
  moveIn: string; // 희망 입주일
  status: ApplicantStatus;
  axes: Record<LifestyleAxisKey, number>; // 신청자 생활습관 1~5
  noSmoke: boolean;
  intro: string;
  /** 이전 셰어하우스 거주 이력 — 없으면 신규 */
  prevMonths?: number;
  /** 이전 집에서 받은 익명 만족도(0~100) — 신규 입주자는 없음 */
  prevSatisfaction?: number;
}

/** 거주자 초대 현황 */
export interface Invite {
  id: string;
  houseId: string;
  room: string;
  code: string;
  status: "대기 중" | "수락됨" | "만료";
  sentTo?: string;
}

/** 개별 방 정보 */
export interface RoomInfo {
  id: string;
  number: string;        // "101호"
  type: "1인실" | "2인실" | "1.5인실";
  sizeSqm: number;       // 전용면적 m²
  monthlyCost: number;
  privateBath: boolean;
  privateAC: boolean;
  available: boolean;    // false = 입주자 있음
  floor: number;
  desc?: string;
}

/** 공유 메모장형 집 정보 항목 */
export type HouseInfoCategory = "생활규칙" | "동네정보" | "쓰레기·재활용" | "긴급연락";

export interface HouseInfoItem {
  id: string;
  category: HouseInfoCategory;
  title: string;
  body: string;
  author: string;
  updatedAt: string;
  pinned?: boolean;
}
