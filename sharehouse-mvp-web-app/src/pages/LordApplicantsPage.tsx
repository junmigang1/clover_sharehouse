import { useState } from "react";
import { Screen, TopBar } from "../components/Layout";
import { Card, Tag } from "../components/Primitives";
import Icon from "../components/Icon";
import { FitBadge } from "../components/HouseBits";
import { useNavigation } from "../hooks/useNavigation";
import { houseById } from "../data/houses";
import { applicants, myHouseIds } from "../data/landlord";
import { computeApplicantFit } from "../data/lifestyle";
import type { ApplicantStatus } from "../types";

const FILTERS: (ApplicantStatus | "전체")[] = ["전체", "검토 전", "투어 요청", "투어 완료", "입주 확정", "미적합"];

export default function LordApplicantsPage() {
  const { navigate } = useNavigation();
  const [filter, setFilter] = useState<ApplicantStatus | "전체">("검토 전");
  const [houseFilter, setHouseFilter] = useState<string>("all");

  const list = applicants
    .filter((a) => myHouseIds.includes(a.houseId))
    .filter((a) => (filter === "전체" ? true : a.status === filter))
    .filter((a) => (houseFilter === "all" ? true : a.houseId === houseFilter))
    .sort(
      (a, b) =>
        computeApplicantFit(houseById(b.houseId), b.axes, !b.noSmoke) -
        computeApplicantFit(houseById(a.houseId), a.axes, !a.noSmoke)
    );

  return (
    <>
      <TopBar title="입주 신청" sub="생활습관 궁합순" showBack={false} />
      <Screen>
        <div className="chip-row">
          {FILTERS.map((f) => (
            <button key={f} className={`chip${filter === f ? " chip--active" : ""}`} onClick={() => setFilter(f)}>
              {f}
            </button>
          ))}
        </div>
        <div className="chip-row" style={{ marginTop: 8 }}>
          <button className={`chip${houseFilter === "all" ? " chip--active" : ""}`} onClick={() => setHouseFilter("all")}>
            전체 하우스
          </button>
          {myHouseIds.map((id) => (
            <button key={id} className={`chip${houseFilter === id ? " chip--active" : ""}`} onClick={() => setHouseFilter(id)}>
              {houseById(id).name}
            </button>
          ))}
        </div>

        {list.length === 0 ? (
          <Card style={{ marginTop: 18 }}>
            <div className="caption" style={{ textAlign: "center", padding: "16px 0" }}>
              해당하는 신청이 없어요.
            </div>
          </Card>
        ) : (
          <div className="stack gap-12" style={{ marginTop: 16 }}>
            {list.map((a) => {
              const house = houseById(a.houseId);
              const fit = computeApplicantFit(house, a.axes, !a.noSmoke);
              return (
                <Card key={a.id} onClick={() => navigate("lordApplicantDetail", { id: a.id })}>
                  <div className="row-between" style={{ alignItems: "flex-start" }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 900, fontSize: 16 }}>
                        {a.name}
                        <span className="caption" style={{ fontWeight: 700 }}> · {a.ageGroup} · {a.job}</span>
                      </div>
                      <div className="caption" style={{ marginTop: 4 }}>
                        {house.name} · {a.moveIn} 입주 희망
                      </div>
                    </div>
                    <StatusTag status={a.status} />
                  </div>

                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 12 }}>
                    <FitBadge pct={fit} />
                    {a.prevSatisfaction !== undefined ? (
                      <Tag variant={a.prevSatisfaction >= 80 ? "green" : a.prevSatisfaction >= 65 ? "amber" : "coral"}>
                        이전 집 {a.prevSatisfaction}% · {a.prevMonths}개월
                      </Tag>
                    ) : (
                      <Tag variant="gray">셰어하우스 처음</Tag>
                    )}
                    {!a.noSmoke && <Tag variant="gray">흡연</Tag>}
                  </div>

                  <p className="caption clamp-2" style={{ marginTop: 10, lineHeight: 1.5 }}>{a.intro}</p>
                </Card>
              );
            })}
          </div>
        )}

        <div className="caption" style={{ marginTop: 16, lineHeight: 1.55, display: "flex", gap: 7 }}>
          <Icon name="info" size={14} style={{ flex: "0 0 auto", marginTop: 2 }} />
          이전 집 점수는 그 집 입주자들이 남긴 익명 집계입니다. 개인을 지목한 평가가 아니라 함께 살았던 기간의 종합 만족도예요.
        </div>
      </Screen>
    </>
  );
}

export function StatusTag({ status }: { status: ApplicantStatus }) {
  const variant =
    status === "입주 확정" ? "green" :
    status === "미적합" ? "coral" :
    status === "투어 완료" ? "violet" :
    status === "투어 요청" ? "amber" : "gray";
  return <Tag variant={variant}>{status}</Tag>;
}
