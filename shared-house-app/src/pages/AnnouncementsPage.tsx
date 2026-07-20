import { Screen, TopBar } from "../components/Layout";
import { Card, Tag } from "../components/Primitives";
import Icon from "../components/Icon";
import { useNavigation } from "../hooks/useNavigation";
import { announcements } from "../data/announcements";
import type { Announcement } from "../types";

const tagVariant = (tag?: Announcement["tag"]) => (tag === "긴급" ? "coral" : tag === "생활" ? "amber" : "violet");

export function AnnouncementsPage() {
  const { navigate } = useNavigation();
  return (
    <>
      <TopBar title="공지사항" />
      <Screen>
        <div className="stack gap-10" style={{ marginTop: 8 }}>
          {announcements.map((notice) => (
            <Card key={notice.id} onClick={() => navigate("announcementDetail", { id: notice.id })}>
              <div className="row-between" style={{ marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {notice.pinned && <Icon name="info" size={16} style={{ color: "var(--primary)" }} />}
                  <Tag variant={tagVariant(notice.tag)}>{notice.tag}</Tag>
                </div>
                <span className="caption">{notice.date}</span>
              </div>
              <div style={{ fontWeight: 900, fontSize: 16.5, lineHeight: 1.34 }}>{notice.title}</div>
              <div className="clamp-2 caption" style={{ marginTop: 7, lineHeight: 1.5 }}>{notice.body}</div>
              <div className="caption" style={{ marginTop: 10, fontWeight: 800 }}>{notice.author}</div>
            </Card>
          ))}
        </div>
      </Screen>
    </>
  );
}

export function AnnouncementDetailPage({ id }: { id: string }) {
  const notice = announcements.find((item) => item.id === id) ?? announcements[0];
  return (
    <>
      <TopBar title="공지" actionIcon="more" />
      <Screen>
        <div style={{ padding: "10px 4px 0" }}>
          <Tag variant={tagVariant(notice.tag)}>{notice.tag}</Tag>
          <h1 style={{ fontSize: 23, fontWeight: 950, lineHeight: 1.3, margin: "13px 0 10px" }}>{notice.title}</h1>
          <div className="caption" style={{ fontWeight: 800 }}>{notice.author} · {notice.date}</div>
        </div>
        <div className="divider" style={{ margin: "17px 4px" }} />
        <div style={{ padding: "0 4px", fontSize: 15.5, lineHeight: 1.72, whiteSpace: "pre-line" }}>{notice.body}</div>
        <Card style={{ marginTop: 24 }}>
          <div className="row-between">
            <span className="caption" style={{ fontWeight: 850 }}>읽음 4명 · 댓글 2개</span>
            <button className="btn btn--soft btn--sm">
              <Icon name="comment" size={16} /> 댓글
            </button>
          </div>
        </Card>
      </Screen>
    </>
  );
}
