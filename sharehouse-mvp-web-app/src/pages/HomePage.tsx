import { useState } from "react";
import { Screen, TopBar } from "../components/Layout";
import { Card, ListRow, SectionHeader, Tag } from "../components/Primitives";
import Avatar from "../components/Avatar";
import Icon from "../components/Icon";
import { useNavigation } from "../hooks/useNavigation";
import { chores, schedules } from "../data/schedules";
import { announcements } from "../data/announcements";
import { myUnpaidTotal, won } from "../data/expenses";
import { house, me, memberById, todayArea, todayCleaner } from "../data/members";

const scheduleColor: Record<string, string> = {
  청소: "#10b981",
  회의: "#8b5cf6",
  수거: "#f59e0b",
  수리: "#06b6d4",
};

export default function HomePage() {
  const { navigate } = useNavigation();
  const [cleanDone, setCleanDone] = useState(false);
  const [checked, setChecked] = useState<Record<string, boolean>>(
    Object.fromEntries(chores.map((chore) => [chore.id, chore.done]))
  );
  const unpaid = myUnpaidTotal(me.id);
  const myChores = chores.filter((chore) => chore.assigneeId === me.id);

  return (
    <>
      <TopBar
        title={house.name}
        sub="셰어하우스 운영 대시보드"
        actionIcon="bell"
        onAction={() => navigate("notifications")}
        showBack={false}
      />
      <Screen>
        <div className="dashboard-layout">
          <div className="dashboard-main">
            <div style={{ padding: "8px 4px 2px" }}>
              <div style={{ color: "var(--text-2)", fontSize: 15, fontWeight: 750 }}>
                좋은 저녁이에요, 유빈님
              </div>
              <div style={{ marginTop: 4, fontSize: 30, fontWeight: 900, lineHeight: 1.08 }}>
                오늘 하우스 운영은 82% 완료됐어요
              </div>
            </div>

            <Card
              pad={false}
              style={{
                marginTop: 16,
                overflow: "hidden",
                background: "linear-gradient(135deg,#7c3aed 0%,#9f67ff 58%,#d7c7ff 100%)",
                color: "#fff",
              }}
            >
              <div style={{ padding: 20 }}>
                <div className="row-between">
                  <Tag variant="violet">오늘의 할 일</Tag>
                  <span style={{ fontSize: 13, fontWeight: 800, opacity: 0.82 }}>{todayArea}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 16 }}>
                  <Avatar member={todayCleaner} size={58} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 21, fontWeight: 900 }}>{todayCleaner.name}</div>
                    <div style={{ marginTop: 4, fontSize: 13, fontWeight: 750, opacity: 0.82 }}>
                      {cleanDone ? "청소 완료로 기록했어요." : "밤 9시 전까지 분리수거를 완료해 주세요."}
                    </div>
                  </div>
                </div>
                <button
                  className={`btn btn--block ${cleanDone ? "btn--neutral" : "btn--primary"}`}
                  style={{ marginTop: 16, boxShadow: "none" }}
                  onClick={() => setCleanDone((value) => !value)}
                >
                  {cleanDone ? (
                    <>
                      <Icon name="check-circle" size={19} /> 완료됨
                    </>
                  ) : (
                    "청소 완료 표시"
                  )}
                </button>
              </div>
            </Card>

            <div className="metric-grid">
              <MetricCard label="미정산 금액" value={won(unpaid)} tone="coral" onClick={() => navigate("expenses")} />
              <MetricCard label="활성 멤버" value={`${house.members}/6명`} tone="violet" onClick={() => navigate("members")} />
            </div>

            <SectionHeader title="공유 정산" more="전체보기" onMore={() => navigate("expenses")} />
            <Card onClick={() => navigate("expenses")}>
              <div className="row-between">
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div className="icon-tile" style={{ background: "var(--coral-soft)", color: "var(--coral)" }}>
                    ₩
                  </div>
                  <div>
                    <div style={{ fontWeight: 850, fontSize: 15 }}>이번 달 정산하기</div>
                    <div className="caption" style={{ marginTop: 3 }}>공과금, 생활용품, 인터넷을 나눠 정산해요</div>
                  </div>
                </div>
                <Icon name="chevron-right" size={20} style={{ color: "var(--primary)" }} />
              </div>
            </Card>

            <SectionHeader title="최근 공지" more="작성 +" onMore={() => navigate("announcementCompose")} />
            <Card pad={false}>
              {announcements.slice(0, 2).map((notice) => (
                <ListRow
                  key={notice.id}
                  onClick={() => navigate("announcementDetail", { id: notice.id })}
                  leading={<div className="icon-tile" style={{ width: 38, height: 38, background: "var(--primary-soft)", color: "var(--primary)" }}>공</div>}
                  title={notice.title}
                  sub={`${notice.author} · ${notice.date}`}
                  trailing={<Tag variant={notice.tag === "긴급" ? "coral" : "violet"}>{notice.tag}</Tag>}
                  chevron
                />
              ))}
            </Card>
          </div>

          <aside className="dashboard-side">
            <SectionHeader title="다가오는 일정" />
            <Card pad={false}>
              {schedules.map((item) => (
                <ListRow
                  key={item.id}
                  leading={<span style={{ width: 9, height: 9, borderRadius: 999, background: scheduleColor[item.kind] }} />}
                  title={item.title}
                  sub={`${item.when}${item.place ? ` · ${item.place}` : ""}`}
                  trailing={<Tag variant="gray">{item.kind}</Tag>}
                />
              ))}
            </Card>

            <SectionHeader title="내 집안일" />
            <Card pad={false}>
              {myChores.map((chore) => {
                const done = checked[chore.id];
                return (
                  <div
                    key={chore.id}
                    className="row pressable"
                    onClick={() => setChecked((prev) => ({ ...prev, [chore.id]: !prev[chore.id] }))}
                  >
                    <span
                      style={{
                        width: 27,
                        height: 27,
                        borderRadius: 999,
                        border: done ? "none" : "2px solid var(--line)",
                        background: done ? "var(--primary)" : "transparent",
                        color: "#fff",
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      {done && <Icon name="check" size={15} strokeWidth={2.8} />}
                    </span>
                    <div className="row__body">
                      <div className="row__title" style={{ color: done ? "var(--text-3)" : "var(--text)", textDecoration: done ? "line-through" : "none" }}>
                        {chore.title}
                      </div>
                      <div className="row__sub">{chore.cycle}</div>
                    </div>
                  </div>
                );
              })}
            </Card>

            <SectionHeader title="익명 건의함" />
            <Card onClick={() => navigate("anonBoard")} style={{ background: "var(--violet-soft, var(--primary-soft))" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div className="icon-tile" style={{ width: 42, height: 42, background: "var(--primary-soft)", color: "var(--primary)" }}>
                  <Icon name="comment" size={20} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 900, fontSize: 14.5 }}>불편한 점 익명으로 남기기</div>
                  <div className="caption" style={{ marginTop: 2 }}>같은 집 입주자들만 볼 수 있어요</div>
                </div>
                <Icon name="chevron-right" size={18} style={{ color: "var(--primary)" }} />
              </div>
            </Card>

            <SectionHeader title="하우스 멤버" more="전체" onMore={() => navigate("members")} />
            <Card>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                {["m1", "m2", "m3", "m4", "m5", "me"].map((id) => {
                  const member = memberById(id);
                  return (
                    <div key={id} style={{ textAlign: "center" }}>
                      <Avatar member={member} size={42} />
                      <div className="caption" style={{ marginTop: 7, fontWeight: 800 }}>
                        {member.name.slice(1)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </aside>
        </div>
      </Screen>
    </>
  );
}

function MetricCard({
  label,
  value,
  tone,
  onClick,
}: {
  label: string;
  value: string;
  tone: "coral" | "violet";
  onClick: () => void;
}) {
  return (
    <Card onClick={onClick}>
      <div className="caption" style={{ fontWeight: 800 }}>{label}</div>
      <div className="num" style={{ marginTop: 6, color: tone === "coral" ? "var(--coral)" : "var(--primary)", fontSize: 21, fontWeight: 900 }}>
        {value}
      </div>
    </Card>
  );
}
