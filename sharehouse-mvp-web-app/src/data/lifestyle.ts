import type { House, LifestyleAxis, LifestyleAxisKey, MyLifestyle } from "../types";

/** 생활습관 비교 축 — "이상한 사람" 공포를 구체적 리듬 차이로 환원 */
export const LIFESTYLE_AXES: LifestyleAxis[] = [
  { key: "sleep", label: "생활 리듬", left: "아침형", right: "새벽형" },
  { key: "clean", label: "청결 기준", left: "느슨함", right: "깔끔함" },
  { key: "quiet", label: "생활 소음", left: "조용함", right: "활발함" },
  { key: "social", label: "교류 성향", left: "각자 생활", right: "함께 어울림" },
  { key: "guests", label: "손님 초대", left: "거의 없음", right: "잦은 편" },
];

/** 통근 허브 (목업) — 각 하우스의 commuteMins 는 이 기준값을 가정 */
export const COMMUTE_HUBS = ["연세대", "홍대입구역", "강남역", "여의도", "판교"];

/** 설정 전 디폴트 — 모든 축 중간값. 점수는 보여주되 UI에서 "내 성향 기반 아님"을 알린다 */
export const DEFAULT_MY_LIFESTYLE: MyLifestyle = {
  axes: { sleep: 3, clean: 3, quiet: 3, social: 3, guests: 3 },
  noSmoke: false,
  commuteHub: "연세대",
  set: false,
};

/**
 * 생활습관 궁합 점수 (0~100).
 * 5개 축의 거리 합(축당 0~4, 최대 20)을 유사도로 환산하고,
 * 비흡연 선호와 흡연 허용 하우스가 부딪히면 감점.
 */
export function computeFit(house: House, my: MyLifestyle): number {
  let dist = 0;
  (Object.keys(house.lifestyle) as LifestyleAxisKey[]).forEach((k) => {
    dist += Math.abs(house.lifestyle[k] - my.axes[k]);
  });
  let fit = Math.round((1 - dist / 20) * 100);
  if (my.noSmoke && house.smoking === "허용") fit -= 18;
  return Math.max(0, Math.min(100, fit));
}

/**
 * 신청자 → 하우스 궁합 (임대인 관점).
 * 입주자용 computeFit 의 noSmoke 는 "비흡연 하우스 선호"라는 선호지만,
 * 신청자의 smoker 는 "본인이 흡연자"라는 사실이라 감점 방향이 반대다.
 */
export function computeApplicantFit(
  house: House,
  axes: Record<LifestyleAxisKey, number>,
  smoker: boolean
): number {
  let dist = 0;
  (Object.keys(house.lifestyle) as LifestyleAxisKey[]).forEach((k) => {
    dist += Math.abs(house.lifestyle[k] - axes[k]);
  });
  let fit = Math.round((1 - dist / 20) * 100);
  if (smoker && house.smoking === "비흡연") fit -= 20;
  return Math.max(0, Math.min(100, fit));
}

/** 축별로 내 성향과 집 집계가 얼마나 붙어 있는지 (0~100) */
export function axisMatch(houseVal: number, myVal: number): number {
  return Math.round((1 - Math.abs(houseVal - myVal) / 4) * 100);
}

export function fitLabel(pct: number): { text: string; variant: "green" | "amber" | "coral" } {
  if (pct >= 80) return { text: "잘 맞아요", variant: "green" };
  if (pct >= 60) return { text: "괜찮아요", variant: "amber" };
  return { text: "차이 있어요", variant: "coral" };
}

export function tenureLabel(months: number): string {
  if (months >= 12) {
    const y = Math.floor(months / 12);
    const m = months % 12;
    return m ? `${y}년 ${m}개월` : `${y}년`;
  }
  return `${months}개월`;
}
