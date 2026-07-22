import { Screen, TopBar } from "../components/Layout";
import { Card, SectionHeader, Tag } from "../components/Primitives";
import Icon from "../components/Icon";
import { Bar } from "../components/HouseBits";
import { houseById } from "../data/houses";
import { myHouseIds } from "../data/landlord";
import { tenureLabel } from "../data/lifestyle";

export default function LordReviewsPage() {
  const myHouses = myHouseIds.map(houseById);

  return (
    <>
      <TopBar title="만족도 리포트" sub="입주자 익명 집계" showBack={false} />
      <Screen>
        {myHouses.map((house) => {
          const latest = house.reviews[0];
          const prev = house.reviews[1];
          const delta = latest && prev ? latest.satisfaction - prev.satisfaction : undefined;

          if (!latest) {
            return (
              <div key={house.id}>
                <SectionHeader title={house.name} />
                <Card>
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <Icon name="info" size={17} style={{ color: "var(--amber)", flex: "0 0 auto", marginTop: 1 }} />
                    <div>
                      <div style={{ fontWeight: 850, fontSize: 14 }}>아직 모인 응답이 없어요</div>
                      <div className="caption" style={{ marginTop: 4, lineHeight: 1.55 }}>
                        입주자가 반기 익명 응답을 남기면 집계가 표시됩니다.
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            );
          }

          return (
            <div key={house.id}>
              <SectionHeader title={house.name} />
              <Card>
                <div className="row-between">
                  <div>
                    <div style={{ fontWeight: 900, fontSize: 15 }}>종합 만족도</div>
                    <div className="caption" style={{ marginTop: 3 }}>
                      {latest.period} · 익명 {latest.responses}명 · 평균 거주 {tenureLabel(house.avgTenureMonths)}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 30, fontWeight: 950, color: "var(--primary)" }}>
                      {latest.satisfaction}
                      <span style={{ fontSize: 15 }}>%</span>
                    </div>
                    {delta !== undefined && (
                      <div style={{ fontSize: 12, fontWeight: 850, color: delta >= 0 ? "var(--green)" : "var(--coral)" }}>
                        {delta >= 0 ? "▲" : "▼"} {Math.abs(delta)}p
                      </div>
                    )}
                  </div>
                </div>

                <div className="stack gap-10" style={{ marginTop: 14 }}>
                  {latest.scores.map((s) => {
                    const before = prev?.scores.find((x) => x.label === s.label)?.value;
                    const diff = before !== undefined ? s.value - before : undefined;
                    return (
                      <div key={s.label}>
                        <div className="row-between" style={{ marginBottom: 5 }}>
                          <span style={{ fontSize: 13, fontWeight: 800 }}>{s.label}</span>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
                            {diff !== undefined && diff !== 0 && (
                              <span className="caption" style={{ color: diff > 0 ? "var(--green)" : "var(--coral)", fontWeight: 800 }}>
                                {diff > 0 ? "+" : ""}
                                {diff}
                              </span>
                            )}
                            <span className="num" style={{ fontSize: 13, fontWeight: 850 }}>{s.value}</span>
                          </span>
                        </div>
                        <Bar
                          value={s.value}
                          color={s.value >= 80 ? "var(--green)" : s.value >= 65 ? "var(--amber)" : "var(--coral)"}
                        />
                      </div>
                    );
                  })}
                </div>

                {latest.quote && (
                  <div style={{ marginTop: 14, padding: 12, borderRadius: 12, background: "var(--bg)", fontSize: 13.5, lineHeight: 1.55 }}>
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
                          <span style={{ fontSize: 12.5 }}>{r.period}</span>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, width: "55%" }}>
                            <div style={{ flex: 1 }}><Bar value={r.satisfaction} /></div>
                            <span className="num" style={{ fontSize: 12.5, fontWeight: 800, width: 34, textAlign: "right" }}>{r.satisfaction}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {(() => {
                  const weak = latest.scores.filter((s) => s.value < 75);
                  if (weak.length === 0) return null;
                  return (
                    <div style={{ marginTop: 14, padding: 12, borderRadius: 12, background: "var(--amber-soft)" }}>
                      <div style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
                        <Icon name="info" size={16} style={{ color: "var(--amber)", flex: "0 0 auto", marginTop: 1 }} />
                        <div>
                          <div style={{ fontWeight: 850, fontSize: 13.5 }}>낮은 항목</div>
                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 7 }}>
                            {weak.map((s) => (
                              <Tag key={s.label} variant="coral">{s.label} {s.value}</Tag>
                            ))}
                          </div>
                          <div style={{ fontSize: 12.5, marginTop: 8, lineHeight: 1.5 }}>
                            새 입주자를 뽑을 때 이 축의 궁합을 더 엄격하게 보면 개선에 도움이 됩니다.
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </Card>
            </div>
          );
        })}

        <div className="caption" style={{ marginTop: 18, lineHeight: 1.55, display: "flex", gap: 7 }}>
          <Icon name="info" size={14} style={{ flex: "0 0 auto", marginTop: 2 }} />
          응답은 반기마다 익명으로 모읍니다. 임대인은 개별 응답자를 알 수 없고 집계만 볼 수 있어요.
        </div>
      </Screen>
    </>
  );
}
