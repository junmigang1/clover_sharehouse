import { useState } from "react";
import { Screen, TopBar } from "../components/Layout";
import { Card, ListRow, SectionHeader, Tag } from "../components/Primitives";
import Avatar from "../components/Avatar";
import Icon from "../components/Icon";
import { cleaningRotation, house, me, memberById, members } from "../data/members";

export function MembersPage() {
  return (
    <>
      <TopBar title="하우스 멤버" sub={`${house.name} · ${members.length}명`} />
      <Screen>
        <Card pad={false} style={{ marginTop: 8 }}>
          {members.map((member) => (
            <ListRow
              key={member.id}
              leading={<Avatar member={member} size={44} />}
              title={
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {member.name}
                  {member.id === me.id && <Tag variant="violet">나</Tag>}
                </span>
              }
              sub={`${member.room} · ${member.role} · ${member.joined}`}
              trailing={
                member.id !== me.id ? (
                  <button className="btn btn--soft btn--sm">
                    <Icon name="comment" size={15} /> 채팅
                  </button>
                ) : undefined
              }
            />
          ))}
        </Card>
        <div className="caption" style={{ textAlign: "center", marginTop: 16 }}>
          멤버 프로필은 생활 규칙과 거래 신뢰를 확인하는 용도예요.
        </div>
      </Screen>
    </>
  );
}

export function CleaningRotationPage() {
  const today = "목";
  return (
    <>
      <TopBar title="청소 로테이션" sub="이번 주" />
      <Screen>
        <Card style={{ marginTop: 8, background: "linear-gradient(135deg,#ede9fe,#ffffff)" }}>
          <div className="caption" style={{ fontWeight: 850 }}>내 담당</div>
          <div style={{ fontSize: 20, fontWeight: 950, marginTop: 5 }}>목요일 · 분리수거</div>
          <div className="caption" style={{ marginTop: 5 }}>AI가 다음 주 무거운 구역을 공평하게 분배해요.</div>
        </Card>

        <SectionHeader title="주간 일정" />
        <Card pad={false}>
          {cleaningRotation.map((row) => {
            const member = memberById(row.memberId);
            const isToday = row.day === today;
            return (
              <div key={row.day} className="row" style={{ background: isToday ? "var(--primary-soft)" : "transparent" }}>
                <span style={{ width: 38, height: 38, borderRadius: 14, background: isToday ? "var(--primary)" : "var(--surface-2)", color: isToday ? "#fff" : "var(--text-2)", display: "grid", placeItems: "center", fontWeight: 950, fontSize: 13, flex: "0 0 auto" }}>
                  {row.day}
                </span>
                <Avatar member={member} size={34} />
                <div className="row__body">
                  <div className="row__title" style={{ fontSize: 14.5 }}>{member.name}</div>
                  <div className="row__sub">{row.area}</div>
                </div>
                {isToday && <Tag variant="violet">오늘</Tag>}
              </div>
            );
          })}
        </Card>

        <button className="btn btn--block btn--soft" style={{ marginTop: 16 }}>
          <Icon name="sparkle" size={18} fill /> 다음 주 청소표 생성
        </button>
      </Screen>
    </>
  );
}

export function NotificationsPage() {
  const items = [
    { label: "하우스 공지", desc: "고정 공지와 긴급 안내", on: true },
    { label: "정산 리마인더", desc: "마감일 전 알림", on: true },
    { label: "커뮤니티 답글", desc: "투표, 댓글, 멘션", on: true },
    { label: "마켓 채팅", desc: "구매자와 판매자 메시지", on: true },
    { label: "청소 알림", desc: "담당일 오전 9시 알림", on: false },
    { label: "조용한 시간 요약", desc: "다음 날 오전 요약", on: false },
  ];
  const [state, setState] = useState(items.map((item) => item.on));
  return (
    <>
      <TopBar title="알림" />
      <Screen>
        <Card pad={false} style={{ marginTop: 8 }}>
          {items.map((item, index) => (
            <div key={item.label} className="row">
              <div className="row__body">
                <div className="row__title" style={{ fontSize: 15 }}>{item.label}</div>
                <div className="row__sub">{item.desc}</div>
              </div>
              <Toggle on={state[index]} onToggle={() => setState((current) => current.map((value, itemIndex) => (itemIndex === index ? !value : value)))} />
            </div>
          ))}
        </Card>
      </Screen>
    </>
  );
}

export function SettingsPage() {
  const groups: { title: string; rows: string[] }[] = [
    { title: "알림", rows: ["알림 수신 설정", "정산 알림 시간", "채팅 알림 방식"] },
    { title: "하우스", rows: ["하우스 정보", "정산 규칙", "입주자 초대"] },
    { title: "서비스", rows: ["개인정보 처리방침", "이용약관", "앱 버전 v0.1"] },
  ];
  return (
    <>
      <TopBar title="앱 설정" />
      <Screen>
        {groups.map((group) => (
          <div key={group.title}>
            <SectionHeader title={group.title} />
            <Card pad={false}>
              {group.rows.map((row) => (
                <ListRow
                  key={row}
                  title={row}
                  chevron={!row.startsWith("앱 버전")}
                  trailing={row.startsWith("앱 버전") ? <span className="caption">최신</span> : undefined}
                />
              ))}
            </Card>
          </div>
        ))}
      </Screen>
    </>
  );
}

export function ProfilePage() {
  return (
    <>
      <TopBar title="프로필" />
      <Screen>
        <div style={{ textAlign: "center", padding: "20px 0 8px" }}>
          <Avatar member={me} size={94} />
          <div style={{ fontWeight: 950, fontSize: 23, marginTop: 14 }}>{me.name}</div>
          <div className="caption" style={{ marginTop: 5 }}>{me.room} · {house.name}</div>
          <div style={{ marginTop: 11 }}>
            <Tag variant="violet">신뢰 점수 98</Tag>
          </div>
        </div>

        <Card style={{ marginTop: 12 }}>
          <div className="caption" style={{ fontWeight: 850, marginBottom: 8 }}>소개</div>
          <div style={{ fontSize: 15, lineHeight: 1.65 }}>
            조용한 아침, 깨끗한 공용 주방, 빠른 정산을 좋아해요. 새 입주자가 하우스 생활에 적응하도록 돕는 것도 좋아합니다.
          </div>
        </Card>

        <SectionHeader title="활동" />
        <Card pad={false}>
          <ListRow title="커뮤니티 글" sub="작성 4개 · 도움 반응 26개" chevron />
          <ListRow title="마켓 거래" sub="거래 7건 · 이번 달 완료 2건" chevron />
          <ListRow title="정산 기록" sub="12개 중 11개 제때 완료" chevron />
        </Card>
      </Screen>
    </>
  );
}

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      aria-pressed={on}
      style={{ width: 52, height: 31, borderRadius: 999, background: on ? "var(--primary)" : "var(--line)", position: "relative", transition: "background 0.2s", flex: "0 0 auto" }}
    >
      <span style={{ position: "absolute", top: 3, left: on ? 24 : 3, width: 25, height: 25, borderRadius: 999, background: "#fff", boxShadow: "0 2px 5px rgba(23,19,33,0.2)", transition: "left 0.2s" }} />
    </button>
  );
}
