import { useState } from "react";
import { Screen, TopBar } from "../components/Layout";
import { Card, Tag } from "../components/Primitives";
import Avatar from "../components/Avatar";
import Icon from "../components/Icon";
import { expenses, won } from "../data/expenses";
import { me, memberById } from "../data/members";
import type { ExpenseItem } from "../types";

export default function ExpensesPage() {
  const [paid, setPaid] = useState<Record<string, boolean>>({});
  const [sheet, setSheet] = useState<ExpenseItem | null>(null);
  const [method, setMethod] = useState("토스페이");
  const [done, setDone] = useState(false);

  const isPaid = (item: ExpenseItem) => item.paidMemberIds.includes(me.id) || paid[item.id];
  const outstanding = expenses.filter((item) => !isPaid(item)).reduce((sum, item) => sum + item.perPerson, 0);
  const completion = Math.round((expenses.filter(isPaid).length / expenses.length) * 100);

  const confirmPay = () => {
    setDone(true);
    window.setTimeout(() => {
      if (sheet) setPaid((prev) => ({ ...prev, [sheet.id]: true }));
      setSheet(null);
    }, 900);
  };

  return (
    <>
      <TopBar title="공유 정산" sub="투명한 공동 비용 관리" />
      <Screen>
        <Card style={{ marginTop: 8, background: "linear-gradient(135deg,#fff1f2,#ffffff)" }}>
          <div className="caption" style={{ fontWeight: 850 }}>내 미정산 금액</div>
          <div className="num" style={{ marginTop: 5, color: "var(--coral)", fontSize: 34, fontWeight: 950 }}>
            {won(outstanding)}
          </div>
          <div className="caption" style={{ marginTop: 5 }}>이번 달 내 정산 항목의 {completion}%를 완료했어요</div>
        </Card>

        <div className="section-head">
          <span className="section-head__title">이번 달 정산</span>
        </div>

        <div className="stack gap-10">
          {expenses.map((item) => {
            const settled = isPaid(item);
            const paidCount = item.paidMemberIds.length + (paid[item.id] && !item.paidMemberIds.includes(me.id) ? 1 : 0);
            return (
              <Card key={item.id}>
                <div className="row-between" style={{ alignItems: "flex-start" }}>
                  <div style={{ display: "flex", gap: 12, minWidth: 0 }}>
                    <div className="icon-tile" style={{ background: settled ? "var(--green-soft)" : "var(--primary-soft)", color: settled ? "var(--green)" : "var(--primary)" }}>
                      {item.icon}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div className="ellipsis" style={{ fontWeight: 850, fontSize: 15 }}>{item.title}</div>
                      <div className="caption" style={{ marginTop: 3 }}>
                        총 {won(item.total)} · {item.dueDate}
                      </div>
                    </div>
                  </div>
                  <Tag variant={settled ? "green" : "coral"}>{settled ? "완료" : "미정산"}</Tag>
                </div>

                <div className="row-between" style={{ marginTop: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div className="avatar-stack">
                      {item.paidMemberIds.slice(0, 4).map((id) => (
                        <Avatar key={id} member={memberById(id)} size={27} showEmoji={false} />
                      ))}
                    </div>
                    <span className="caption">{paidCount}/6명 완료</span>
                  </div>
                  <div className="num" style={{ fontWeight: 900, fontSize: 16 }}>{won(item.perPerson)}</div>
                </div>

                {!settled && (
                  <button className="btn btn--block btn--primary btn--sm" style={{ marginTop: 12 }} onClick={() => { setSheet(item); setDone(false); setMethod("토스페이"); }}>
                    {won(item.perPerson)} 정산하기
                  </button>
                )}
              </Card>
            );
          })}
        </div>
      </Screen>

      {sheet && (
        <PaymentSheet
          item={sheet}
          method={method}
          setMethod={setMethod}
          done={done}
          onClose={() => setSheet(null)}
          onConfirm={confirmPay}
        />
      )}
    </>
  );
}

function PaymentSheet({
  item,
  method,
  setMethod,
  done,
  onClose,
  onConfirm,
}: {
  item: ExpenseItem;
  method: string;
  setMethod: (method: string) => void;
  done: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const methods = ["토스페이", "카카오페이", "계좌이체"];
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 50, display: "flex", alignItems: "flex-end" }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(23,19,33,0.34)" }} onClick={onClose} />
      <div
        style={{
          position: "relative",
          width: "100%",
          background: "var(--surface)",
          borderRadius: "28px 28px 0 0",
          padding: "10px 20px calc(24px + env(safe-area-inset-bottom))",
          boxShadow: "0 -18px 44px rgba(23,19,33,0.18)",
          animation: "fade-up 0.25s ease",
        }}
      >
        <div style={{ width: 42, height: 5, borderRadius: 999, background: "var(--line)", margin: "0 auto 16px" }} />
        {done ? (
          <div style={{ textAlign: "center", padding: "22px 0 12px" }}>
            <div style={{ width: 64, height: 64, borderRadius: 999, background: "var(--primary)", color: "#fff", display: "grid", placeItems: "center", margin: "0 auto 14px" }}>
              <Icon name="check" size={32} strokeWidth={3} />
            </div>
            <div style={{ fontSize: 19, fontWeight: 900 }}>정산 완료</div>
            <div className="caption" style={{ marginTop: 5 }}>{item.title} · {won(item.perPerson)}</div>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 18, fontWeight: 900 }}>{item.title}</div>
            <div className="caption" style={{ marginTop: 3 }}>내 부담금 · {won(item.perPerson)}</div>
            <div className="caption" style={{ fontWeight: 850, margin: "18px 0 8px" }}>정산 방법</div>
            <div className="stack gap-8">
              {methods.map((name) => (
                <button
                  key={name}
                  onClick={() => setMethod(name)}
                  className="pressable"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 16px",
                    borderRadius: 16,
                    border: `1.5px solid ${method === name ? "var(--primary)" : "var(--line)"}`,
                    background: method === name ? "var(--primary-soft)" : "var(--surface)",
                    textAlign: "left",
                  }}
                >
                  <span style={{ fontWeight: 850, fontSize: 15 }}>{name}</span>
                  {method === name && <Icon name="check" size={18} strokeWidth={2.8} style={{ color: "var(--primary)" }} />}
                </button>
              ))}
            </div>
            <button className="btn btn--block btn--primary" style={{ marginTop: 18 }} onClick={onConfirm}>
              {won(item.perPerson)} 결제하기
            </button>
            <div className="caption" style={{ textAlign: "center", marginTop: 10 }}>
              발표용 프로토타입이라 실제 결제는 진행되지 않아요.
            </div>
          </>
        )}
      </div>
    </div>
  );
}
