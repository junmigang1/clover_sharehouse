import { Screen, TopBar } from "../components/Layout";
import { Button, Card, SectionHeader, Tag } from "../components/Primitives";
import Icon from "../components/Icon";
import { HeartButton, FitBadge, Bar, AxisTrack } from "../components/HouseBits";
import { useNavigation } from "../hooks/useNavigation";
import { useSeeker } from "../hooks/useSeeker";
import { houseById, commuteTo, openRoomCount } from "../data/houses";
import { LIFESTYLE_AXES, computeFit, axisMatch, tenureLabel } from "../data/lifestyle";
import { won } from "../data/expenses";

export default function HouseDetailPage({ id }: { id: string }) {
  const house = houseById(id);
  const { navigate } = useNavigation();
  const { my, isLiked, toggleLike } = useSeeker();
  const fit = computeFit(house, my);
  const fitIsDefault = !my.set;
  const latest = house.reviews[0]; // 신규 매물은 후기가 없을 수 있다

  return (
    <>
      <TopBar title={house.name} sub={`${house.station} 도보 ${house.stationMins}분`} />
      <Screen>
        <div style={{ height: 150, borderRadius: 22, background: house.bg, position: "relative", display: "flex", alignItems: "flex-end", padding: 14, marginTop: 8 }}>
          <div style={{ position: "absolute", top: 12, right: 12 }}>
            <HeartButton active={isLiked(house.id)} onToggle={() => toggleLike(house.id)} size={22} />
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <FitBadge pct={fit} isDefault={fitIsDefault} />
            {openRoomCount(house) > 0 && <Tag variant="gray">빈방 {openRoomCount(house)}</Tag>}
          </div>
        </div>

        <p style={{ margin: "14px 2px 0", fontSize: 14.5, lineHeight: 1.6, color: "var(--text)" }}>{house.desc}</p>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", margin: "12px 0 4px" }}>
          {house.vibeTags.map((t) => (
            <Tag key={t} variant="violet">{t}</Tag>
          ))}
          <Tag variant="gray">{house.smoking}</Tag>
          <Tag variant="gray">반려동물 {house.pet}</Tag>
        </div>

        {/* 생활습관 궁합 */}
        <SectionHeader title="생활습관 궁합" />
        <Card>
          {!my.set && (
            <div
              className="pressable"
              onClick={() => navigate("lifestyleSetup")}
              role="button"
              style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, padding: 10, borderRadius: 12, background: "var(--primary-soft)", color: "var(--primary-strong)", fontSize: 13, fontWeight: 800 }}
            >
              <Icon name="sparkle" size={16} fill /> 내 생활습관을 설정하면 내 성향을 넣으면 지금 예상 점수가 더 정확해져요
            </div>
          )}
          <div className="stack gap-14">
            {LIFESTYLE_AXES.map((axis) => (
              <AxisTrack
                key={axis.key}
                label={axis.label}
                left={axis.left}
                right={axis.right}
                houseVal={house.lifestyle[axis.key]}
                myVal={my.set ? my.axes[axis.key] : undefined}
                matchPct={my.set ? axisMatch(house.lifestyle[axis.key], my.axes[axis.key]) : undefined}
              />
            ))}
          </div>
          {my.set && (
            <div className="caption" style={{ marginTop: 12, display: "flex", gap: 14 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Dot color="var(--primary)" /> 이 집</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Dot color="#a29db3" ring /> 내 성향</span>
            </div>
          )}
        </Card>

        {/* 구성 */}
        <SectionHeader title="누가 사나요" />
        <Card>
          <div className="metric-grid">
            <Metric label="입주자" value={`${house.memberCount}명`} />
            <Metric label="평균 거주" value={tenureLabel(house.avgTenureMonths)} />
            <Metric label="성별" value={house.genderPolicy} />
            <Metric label="연령대" value={house.ageRange} />
          </div>
          <div className="divider" style={{ margin: "12px 0" }} />
          <div className="caption">주요 구성 · {house.jobMix}</div>
        </Card>

        {/* 익명 집계 후기 */}
        <SectionHeader title="입주자 익명 만족도" />
        {!latest ? (
          <Card>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <Icon name="info" size={17} style={{ color: "var(--amber)", flex: "0 0 auto", marginTop: 1 }} />
              <div>
                <div style={{ fontWeight: 850, fontSize: 14 }}>아직 모인 후기가 없어요</div>
                <div className="caption" style={{ marginTop: 4, lineHeight: 1.55 }}>
                  입주자들이 반기마다 익명으로 남기는 만족도가 쌓이면 여기에 표시됩니다. 그전까지는 생활습관 궁합과 직접 투어로 확인해 주세요.
                </div>
              </div>
            </div>
          </Card>
        ) : (
        <Card>
          <div className="row-between">
            <div>
              <div style={{ fontWeight: 900, fontSize: 15 }}>종합 만족도</div>
              <div className="caption" style={{ marginTop: 2 }}>{latest.period} · 익명 {latest.responses}명 응답</div>
            </div>
            <div style={{ fontSize: 30, fontWeight: 950, color: "var(--primary)" }}>{latest.satisfaction}<span style={{ fontSize: 15 }}>%</span></div>
          </div>

          <div className="stack gap-10" style={{ marginTop: 14 }}>
            {latest.scores.map((s) => (
              <div key={s.label}>
                <div className="row-between" style={{ marginBottom: 5 }}>
                  <span style={{ fontSize: 13, fontWeight: 800 }}>{s.label}</span>
                  <span className="num" style={{ fontSize: 13, fontWeight: 850 }}>{s.value}</span>
                </div>
                <Bar value={s.value} color={s.value >= 80 ? "var(--green)" : s.value >= 65 ? "var(--amber)" : "var(--coral)"} />
              </div>
            ))}
          </div>

          {latest.quote && (
            <div style={{ marginTop: 14, padding: 12, borderRadius: 12, background: "var(--bg)", fontSize: 13.5, lineHeight: 1.55, color: "var(--text)" }}>
              <Icon name="comment" size={14} style={{ color: "var(--primary)", marginRight: 6 }} />
              {latest.quote}
            </div>
          )}

          {house.reviews.length > 1 && (
            <>
              <div className="divider" style={{ margin: "14px 0 10px" }} />
              <div className="caption" style={{ marginBottom: 8 }}>기간별 추이</div>
              <div className="stack gap-8">
                {house.reviews.map((r) => (
                  <div key={r.period} className="row-between">
                    <span style={{ fontSize: 12.5, color: "var(--text)" }}>{r.period}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, width: "55%" }}>
                      <div style={{ flex: 1 }}><Bar value={r.satisfaction} /></div>
                      <span className="num" style={{ fontSize: 12.5, fontWeight: 800, width: 34, textAlign: "right" }}>{r.satisfaction}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          <div className="caption" style={{ marginTop: 12, lineHeight: 1.5 }}>
            개인을 지목한 실시간 평가가 아니라, 기간마다 익명으로 모은 집계입니다.
          </div>
        </Card>
        )}

        {/* 비용 · 통근 */}
        <SectionHeader title="비용과 통근" />
        <Card>
          <div className="metric-grid">
            <Metric label="월 예상" value={won(house.monthlyCost)} />
            <Metric label="보증금" value={`${house.deposit}만원`} />
            <Metric label={`${my.commuteHub}까지`} value={`${commuteTo(house, my.commuteHub)}분`} />
            <Metric label="빈방" value={`${openRoomCount(house)}개`} />
          </div>
        </Card>

        {/* 방 목록 */}
        <SectionHeader title="빈방 정보" />
        <div className="stack gap-10">
          {house.rooms.filter(r => r.available).length === 0 ? (
            <Card><div className="caption" style={{ textAlign:"center", padding:"12px 0" }}>현재 빈방이 없습니다.</div></Card>
          ) : (
            house.rooms.filter(r => r.available).map(room => (
              <Card key={room.id}>
                <div className="row-between" style={{ marginBottom: 8 }}>
                  <div>
                    <span style={{ fontWeight: 900, fontSize: 16 }}>{room.number}</span>
                    <span className="caption" style={{ marginLeft: 8 }}>{room.type} · {room.floor}층 · {room.sizeSqm}m²</span>
                  </div>
                  <span className="num" style={{ fontWeight: 950, fontSize: 16, color: "var(--primary)" }}>{won(room.monthlyCost)}<span className="caption">/월</span></span>
                </div>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  <Tag variant={room.privateBath ? "green" : "gray"}>{room.privateBath ? "개인화장실" : "공용화장실"}</Tag>
                  <Tag variant={room.privateAC ? "green" : "gray"}>{room.privateAC ? "개인에어컨" : "공용에어컨"}</Tag>
                </div>
                {room.desc && <p className="caption" style={{ marginTop: 8, lineHeight: 1.5 }}>{room.desc}</p>}
              </Card>
            ))
          )}
        </div>

        {/* 입주 중인 방 */}
        {house.rooms.filter(r => !r.available).length > 0 && (
          <>
            <div className="caption" style={{ margin:"12px 4px 8px", fontWeight:850 }}>입주 중인 방</div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {house.rooms.filter(r => !r.available).map(room => (
                <div key={room.id} style={{ padding:"6px 12px", borderRadius:10, background:"var(--line)", fontSize:12.5, fontWeight:800 }}>
                  {room.number} <span className="caption">{room.type}</span>
                </div>
              ))}
            </div>
          </>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
          <Button variant="neutral" onClick={() => toggleLike(house.id)} style={{ flex: 1 }} icon={isLiked(house.id) ? "heart-fill" : "heart"}>
            {isLiked(house.id) ? "관심 등록됨" : "관심"}
          </Button>
          <Button variant="primary" onClick={() => navigate("compareHouses")} style={{ flex: 1 }} icon="sparkle">
            하우스 비교
          </Button>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
          <Button variant="soft" onClick={() => navigate("tourRequest", { id: house.id })} style={{ flex: 1 }} icon="calendar">
            투어 신청
          </Button>
          <Button variant="primary" onClick={() => navigate("moveInRequest", { id: house.id })} style={{ flex: 1 }} icon="send">
            입주 신청
          </Button>
        </div>
      </Screen>
    </>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="caption">{label}</div>
      <div style={{ fontWeight: 900, fontSize: 15, marginTop: 3 }}>{value}</div>
    </div>
  );
}

function Dot({ color, ring }: { color: string; ring?: boolean }) {
  return <span style={{ width: 12, height: 12, borderRadius: 999, background: ring ? "#fff" : color, border: ring ? `3px solid ${color}` : "none", boxSizing: "border-box", display: "inline-block" }} />;
}
