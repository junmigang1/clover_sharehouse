import type { Chore, ScheduleItem } from "../types";

export const schedules: ScheduleItem[] = [
  { id: "s1", title: "주간 하우스 회의", when: "오늘 오후 8:00", place: "거실", kind: "회의" },
  { id: "s2", title: "대형 분리수거 배출", when: "내일 오전 9:00", place: "현관 앞", kind: "수거" },
  { id: "s3", title: "주방 집중 청소", when: "금요일 오후 7:30", place: "주방", kind: "청소" },
  { id: "s4", title: "에어컨 점검", when: "토요일 오전 10:00", place: "전체 방", kind: "수리" },
];

export const chores: Chore[] = [
  { id: "c1", title: "분리수거장에 재활용품 내놓기", assigneeId: "me", done: false, cycle: "오늘 밤 9시 전", rotationId: "r4" },
  { id: "c2", title: "공용 세제 채워두기", assigneeId: "me", done: true, cycle: "매주 목요일" },
  { id: "c3", title: "주방 상판 닦기", assigneeId: "m1", done: false, cycle: "매일", rotationId: "r1" },
  { id: "c4", title: "욕실 비품 확인", assigneeId: "m2", done: false, cycle: "주 2회", rotationId: "r2" },
];
