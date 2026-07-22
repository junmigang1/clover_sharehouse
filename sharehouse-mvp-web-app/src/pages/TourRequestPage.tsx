import { useState } from "react";
import { Screen, TopBar } from "../components/Layout";
import { Button, Card } from "../components/Primitives";
import { useNavigation } from "../hooks/useNavigation";
import { houseById } from "../data/houses";

const SLOTS = ["이번 주 토요일 오전 10시", "이번 주 토요일 오후 2시", "이번 주 일요일 오전 11시", "다음 주 평일 협의"];

export default function TourRequestPage({ id }: { id: string }) {
  const { goBack } = useNavigation();
  const house = houseById(id);
  const [slot, setSlot] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submit = () => {
    if (!slot) return;
    setSubmitted(true);
    setTimeout(goBack, 900);
  };

  return (
    <>
      <TopBar title="투어 신청" sub={house.name} />
      <Screen>
        <Card style={{ marginTop: 8 }}>
          <div style={{ fontWeight: 900, fontSize: 15, marginBottom: 12 }}>희망 일정을 선택해 주세요</div>
          <div className="stack gap-8">
            {SLOTS.map((s) => (
              <button
                key={s}
                onClick={() => setSlot(s)}
                style={{
                  width: "100%", padding: "13px 16px", borderRadius: 14, textAlign: "left",
                  border: `2px solid ${slot === s ? "var(--primary)" : "var(--line)"}`,
                  background: slot === s ? "var(--primary-soft)" : "var(--bg)",
                  fontWeight: 800, fontSize: 14, color: slot === s ? "var(--primary-strong)" : "var(--text)",
                  cursor: "pointer",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </Card>

        <Card style={{ marginTop: 10 }}>
          <div className="caption" style={{ lineHeight: 1.55 }}>
            투어 신청 후 임대인이 확정하면 연락드립니다. 직접 집을 보고 생활습관 얘기를 나눈 뒤 입주를 결정할 수 있어요.
          </div>
        </Card>

        <Button variant="primary" block icon={submitted ? "check-circle" : "send"} style={{ marginTop: 18 }} onClick={submit} disabled={!slot}>
          {submitted ? "신청했어요" : "투어 신청하기"}
        </Button>
      </Screen>
    </>
  );
}
