import { Screen, TopBar } from "../components/Layout";
import { Card, SectionHeader } from "../components/Primitives";
import Avatar from "../components/Avatar";
import Icon from "../components/Icon";
import { useNavigation } from "../hooks/useNavigation";
import { house, members, me } from "../data/members";
import { lastMessageOf } from "../data/chats";

export default function ChatListPage() {
  const { navigate } = useNavigation();
  const others = members.filter((m) => m.id !== me.id);
  const groupLast = lastMessageOf();

  return (
    <>
      <TopBar title="채팅" sub="단체방과 1:1 대화" />
      <Screen>
        {/* 단체 채팅 */}
        <SectionHeader title="단체 채팅" />
        <Card pad={false}>
          <div
            className="row pressable"
            onClick={() => navigate("memberChat")}
            style={{ padding: "14px 16px", gap: 12 }}
          >
            <div
              style={{
                width: 46, height: 46, borderRadius: 16, flex: "0 0 auto",
                background: "var(--primary-soft)", color: "var(--primary)",
                display: "grid", placeItems: "center",
              }}
            >
              <Icon name="community" size={22} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 900, fontSize: 15 }}>
                {house.name}
                <span className="caption" style={{ fontWeight: 700 }}> · {members.length}명</span>
              </div>
              <div className="caption ellipsis" style={{ marginTop: 3 }}>
                {groupLast ? groupLast.text : "아직 대화가 없어요"}
              </div>
            </div>
            <div style={{ textAlign: "right", flex: "0 0 auto" }}>
              <div className="caption">{groupLast?.time ?? ""}</div>
            </div>
          </div>
        </Card>

        {/* 개인 채팅 */}
        <SectionHeader title="개인 채팅" />
        <Card pad={false}>
          {others.map((member, i) => {
            const last = lastMessageOf(member.id);
            return (
              <div
                key={member.id}
                className="row pressable"
                onClick={() => navigate("memberChat", { id: member.id })}
                style={{
                  padding: "13px 16px",
                  gap: 12,
                  borderTop: i === 0 ? "none" : "1px solid var(--line)",
                }}
              >
                <Avatar member={member} size={44} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 850, fontSize: 14.5 }}>
                    {member.name}
                    <span className="caption" style={{ fontWeight: 700 }}> · {member.room}</span>
                  </div>
                  <div className="caption ellipsis" style={{ marginTop: 3 }}>
                    {last ? `${last.senderId === "me" ? "나: " : ""}${last.text}` : "대화를 시작해보세요"}
                  </div>
                </div>
                <div className="caption" style={{ flex: "0 0 auto" }}>{last?.time ?? ""}</div>
              </div>
            );
          })}
        </Card>

        <div className="caption" style={{ marginTop: 16, lineHeight: 1.55, display: "flex", gap: 7 }}>
          <Icon name="info" size={14} style={{ flex: "0 0 auto", marginTop: 2 }} />
          단체방은 모두에게, 개인 채팅은 상대에게만 보입니다. 익명으로 남기고 싶은 이야기는 익명 건의함을 이용하세요.
        </div>
      </Screen>
    </>
  );
}
