import { Screen, TopBar } from "../components/Layout";
import { Button, Card, Tag } from "../components/Primitives";
import Icon from "../components/Icon";
import { useNavigation } from "../hooks/useNavigation";
import { houseById } from "../data/houses";
import { myApplications } from "../data/myApplications";
import type { ApplicantStatus } from "../types";

const FLOW: ApplicantStatus[] = ["검토 전", "투어 요청", "투어 완료", "입주 확정"];

function variantOf(s: ApplicantStatus): "gray" | "amber" | "violet" | "green" | "coral" {
  if (s === "검토 전") return "gray";
  if (s === "투어 요청") return "amber";
  if (s === "투어 완료") return "violet";
  if (s === "입주 확정") return "green";
  return "coral";
}

export default function MyApplicationsPage() {
  const { navigate } = useNavigation();

  return (
    <>
      <TopBar title="내 신청 현황" sub="투어와 입주 신청 진행 상태" />
      <Screen>
        {myApplications.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <div style={{ width: 60, height: 60, borderRadius: 999, background: "var(--primary-soft)", color: "var(--primary)", display: "grid", placeItems: "center", margin: "0 auto 16px" }}>
              <Icon name="send" size={26} />
            </div>
            <div style={{ fontWeight: 850, fontSize: 15 }}>아직 보낸 신청이 없어요</div>
            <div className="caption" style={{ marginTop: 6, lineHeight: 1.5 }}>
              마음에 드는 집에서 투어나 입주를 신청하면<br />여기서 진행 상태를 확인할 수 있어요.
            </div>
            <Button variant="primary" onClick={() => navigate("listings")} style={{ marginTop: 18 }} icon="search">
              매물 둘러보기
            </Button>
          </div>
        ) : (
          <div className="stack gap-12" style={{ marginTop: 8 }}>
            {myApplications.map((app) => {
              const house = houseById(app.houseId);
              const rejected = app.status === "미적합";
              const stepIndex = FLOW.indexOf(app.status);

              return (
                <Card key={app.id}>
                  <div className="row-between" style={{ alignItems: "flex-start" }}>
                    <div style={{ minWidth: 0 }}>
                      <div
                        className="pressable"
                        onClick={() => navigate("houseDetail", { id: house.id })}
                        style={{ fontWeight: 900, fontSize: 16, cursor: "pointer" }}
                      >
                        {house.name}
                      </div>
                      <div className="caption" style={{ marginTop: 3 }}>
                        {app.kind} 신청 · {app.submittedAt} 보냄
                      </div>
                    </div>
                    <Tag variant={variantOf(app.status)}>{app.status}</Tag>
                  </div>

                  <div className="divider" style={{ margin: "12px 0" }} />

                  <div className="caption" style={{ marginBottom: 10 }}>
                    {app.kind === "투어"
                      ? `희망 일정 · ${app.when}`
                      : `${app.roomNumber ?? "방 미정"} · ${app.when} 입주 희망`}
                  </div>

                  {rejected ? (
                    <div style={{ padding: 11, borderRadius: 12, background: "var(--coral-soft)", color: "var(--coral)", fontSize: 13, fontWeight: 800 }}>
                      이번에는 매칭되지 않았어요. 다른 집도 둘러보세요.
                    </div>
                  ) : (
                    <>
                      {/* 임대인 쪽과 동일한 4단계 트래커 */}
                      <div style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
                        {FLOW.map((step, i) => {
                          const done = stepIndex >= i;
                          const current = app.status === step;
                          return (
                            <div key={step} style={{ display: "flex", alignItems: "center", flex: i < FLOW.length - 1 ? 1 : "none" }}>
                              <div style={{
                                width: 24, height: 24, borderRadius: 999, flexShrink: 0,
                                background: done ? "var(--primary)" : "var(--line)",
                                color: done ? "#fff" : "var(--text)",
                                display: "grid", placeItems: "center",
                                fontSize: 10, fontWeight: 900,
                                boxShadow: current ? "0 0 0 3px var(--primary-soft)" : "none",
                              }}>
                                {done && !current ? <Icon name="check" size={11} /> : i + 1}
                              </div>
                              {i < FLOW.length - 1 && (
                                <div style={{ flex: 1, height: 2, background: stepIndex > i ? "var(--primary)" : "var(--line)", margin: "0 3px" }} />
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        {FLOW.map((step) => (
                          <div key={step} className="caption" style={{ fontSize: 10, textAlign: "center", flex: 1 }}>{step}</div>
                        ))}
                      </div>
                    </>
                  )}
                </Card>
              );
            })}
          </div>
        )}

        <div className="caption" style={{ marginTop: 16, lineHeight: 1.55, display: "flex", gap: 7 }}>
          <Icon name="info" size={14} style={{ flex: "0 0 auto", marginTop: 2 }} />
          진행 상태는 임대인이 검토하면서 갱신됩니다. 투어를 마친 뒤 최종 계약이 진행돼요.
        </div>
      </Screen>
    </>
  );
}
