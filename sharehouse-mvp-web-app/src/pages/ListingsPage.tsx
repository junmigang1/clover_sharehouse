import { useState } from "react";
import { Screen, TopBar } from "../components/Layout";
import { Tag } from "../components/Primitives";
import Icon from "../components/Icon";
import { HeartButton, FitBadge } from "../components/HouseBits";
import { useNavigation } from "../hooks/useNavigation";
import { useSeeker } from "../hooks/useSeeker";
import { houses, commuteTo, openRoomCount } from "../data/houses";
import { computeFit, tenureLabel, COMMUTE_HUBS } from "../data/lifestyle";
import { won } from "../data/expenses";
import type { House } from "../types";

type Sort = "fit" | "commute" | "cost";

export default function ListingsPage() {
  const { navigate } = useNavigation();
  const { my, isLiked, toggleLike, setCommuteHub } = useSeeker();
  const [sort, setSort] = useState<Sort>(my.set ? "fit" : "commute");

  const ranked = [...houses].sort((a, b) => {
    if (sort === "fit") return computeFit(b, my) - computeFit(a, my);
    if (sort === "commute") return commuteTo(a, my.commuteHub) - commuteTo(b, my.commuteHub);
    return a.monthlyCost - b.monthlyCost;
  });

  return (
    <>
      <TopBar title="매물 둘러보기" sub="생활습관이 맞는 집부터" showBack={false} />

      {!my.set && (
        <div style={{ padding: "0 12px" }}>
          <div
            className="pressable"
            onClick={() => navigate("lifestyleSetup")}
            role="button"
            style={{ display: "flex", alignItems: "center", gap: 12, padding: 14, borderRadius: 18, background: "var(--primary-soft)", color: "var(--primary-strong)", cursor: "pointer" }}
          >
            <Icon name="sparkle" size={20} fill />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 850, fontSize: 14 }}>내 생활습관을 알려주세요</div>
              <div style={{ fontSize: 12.5, opacity: 0.85, marginTop: 2 }}>맞는 집이 위로 올라오고, 궁합 점수가 보여요.</div>
            </div>
            <Icon name="chevron-right" size={20} />
          </div>
        </div>
      )}

      <div style={{ padding: "0 12px" }}>
        <div className="chip-row" style={{ marginTop: 12 }}>
          <span className="caption" style={{ alignSelf: "center", marginRight: 2 }}>통근지</span>
          {COMMUTE_HUBS.map((hub) => (
            <button key={hub} className={`chip${my.commuteHub === hub ? " chip--active" : ""}`} onClick={() => setCommuteHub(hub)}>
              {hub}
            </button>
          ))}
        </div>
        <div className="chip-row" style={{ marginTop: 8 }}>
          <span className="caption" style={{ alignSelf: "center", marginRight: 2 }}>정렬</span>
          <SortChip active={sort === "fit"} disabled={!my.set} onClick={() => setSort("fit")}>궁합순</SortChip>
          <SortChip active={sort === "commute"} onClick={() => setSort("commute")}>통근 빠른순</SortChip>
          <SortChip active={sort === "cost"} onClick={() => setSort("cost")}>비용 낮은순</SortChip>
        </div>
      </div>

      <Screen>
        <div className="stack gap-12">
          {ranked.map((house) => (
            <HouseCard
              key={house.id}
              house={house}
              fit={computeFit(house, my)}
              fitIsDefault={!my.set}
              commute={commuteTo(house, my.commuteHub)}
              liked={isLiked(house.id)}
              onLike={() => toggleLike(house.id)}
              onClick={() => navigate("houseDetail", { id: house.id })}
            />
          ))}
        </div>
      </Screen>
    </>
  );
}

function SortChip({ active, disabled, onClick, children }: { active: boolean; disabled?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button className={`chip${active ? " chip--active" : ""}`} onClick={onClick} disabled={disabled} style={disabled ? { opacity: 0.4 } : undefined}>
      {children}
    </button>
  );
}

export function HouseCard({
  house,
  fit,
  fitIsDefault,
  commute,
  liked,
  onLike,
  onClick,
}: {
  house: House;
  fit: number;
  fitIsDefault?: boolean;
  commute: number;
  liked: boolean;
  onLike: () => void;
  onClick: () => void;
}) {
  return (
    <div className="card pressable" onClick={onClick} role="button" style={{ overflow: "hidden", padding: 0 }}>
      <div style={{ height: 96, background: house.bg, position: "relative", display: "flex", alignItems: "flex-end", padding: 12 }}>
        <div style={{ position: "absolute", top: 10, right: 10 }}>
          <HeartButton active={liked} onToggle={onLike} />
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {fit !== undefined && <FitBadge pct={fit} />}
          {openRoomCount(house) > 0 && <Tag variant="gray">빈방 {openRoomCount(house)}</Tag>}
        </div>
      </div>

      <div style={{ padding: 14 }}>
        <div className="row-between" style={{ alignItems: "flex-start" }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 900, fontSize: 16 }}>{house.name}</div>
            <div className="caption" style={{ marginTop: 3 }}>
              {house.station} 도보 {house.stationMins}분 · {house.genderPolicy} · {house.ageRange}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", margin: "10px 0" }}>
          {house.vibeTags.slice(0, 3).map((t) => (
            <Tag key={t} variant="violet">{t}</Tag>
          ))}
        </div>

        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", fontSize: 12.5, color: "var(--text)" }}>
          <TrustStat icon="check-circle" label="만족도" value={`${house.reviews[0]?.satisfaction ?? "-"}%`} />
          <TrustStat icon="user" label="평균 거주" value={tenureLabel(house.avgTenureMonths)} />
          <TrustStat icon="calendar" label="통근" value={`${commute}분`} />
        </div>

        <div className="divider" style={{ margin: "12px 0" }} />
        <div className="row-between">
          <span className="num" style={{ fontWeight: 950, fontSize: 17 }}>{won(house.monthlyCost)}<span className="caption" style={{ fontWeight: 700 }}> /월</span></span>
          <span className="caption">보증금 {house.deposit}만</span>
        </div>
      </div>
    </div>
  );
}

function TrustStat({ icon, label, value }: { icon: Parameters<typeof Icon>[0]["name"]; label: string; value: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
      <Icon name={icon} size={14} style={{ color: "var(--primary)" }} />
      <span className="caption">{label}</span>
      <b style={{ fontWeight: 850 }}>{value}</b>
    </span>
  );
}
