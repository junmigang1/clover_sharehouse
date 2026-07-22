import { useState } from "react";
import { Screen, TopBar } from "../components/Layout";
import { Button, Card } from "../components/Primitives";
import Icon from "../components/Icon";
import { useNavigation } from "../hooks/useNavigation";
import { addAnnouncement } from "../data/announcements";

const TAGS = ["공지", "긴급", "생활"] as const;
type Tag = typeof TAGS[number];

const TAG_DESC: Record<Tag, string> = {
  공지: "일반 운영 안내",
  긴급: "즉시 확인 필요",
  생활: "일상 생활 공유",
};

export default function AnnouncementComposePage() {
  const { goBack } = useNavigation();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tag, setTag] = useState<Tag>("공지");
  const [anonymous, setAnonymous] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = title.trim().length > 0 && body.trim().length > 0;

  const submit = () => {
    if (!canSubmit) return;
    setSubmitted(true);
    setTimeout(goBack, 800);
  };

  return (
    <>
      <TopBar title="공지 작성" sub="모든 입주자에게 전달됩니다" />
      <Screen>
        {/* 태그 선택 */}
        <Card style={{ marginTop: 8 }}>
          <div className="caption" style={{ marginBottom: 8 }}>분류</div>
          <div style={{ display: "flex", gap: 8 }}>
            {TAGS.map((t) => (
              <button
                key={t}
                onClick={() => setTag(t)}
                style={{
                  flex: 1,
                  padding: "10px 6px",
                  borderRadius: 14,
                  border: `2px solid ${tag === t ? "var(--primary)" : "var(--line)"}`,
                  background: tag === t ? "var(--primary-soft)" : "var(--bg)",
                  cursor: "pointer",
                  textAlign: "center",
                }}
              >
                <div style={{ fontWeight: 900, fontSize: 14, color: tag === t ? "var(--primary-strong)" : "var(--text)" }}>{t}</div>
                <div className="caption" style={{ marginTop: 3 }}>{TAG_DESC[t]}</div>
              </button>
            ))}
          </div>
        </Card>

        {/* 제목 */}
        <Card style={{ marginTop: 10 }}>
          <div className="caption" style={{ marginBottom: 6 }}>제목</div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="공지 제목을 입력하세요"
            maxLength={60}
            style={{
              width: "100%",
              border: "none",
              outline: "none",
              fontSize: 17,
              fontWeight: 850,
              fontFamily: "var(--font)",
              background: "transparent",
              color: "var(--text)",
              boxSizing: "border-box",
            }}
          />
        </Card>

        {/* 본문 */}
        <Card style={{ marginTop: 10 }}>
          <div className="caption" style={{ marginBottom: 6 }}>내용</div>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="입주자들에게 전달할 내용을 적어주세요."
            rows={7}
            style={{
              width: "100%",
              border: "none",
              outline: "none",
              resize: "vertical",
              fontSize: 14.5,
              lineHeight: 1.65,
              fontFamily: "var(--font)",
              background: "transparent",
              color: "var(--text)",
              boxSizing: "border-box",
            }}
          />
        </Card>

        {/* 익명 토글 */}
        <Card style={{ marginTop: 10 }}>
          <div
            className="row-between pressable"
            role="button"
            onClick={() => setAnonymous((v) => !v)}
            style={{ cursor: "pointer" }}
          >
            <div>
              <div style={{ fontWeight: 850, fontSize: 14 }}>익명으로 올리기</div>
              <div className="caption" style={{ marginTop: 2 }}>
                {anonymous ? "작성자가 '입주자'로 표시됩니다" : "내 이름이 표시됩니다 (유빈)"}
              </div>
            </div>
            <Toggle on={anonymous} />
          </div>
        </Card>

        <Button
          variant="primary"
          block
          icon={submitted ? "check-circle" : "send"}
          style={{ marginTop: 18 }}
          onClick={submit}
          disabled={!canSubmit}
        >
          {submitted ? "등록됐어요" : "공지 올리기"}
        </Button>

        {!canSubmit && (
          <div className="caption" style={{ textAlign: "center", marginTop: 10 }}>
            제목과 내용을 모두 입력해야 올릴 수 있어요.
          </div>
        )}
      </Screen>
    </>
  );
}

function Toggle({ on }: { on: boolean }) {
  return (
    <span style={{ width: 46, height: 28, borderRadius: 999, background: on ? "var(--primary)" : "var(--line)", position: "relative", transition: "background 0.2s", flex: "0 0 auto", display: "block" }}>
      <span style={{ position: "absolute", top: 3, left: on ? 21 : 3, width: 22, height: 22, borderRadius: 999, background: "#fff", boxShadow: "var(--shadow-sm)", transition: "left 0.2s" }} />
    </span>
  );
}
