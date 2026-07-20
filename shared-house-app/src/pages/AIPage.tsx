import { Screen, TopBar } from "../components/Layout";
import Icon from "../components/Icon";
import { useNavigation } from "../hooks/useNavigation";
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
  return (
    <>
      <TopBar title="AI 매물 추천" sub="조건에 맞는 하우스를 빠르게 찾아요" showBack={false} />
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
            AI 하우스 매칭
          </div>
          <div style={{ marginTop: 14, fontSize: 24, fontWeight: 900, lineHeight: 1.18 }}>
            예산, 지역, 생활패턴을 보고 나에게 맞는 하우스를 추천해요.
          </div>
          <div style={{ marginTop: 10, opacity: 0.78, fontSize: 14, fontWeight: 700, lineHeight: 1.5 }}>
            단순 매물 목록이 아니라 규칙, 분위기, 정산 방식, 입주 준비까지 함께 판단합니다.
          </div>
        </div>

        <div className="stack gap-12" style={{ marginTop: 18 }}>
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
