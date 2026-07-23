import { Screen, TopBar } from "../components/Layout";
import { Button, Card, Tag } from "../components/Primitives";
import Icon from "../components/Icon";
import { useNavigation } from "../hooks/useNavigation";
import { houseById, openRoomCount, priceRange } from "../data/houses";
import { myHouseIds, applicantsByHouse } from "../data/landlord";
import { LIFESTYLE_AXES } from "../data/lifestyle";

export default function LordHousesPage() {
  const { navigate } = useNavigation();
  const myHouses = myHouseIds.map(houseById);

  return (
    <>
      <TopBar title="내 매물" sub="등록한 하우스 관리" showBack={false} />
      <Screen>
        <div className="stack gap-12">
          {myHouses.map((h) => {
            const pending = applicantsByHouse(h.id).filter((a) => a.status === "검토 전" || a.status === "투어 요청").length;
            return (
              <Card key={h.id} pad={false} style={{ overflow: "hidden" }}>
                <div style={{ height: 74, background: h.bg, display: "flex", alignItems: "flex-end", padding: 12, gap: 6 }}>
                  {openRoomCount(h) > 0 ? <Tag variant="coral">빈방 {openRoomCount(h)}</Tag> : <Tag variant="green">만실</Tag>}
                  {pending > 0 && <Tag variant="amber">신청 {pending}</Tag>}
                </div>

                <div style={{ padding: 14 }}>
                  <div style={{ fontWeight: 900, fontSize: 16 }}>{h.name}</div>
                  <div className="caption" style={{ marginTop: 3 }}>
                    {h.station} 도보 {h.stationMins}분 · {h.genderPolicy} · 입주자 {h.memberCount}명
                  </div>

                  <div className="metric-grid" style={{ marginTop: 12 }}>
                    <Metric label="월 예상" value={priceRange(h)} />
                    <Metric label="보증금" value={`${h.deposit}만`} />
                  </div>

                  <div className="divider" style={{ margin: "12px 0" }} />
                  <div className="caption" style={{ marginBottom: 6 }}>등록된 생활습관 성격</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {LIFESTYLE_AXES.map((axis) => (
                      <Tag key={axis.key} variant="violet">
                        {axis.label} {h.lifestyle[axis.key]}/5
                      </Tag>
                    ))}
                  </div>

                  <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                    <Button variant="neutral" sm onClick={() => navigate("lordHouseEdit", { id: h.id })} icon="settings" style={{ flex: 1 }}>
                      편집
                    </Button>
                    <Button variant="primary" sm onClick={() => navigate("lordApplicants")} icon="user" style={{ flex: 1 }}>
                      신청자
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div
          className="pressable"
          role="button"
          onClick={() => navigate("lordHouseEdit", { id: "new" })}
          style={{
            marginTop: 14,
            padding: 20,
            borderRadius: 20,
            border: "2px dashed var(--line)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            color: "var(--primary)",
            fontWeight: 850,
            cursor: "pointer",
          }}
        >
          <Icon name="plus" size={19} /> 새 매물 등록
        </div>
      </Screen>
    </>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="caption">{label}</div>
      <div style={{ fontWeight: 900, fontSize: 14.5, marginTop: 2 }}>{value}</div>
    </div>
  );
}
