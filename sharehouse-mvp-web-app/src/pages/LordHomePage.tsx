import { Screen, TopBar } from "../components/Layout";
import { Card, SectionHeader, Tag, Button } from "../components/Primitives";
import Icon from "../components/Icon";
import { Bar } from "../components/HouseBits";
import { useNavigation } from "../hooks/useNavigation";
import { houseById, openRoomCount } from "../data/houses";
import { myHouseIds, applicants, invites } from "../data/landlord";
import { tenureLabel } from "../data/lifestyle";

export default function LordHomePage() {
  const { navigate } = useNavigation();
  const myHouses = myHouseIds.map(houseById);

  const openRooms = myHouses.reduce((sum, h) => sum + openRoomCount(h), 0);
  const pending = applicants.filter((a) => a.status === "검토 전" || a.status === "투어 요청");
  const pendingMine = pending.filter((a) => myHouseIds.includes(a.houseId));
  const liveInvites = invites.filter((i) => i.status === "미사용").length;

  // 만족도 항목 중 낮은 값 — 임대인이 개입해야 할 신호
  const alerts = myHouses.flatMap((h) =>
    (h.reviews[0]?.scores ?? [])
      .filter((s) => s.value < 75)
      .map((s) => ({ house: h.name, label: s.label, value: s.value }))
  );

  return (
    <>
      <TopBar title="운영 현황" sub="네스트허브 운영" showBack={false} />
      <Screen>
        <div
          style={{
            marginTop: 8,
            padding: 20,
            borderRadius: 26,
            background: "linear-gradient(135deg,#0f766e 0%,#14b8a6 60%,#99f6e4 100%)",
            color: "#fff",
            boxShadow: "0 16px 36px rgba(13,148,136,0.22)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 7, fontWeight: 800, fontSize: 13, opacity: 0.9 }}>
            <Icon name="home" size={17} /> 임대인 모드
          </div>
          <div style={{ marginTop: 12, fontSize: 21, fontWeight: 900, lineHeight: 1.25 }}>
            빈방 {openRooms}개 · 신규 신청 {pendingMine.length}건
          </div>
          <div style={{ marginTop: 8, opacity: 0.85, fontSize: 13, fontWeight: 700, lineHeight: 1.5 }}>
            생활습관이 맞는 신청자를 먼저 검토하면 중도 퇴거가 줄어요.
          </div>
        </div>

        <div className="metric-grid" style={{ marginTop: 14 }}>
          <StatCard label="운영 하우스" value={`${myHouses.length}곳`} onClick={() => navigate("lordHouses")} />
          <StatCard label="빈방" value={`${openRooms}개`} tone="coral" onClick={() => navigate("lordHouses")} />
          <StatCard label="신규 신청" value={`${pendingMine.length}건`} tone="amber" onClick={() => navigate("lordApplicants")} />
          <StatCard label="전달 대기중" value={`${liveInvites}개`} onClick={() => navigate("lordInvite")} />
        </div>

        {pendingMine.length > 0 && (
          <>
            <SectionHeader title="검토 대기 중인 신청" more="전체" onMore={() => navigate("lordApplicants")} />
            <div className="stack gap-10">
              {pendingMine.slice(0, 3).map((a) => (
                <Card key={a.id} onClick={() => navigate("lordApplicantDetail", { id: a.id })}>
                  <div className="row-between">
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 900, fontSize: 15 }}>
                        {a.name} <span className="caption" style={{ fontWeight: 700 }}>· {a.ageGroup}</span>
                      </div>
                      <div className="caption" style={{ marginTop: 3 }}>
                        {houseById(a.houseId).name} · {a.moveIn} 입주 희망
                      </div>
                    </div>
                    {a.prevSatisfaction !== undefined ? (
                      <Tag variant={a.prevSatisfaction >= 80 ? "green" : a.prevSatisfaction >= 65 ? "amber" : "coral"}>
                        이전 {a.prevSatisfaction}%
                      </Tag>
                    ) : (
                      <Tag variant="gray">이력 없음</Tag>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        <SectionHeader title="하우스 만족도" />
        <div className="stack gap-10">
          {myHouses.map((h) => {
            const latest = h.reviews[0];
            return (
              <Card key={h.id}>
                <div className="row-between" style={{ marginBottom: 8 }}>
                  <div style={{ fontWeight: 900, fontSize: 15 }}>{h.name}</div>
                  <span className="num" style={{ fontWeight: 900, color: latest ? "var(--primary)" : "var(--text-3)" }}>
                    {latest ? `${latest.satisfaction}%` : "—"}
                  </span>
                </div>
                <Bar value={latest?.satisfaction ?? 0} />
                <div className="caption" style={{ marginTop: 8 }}>
                  {latest
                    ? `${latest.period} · 익명 ${latest.responses}명`
                    : "아직 모인 후기가 없어요"}
                </div>
              </Card>
            );
          })}
        </div>

        {alerts.length > 0 && (
          <>
            <SectionHeader title="살펴볼 지표" />
            <Card>
              <div className="stack gap-8">
                {alerts.map((a, i) => (
                  <div key={i} className="row-between">
                    <span style={{ fontSize: 13.5 }}>
                      <b style={{ fontWeight: 850 }}>{a.label}</b>
                      <span className="caption"> · {a.house}</span>
                    </span>
                    <Tag variant={a.value < 65 ? "coral" : "amber"}>{a.value}점</Tag>
                  </div>
                ))}
              </div>
              <div className="caption" style={{ marginTop: 12, lineHeight: 1.5 }}>
                낮은 항목은 새 입주자를 뽑을 때 그 축의 궁합을 더 보수적으로 보는 게 좋아요.
              </div>
            </Card>
          </>
        )}

        <Button variant="primary" block icon="plus" style={{ marginTop: 18 }} onClick={() => navigate("lordHouseEdit", { id: "new" })}>
          새 매물 등록
        </Button>
      </Screen>
    </>
  );
}

function StatCard({
  label,
  value,
  tone,
  onClick,
}: {
  label: string;
  value: string;
  tone?: "coral" | "amber";
  onClick: () => void;
}) {
  const color = tone === "coral" ? "var(--coral)" : tone === "amber" ? "var(--amber)" : "var(--primary)";
  return (
    <div className="card card--pad pressable" role="button" onClick={onClick}>
      <div className="caption">{label}</div>
      <div style={{ fontWeight: 950, fontSize: 20, marginTop: 4, color }}>{value}</div>
    </div>
  );
}
