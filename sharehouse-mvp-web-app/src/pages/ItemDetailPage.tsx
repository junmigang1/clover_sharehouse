import { useState } from "react";
import { Screen, TopBar } from "../components/Layout";
import { Tag } from "../components/Primitives";
import Avatar from "../components/Avatar";
import Icon from "../components/Icon";
import { useNavigation } from "../hooks/useNavigation";
import { marketItems, updateMarketStatus } from "../data/marketplace";
import { won } from "../data/expenses";
import { Placeholder } from "./MarketplacePage";

export function ItemDetailPage({ id }: { id: string }) {
  const { navigate } = useNavigation();
  const item = marketItems.find((entry) => entry.id === id) ?? marketItems[0];
  const isMine = item.seller === "유빈";
  const [status, setStatus] = useState(item.status);

  const changeStatus = (next: typeof status) => {
    setStatus(next);
    updateMarketStatus(item.id, next);
  };

  return (
    <>
      <TopBar title="상품" actionIcon="more" />
      <Screen>
        <Placeholder item={item} height={260} radius={24} big />

        <div style={{ padding: "16px 4px 0" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <Tag variant="gray">{item.category}</Tag>
            <Tag variant={status === "판매중" ? "green" : status === "예약중" ? "amber" : "gray"}>{status}</Tag>
          </div>
          <h1 style={{ fontSize: 23, fontWeight: 950, lineHeight: 1.25 }}>{item.title}</h1>
          <div className="num" style={{ fontSize: 28, fontWeight: 950, marginTop: 9 }}>
            {item.price === 0 ? <span style={{ color: "var(--primary)" }}>나눔</span> : won(item.price)}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "18px 0", padding: "14px 0", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
            <Avatar name={item.seller} color={item.sellerColor} size={42} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 850 }}>{item.seller}</div>
              <div className="caption">{item.room} · 근처 하우스 인증 · {item.time}</div>
            </div>
            <Tag variant="violet">{item.condition}</Tag>
          </div>

          <div style={{ fontSize: 15.5, lineHeight: 1.72, whiteSpace: "pre-line" }}>{item.desc}</div>
          <div className="caption" style={{ marginTop: 18 }}>채팅 12 · 관심 5 · 조회 87</div>
        </div>
      </Screen>

      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "12px 16px calc(14px + env(safe-area-inset-bottom))", background: "rgba(255,255,255,0.9)", backdropFilter: "blur(18px)", borderTop: "1px solid var(--line)", display: "flex", flexDirection: "column", gap: 8 }}>
        {isMine ? (
          <>
            <div className="caption" style={{ textAlign:"center", fontWeight:800 }}>내 물건 · 상태 변경</div>
            <div style={{ display:"flex", gap:8 }}>
              {(["판매중","예약중","거래완료"] as const).map(st => (
                <button
                  key={st}
                  className={`btn btn--sm ${status === st ? "btn--primary" : "btn--neutral"}`}
                  style={{ flex:1 }}
                  onClick={() => changeStatus(st)}
                >
                  {st}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div style={{ display:"flex", gap:12, alignItems:"center" }}>
            <button style={{ width:48, height:48, display:"grid", placeItems:"center", color:"var(--coral)" }} aria-label="관심 상품">
              <Icon name="heart" size={26} />
            </button>
            <button className="btn btn--primary" style={{ flex:1 }} onClick={() => navigate("itemChat", { id: item.id })} disabled={status === "거래완료"}>
              <Icon name="comment" size={19} />
              {status === "거래완료" ? "거래완료 상품" : "판매자와 채팅"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export function ItemChatPage({ id }: { id: string }) {
  const item = marketItems.find((entry) => entry.id === id) ?? marketItems[0];
  const [msgs, setMsgs] = useState<{ me: boolean; text: string }[]>([
    { me: false, text: `안녕하세요, ${item.title} 아직 거래 가능할까요?` },
    { me: true, text: "네, 아직 가능해요. 언제 보러 오실 수 있으세요?" },
    { me: false, text: "오늘 저녁 8시에 근처 라운지에서 봐도 괜찮을까요?" },
  ]);
  const [draft, setDraft] = useState("");
  const [assistantOpen, setAssistantOpen] = useState(false);

  const softened = draft.trim()
    ? `안녕하세요. ${draft.trim().replace(/[?!]+$/g, "")} 혹시 가능하실까요? 편하실 때 답변 부탁드려요.`
    : "예: 혹시 오늘 저녁 8시에 근처 라운지에서 확인해 볼 수 있을까요?";

  const send = () => {
    if (!draft.trim()) return;
    setMsgs((list) => [...list, { me: true, text: draft.trim() }]);
    setDraft("");
    setAssistantOpen(false);
    window.setTimeout(() => {
      setMsgs((list) => [...list, { me: false, text: "좋아요. 그때 뵐게요." }]);
    }, 650);
  };

  const applySoftTone = () => {
    setDraft(softened);
    setAssistantOpen(false);
  };

  return (
    <>
      <TopBar title={item.seller} sub={item.room} />
      <div style={{ padding: "0 16px" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", padding: 10, borderRadius: 18, background: "var(--surface)", border: "1px solid var(--line)" }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: item.bg, display: "grid", placeItems: "center", color: "var(--primary)", fontWeight: 950 }}>
            {item.emoji}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="ellipsis" style={{ fontWeight: 850, fontSize: 14 }}>{item.title}</div>
            <div className="num" style={{ fontWeight: 900 }}>{item.price === 0 ? "나눔" : won(item.price)}</div>
          </div>
          <Tag variant={item.status === "판매중" ? "green" : "amber"}>{item.status}</Tag>
        </div>
      </div>

      <Screen>
        <div className="stack gap-10" style={{ marginTop: 14 }}>
          {msgs.map((message, index) => (
            <div
              key={`${message.text}-${index}`}
              style={{
                alignSelf: message.me ? "flex-end" : "flex-start",
                maxWidth: "76%",
                padding: "11px 14px",
                borderRadius: message.me ? "17px 17px 5px 17px" : "17px 17px 17px 5px",
                background: message.me ? "var(--primary)" : "var(--surface)",
                color: message.me ? "#fff" : "var(--text)",
                border: message.me ? "none" : "1px solid var(--line)",
                fontSize: 14.5,
                lineHeight: 1.5,
              }}
            >
              {message.text}
            </div>
          ))}
        </div>
      </Screen>

      <div className="chat-composer">
        {assistantOpen && (
          <div className="chat-extension">
            <div className="row-between" style={{ gap: 12 }}>
              <div>
                <div style={{ fontWeight: 900, fontSize: 14 }}>AI 말투 변환</div>
                <div className="caption" style={{ marginTop: 3 }}>거래 채팅을 더 정중하고 부담 없게 바꿔줘요.</div>
              </div>
              <Tag variant="violet">확장</Tag>
            </div>
            <div style={{ marginTop: 12, padding: 12, borderRadius: 14, background: "var(--primary-soft)", color: "var(--primary-strong)", fontSize: 14, lineHeight: 1.55, fontWeight: 750 }}>
              {softened}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <button className="btn btn--soft btn--sm" style={{ flex: 1 }} onClick={applySoftTone}>
                적용하기
              </button>
              <button className="btn btn--neutral btn--sm" style={{ flex: 1 }} onClick={() => setAssistantOpen(false)}>
                닫기
              </button>
            </div>
          </div>
        )}

        <button
          onClick={() => setAssistantOpen((value) => !value)}
          className="pressable"
          style={{ width: 46, height: 46, borderRadius: 999, background: "var(--primary-soft)", color: "var(--primary)", display: "grid", placeItems: "center", flex: "0 0 auto" }}
          aria-label="AI 말투 변환"
        >
          <Icon name="sparkle" size={18} fill />
        </button>
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && send()}
          placeholder="메시지 보내기"
          style={{ flex: 1, height: 46, borderRadius: 999, border: "1px solid var(--line)", background: "var(--surface-2)", padding: "0 18px", fontSize: 14.5, outline: "none", minWidth: 0 }}
        />
        <button onClick={send} className="pressable" style={{ width: 46, height: 46, borderRadius: 999, background: draft.trim() ? "var(--primary)" : "var(--surface-2)", color: draft.trim() ? "#fff" : "var(--text-3)", display: "grid", placeItems: "center", flex: "0 0 auto" }}>
          <Icon name="send" size={19} />
        </button>
      </div>
    </>
  );
}
