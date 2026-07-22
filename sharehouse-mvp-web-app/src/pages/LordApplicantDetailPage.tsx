import { useState } from "react";
import { Screen, TopBar } from "../components/Layout";
import { Button, Card, SectionHeader, Tag } from "../components/Primitives";
import Icon from "../components/Icon";
import { AxisTrack, FitBadge, Bar } from "../components/HouseBits";
import { useNavigation } from "../hooks/useNavigation";
import { houseById } from "../data/houses";
import { applicantById } from "../data/landlord";
import { LIFESTYLE_AXES, computeApplicantFit, axisMatch } from "../data/lifestyle";
import type { ApplicantStatus } from "../types";

const STATUS_FLOW: ApplicantStatus[] = ["검토 전", "투어 요청", "투어 완료", "입주 확정"];

function statusVariant(s: ApplicantStatus): "amber" | "violet" | "green" | "coral" | "gray" {
  if (s === "검토 전") return "gray";
  if (s === "투어 요청") return "amber";
  if (s === "투어 완료") return "violet";
  if (s === "입주 확정") return "green";
  return "coral";
}

export default function LordApplicantDetailPage({ id }: { id: string }) {
  const { navigate, goBack } = useNavigation();
  const applicant = applicantById(id);
  const house = houseById(applicant.houseId);
  const fit = computeApplicantFit(house, applicant.axes, !applicant.noSmoke);
  const [status, setStatus] = useState<ApplicantStatus>(applicant.status);

  const weakest = [...LIFESTYLE_AXES]
    .map((axis) => ({ axis, match: axisMatch(house.lifestyle[axis.key], applicant.axes[axis.key]) }))
    .sort((a, b) => a.match - b.match)[0];

  const advance = () => {
    const idx = STATUS_FLOW.indexOf(status);
    if (idx < STATUS_FLOW.length - 1) {
      const next = STATUS_FLOW[idx + 1];
      setStatus(next);
      // 입주 확정 시 초대 탭으로 이동
      if (next === "입주 확정") {
        setTimeout(() => navigate("lordInvite", { id: house.id }), 600);
      }
    }
  };

  const reject = () => setStatus("미적합");

  const nextLabel: Record<ApplicantStatus, string> = {
    "검토 전": "투어 요청하기",
    "투어 요청": "투어 완료로 표시",
    "투어 완료": "입주 확정 → 초대 코드 발급",
    "입주 확정": "",
    "미적합": "",
  };

  return (
    <>
      <TopBar title={applicant.name} sub={`${house.name} · ${applicant.moveIn} 입주 희망`} />
      <Screen>
        {/* 진행 상태 트래커 */}
        <div style={{ display: "flex", alignItems: "center", gap: 0, marginTop: 8, marginBottom: 4 }}>
          {STATUS_FLOW.map((s, i) => {
            const done = STATUS_FLOW.indexOf(status) >= i;
            const current = status === s;
            return (
              <div key={s} style={{ display: "flex", alignItems: "center", flex: i < STATUS_FLOW.length - 1 ? 1 : "none" }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 999, flexShrink: 0,
                  background: done ? "var(--primary)" : "var(--line)",
                  color: done ? "#fff" : "var(--text)",
                  display: "grid", placeItems: "center",
                  fontSize: 11, fontWeight: 900,
                  boxShadow: current ? "0 0 0 3px var(--primary-soft)" : "none",
                }}>
                  {done && !current ? <Icon name="check" size={13} /> : i + 1}
                </div>
                {i < STATUS_FLOW.length - 1 && (
                  <div style={{ flex: 1, height: 2, background: STATUS_FLOW.indexOf(status) > i ? "var(--primary)" : "var(--line)", margin: "0 4px" }} />
                )}
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {STATUS_FLOW.map((s) => (
            <div key={s} className="caption" style={{ fontSize: 10, textAlign: "center", flex: 1 }}>{s}</div>
          ))}
        </div>

        {/* 신청자 기본 정보 */}
        <Card style={{ marginTop: 14 }}>
          <div className="row-between" style={{ alignItems: "flex-start" }}>
            <div>
              <div style={{ fontWeight: 900, fontSize: 17 }}>{applicant.name}</div>
              <div className="caption" style={{ marginTop: 4 }}>{applicant.ageGroup} · {applicant.job}</div>
            </div>
            <Tag variant={statusVariant(status)}>{status}</Tag>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 12 }}>
            <FitBadge pct={fit} />
            <Tag variant="gray">{applicant.noSmoke ? "비흡연" : "흡연"}</Tag>
          </div>
          <p style={{ marginTop: 12, fontSize: 14, lineHeight: 1.6 }}>{applicant.intro}</p>
        </Card>

        {/* 이전 거주 이력 */}
        <SectionHeader title="이전 셰어하우스 이력" />
        <Card>
          {applicant.prevSatisfaction !== undefined ? (
            <>
              <div className="row-between">
                <div>
                  <div style={{ fontWeight: 900, fontSize: 15 }}>함께 산 사람들의 익명 만족도</div>
                  <div className="caption" style={{ marginTop: 3 }}>{applicant.prevMonths}개월 거주</div>
                </div>
                <div style={{
                  fontSize: 28, fontWeight: 950,
                  color: applicant.prevSatisfaction >= 80 ? "var(--green)" : applicant.prevSatisfaction >= 65 ? "var(--amber)" : "var(--coral)",
                }}>
                  {applicant.prevSatisfaction}<span style={{ fontSize: 14 }}>%</span>
                </div>
              </div>
              <div style={{ marginTop: 12 }}>
                <Bar value={applicant.prevSatisfaction}
                  color={applicant.prevSatisfaction >= 80 ? "var(--green)" : applicant.prevSatisfaction >= 65 ? "var(--amber)" : "var(--coral)"} />
              </div>
              <div className="caption" style={{ marginTop: 12, lineHeight: 1.55 }}>
                이 사람이 살던 집 전체의 기간 만족도입니다. 집 투어와 함께 참고 지표로 사용하세요.
              </div>
            </>
          ) : (
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <Icon name="info" size={17} style={{ color: "var(--amber)", flex: "0 0 auto", marginTop: 1 }} />
              <div>
                <div style={{ fontWeight: 850, fontSize: 14 }}>셰어하우스가 처음이에요</div>
                <div className="caption" style={{ marginTop: 4, lineHeight: 1.55 }}>
                  이력이 없으니 투어 때 생활습관 얘기를 꼭 나눠보세요.
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* 생활습관 궁합 */}
        <SectionHeader title="우리 집과의 생활습관 궁합" />
        <Card>
          <div className="stack gap-14">
            {LIFESTYLE_AXES.map((axis) => (
              <AxisTrack
                key={axis.key}
                label={axis.label}
                left={axis.left}
                right={axis.right}
                houseVal={house.lifestyle[axis.key]}
                myVal={applicant.axes[axis.key]}
                matchPct={axisMatch(house.lifestyle[axis.key], applicant.axes[axis.key])}
              />
            ))}
          </div>
          <div className="caption" style={{ marginTop: 12, display: "flex", gap: 14 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Dot color="var(--primary)" /> 우리 집</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Dot color="#a29db3" ring /> 신청자</span>
          </div>
        </Card>

        {/* 투어 포인트 */}
        {weakest.match < 75 && (
          <Card style={{ marginTop: 12, background: "var(--amber-soft)" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <Icon name="info" size={17} style={{ color: "var(--amber)", flex: "0 0 auto", marginTop: 1 }} />
              <div>
                <div style={{ fontWeight: 850, fontSize: 14 }}>투어 때 확인할 포인트 · {weakest.axis.label}</div>
                <div style={{ fontSize: 13, marginTop: 5, lineHeight: 1.55 }}>
                  이 축이 {weakest.match}%로 가장 차이 납니다. "{weakest.axis.left} ↔ {weakest.axis.right}"에 대해 직접 이야기해보면 입주 후 마찰을 미리 줄일 수 있어요.
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* 액션 버튼 */}
        {status !== "입주 확정" && status !== "미적합" && (
          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            <Button variant="neutral" onClick={reject} style={{ flex: 1 }}>
              미적합
            </Button>
            <Button variant="primary" onClick={advance} style={{ flex: 2 }} icon={status === "투어 완료" ? "check" : "send"}>
              {nextLabel[status]}
            </Button>
          </div>
        )}
        {status === "입주 확정" && (
          <Card style={{ marginTop: 18, background: "var(--green-soft)" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <Icon name="check-circle" size={20} style={{ color: "var(--green)" }} />
              <div>
                <div style={{ fontWeight: 850, fontSize: 14 }}>입주 확정 — 초대 코드 발급으로 이동합니다</div>
                <div className="caption" style={{ marginTop: 3 }}>코드를 전달하면 앱 입주가 완료됩니다.</div>
              </div>
            </div>
          </Card>
        )}
        {status === "미적합" && (
          <Card style={{ marginTop: 18 }}>
            <div className="caption" style={{ textAlign: "center", padding: "10px 0" }}>미적합 처리된 신청입니다.</div>
          </Card>
        )}
      </Screen>
    </>
  );
}

function Dot({ color, ring }: { color: string; ring?: boolean }) {
  return (
    <span style={{
      width: 12, height: 12, borderRadius: 999,
      background: ring ? "#fff" : color,
      border: ring ? `3px solid ${color}` : "none",
      boxSizing: "border-box", display: "inline-block",
    }} />
  );
}
