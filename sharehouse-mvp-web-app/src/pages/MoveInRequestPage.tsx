import { useState } from "react";
import { Screen, TopBar } from "../components/Layout";
import { Button, Card } from "../components/Primitives";
import { useNavigation } from "../hooks/useNavigation";
import { houseById } from "../data/houses";
import { won } from "../data/expenses";
import { addMyApplication } from "../data/myApplications";

export default function MoveInRequestPage({ id }: { id: string }) {
  const { navigate } = useNavigation();
  const house = houseById(id);
  const availableRooms = house.rooms.filter(r => r.available);
  const [roomId, setRoomId] = useState(availableRooms[0]?.id ?? "");
  const [moveInDate, setMoveInDate] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submit = () => {
    if (!roomId || !moveInDate) return;
    const room = availableRooms.find(r => r.id === roomId);
    addMyApplication({
      id: `my${Date.now()}`,
      houseId: house.id,
      kind: "입주",
      when: moveInDate,
      roomNumber: room?.number,
      status: "검토 전",
      submittedAt: "방금",
    });
    setSubmitted(true);
    setTimeout(() => navigate("myApplications"), 900);
  };

  return (
    <>
      <TopBar title="입주 신청" sub={house.name} />
      <Screen>
        {availableRooms.length === 0 ? (
          <Card style={{ marginTop: 8 }}>
            <div className="caption" style={{ textAlign: "center", padding: "16px 0" }}>현재 빈방이 없습니다.</div>
          </Card>
        ) : (
          <>
            <Card style={{ marginTop: 8 }}>
              <div style={{ fontWeight: 900, fontSize: 15, marginBottom: 12 }}>희망 방을 선택해 주세요</div>
              <div className="stack gap-8">
                {availableRooms.map(room => (
                  <button
                    key={room.id}
                    onClick={() => setRoomId(room.id)}
                    style={{
                      width: "100%", padding: "13px 16px", borderRadius: 14, textAlign: "left",
                      border: `2px solid ${roomId === room.id ? "var(--primary)" : "var(--line)"}`,
                      background: roomId === room.id ? "var(--primary-soft)" : "var(--bg)",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ fontWeight: 900, fontSize: 14, color: roomId === room.id ? "var(--primary-strong)" : "var(--text)" }}>
                      {room.number} · {room.type} · {room.sizeSqm}m²
                    </div>
                    <div className="caption" style={{ marginTop: 3 }}>
                      {won(room.monthlyCost)}/월 · {room.privateBath ? "개인화장실" : "공용화장실"}
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            <Card style={{ marginTop: 10 }}>
              <div style={{ fontWeight: 900, fontSize: 15, marginBottom: 8 }}>희망 입주일</div>
              <input
                type="date"
                value={moveInDate}
                onChange={e => setMoveInDate(e.target.value)}
                style={{
                  width: "100%", border: "1px solid var(--line)", borderRadius: 12,
                  padding: "11px 12px", fontSize: 14, fontFamily: "var(--font)",
                  background: "var(--bg)", color: "var(--text)", boxSizing: "border-box",
                }}
              />
            </Card>

            <Card style={{ marginTop: 10 }}>
              <div className="caption" style={{ lineHeight: 1.55 }}>
                신청 후 임대인이 생활습관 궁합을 검토하고 투어 일정을 제안합니다. 투어 후 최종 계약이 진행됩니다.
              </div>
            </Card>

            <Button variant="primary" block icon={submitted ? "check-circle" : "send"} style={{ marginTop: 18 }} onClick={submit} disabled={!roomId || !moveInDate}>
              {submitted ? "신청했어요" : "입주 신청하기"}
            </Button>
          </>
        )}
      </Screen>
    </>
  );
}
