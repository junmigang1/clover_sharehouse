import type { AITool } from "../types";

export const aiTools: AITool[] = [
  {
    id: "movein",
    title: "입주 준비 체크",
    desc: "새 입주자가 필요한 가구, 비품, 정산 항목을 체크리스트로 정리해줘요.",
    icon: "입주",
    accent: "amber",
    inputLabel: "언제, 어떤 방에 입주하나요?",
    placeholder: "예: 8월 1일 입주, 침대와 책상은 있음, 주방용품은 없음",
    sampleInput: "8월 1일 입주 예정이고 침대와 책상은 있지만 의자, 침구, 주방용품이 필요해요.",
  },
];

export function aiToolById(id: string): AITool {
  return aiTools.find((tool) => tool.id === id) ?? aiTools[0];
}

export const fakeOutputs: Record<string, string> = {
  movein: `입주 준비 체크리스트

필수 구매
- 의자
- 침구 세트
- 세탁망
- 개인 수건

마켓에서 찾아볼 물건
- 인체공학 의자
- 소형 가습기
- 에어프라이어

입주 전 확인
- 첫 달 공용 정산 방식
- 청소 로테이션 시작일
- 와이파이와 현관 출입 방식

AI 팁: 우리 집 마켓에 떠나는 입주자가 내놓은 물건이 있는지 먼저 보면 초기 비용을 줄일 수 있어요.`,
};
