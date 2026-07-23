import type { ExpenseItem } from "../types";

export const expenses: ExpenseItem[] = [
  {
    id: "e2",
    title: "전기·가스 요금",
    category: "공과금",
    total: 168000,
    perPerson: 28000,
    dueDate: "7월 22일까지",
    paidMemberIds: ["m1", "m2", "m3", "m4", "m5"],
    icon: "공",
  },
  {
    id: "e3",
    title: "공용 생활용품",
    category: "생활용품",
    total: 72000,
    perPerson: 12000,
    dueDate: "7월 21일까지",
    paidMemberIds: ["m2", "m4"],
    icon: "비",
  },
  {
    id: "e4",
    title: "초고속 인터넷",
    category: "인터넷",
    total: 39000,
    perPerson: 6500,
    dueDate: "7월 28일까지",
    paidMemberIds: ["m1", "m3", "m4"],
    icon: "넷",
  },
  {
    id: "e5",
    title: "공용 정수기 필터",
    category: "관리",
    total: 48000,
    perPerson: 8000,
    dueDate: "7월 30일까지",
    paidMemberIds: ["m1", "m2", "m5"],
    icon: "관",
  },
];

export function myUnpaidTotal(myId: string): number {
  return expenses
    .filter((item) => !item.paidMemberIds.includes(myId))
    .reduce((sum, item) => sum + item.perPerson, 0);
}

export const won = (n: number) => (n === 0 ? "나눔" : `${n.toLocaleString("ko-KR")}원`);

export const expenseFormat = (n: number) => (n === 0 ? "완료" : `${n.toLocaleString("ko-KR")}원`);
