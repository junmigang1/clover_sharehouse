import { useState } from "react";
import { Screen, TopBar } from "../components/Layout";
import { Card } from "../components/Primitives";
import Avatar from "../components/Avatar";
import Icon from "../components/Icon";
import { memberById, members, house } from "../data/members";
import { threadOf, appendMessage, type ChatMsg } from "../data/chats";

export default function MemberChatPage({ memberId }: { memberId?: string }) {
  const isGroup = !memberId;
  const [msgs, setMsgs] = useState<ChatMsg[]>(() => [...threadOf(memberId)]);
  const [draft, setDraft] = useState("");
  const title = isGroup ? house.name : memberById(memberId).name;

  const send = () => {
    if (!draft.trim()) return;
    const msg: ChatMsg = { id: `c${Date.now()}`, senderId: "me", text: draft.trim(), time: "방금" };
    appendMessage(memberId, msg);          // 채팅 목록의 미리보기와 공유
    setMsgs(prev => [...prev, msg]);
    setDraft("");
  };

  return (
    <>
      <TopBar title={title} sub={isGroup ? `단체 채팅 · ${members.length}명` : memberById(memberId!).room} />
      <div style={{ display:"flex", flexDirection:"column", height:"calc(100vh - 56px)", overflow:"hidden" }}>
        <div style={{ flex:1, overflowY:"auto", padding:"12px 16px", display:"flex", flexDirection:"column", gap:10 }}>
          {msgs.length === 0 && (
            <div className="caption" style={{ textAlign:"center", padding:"40px 20px", lineHeight:1.6 }}>
              아직 대화가 없어요.<br />첫 메시지를 보내보세요.
            </div>
          )}
          {msgs.map(msg => {
            const isMe = msg.senderId === "me";
            const sender = isMe ? null : memberById(msg.senderId);
            return (
              <div key={msg.id} style={{ display:"flex", flexDirection: isMe ? "row-reverse" : "row", alignItems:"flex-end", gap:8 }}>
                {!isMe && sender && <Avatar member={sender} size={32} />}
                <div style={{ maxWidth:"72%" }}>
                  {!isMe && sender && isGroup && <div className="caption" style={{ marginBottom:3, marginLeft:2 }}>{sender.name}</div>}
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
