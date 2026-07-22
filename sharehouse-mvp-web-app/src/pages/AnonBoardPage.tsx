import { useState } from "react";
import { Screen, TopBar } from "../components/Layout";
import { Button, Card } from "../components/Primitives";
import Icon from "../components/Icon";
import { useNavigation } from "../hooks/useNavigation";
import { anonPosts } from "../data/anonPosts";
import type { AnonPost } from "../types";

type Reaction = keyof AnonPost["reactions"];
const REACTIONS: Reaction[] = ["공감", "해결해줘", "나도"];

const REACTION_EMOJI: Record<Reaction, string> = {
  "공감": "👍",
  "해결해줘": "🙏",
  "나도": "🙋",
};

export default function AnonBoardPage() {
  const { goBack } = useNavigation();
  const [posts, setPosts] = useState<AnonPost[]>(anonPosts);
  const [draft, setDraft] = useState("");
  const [reacted, setReacted] = useState<Record<string, Reaction | null>>({});
  const [submitted, setSubmitted] = useState(false);

  const react = (postId: string, r: Reaction) => {
    const prev = reacted[postId];
    setPosts((ps) =>
      ps.map((p) => {
        if (p.id !== postId) return p;
        const reactions = { ...p.reactions };
        if (prev) reactions[prev] = Math.max(0, reactions[prev] - 1);
        if (prev !== r) reactions[r] = reactions[r] + 1;
        return { ...p, reactions };
      })
    );
    setReacted((prev) => ({ ...prev, [postId]: prev[postId] === r ? null : r }));
  };

  const submit = () => {
    if (!draft.trim()) return;
    const newPost: AnonPost = {
      id: `ap${Date.now()}`,
      body: draft.trim(),
      date: "방금",
      reactions: { "공감": 0, "해결해줘": 0, "나도": 0 },
    };
    setPosts((prev) => [newPost, ...prev]);
    setDraft("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
  };

  return (
    <>
      <TopBar title="익명 건의함" sub="같은 집 입주자들만 볼 수 있어요" />
      <Screen>
        {/* 안내 배너 */}
        <div style={{
          marginTop: 8,
          padding: "12px 14px",
          borderRadius: 16,
          background: "var(--violet-soft, var(--primary-soft))",
          display: "flex",
          gap: 10,
          alignItems: "flex-start",
        }}>
          <Icon name="info" size={16} style={{ color: "var(--primary)", flex: "0 0 auto", marginTop: 1 }} />
          <div style={{ fontSize: 13, lineHeight: 1.55, color: "var(--primary-strong, var(--primary))", fontWeight: 700 }}>
            작성자가 누구인지 알 수 없어요. 불편한 점, 바라는 점을 솔직하게 남겨주세요. 반응은 익명으로 남길 수 있어요.
          </div>
        </div>

        {/* 글 작성 */}
        <Card style={{ marginTop: 12 }}>
          <div className="caption" style={{ marginBottom: 6 }}>익명 글 남기기</div>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="부담 없이 적어주세요. 작성자는 표시되지 않아요."
            rows={3}
            style={{
              width: "100%",
              border: "1px solid var(--line)",
              borderRadius: 12,
              padding: "11px 12px",
              fontSize: 14,
              lineHeight: 1.6,
              fontFamily: "var(--font)",
              background: "var(--bg)",
              color: "var(--text)",
              resize: "vertical",
              boxSizing: "border-box",
            }}
          />
          <Button
            variant="primary"
            block
            icon={submitted ? "check-circle" : "send"}
            style={{ marginTop: 10 }}
            onClick={submit}
            disabled={!draft.trim()}
          >
            {submitted ? "올렸어요" : "익명으로 올리기"}
          </Button>
        </Card>

        {/* 게시글 목록 */}
        <div className="stack gap-10" style={{ marginTop: 16 }}>
          {posts.map((post) => (
            <Card key={post.id}>
              <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                {/* 익명 아바타 */}
                <div style={{
                  width: 34, height: 34, borderRadius: 999,
                  background: "var(--line)", color: "var(--text)",
                  display: "grid", placeItems: "center",
                  flex: "0 0 auto",
                }}>
                  <Icon name="user" size={17} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="caption" style={{ fontWeight: 850 }}>입주자 · {post.date}</div>
                  <p style={{ margin: "6px 0 12px", fontSize: 14.5, lineHeight: 1.65 }}>{post.body}</p>
                  {/* 리액션 */}
                  <div style={{ display: "flex", gap: 6 }}>
                    {REACTIONS.map((r) => {
                      const active = reacted[post.id] === r;
                      return (
                        <button
                          key={r}
                          onClick={() => react(post.id, r)}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            padding: "5px 10px",
                            borderRadius: 999,
                            border: `1.5px solid ${active ? "var(--primary)" : "var(--line)"}`,
                            background: active ? "var(--primary-soft)" : "var(--bg)",
                            color: active ? "var(--primary-strong)" : "var(--text)",
                            fontWeight: 800,
                            fontSize: 12.5,
                            cursor: "pointer",
                          }}
                        >
                          <span>{REACTION_EMOJI[r]}</span>
                          <span>{r}</span>
                          <span style={{ fontVariantNumeric: "tabular-nums" }}>{post.reactions[r]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Screen>
    </>
  );
}
