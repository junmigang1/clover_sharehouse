export interface ChatMsg {
  id: string;
  senderId: string; // "me" 또는 멤버 id
  text: string;
  time: string;
}

/** 하우스 단체 채팅방 — 모든 입주자가 참여 */
export const groupMessages: ChatMsg[] = [
  { id: "g1", senderId: "m1", text: "안녕하세요! 내일 청소 담당이 저 맞죠?", time: "오후 2:10" },
  { id: "g2", senderId: "me", text: "네 맞아요~ 주방이랑 현관이에요!", time: "오후 2:11" },
  { id: "g3", senderId: "m2", text: "오늘 밤 늦게 들어올 것 같아서 미리 공유해요", time: "오후 3:44" },
  { id: "g4", senderId: "m3", text: "ㅇㅋ 알겠어요 👍", time: "오후 3:45" },
  { id: "g5", senderId: "m5", text: "세제 다 떨어져가서 주문했어요. 도착하면 세탁실에 둘게요", time: "오후 4:02" },
  { id: "g6", senderId: "me", text: "냉장고 공용 칸 라벨 붙여놨어요!", time: "오후 5:20" },
];

/** 1:1 개인 채팅 — 멤버 id 별 스레드 */
export const directMessages: Record<string, ChatMsg[]> = {
  m1: [
    { id: "d11", senderId: "m1", text: "유빈님, 이번 주 분리수거 저랑 바꿔주실 수 있어요?", time: "오전 10:12" },
    { id: "d12", senderId: "me", text: "아 네 가능해요! 목요일이죠?", time: "오전 10:30" },
    { id: "d13", senderId: "m1", text: "맞아요 감사합니다 🙏", time: "오전 10:31" },
  ],
  m2: [
    { id: "d21", senderId: "me", text: "이번 달 공과금 정산 언제쯤 올려주세요?", time: "어제 오후 8:05" },
    { id: "d22", senderId: "m2", text: "고지서 나오면 바로 올릴게요. 이번 주 안에는 될 것 같아요", time: "어제 오후 8:20" },
  ],
  m3: [
    { id: "d31", senderId: "m3", text: "주말에 라운지에서 같이 영화 보실 분 구해요~", time: "오후 1:40" },
  ],
  m4: [
    { id: "d41", senderId: "m4", text: "마켓에 올리신 책상 아직 있나요?", time: "오후 6:15" },
    { id: "d42", senderId: "me", text: "네 아직 있어요! 언제든 보러 오세요", time: "오후 6:22" },
  ],
  m5: [
    { id: "d51", senderId: "m5", text: "화장실 전구 나간 것 같은데 혹시 보셨어요?", time: "7월 19일" },
    { id: "d52", senderId: "me", text: "저도 어제 봤어요. 관리실에 말해둘게요", time: "7월 19일" },
    { id: "d53", senderId: "m5", text: "감사해요!", time: "7월 19일" },
  ],
};

export function threadOf(memberId?: string): ChatMsg[] {
  if (!memberId) return groupMessages;
  return directMessages[memberId] ?? [];
}

export function appendMessage(memberId: string | undefined, msg: ChatMsg) {
  if (!memberId) {
    groupMessages.push(msg);
    return;
  }
  if (!directMessages[memberId]) directMessages[memberId] = [];
  directMessages[memberId].push(msg);
}

export function lastMessageOf(memberId?: string): ChatMsg | undefined {
  const thread = threadOf(memberId);
  return thread[thread.length - 1];
}
