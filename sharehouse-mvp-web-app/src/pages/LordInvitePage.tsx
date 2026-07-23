import { useState } from "react";
import { Screen, TopBar } from "../components/Layout";
import { Button, Card, SectionHeader, Tag } from "../components/Primitives";
import Icon from "../components/Icon";
import { useNavigation } from "../hooks/useNavigation";
import { houseById } from "../data/houses";
import { invites as seedInvites, myHouseIds } from "../data/landlord";
import type { Invite } from "../types";

function randomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 4; i += 1) out += chars[Math.floor(Math.random() * chars.length)];
  return `NEST-${out}`;
}

export default function LordInvitePage({ id }: { id?: string }) {
  const { navigate } = useNavigation();
  const defaultHouse = id && myHouseIds.includes(id) ? id : myHouseIds[0];
  const [houseId, setHouseId] = useState(defaultHouse);
  const [room, setRoom] = useState("");
  const [list, setList] = useState<Invite[]>(seedInvites);
  const [justMade, setJustMade] = useState<string | null>(null);

  const house = houseById(houseId);
  const houseInvites = list.filter((i) => i.houseId === houseId);

  const create = () => {
    const code = randomCode();
    setList((prev) => [
      { id: `i${Date.now()}`, houseId, room: room.trim() || "미지정", code, status: "대기 중" },
      ...prev,
    ]);
    setJustMade(code);
    setRoom("");
  };

  return (
    <>
      <TopBar title="거주자 초대" sub="입주 확정된 사람에게 코드를 보내세요" />
      <Screen>
        <div className="chip-row" style={{ marginTop: 4 }}>
          {myHouseIds.map((hid) => (
            <button
              key={hid}
              className={`chip${houseId === hid ? " chip--active" : ""}`}
              onClick={() => {
                setHouseId(hid);
                setJustMade(null);
              }}
            >
              {houseById(hid).name}
            </button>
          ))}
        </div>

        <SectionHeader title="새 초대 만들기" />
        <Card>
          <div className="caption" style={{ marginBottom: 6 }}>방 번호 (선택)</div>
          <input
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            placeholder="예: 301호"
            style={{
              width: "100%",
              border: "1px solid var(--line)",
              borderRadius: 12,
              padding: "11px 12px",
              fontSize: 14,
              fontFamily: "var(--font)",
              background: "var(--bg)",
              color: "var(--text)",
              boxSizing: "border-box",
            }}
          />
          <Button variant="primary" block icon="send" style={{ marginTop: 12 }} onClick={create}>
            초대 코드 발급
          </Button>

          {justMade && (
            <div
              style={{
                marginTop: 12,
                padding: 14,
                borderRadius: 14,
                background: "var(--green-soft)",
                color: "var(--green)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 12.5, fontWeight: 800 }}>발급된 코드</div>
              <div className="num" style={{ fontSize: 22, fontWeight: 950, letterSpacing: 2, marginTop: 5 }}>{justMade}</div>
              <div style={{ fontSize: 12, marginTop: 6, opacity: 0.85 }}>이 코드를 입력하면 {house.name} 입주자로 합류합니다.</div>
            </div>
          )}
        </Card>

        <SectionHeader title={`${house.name} 초대 현황`} />
        {houseInvites.length === 0 ? (
          <Card>
            <div className="caption" style={{ textAlign: "center", padding: "14px 0" }}>아직 발급한 초대가 없어요.</div>
          </Card>
        ) : (
          <div className="stack gap-10">
            {houseInvites.map((inv) => (
              <Card key={inv.id}>
                <div className="row-between">
                  <div>
                    <div className="num" style={{ fontWeight: 900, fontSize: 15, letterSpacing: 1 }}>{inv.code}</div>
                    <div className="caption" style={{ marginTop: 3 }}>
                      {inv.room}
                      {inv.sentTo ? ` · ${inv.sentTo}` : ""}
                    </div>
                  </div>
                  <Tag variant={inv.status === "수락됨" ? "green" : inv.status === "만료" ? "gray" : "amber"}>{inv.status}</Tag>
                </div>
              </Card>
            ))}
          </div>
        )}

        <div className="caption" style={{ marginTop: 16, lineHeight: 1.55, display: "flex", gap: 7 }}>
          <Icon name="info" size={14} style={{ flex: "0 0 auto", marginTop: 2 }} />
          초대를 수락하면 그 사람도 이 집의 익명 만족도 응답에 참여하게 됩니다.
        </div>

        <Button variant="neutral" block icon="user" style={{ marginTop: 14 }} onClick={() => navigate("lordApplicants")}>
          신청자 목록 보기
        </Button>
      </Screen>
    </>
  );
}
