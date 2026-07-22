import { useState } from "react";
import { Screen, TopBar } from "../components/Layout";
import { Button, Card } from "../components/Primitives";
import Icon from "../components/Icon";
import { FitBadge } from "../components/HouseBits";
import { useNavigation } from "../hooks/useNavigation";
import { useSeeker } from "../hooks/useSeeker";
import { houseById, commuteTo } from "../data/houses";
import { LIFESTYLE_AXES, computeFit } from "../data/lifestyle";
import { won } from "../data/expenses";

export default function CompareHousesPage() {
  const { navigate } = useNavigation();
  const { liked, my } = useSeeker();
  const likedHouses = liked.map(houseById);
  const [picked, setPicked] = useState<string[]>(liked.slice(0, 3));

  if (likedHouses.length === 0) {
    return (
      <>
        <TopBar title="관심 하우스 비교" />
        <Screen>
          <Empty onGo={() => navigate("listings")} />
        </Screen>
      </>
    );
  }

  const toggle = (id: string) => {
    setPicked((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return [...prev.slice(1), id];
      return [...prev, id];
    });
  };

  const cols = picked.map(houseById);

  return (
    <>
      <TopBar title="관심 하우스 비교" sub="관심 등록한 집을 생활습관 기준으로" />
      <Screen>
        <div className="caption" style={{ margin: "6px 2px 8px" }}>비교할 집 선택 (최대 3곳)</div>
        <div className="chip-row" style={{ flexWrap: "wrap" }}>
          {likedHouses.map((h) => (
            <button key={h.id} className={`chip${picked.includes(h.id) ? " chip--active" : ""}`} onClick={() => toggle(h.id)}>
              {h.name}
            </button>
          ))}
        </div>

        {cols.length === 0 ? (
          <Card style={{ marginTop: 16 }}>
            <div className="caption" style={{ textAlign: "center", padding: "10px 0" }}>위에서 비교할 집을 골라 주세요.</div>
          </Card>
        ) : (
          <Card style={{ marginTop: 16, overflowX: "auto", padding: 0 }}>
            <table style={{ borderCollapse: "collapse", width: "100%", minWidth: cols.length * 116 + 96 }}>
              <thead>
                <tr>
                  <Th sticky />
                  {cols.map((h) => (
                    <Th key={h.id}>
                      <div style={{ fontWeight: 900, fontSize: 13.5, lineHeight: 1.3 }}>{h.name}</div>
                      {my.set && <div style={{ marginTop: 6 }}><FitBadge pct={computeFit(h, my)} /></div>}
                    </Th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <Row label="월 예상" cells={cols.map((h) => won(h.monthlyCost))} />
                <Row label="보증금" cells={cols.map((h) => `${h.deposit}만`)} />
                <Row label={`${my.commuteHub}까지`} cells={cols.map((h) => `${commuteTo(h, my.commuteHub)}분`)} />
                <Row label="만족도" cells={cols.map((h) => `${h.reviews[0]?.satisfaction ?? "-"}%`)} />
                <Row label="평균 거주" cells={cols.map((h) => `${h.avgTenureMonths}개월`)} />
                <Row label="성별" cells={cols.map((h) => h.genderPolicy)} />
                <Row label="흡연" cells={cols.map((h) => h.smoking)} />
                <SectionRow label="생활습관" span={cols.length} />
                {LIFESTYLE_AXES.map((axis) => (
                  <Row
                    key={axis.key}
                    label={axis.label}
                    cells={cols.map((h) => `${axis.left.slice(0, 2)} ${"●".repeat(h.lifestyle[axis.key])}${"○".repeat(5 - h.lifestyle[axis.key])}`)}
                    mono
                  />
                ))}
              </tbody>
            </table>
          </Card>
        )}

        <Button variant="neutral" block onClick={() => navigate("listings")} style={{ marginTop: 16 }} icon="search">
          다른 집 더 둘러보기
        </Button>
      </Screen>
    </>
  );
}

function Th({ children, sticky }: { children?: React.ReactNode; sticky?: boolean }) {
  return (
    <th
      style={{
        textAlign: sticky ? "left" : "center",
        padding: "14px 12px",
        verticalAlign: "bottom",
        position: sticky ? "sticky" : undefined,
        left: sticky ? 0 : undefined,
        background: "var(--surface)",
        borderBottom: "1px solid var(--line)",
        minWidth: sticky ? 84 : 108,
      }}
    >
      {children}
    </th>
  );
}

function Row({ label, cells, mono }: { label: string; cells: string[]; mono?: boolean }) {
  return (
    <tr>
      <td style={{ padding: "11px 12px", fontSize: 12.5, color: "var(--text)", fontWeight: 700, position: "sticky", left: 0, background: "var(--surface)", borderBottom: "1px solid var(--line)" }}>{label}</td>
      {cells.map((c, i) => (
        <td key={i} style={{ padding: "11px 12px", textAlign: "center", fontSize: mono ? 12 : 13, fontWeight: 800, borderBottom: "1px solid var(--line)", letterSpacing: mono ? 1 : 0 }}>{c}</td>
      ))}
    </tr>
  );
}

function SectionRow({ label, span }: { label: string; span: number }) {
  return (
    <tr>
      <td colSpan={span + 1} style={{ padding: "10px 12px", fontSize: 12, fontWeight: 850, color: "var(--primary)", background: "var(--primary-soft)" }}>{label}</td>
    </tr>
  );
}

function Empty({ onGo }: { onGo: () => void }) {
  return (
    <div style={{ textAlign: "center", padding: "40px 20px" }}>
      <div style={{ width: 60, height: 60, borderRadius: 999, background: "var(--coral-soft)", color: "var(--coral)", display: "grid", placeItems: "center", margin: "0 auto 16px" }}>
        <Icon name="heart" size={28} />
      </div>
      <div style={{ fontWeight: 850, fontSize: 15 }}>아직 관심 등록한 집이 없어요</div>
      <div className="caption" style={{ marginTop: 6, lineHeight: 1.5 }}>매물을 둘러보며 하트를 누르면<br />여기서 나란히 비교할 수 있어요.</div>
      <Button variant="primary" onClick={onGo} style={{ marginTop: 18 }} icon="search">매물 둘러보기</Button>
    </div>
  );
}
