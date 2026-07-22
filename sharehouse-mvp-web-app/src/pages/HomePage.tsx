import { useState } from "react";
import { Screen, TopBar } from "../components/Layout";
import { Card, ListRow, SectionHeader, Tag } from "../components/Primitives";
import Avatar from "../components/Avatar";
import Icon from "../components/Icon";
import { useNavigation } from "../hooks/useNavigation";
import { chores, schedules } from "../data/schedules";
import { announcements } from "../data/announcements";
import { anonPosts } from "../data/anonPosts";
import { myUnpaidTotal, won } from "../data/expenses";
import { house, me, memberById, cleaningRotation } from "../data/members";
import { cleaningDoneState } from "../data/members";

const scheduleColor: Record<string, string> = {
  청소: "#10b981",
  회의: "#8b5cf6",
  수거: "#f59e0b",
  수리: "#06b6d4",
};

export default function HomePage() {
  const { navigate } = useNavigation();
  const [checked, setChecked] = useState<Record<string, boolean>>(
    Object.fromEntries(chores.map((chore) => [chore.id, chore.done]))
  );
  const unpaid = myUnpaidTotal(me.id);
  const myChores = chores.filter((chore) => chore.assigneeId === me.id);

  // 집안일 완료 → 청소 로테이션 공유 상태 동기화
  const toggleChore = (id: string) => {
    setChecked((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      // cleaningDoneState 에도 반영 (CleaningRotationPage 와 공유)
      const chore = chores.find(c => c.id === id);
      if (chore) cleaningDoneState[chore.title] = next[id];
      return next;
    });
  };

  const doneCount = myChores.filter(c => checked[c.id]).length;
  const totalCount = myChores.length;

  return (
    <>
      <TopBar
        title={house.name}
        sub="홈"
        actionIcon="bell"
        onAction={() => navigate("notifications")}
        showBack={false}
      />
      <Screen>
        <div className="dashboard-layout">
          <div className="dashboard-main">

            {/* 인사 + 진행률 */}
            <div style={{ padding: "8px 4px 2px" }}>
              <div style={{ color: "var(--text-2)", fontSize: 15, fontWeight: 750 }}>
                좋은 저녁이에요, 유빈님
              </div>
              <div style={{ marginTop: 4, fontSize: 26, fontWeight: 900, lineHeight: 1.15 }}>
                오늘 집안일 {doneCount}/{totalCount} 완료했어요
              </div>
            </div>

            {/* 1. 최근 공지 — 제일 위로 */}
            <SectionHeader title="최근 공지" more="작성 +" onMore={() => navigate("announcementCompose")} />
            <Card pad={false}>
              {announcements.slice(0, 2).map((notice) => (
                <ListRow
                  key={notice.id}
                  onClick={() => navigate("announcementDetail", { id: notice.id })}
                  leading={<div className="icon-tile" style={{ width: 38, height: 38, background: "var(--primary-soft)", color: "var(--primary)" }}>공</div>}
                  title={notice.title}
                  sub={`${notice.anonymous ? "입주자 (익명)" : notice.author} · ${notice.date}`}
                  trailing={<Tag variant={notice.tag === "긴급" ? "coral" : "violet"}>{notice.tag}</Tag>}
                  chevron
                />
              ))}
            </Card>

            {/* 2. 익명 건의함 미리보기 — 공지 바로 아래 */}
            <SectionHeader title="익명 건의함" more="전체보기" onMore={() => navigate("anonBoard")} />
            <Card pad={false}>
              {anonPosts.slice(0, 2).map((post) => (
                <div
                  key={post.id}
                  className="row pressable"
                  onClick={() => navigate("anonBoard")}
                  style={{ padding: "13px 16px", gap: 12 }}
                >
                  <div style={{ width: 32, height: 32, borderRadius: 999, background: "var(--line)", display: "grid", placeItems: "center", flex: "0 0 auto" }}>
                    <Icon name="user" size={16} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700, lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                      {post.body}
                    </div>
                    <div className="caption" style={{ marginTop: 4, display: "flex", gap: 8 }}>
                      {Object.entries(post.reactions).map(([r, n]) => n > 0 && (
                        <span key={r}>{r} {n}</span>
                      ))}
                    </div>
                  </div>
                  <Icon name="chevron-right" size={18} style={{ color: "var(--primary)", flex: "0 0 auto" }} />
                </div>
              ))}
              <div
                className="pressable"
                onClick={() => navigate("anonBoard")}
                style={{ padding: "12px 16px", borderTop: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 8, color: "var(--primary)", fontWeight: 850, fontSize: 13 }}
              >
                <Icon name="plus" size={15} /> 익명으로 글 남기기
              </div>
            </Card>

            {/* 3. 정산 */}
            <div className="metric-grid">
              <MetricCard label="미정산 금액" value={won(unpaid)} tone="coral" onClick={() => navigate("expenses")} />
              <MetricCard label="활성 멤버" value={`${house.members}/6명`} tone="violet" onClick={() => navigate("members")} />
            </div>

            <SectionHeader title="공유 정산" more="전체보기" onMore={() => navigate("expenses")} />
            <Card onClick={() => navigate("expenses")}>
              <div className="row-between">
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div className="icon-tile" style={{ background: "var(--coral-soft)", color: "var(--coral)" }}>₩</div>
                  <div>
                    <div style={{ fontWeight: 850, fontSize: 15 }}>이번 달 정산하기</div>
                    <div className="caption" style={{ marginTop: 3 }}>공과금, 생활용품, 인터넷을 나눠 정산해요</div>
                  </div>
                </div>
                <Icon name="chevron-right" size={20} style={{ color: "var(--primary)" }} />
              </div>
            </Card>
          </div>

          <aside className="dashboard-side">

            {/* 4. 다가오는 일정 */}
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

            {/* 5. 내 집안일 — 완료 체크 → 청소 로테이션 연동 */}
            <SectionHeader title="내 집안일" more={`${doneCount}/${totalCount}`} onMore={() => navigate("cleaningRotation")} />
            <Card pad={false}>
              {myChores.map((chore) => {
                const done = checked[chore.id];
                return (
                  <div
                    key={chore.id}
                    className="row pressable"
                    onClick={() => toggleChore(chore.id)}
                  >
                    <span
                      style={{
                        width: 27, height: 27, borderRadius: 999,
                        border: done ? "none" : "2px solid var(--line)",
                        background: done ? "var(--primary)" : "transparent",
                        color: "#fff",
                        display: "grid", placeItems: "center",
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
              <div
                className="pressable"
                onClick={() => navigate("cleaningRotation")}
                style={{ padding: "11px 16px", borderTop: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: "var(--primary)", fontWeight: 850, fontSize: 13 }}
              >
                <Icon name="calendar" size={14} /> 청소 로테이션 전체 보기
              </div>
            </Card>

            {/* 6. 하우스 멤버 */}
            <SectionHeader title="하우스 멤버" more="전체" onMore={() => navigate("members")} />
            <Card>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                {["m1", "m2", "m3", "m4", "m5", "me"].map((id) => {
                  const member = memberById(id);
                  return (
                    <div
                      key={id}
                      style={{ textAlign: "center", cursor: id !== "me" ? "pointer" : "default" }}
                      onClick={() => id !== "me" && navigate("memberChat", { id })}
                    >
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

function MetricCard({ label, value, tone, onClick }: { label: string; value: string; tone: "coral" | "violet"; onClick: () => void; }) {
  return (
    <Card onClick={onClick}>
      <div className="caption" style={{ fontWeight: 800 }}>{label}</div>
      <div className="num" style={{ marginTop: 6, color: tone === "coral" ? "var(--coral)" : "var(--primary)", fontSize: 21, fontWeight: 900 }}>
        {value}
      </div>
    </Card>
  );
}
