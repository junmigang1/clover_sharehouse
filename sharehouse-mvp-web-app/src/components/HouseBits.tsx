import Icon from "./Icon";
import { Tag } from "./Primitives";
import { fitLabel } from "../data/lifestyle";

/** 관심(좋아요) 하트 토글 */
export function HeartButton({ active, onToggle, size = 20 }: { active: boolean; onToggle: () => void; size?: number }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      aria-label={active ? "관심 해제" : "관심 등록"}
      style={{
        width: size + 16,
        height: size + 16,
        borderRadius: 999,
        border: "none",
        background: active ? "var(--coral-soft)" : "rgba(255,255,255,0.9)",
        color: active ? "var(--coral)" : "var(--muted-strong, #8b8698)",
        display: "grid",
        placeItems: "center",
        cursor: "pointer",
        boxShadow: "var(--shadow-sm)",
        flex: "0 0 auto",
      }}
    >
      <Icon name={active ? "heart-fill" : "heart"} size={size} fill={active} />
    </button>
  );
}

/** 생활습관 궁합 배지. isDefault=true 이면 미설정 상태 스타일 */
export function FitBadge({ pct, isDefault }: { pct: number; isDefault?: boolean }) {
  const { text, variant } = fitLabel(pct);
  return (
    <Tag variant={isDefault ? "gray" : variant}>
      {isDefault ? `예상 ${pct}%` : `궁합 ${pct}% · ${text}`}
    </Tag>
  );
}

/** 0~5 또는 0~100 값을 막대로 표현 */
export function Bar({ value, max = 100, color = "var(--primary)" }: { value: number; max?: number; color?: string }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div style={{ height: 8, borderRadius: 999, background: "var(--line)", overflow: "hidden" }}>
      <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 999 }} />
    </div>
  );
}

/** 축 하나: 라벨 + 내 위치와 집 위치를 한 트랙에 표시 */
export function AxisTrack({
  label,
  left,
  right,
  houseVal,
  myVal,
  matchPct,
}: {
  label: string;
  left: string;
  right: string;
  houseVal: number;
  myVal?: number;
  matchPct?: number;
}) {
  const toPct = (v: number) => ((v - 1) / 4) * 100;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
        <span style={{ fontWeight: 800, fontSize: 13.5 }}>{label}</span>
        {matchPct !== undefined && (
          <span style={{ fontSize: 12, fontWeight: 800, color: matchPct >= 75 ? "var(--green)" : matchPct >= 50 ? "var(--amber)" : "var(--coral)" }}>
            {matchPct}%
          </span>
        )}
      </div>
      <div style={{ position: "relative", height: 8, borderRadius: 999, background: "var(--line)" }}>
        {myVal !== undefined && (
          <span
            title="내 성향"
            style={{ position: "absolute", top: -3, left: `calc(${toPct(myVal)}% - 7px)`, width: 14, height: 14, borderRadius: 999, background: "#fff", border: "3px solid var(--muted-strong,#a29db3)", boxSizing: "border-box" }}
          />
        )}
        <span
          title="이 집"
          style={{ position: "absolute", top: -4, left: `calc(${toPct(houseVal)}% - 8px)`, width: 16, height: 16, borderRadius: 999, background: "var(--primary)", border: "3px solid #fff", boxSizing: "border-box", boxShadow: "var(--shadow-sm)" }}
        />
      </div>
      <div className="caption" style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
        <span>{left}</span>
        <span>{right}</span>
      </div>
    </div>
  );
}
