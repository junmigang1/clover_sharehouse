import { useState } from "react";
import { Screen, TopBar } from "../components/Layout";
import { useNavigation } from "../hooks/useNavigation";
import { marketItems } from "../data/marketplace";
import { won } from "../data/expenses";
import type { MarketCategory, MarketItem } from "../types";

const CATEGORIES: MarketCategory[] = ["전체", "책상", "의자", "침구", "주방", "가전"];

export default function MarketplacePage() {
  const { navigate } = useNavigation();
  const [cat, setCat] = useState<MarketCategory>("전체");
  const list = cat === "전체" ? marketItems : marketItems.filter((item) => item.category === cat);

  return (
    <>
      <TopBar title="마켓" sub="우리 집 · 새 입주자와 나누는 물품" actionIcon="plus" showBack={false} />
      <div style={{ padding: "0 12px" }}>
        <div className="chip-row">
          {CATEGORIES.map((category) => (
            <button key={category} className={`chip${cat === category ? " chip--active" : ""}`} onClick={() => setCat(category)}>
              {category}
            </button>
          ))}
        </div>
      </div>
      <Screen>
        <div className="market-grid">
          {list.map((item) => (
            <ItemCard key={item.id} item={item} onClick={() => navigate("itemDetail", { id: item.id })} />
          ))}
        </div>
      </Screen>
    </>
  );
}

export function Placeholder({
  item,
  height,
  radius = 18,
  big = false,
}: {
  item: MarketItem;
  height?: number;
  radius?: number;
  big?: boolean;
}) {
  return (
    <div
      className={height ? undefined : "market-thumb"}
      style={{
        height,
        borderRadius: radius,
        background: item.bg,
        display: "grid",
        placeItems: "center",
        position: "relative",
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.85)",
      }}
    >
      <span style={{ fontSize: big ? 34 : 18, fontWeight: 950, color: "var(--primary)" }}>{item.emoji}</span>
      {item.status !== "판매중" && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(23,19,33,0.48)", display: "grid", placeItems: "center", color: "#fff", fontWeight: 950, fontSize: big ? 20 : 14 }}>
          {item.status}
        </div>
      )}
    </div>
  );
}

function ItemCard({ item, onClick }: { item: MarketItem; onClick: () => void }) {
  return (
    <div className="pressable" onClick={onClick} role="button" style={{ cursor: "pointer", minWidth: 0 }}>
      <Placeholder item={item} />
      <div style={{ padding: "8px 1px 0" }}>
        <div className="ellipsis" style={{ fontWeight: 850, fontSize: 14 }}>{item.title}</div>
        <div className="num" style={{ fontWeight: 950, fontSize: 16, marginTop: 2 }}>
          {item.price === 0 ? <span style={{ color: "var(--primary)" }}>나눔</span> : won(item.price)}
        </div>
        <div className="caption" style={{ marginTop: 4, display: "flex", alignItems: "center", gap: 5, minWidth: 0 }}>
          <span style={{ width: 14, height: 14, borderRadius: 999, background: item.sellerColor, display: "inline-block", flex: "0 0 auto" }} />
          <span className="ellipsis">{item.room}</span>
        </div>
      </div>
    </div>
  );
}
