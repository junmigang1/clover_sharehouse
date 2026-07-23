import { useState } from "react";
import { Screen, TopBar } from "../components/Layout";
import Icon from "../components/Icon";
import { aiToolById, fakeOutputs } from "../data/ai";

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

type Phase = "input" | "loading" | "result" | "checklist";

const moveInChecklistItems = {
  furniture: [
    { id: "bed", label: "침대", checked: false },
    { id: "desk", label: "책상", checked: false },
    { id: "chair", label: "의자", checked: false },
    { id: "closet", label: "옷장/서랍장", checked: false },
    { id: "shelves", label: "선반", checked: false },
  ],
  bedding: [
    { id: "sheets", label: "침구 세트", checked: false },
    { id: "pillow", label: "베개", checked: false },
    { id: "blanket", label: "담요", checked: false },
    { id: "towel", label: "개인 수건", checked: false },
  ],
  kitchen: [
    { id: "dishes", label: "그릇/찬기", checked: false },
    { id: "utensils", label: "숟가락/젓가락", checked: false },
    { id: "pots", label: "냄비/팬", checked: false },
    { id: "cooker", label: "수저/도마", checked: false },
  ],
  confirm: [
    { id: "wifi", label: "와이파이 설정", checked: false },
    { id: "key", label: "열쇠 수령", checked: false },
    { id: "contract", label: "계약서 확인", checked: false },
    { id: "cleaning", label: "청소 로테이션 확인", checked: false },
    { id: "payment", label: "첫 달 정산 방식 확인", checked: false },
  ],
};

export default function AIToolPage({ id }: { id: string }) {
  const tool = aiToolById(id);
  const [input, setInput] = useState("");
  const [phase, setPhase] = useState<Phase>(tool.id === "movein" ? "checklist" : "input");
  const [copied, setCopied] = useState(false);
  const [checklist, setChecklist] = useState<Record<string, Record<string, boolean>>>(
    tool.id === "movein" ? {
      furniture: Object.fromEntries(moveInChecklistItems.furniture.map(i => [i.id, false])),
      bedding: Object.fromEntries(moveInChecklistItems.bedding.map(i => [i.id, false])),
      kitchen: Object.fromEntries(moveInChecklistItems.kitchen.map(i => [i.id, false])),
      confirm: Object.fromEntries(moveInChecklistItems.confirm.map(i => [i.id, false])),
    } : {}
  );
  const accent = accentColor[tool.accent];

  const generate = () => {
    setPhase("loading");
    window.setTimeout(() => setPhase("result"), 950);
  };

  const copy = () => {
    navigator.clipboard?.writeText(fakeOutputs[tool.id] ?? "").catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <>
      <TopBar title={tool.title} />
      <Screen>
        <div
          style={{
            marginTop: 8,
            padding: 18,
            borderRadius: 22,
            background: accentSoft[tool.accent],
            display: "flex",
            gap: 14,
            alignItems: "center",
          }}
        >
          <div className="icon-tile" style={{ background: "#fff", color: accent }}>{tool.icon}</div>
          <div>
            <div style={{ fontWeight: 900, fontSize: 16 }}>{tool.title}</div>
            <div className="caption" style={{ marginTop: 3, lineHeight: 1.45 }}>{tool.desc}</div>
          </div>
        </div>

        {phase !== "result" && phase !== "checklist" && (
          <>
            <div style={{ fontWeight: 850, fontSize: 14, margin: "22px 4px 10px" }}>
              {tool.inputLabel}
            </div>
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={tool.placeholder}
              rows={5}
              disabled={phase === "loading"}
              style={{
                width: "100%",
                borderRadius: 18,
                border: "1px solid var(--line)",
                background: "rgba(255,255,255,0.9)",
                padding: "15px 16px",
                fontSize: 15,
                lineHeight: 1.55,
                resize: "none",
                outline: "none",
                color: "var(--text)",
              }}
            />
            <button onClick={() => setInput(tool.sampleInput)} className="chip" style={{ marginTop: 10 }}>
              예시 입력하기
            </button>

            <button
              className="btn btn--block"
              style={{ marginTop: 18, background: accent, color: "#fff", boxShadow: "0 12px 24px rgba(124,58,237,0.2)" }}
              onClick={generate}
              disabled={phase === "loading"}
            >
              {phase === "loading" ? (
                <>
                  <Spinner /> 생성 중
                </>
              ) : (
                <>
                  <Icon name="sparkle" size={19} fill /> AI로 생성하기
                </>
              )}
            </button>
          </>
        )}

        {phase === "loading" && (
          <div style={{ marginTop: 20 }}>
            <SkeletonLines />
          </div>
        )}

        {phase === "result" && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 6, margin: "22px 4px 10px", color: accent, fontWeight: 900, fontSize: 14 }}>
              <Icon name="sparkle" size={16} fill /> AI 결과
            </div>
            <div
              style={{
                borderRadius: 20,
                border: `1px solid ${accent}`,
                background: "var(--surface)",
                padding: 18,
                fontSize: 14.5,
                lineHeight: 1.68,
                whiteSpace: "pre-line",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              {fakeOutputs[tool.id]}
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <button className="btn btn--neutral" style={{ flex: 1 }} onClick={() => setPhase("input")}>
                <Icon name="chevron-left" size={18} /> 수정
              </button>
              <button className="btn" style={{ flex: 2, background: accent, color: "#fff" }} onClick={copy}>
                {copied ? (
                  <>
                    <Icon name="check" size={18} strokeWidth={2.6} /> 복사됨
                  </>
                ) : (
                  "복사하고 공유"
                )}
              </button>
            </div>
          </>
        )}

        {phase === "checklist" && (
          <>
            <div style={{ margin: "20px 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ fontWeight: 950, fontSize: 16 }}>입주 준비물 확인</div>
              <div className="caption" style={{ color: "var(--text-3)" }}>
                {Object.entries(checklist).reduce((sum, [_, items]) => sum + Object.values(items).filter(Boolean).length, 0)} / {Object.entries(checklist).reduce((sum, [_, items]) => sum + Object.keys(items).length, 0)} 완료
              </div>
            </div>

            {[
              { key: "furniture", title: "🛏️ 가구", items: moveInChecklistItems.furniture },
              { key: "bedding", title: "🛌 침구류", items: moveInChecklistItems.bedding },
              { key: "kitchen", title: "🍽️ 주방용품", items: moveInChecklistItems.kitchen },
              { key: "confirm", title: "✅ 입주 전 확인", items: moveInChecklistItems.confirm },
            ].map(({ key, title, items }) => (
              <div key={key} style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 850, fontSize: 13, marginBottom: 8, color: "var(--text-2)" }}>{title}</div>
                <div className="stack gap-6">
                  {items.map((item) => (
                    <label
                      key={item.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "10px 12px",
                        borderRadius: 12,
                        background: checklist[key][item.id] ? accentSoft[tool.accent] : "var(--surface-2)",
                        cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={checklist[key][item.id] ?? false}
                        onChange={() => {
                          setChecklist((prev) => ({
                            ...prev,
                            [key]: { ...prev[key], [item.id]: !prev[key][item.id] },
                          }));
                        }}
                        style={{
                          width: 18,
                          height: 18,
                          cursor: "pointer",
                          accentColor: accent,
                        }}
                      />
                      <span style={{ flex: 1, textDecoration: checklist[key][item.id] ? "line-through" : "none", opacity: checklist[key][item.id] ? 0.6 : 1 }}>
                        {item.label}
                      </span>
                      {checklist[key][item.id] && <Icon name="check" size={16} style={{ color: accent }} strokeWidth={3} />}
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <div style={{ margin: "20px 0 16px" }}>
              <button 
                className="btn btn--block"
                style={{ background: accent, color: "#fff" }}
                onClick={() => setPhase("input")}
              >
                다른 방법으로 준비하기
              </button>
            </div>
          </>
        )}
      </Screen>
    </>
  );
}

function Spinner() {
  return (
    <span
      style={{
        width: 18,
        height: 18,
        borderRadius: 999,
        border: "2.5px solid rgba(255,255,255,0.42)",
        borderTopColor: "#fff",
        display: "inline-block",
        animation: "spin 0.7s linear infinite",
      }}
    />
  );
}

function SkeletonLines() {
  const widths = ["92%", "100%", "74%", "96%", "62%"];
  return (
    <div className="stack gap-10">
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}@keyframes shimmer{0%{opacity:.45}50%{opacity:1}100%{opacity:.45}}`}</style>
      {widths.map((width, index) => (
        <div
          key={width}
          style={{
            height: 14,
            width,
            borderRadius: 8,
            background: "rgba(255,255,255,0.86)",
            animation: `shimmer 1.2s ease ${index * 0.12}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
