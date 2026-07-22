import { useState } from "react";
import { Screen, TopBar } from "../components/Layout";
import { Button, Card, SectionHeader } from "../components/Primitives";
import { useNavigation } from "../hooks/useNavigation";
import { addMarketItem } from "../data/marketplace";
import type { MarketItem } from "../types";

const CATEGORIES = ["책상", "의자", "침구", "주방", "가전", "기타"] as const;
type Cat = typeof CATEGORIES[number];

const CONDITIONS = ["거의 새것", "상태 좋음", "양호", "사용감 있음"] as const;

const BG_MAP: Record<Cat, string> = {
  책상: "linear-gradient(135deg,#ede9fe,#f8fafc)",
  의자: "linear-gradient(135deg,#e0f2fe,#ffffff)",
  침구: "linear-gradient(135deg,#fef3c7,#f5f3ff)",
  주방: "linear-gradient(135deg,#dcfce7,#fff7ed)",
  가전: "linear-gradient(135deg,#ccfbf1,#eef2ff)",
  기타: "linear-gradient(135deg,#f3f4f6,#ffffff)",
};

export default function MarketComposePage() {
  const { goBack } = useNavigation();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Cat>("책상");
  const [price, setPrice] = useState<number | "">("");
  const [isFree, setIsFree] = useState(false);
  const [condition, setCondition] = useState<typeof CONDITIONS[number]>("상태 좋음");
  const [desc, setDesc] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = title.trim() && desc.trim();

  const submit = () => {
    if (!canSubmit) return;
    const newItem: MarketItem = {
      id: `mkt${Date.now()}`,
      category: category === "기타" ? "가전" : category,
      title: title.trim(),
      price: isFree ? 0 : (typeof price === "number" ? price : 0),
      seller: "유빈",
      sellerColor: "#7c3aed",
      room: "네스트허브 연남",
      time: "방금",
      condition,
      emoji: category,
      bg: BG_MAP[category],
      desc: desc.trim(),
      status: "판매중",
    };
    addMarketItem(newItem);
    setSubmitted(true);
    setTimeout(goBack, 800);
  };

  return (
    <>
      <TopBar title="물건 올리기" sub="새 입주자에게 넘기거나 나눔해요" />
      <Screen>
        <Card style={{ marginTop: 8 }}>
          <div className="caption" style={{ marginBottom: 6 }}>카테고리</div>
          <div className="chip-row" style={{ flexWrap: "wrap" }}>
            {CATEGORIES.map(c => (
              <button key={c} className={`chip${category === c ? " chip--active" : ""}`} onClick={() => setCategory(c)}>{c}</button>
            ))}
          </div>
        </Card>

        <Card style={{ marginTop: 10 }}>
          <div className="caption" style={{ marginBottom: 6 }}>제목</div>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="예: 화이트 책상 120cm"
            maxLength={40}
            style={{ width: "100%", border: "none", outline: "none", fontSize: 17, fontWeight: 850, fontFamily: "var(--font)", background: "transparent", color: "var(--text)", boxSizing: "border-box" }}
          />
        </Card>

        <Card style={{ marginTop: 10 }}>
          <div
            className="row-between pressable"
            role="button"
            onClick={() => setIsFree(v => !v)}
            style={{ cursor: "pointer", marginBottom: isFree ? 0 : 12 }}
          >
            <div>
              <div style={{ fontWeight: 850, fontSize: 14 }}>나눔 (무료)</div>
              <div className="caption" style={{ marginTop: 2 }}>가격 없이 무료로 넘겨요</div>
            </div>
            <Toggle on={isFree} />
          </div>
          {!isFree && (
            <div>
              <div className="caption" style={{ marginBottom: 6 }}>가격 (원)</div>
              <input
                type="number"
                value={price}
                onChange={e => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="0"
                step={1000}
                style={{ width: "100%", border: "1px solid var(--line)", borderRadius: 12, padding: "10px 12px", fontSize: 15, fontFamily: "var(--font)", background: "var(--bg)", color: "var(--text)", boxSizing: "border-box", fontVariantNumeric: "tabular-nums" }}
              />
            </div>
          )}
        </Card>

        <Card style={{ marginTop: 10 }}>
          <div className="caption" style={{ marginBottom: 8 }}>상태</div>
          <div className="chip-row">
            {CONDITIONS.map(c => (
              <button key={c} className={`chip${condition === c ? " chip--active" : ""}`} onClick={() => setCondition(c)}>{c}</button>
            ))}
          </div>
        </Card>

        <Card style={{ marginTop: 10 }}>
          <div className="caption" style={{ marginBottom: 6 }}>설명</div>
          <textarea
            value={desc}
            onChange={e => setDesc(e.target.value)}
            placeholder="물건 상태, 구매 시기, 인수 방법 등을 알려주세요."
            rows={4}
            style={{ width: "100%", border: "none", outline: "none", resize: "vertical", fontSize: 14.5, lineHeight: 1.65, fontFamily: "var(--font)", background: "transparent", color: "var(--text)", boxSizing: "border-box" }}
          />
        </Card>

        <Button variant="primary" block icon={submitted ? "check-circle" : "send"} style={{ marginTop: 18 }} onClick={submit} disabled={!canSubmit}>
          {submitted ? "올렸어요" : "물건 올리기"}
        </Button>
      </Screen>
    </>
  );
}

function Toggle({ on }: { on: boolean }) {
  return (
    <span style={{ width: 46, height: 28, borderRadius: 999, background: on ? "var(--primary)" : "var(--line)", position: "relative", transition: "background 0.2s", flex: "0 0 auto", display: "block" }}>
      <span style={{ position: "absolute", top: 3, left: on ? 21 : 3, width: 22, height: 22, borderRadius: 999, background: "#fff", boxShadow: "var(--shadow-sm)", transition: "left 0.2s" }} />
    </span>
  );
}
