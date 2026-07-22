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
  const [search, setSearch] = useState("");
  const filtered = (cat === "전체" ? posts : posts.filter(p => p.category === cat))
    .filter(p => !search || p.title.includes(search) || p.body.includes(search));

  return (
    <>
      <TopBar title="커뮤니티" sub="함께 정하고 연결해요" actionIcon="plus" showBack={false} />
      <div style={{ padding: "0 12px" }}>
        {/* 집 정보 진입 */}
        <div
          className="pressable"
          role="button"
          onClick={() => navigate("houseInfo")}
          style={{ display:"flex", alignItems:"center", gap:10, padding:"11px 14px", marginBottom:10, borderRadius:16, background:"var(--primary-soft)", cursor:"pointer" }}
        >
          <Icon name="info" size={17} style={{ color:"var(--primary)" }} />
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontWeight:850, fontSize:14, color:"var(--primary-strong)" }}>집 정보 공유 메모장</div>
            <div className="caption" style={{ marginTop:1 }}>생활규칙 · 동네정보 · 분리수거 · 긴급연락</div>
          </div>
          <Icon name="chevron-right" size={17} style={{ color:"var(--primary)" }} />
        </div>
        {/* 검색 */}
        <div style={{ position:"relative", marginBottom:8 }}>
          <Icon name="search" size={16} style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:"var(--text-3)", pointerEvents:"none" }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="게시글 검색"
            style={{ width:"100%", border:"1px solid var(--line)", borderRadius:14, padding:"10px 12px 10px 36px", fontSize:14, fontFamily:"var(--font)", background:"var(--bg)", color:"var(--text)", boxSizing:"border-box" }}
          />
        </div>
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
          {filtered.map((post) => (
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
