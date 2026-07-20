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

type Phase = "input" | "loading" | "result";

export default function AIToolPage({ id }: { id: string }) {
  const tool = aiToolById(id);
  const [input, setInput] = useState("");
  const [phase, setPhase] = useState<Phase>("input");
  const [copied, setCopied] = useState(false);
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

        {phase !== "result" && (
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
