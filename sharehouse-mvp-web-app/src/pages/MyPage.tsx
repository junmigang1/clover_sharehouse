import { Screen, TopBar } from "../components/Layout";
import { Card, ListRow, SectionHeader, Tag } from "../components/Primitives";
import Avatar from "../components/Avatar";
import Icon from "../components/Icon";
import { useNavigation, type RouteKey } from "../hooks/useNavigation";
import { house, me } from "../data/members";

const MENU: { key: RouteKey; icon: Parameters<typeof Icon>[0]["name"]; label: string; sub: string }[] = [
  { key: "members", icon: "user", label: "하우스 멤버", sub: "현재 함께 거주 중인 6명" },
  { key: "cleaningRotation", icon: "calendar", label: "청소 로테이션", sub: "이번 주 담당 구역 확인" },
  { key: "notifications", icon: "bell", label: "알림", sub: "정산, 채팅, 집안일 알림" },
  { key: "settings", icon: "settings", label: "앱 설정", sub: "알림과 서비스 정보" },
];

export default function MyPage() {
  const { navigate } = useNavigation();
  return (
    <>
      <TopBar title="MY" showBack={false} />
      <Screen>
        <Card onClick={() => navigate("profile")} style={{ marginTop: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Avatar member={me} size={62} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 950, fontSize: 19 }}>{me.name}</div>
              <div className="caption" style={{ marginTop: 4 }}>{me.room} · {house.name}</div>
            </div>
            <Icon name="chevron-right" size={20} style={{ color: "var(--text-3)" }} />
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 15 }}>
            <StatBox label="거주 기간" value={me.joined ?? "8개월"} />
            <StatBox label="신뢰 점수" value="98" />
            <StatBox label="거래" value="7건" />
          </div>
        </Card>

        <SectionHeader title="하우스 정보" />
        <Card pad={false}>
          <div className="row">
            <div className="icon-tile" style={{ background: "var(--primary-soft)", color: "var(--primary)" }}>집</div>
            <div className="row__body">
              <div className="row__title">{house.name}</div>
              <div className="row__sub">{house.address}</div>
            </div>
            <Tag variant="green">거주중</Tag>
          </div>
          <div className="row">
            <div className="row__body">
              <div className="row__sub">Wi-Fi</div>
              <div className="row__title" style={{ fontSize: 14 }}>{house.wifi}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div className="row__sub">비밀번호</div>
              <div className="row__title num" style={{ fontSize: 14 }}>{house.wifiPw}</div>
            </div>
          </div>
        </Card>

        <SectionHeader title="확인하기" />
        <Card pad={false}>
          {MENU.map((item) => (
            <ListRow
              key={item.key}
              onClick={() => navigate(item.key)}
              leading={<span className="icon-tile" style={{ width: 40, height: 40, background: "var(--surface-2)", color: "var(--primary)" }}><Icon name={item.icon} size={20} /></span>}
              title={item.label}
              sub={item.sub}
              chevron
            />
          ))}
        </Card>

        <div className="caption" style={{ textAlign: "center", marginTop: 18 }}>
          내 정보는 하우스 초대/인증 기준으로 관리돼요
        </div>
      </Screen>
    </>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ flex: 1, background: "var(--surface-2)", borderRadius: 16, padding: "11px 4px", textAlign: "center" }}>
      <div style={{ fontWeight: 950, fontSize: 16 }}>{value}</div>
      <div className="caption" style={{ marginTop: 3 }}>{label}</div>
    </div>
  );
}
