import { useState } from "react";
import { Screen, TopBar } from "../components/Layout";
import { Card } from "../components/Primitives";
import Avatar from "../components/Avatar";
import Icon from "../components/Icon";
import { memberById } from "../data/members";

interface Msg { id: string; senderId: string; text: string; time: string; }

const INIT_MSGS: Msg[] = [
  { id:"m1", senderId:"m1", text:"안녕하세요! 내일 청소 담당이 저 맞죠?", time:"오후 2:10" },
  { id:"m2", senderId:"me", text:"네 맞아요~ 주방이랑 현관이에요!", time:"오후 2:11" },
  { id:"m3", senderId:"m2", text:"오늘 밤 늦게 들어올 것 같아서 미리 공유해요", time:"오후 3:44" },
  { id:"m4", senderId:"m3", text:"ㅇㅋ 알겠어요 👍", time:"오후 3:45" },
  { id:"m5", senderId:"me", text:"냉장고 공용 칸 라벨 붙여놨어요!", time:"오후 5:20" },
];

export default function MemberChatPage({ memberId }: { memberId?: string }) {
  const [msgs, setMsgs] = useState<Msg[]>(INIT_MSGS);
  const [draft, setDraft] = useState("");
  const isGroup = !memberId;
  const title = isGroup ? "하우스 채팅" : memberById(memberId).name;

  const send = () => {
    if (!draft.trim()) return;
    setMsgs(prev => [...prev, { id: `m${Date.now()}`, senderId:"me", text: draft.trim(), time:"방금" }]);
    setDraft("");
  };

  return (
    <>
      <TopBar title={title} sub={isGroup ? "네스트허브 연남 · 6명" : ""} />
      <div style={{ display:"flex", flexDirection:"column", height:"calc(100vh - 56px)", overflow:"hidden" }}>
        <div style={{ flex:1, overflowY:"auto", padding:"12px 16px", display:"flex", flexDirection:"column", gap:10 }}>
          {msgs.map(msg => {
            const isMe = msg.senderId === "me";
            const sender = isMe ? null : memberById(msg.senderId);
            return (
              <div key={msg.id} style={{ display:"flex", flexDirection: isMe ? "row-reverse" : "row", alignItems:"flex-end", gap:8 }}>
                {!isMe && sender && <Avatar member={sender} size={32} />}
                <div style={{ maxWidth:"72%" }}>
                  {!isMe && sender && <div className="caption" style={{ marginBottom:3, marginLeft:2 }}>{sender.name}</div>}
                  <div style={{
                    padding:"10px 13px", borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    background: isMe ? "var(--primary)" : "var(--surface)",
                    color: isMe ? "#fff" : "var(--text)",
                    fontSize: 14, lineHeight: 1.5, fontWeight: 700,
                    boxShadow: "var(--shadow-sm)",
                  }}>
                    {msg.text}
                  </div>
                  <div className="caption" style={{ marginTop:3, textAlign: isMe ? "right" : "left" }}>{msg.time}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ padding:"10px 12px", borderTop:"1px solid var(--line)", display:"flex", gap:8, background:"var(--surface)" }}>
          <input
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()}
            placeholder="메시지 입력..."
            style={{
              flex:1, border:"1px solid var(--line)", borderRadius:24, padding:"10px 16px",
              fontSize:14, fontFamily:"var(--font)", background:"var(--bg)", color:"var(--text)", outline:"none",
            }}
          />
          <button onClick={send} style={{
            width:42, height:42, borderRadius:999, background:"var(--primary)", border:"none",
            color:"#fff", display:"grid", placeItems:"center", cursor:"pointer", flex:"0 0 auto",
          }}>
            <Icon name="send" size={18} />
          </button>
        </div>
      </div>
    </>
  );
}
