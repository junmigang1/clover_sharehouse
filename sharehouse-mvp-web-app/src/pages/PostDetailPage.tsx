import { useState } from "react";
import { Screen, TopBar } from "../components/Layout";
import Avatar from "../components/Avatar";
import Icon from "../components/Icon";
import { posts, commentsByPost } from "../data/community";
import type { Comment } from "../types";

export default function PostDetailPage({ id }: { id: string }) {
  const post = posts.find((item) => item.id === id) ?? posts[0];
  const [liked, setLiked] = useState(!!post.liked);
  const [likes, setLikes] = useState(post.likes);
  const [voted, setVoted] = useState<number | null>(null);
  const [draft, setDraft] = useState("");
  const [comments, setComments] = useState<Comment[]>(commentsByPost[post.id] ?? []);
  const poll = post.poll ?? [];
  const totalVotes = poll.reduce((sum, option) => sum + option.votes, 0) + (voted !== null ? 1 : 0);

  const toggleLike = () => {
    setLiked((value) => !value);
    setLikes((count) => (liked ? count - 1 : count + 1));
  };

  const addComment = () => {
    if (!draft.trim()) return;
    setComments((list) => [
      ...list,
      { id: `new-${list.length}`, author: "한유빈", authorColor: "#7c3aed", body: draft.trim(), time: "방금 전" },
    ]);
    setDraft("");
  };

  return (
    <>
      <TopBar title={post.category} />
      <Screen>
        <div style={{ padding: "8px 4px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Avatar name={post.author} color={post.authorColor} size={38} />
            <div>
              <div style={{ fontWeight: 850, fontSize: 14.5 }}>{post.author}</div>
              <div className="caption">{post.time}</div>
            </div>
          </div>

          <h1 style={{ fontSize: 22, fontWeight: 950, lineHeight: 1.3, margin: "17px 0 10px" }}>{post.title}</h1>
          <div style={{ fontSize: 15.5, lineHeight: 1.72, whiteSpace: "pre-line" }}>{post.body}</div>

          {post.eventDate && (
            <div style={{ marginTop: 16, padding: "14px 16px", borderRadius: 16, background: "var(--amber-soft)", color: "#b45309", fontWeight: 850, display: "flex", gap: 8, alignItems: "center" }}>
              <Icon name="calendar" size={18} /> {post.eventDate}
            </div>
          )}

          {poll.length > 0 && (
            <div className="stack gap-8" style={{ marginTop: 18 }}>
              {poll.map((option, index) => {
                const votes = option.votes + (voted === index ? 1 : 0);
                const pct = totalVotes ? Math.round((votes / totalVotes) * 100) : 0;
                const chosen = voted === index;
                return (
                  <button
                    key={option.label}
                    onClick={() => setVoted(index)}
                    className="pressable"
                    style={{
                      position: "relative",
                      padding: "13px 14px",
                      borderRadius: 14,
                      overflow: "hidden",
                      textAlign: "left",
                      border: `1.5px solid ${chosen ? "var(--primary)" : "var(--line)"}`,
                      background: "var(--surface)",
                    }}
                  >
                    {voted !== null && <div style={{ position: "absolute", inset: 0, width: `${pct}%`, background: chosen ? "var(--violet-soft)" : "var(--surface-2)", transition: "width 0.4s ease" }} />}
                    <div className="row-between" style={{ position: "relative", fontWeight: chosen ? 900 : 750, fontSize: 14.5 }}>
                      <span>{option.label}</span>
                      {voted !== null && <span className="num">{pct}%</span>}
                    </div>
                  </button>
                );
              })}
              <div className="caption">{voted !== null ? `투표 완료 · ${totalVotes}명 참여` : "항목을 눌러 투표해 주세요"}</div>
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 10, margin: "22px 4px 16px", paddingTop: 16, borderTop: "1px solid var(--line)" }}>
          <button className="btn btn--sm pressable" onClick={toggleLike} style={{ background: liked ? "var(--coral-soft)" : "var(--surface)", color: liked ? "var(--coral)" : "var(--text-2)" }}>
            <Icon name="heart" size={17} fill={liked} /> {likes}
          </button>
          <div className="btn btn--sm" style={{ background: "var(--surface)", color: "var(--text-2)" }}>
            <Icon name="comment" size={17} /> {comments.length}
          </div>
        </div>

        <div className="stack gap-14" style={{ padding: "0 4px" }}>
          {comments.map((comment) => (
            <div key={comment.id} style={{ display: "flex", gap: 10 }}>
              <Avatar name={comment.author} color={comment.authorColor} size={32} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 6, alignItems: "baseline" }}>
                  <span style={{ fontWeight: 850, fontSize: 13.5 }}>{comment.author}</span>
                  <span className="caption" style={{ fontSize: 11.5 }}>{comment.time}</span>
                </div>
                <div style={{ fontSize: 14.5, marginTop: 4, lineHeight: 1.5 }}>{comment.body}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 18, padding: "0 4px" }}>
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && addComment()}
            placeholder="댓글을 입력하세요"
            style={{ flex: 1, height: 46, borderRadius: 999, border: "1px solid var(--line)", background: "rgba(255,255,255,0.82)", padding: "0 18px", fontSize: 14.5, outline: "none" }}
          />
          <button onClick={addComment} className="pressable" style={{ width: 46, height: 46, borderRadius: 999, background: draft.trim() ? "var(--primary)" : "var(--surface)", color: draft.trim() ? "#fff" : "var(--text-3)", display: "grid", placeItems: "center" }}>
            <Icon name="send" size={19} />
          </button>
        </div>
      </Screen>
    </>
  );
}
