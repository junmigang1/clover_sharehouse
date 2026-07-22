import type { ApplicantStatus } from "../types";

/** 내가 보낸 신청 — 임대인 쪽 ApplicantStatus 흐름과 같은 단계를 공유한다 */
export interface MyApplication {
  id: string;
  houseId: string;
  kind: "투어" | "입주";
  /** 투어: 희망 일정 / 입주: 희망 입주일 */
  when: string;
  /** 입주 신청일 때만 */
  roomNumber?: string;
  status: ApplicantStatus;
  submittedAt: string;
}

export const myApplications: MyApplication[] = [
  {
    id: "my1",
    houseId: "h4",
    kind: "투어",
    when: "이번 주 토요일 오전 10시",
    status: "투어 완료",
    submittedAt: "7월 18일",
  },
  {
    id: "my2",
    houseId: "h2",
    kind: "입주",
    when: "8월 15일",
    roomNumber: "101호",
    status: "검토 전",
    submittedAt: "7월 20일",
  },
];

export function addMyApplication(item: MyApplication) {
  myApplications.unshift(item);
}

export const activeApplicationCount = () =>
  myApplications.filter((a) => a.status !== "미적합" && a.status !== "입주 확정").length;
