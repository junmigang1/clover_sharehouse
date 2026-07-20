import { useState } from "react";
import { Screen, TopBar } from "../components/Layout";
import { Card, Tag } from "../components/Primitives";
import Avatar from "../components/Avatar";
import Icon from "../components/Icon";
import { useNavigation } from "../hooks/useNavigation";
import { posts } from "../data/community";
import type { CommunityCategory, Post } from "../types";

const CATEGORIES: CommunityCategory[] = ["전체", "자유", "생활팁", "동네추천", "투표", "모임"];

const catVariant = (category: Post["category"]) =>
  category === "투표" ? "violet" : category === "모임" ? "amber" : category === "동네추천" ? "coral" : "green";

export default function CommunityPage() {
  const { navigate } = useNavigation();
  const [cat, setCat] = useState<CommunityCategory>("전체");
  const list = cat === "전체" ? posts : posts.filter((post) => post.category === cat);

  return (
    <>
      <TopBar title="커뮤니티" sub="함께 정하고 연결해요" actionIcon="plus" showBack={false} />
      <div style={{ padding: "0 12px" }}>
        <div className="chip-row">
          {CATEGORIES.map((category) => (
            <button key={category} className={`chip${cat === category ? " chip--active" : ""}`} onClick={() => setCat(category)}>
              {category}
            </button>
          ))}
        </div>
      </div>
      <Screen>
        <div className="stack gap-10" style={{ marginTop: 4 }}>
          {list.map((post) => (
            <PostCard key={post.id} post={post} onClick={() => navigate("postDetail", { id: post.id })} />
          ))}
        </div>
      </Screen>
    </>
  );
}

function PostCard({ post, onClick }: { post: Post; onClick: () => void }) {
  const topVotes = post.poll ? Math.max(...post.poll.map((option) => option.votes)) : 0;
  const totalVotes = post.poll ? post.poll.reduce((sum, option) => sum + option.votes, 0) : 0;

  return (
    <Card onClick={onClick}>
      <div className="row-between" style={{ marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <Avatar name={post.author} color={post.authorColor} size={31} />
          <div>
            <div style={{ fontWeight: 850, fontSize: 13.5 }}>{post.author}</div>
            <div className="caption" style={{ fontSize: 12 }}>{post.time}</div>
          </div>
        </div>
        <Tag variant={catVariant(post.category)}>{post.category}</Tag>
      </div>

      <div style={{ fontWeight: 900, fontSize: 16.5, lineHeight: 1.32 }}>{post.title}</div>
      <div className="clamp-2 muted" style={{ fontSize: 14, marginTop: 7, lineHeight: 1.5 }}>{post.body}</div>

      {post.eventDate && (
        <div style={{ marginTop: 12, padding: "10px 12px", borderRadius: 14, background: "var(--amber-soft)", color: "#b45309", fontWeight: 850, fontSize: 13, display: "flex", gap: 8, alignItems: "center" }}>
          <Icon name="calendar" size={16} /> {post.eventDate}
        </div>
      )}

      {post.poll && (
        <div className="stack gap-8" style={{ marginTop: 12 }}>
          {post.poll.slice(0, 2).map((option) => {
            const pct = Math.round((option.votes / totalVotes) * 100);
            const top = option.votes === topVotes;
            return (
              <div key={option.label} style={{ position: "relative", padding: "9px 12px", borderRadius: 12, background: "var(--surface-2)", overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0, width: `${pct}%`, background: top ? "var(--violet-soft)" : "#eef2ff" }} />
                <div className="row-between" style={{ position: "relative", fontSize: 13.5, fontWeight: top ? 850 : 700 }}>
                  <span>{option.label}</span>
                  <span className="num">{pct}%</span>
                </div>
              </div>
            );
          })}
          <div className="caption">{totalVotes}명 참여 · 눌러서 투표하기</div>
        </div>
      )}

      <div style={{ display: "flex", gap: 16, marginTop: 13 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, fontWeight: 800, color: post.liked ? "var(--coral)" : "var(--text-3)" }}>
          <Icon name="heart" size={16} fill={post.liked} /> {post.likes}
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, fontWeight: 800, color: "var(--text-3)" }}>
          <Icon name="comment" size={16} /> {post.comments}
        </span>
      </div>
    </Card>
  );
}
