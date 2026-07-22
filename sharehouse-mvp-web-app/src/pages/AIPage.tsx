import { Screen, TopBar } from "../components/Layout";
import Icon from "../components/Icon";
import { useNavigation } from "../hooks/useNavigation";
import { useSeeker } from "../hooks/useSeeker";
import { aiTools } from "../data/ai";

const accentColor = {
  green: "var(--green)",
  amber: "var(--amber)",
  coral: "var(--coral)",
  violet: "var(--primary)",
};

const accentSoft = {
  green: "var(--green-soft)",
  amber: "var(--amber-soft)",
  coral: "var(--coral-soft)",
  violet: "var(--primary-soft)",
};

export default function AIPage() {
  const { navigate } = useNavigation();
  const { liked, my } = useSeeker();

  return (
    <>
      <TopBar title="하우스 찾기" sub="생활습관이 맞는 집을 찾아요" showBack={false} />
      <Screen>
        <div
          style={{
            marginTop: 8,
            padding: 22,
            borderRadius: 28,
            background: "linear-gradient(135deg,#2e1065 0%,#7c3aed 62%,#c4b5fd 100%)",
            color: "#fff",
            boxShadow: "0 18px 40px rgba(124,58,237,0.24)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 900 }}>
            <Icon name="sparkle" size={21} fill />
            생활습관으로 찾는 셰어하우스
          </div>
          <div style={{ marginTop: 14, fontSize: 22, fontWeight: 900, lineHeight: 1.2 }}>
            방이 아니라 "같이 사는 사람"을 보고 고르세요.
          </div>
          <div style={{ marginTop: 10, opacity: 0.8, fontSize: 13.5, fontWeight: 700, lineHeight: 1.5 }}>
            실제 입주자의 생활 리듬과 익명 만족도로, 나와 맞는 집을 먼저 보여줘요.
          </div>
          <button
            onClick={() => navigate("listings")}
            style={{ marginTop: 16, background: "#fff", color: "var(--primary-strong)", border: "none", borderRadius: 14, padding: "12px 18px", fontWeight: 900, fontSize: 14.5, display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer" }}
          >
            <Icon name="search" size={18} /> 매물 둘러보기
          </button>
        </div>

        {/* 빠른 진입 */}
        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          <QuickCard
            icon="sparkle"
            title="내 생활습관"
            sub={my.set ? "설정 완료 · 수정" : "설정하기"}
            done={my.set}
            onClick={() => navigate("lifestyleSetup")}
          />
          <QuickCard
            icon="heart"
            title="관심 하우스"
            sub={liked.length ? `${liked.length}곳 비교` : "비교하기"}
            badge={liked.length || undefined}
            onClick={() => navigate("compareHouses")}
          />
        </div>

        <div style={{ fontWeight: 900, fontSize: 15, margin: "22px 4px 12px" }}>AI 도우미</div>
        <div className="stack gap-12">
          {aiTools.map((tool) => (
            <div
              key={tool.id}
              className="card card--pad pressable"
              onClick={() => navigate("aiTool", { id: tool.id })}
              style={{ display: "flex", alignItems: "center", gap: 14 }}
            >
              <div className="icon-tile" style={{ width: 54, height: 54, background: accentSoft[tool.accent], color: accentColor[tool.accent] }}>
                {tool.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 900, fontSize: 16 }}>{tool.title}</div>
                <div className="caption" style={{ marginTop: 4, lineHeight: 1.45 }}>{tool.desc}</div>
              </div>
              <Icon name="chevron-right" size={20} style={{ color: accentColor[tool.accent] }} />
            </div>
          ))}
        </div>
      </Screen>
    </>
  );
}

function QuickCard({
  icon,
  title,
  sub,
  onClick,
  done,
  badge,
}: {
  icon: Parameters<typeof Icon>[0]["name"];
  title: string;
  sub: string;
  onClick: () => void;
  done?: boolean;
  badge?: number;
}) {
  return (
    <div className="card card--pad pressable" onClick={onClick} role="button" style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div className="icon-tile" style={{ width: 38, height: 38, background: "var(--primary-soft)", color: "var(--primary)", position: "relative" }}>
          <Icon name={icon} size={19} fill={done} />
          {badge !== undefined && (
            <span style={{ position: "absolute", top: -5, right: -5, minWidth: 18, height: 18, padding: "0 5px", borderRadius: 999, background: "var(--coral)", color: "#fff", fontSize: 11, fontWeight: 900, display: "grid", placeItems: "center" }}>{badge}</span>
          )}
        </div>
      </div>
      <div style={{ fontWeight: 900, fontSize: 14, marginTop: 10 }}>{title}</div>
      <div className="caption" style={{ marginTop: 2 }}>{sub}</div>
    </div>
  );
}
