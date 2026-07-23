import type { Applicant, Invite, MyLifestyle } from "../types";

/** 이 임대인이 운영하는 하우스 (houses.ts 의 id 참조) */
export const myHouseIds = ["h1", "h6"];

export const landlord = {
  name: "네스트허브 운영",
  contact: "운영자 · 김대표",
};

export const applicants: Applicant[] = [
  {
    id: "a1",
    name: "정S",
    ageGroup: "20대 후반",
    job: "직장인 (재택 3일)",
    houseId: "h1",
    moveIn: "8월 1일",
    status: "검토 전",
    axes: { sleep: 2, clean: 4, quiet: 3, social: 4, guests: 2 },
    noSmoke: true,
    intro: "아침형이고 밤엔 조용히 지냅니다. 청소 로테이션은 지키는 편이에요.",
    prevMonths: 18,
    prevSatisfaction: 91,
  },
  {
    id: "a2",
    name: "박J",
    ageGroup: "20대 초반",
    job: "대학생",
    houseId: "h1",
    moveIn: "8월 10일",
    status: "투어 요청",
    axes: { sleep: 5, clean: 2, quiet: 4, social: 5, guests: 4 },
    noSmoke: false,
    intro: "사람들이랑 어울리는 걸 좋아해요. 친구도 종종 부르는 편입니다.",
  },
  {
    id: "a3",
    name: "이H",
    ageGroup: "30대 초반",
    job: "프리랜서 디자이너",
    houseId: "h6",
    moveIn: "8월 5일",
    status: "투어 완료",
    axes: { sleep: 4, clean: 4, quiet: 3, social: 3, guests: 2 },
    noSmoke: true,
    intro: "재택 작업이 많아 낮에 집에 있습니다. 서로 방해 안 하는 거리감을 좋아해요.",
    prevMonths: 9,
    prevSatisfaction: 84,
  },
  {
    id: "a4",
    name: "최M",
    ageGroup: "20대 중반",
    job: "사회초년생",
    houseId: "h6",
    moveIn: "9월 1일",
    status: "입주 확정",
    axes: { sleep: 3, clean: 4, quiet: 3, social: 3, guests: 2 },
    noSmoke: true,
    intro: "첫 셰어하우스라 규칙은 잘 따르려고 합니다.",
    prevMonths: 6,
    prevSatisfaction: 79,
  },
  {
    id: "a5",
    name: "한D",
    ageGroup: "20대 후반",
    job: "직장인",
    houseId: "h1",
    moveIn: "7월 20일",
    status: "미적합",
    axes: { sleep: 5, clean: 1, quiet: 5, social: 4, guests: 5 },
    noSmoke: false,
    intro: "야근이 잦아 늦게 들어옵니다.",
    prevMonths: 4,
    prevSatisfaction: 52,
  },
];

export const invites: Invite[] = [
  { id: "i1", houseId: "h1", room: "301호", code: "NEST-3F91", status: "대기 중", sentTo: "정S" },
  { id: "i2", houseId: "h6", room: "202호", code: "NEST-7K22", status: "수락됨", sentTo: "최M" },
  { id: "i3", houseId: "h6", room: "204호", code: "NEST-1B47", status: "만료" },
];

export function applicantsByHouse(houseId: string): Applicant[] {
  return applicants.filter((a) => a.houseId === houseId);
}

export function applicantById(id: string): Applicant {
  return applicants.find((a) => a.id === id) ?? applicants[0];
}

/** computeFit(house, my) 에 넣기 위해 신청자를 MyLifestyle 모양으로 변환 */
export function asLifestyle(a: Applicant): MyLifestyle {
  return { axes: a.axes, noSmoke: a.noSmoke, commuteHub: "", set: true };
}

export const pendingCount = applicants.filter((a) => a.status === "검토 전" || a.status === "투어 요청").length;
