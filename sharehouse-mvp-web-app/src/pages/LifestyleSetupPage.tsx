import { Screen, TopBar } from "../components/Layout";
import { Button, Card } from "../components/Primitives";
import { useNavigation } from "../hooks/useNavigation";
import { useSeeker } from "../hooks/useSeeker";
import { LIFESTYLE_AXES, COMMUTE_HUBS } from "../data/lifestyle";
import CommuteMapPicker from "../components/CommuteMapPicker";
import { useState } from "react";

interface ChipGridItem {
  key: string;
  left: { label: string; value: number };
  right: { label: string; value: number };
}

const LIFESTYLE_CHIPS: ChipGridItem[] = [
  {
    key: "sleep",
    left: { label: "아침형이에요", value: 1 },
    right: { label: "밤에 활동해요", value: 5 },
  },
  {
    key: "clean",
    left: { label: "청결에 예민해요", value: 1 },
    right: { label: "적당히 치우면 돼요", value: 5 },
  },
  {
    key: "quiet",
    left: { label: "밤엔 조용했으면", value: 1 },
    right: { label: "북적여도 괜찮아요", value: 5 },
  },
  {
    key: "social",
    left: { label: "각자 생활 존중", value: 1 },
    right: { label: "같이 어울리고 싶어요", value: 5 },
  },
  {
    key: "guests",
    left: { label: "손님 거의 안 불러요", value: 1 },
    right: { label: "친구 종종 불러요", value: 5 },
  },
];

const PREFERENCE_TAGS = [
  { id: "noSmoke", label: "비흡연" },
  { id: "female", label: "여성전용" },
  { id: "privateBath", label: "개인 화장실" },
  { id: "wfh", label: "재택근무 많아요" },
];

const PRIORITY_TAGS = [
  { id: "commute", label: "통근이 가장 중요" },
  { id: "cost", label: "비용이 가장 중요" },
  { id: "longTerm", label: "오래 살 곳 찾아요" },
];

export default function LifestyleSetupPage() {
  const { goBack } = useNavigation();
  const { my, setAxis, setNoSmoke, setCommuteHub, markSet } = useSeeker();
  const [preferences, setPreferences] = useState<Record<string, boolean>>({
    noSmoke: my.noSmoke,
    female: false,
    privateBath: false,
    wfh: false,
  });
  const [priorities, setPriorities] = useState<Record<string, boolean>>({
    commute: false,
    cost: false,
    longTerm: false,
  });

  const togglePreference = (id: string) => {
    setPreferences((p) => ({ ...p, [id]: !p[id] }));
    if (id === "noSmoke") setNoSmoke(!preferences.noSmoke);
  };

  const togglePriority = (id: string) => {
    setPriorities((p) => ({ ...p, [id]: !p[id] }));
  };

  const save = () => {
    markSet();
    goBack();
  };

  return (
    <>
      <TopBar title="내 생활습관" sub="맞는 집을 골라내는 기준이 돼요" />
      <Screen>
        {/* 생활 리듬 칩 그리드 */}
        <Card>
          <div className="stack gap-16">
            {LIFESTYLE_CHIPS.map((item) => (
              <div key={item.key}>
                <div style={{ fontWeight: 850, fontSize: 13.5, marginBottom: 10, color: "var(--text)" }}>
                  {LIFESTYLE_AXES.find((a) => a.key === item.key)?.label}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    className={`chip${my.axes[item.key as keyof typeof my.axes] === item.left.value ? " chip--active" : ""}`}
                    onClick={() => setAxis(item.key as any, item.left.value)}
                    style={{ flex: 1, fontSize: 13 }}
                  >
                    {item.left.label}
                  </button>
                  <button
                    className={`chip${my.axes[item.key as keyof typeof my.axes] === item.right.value ? " chip--active" : ""}`}
                    onClick={() => setAxis(item.key as any, item.right.value)}
                    style={{ flex: 1, fontSize: 13 }}
                  >
                    {item.right.label}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 선호 조건 */}
        <Card style={{ marginTop: 12 }}>
          <div style={{ fontWeight: 850, fontSize: 13.5, marginBottom: 12, color: "var(--text)" }}>선호 조건</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {PREFERENCE_TAGS.map((tag) => (
              <button
                key={tag.id}
                className={`chip chip--sm${preferences[tag.id] ? " chip--active" : ""}`}
                onClick={() => togglePreference(tag.id)}
                style={{ fontSize: 12.5 }}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </Card>

        {/* 우선순위 */}
        <Card style={{ marginTop: 12 }}>
          <div style={{ fontWeight: 850, fontSize: 13.5, marginBottom: 12, color: "var(--text)" }}>우선순위</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {PRIORITY_TAGS.map((tag) => (
              <button
                key={tag.id}
                className={`chip chip--sm${priorities[tag.id] ? " chip--active" : ""}`}
                onClick={() => togglePriority(tag.id)}
                style={{ fontSize: 12.5 }}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </Card>

        {/* 통근 목적지 */}
        <Card style={{ marginTop: 12, padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "14px 16px", fontWeight: 850, fontSize: 13.5, color: "var(--text)", borderBottom: "1px solid var(--line)" }}>
            통근 목적지
          </div>
          <div style={{ padding: 12 }}>
            <CommuteMapPicker selected={my.commuteHub} onSelect={setCommuteHub} />
            <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 12, textAlign: "center" }}>
              지도에서 위치를 클릭하세요
            </div>
          </div>
        </Card>

        <Button variant="primary" block onClick={save} icon="check" style={{ marginTop: 24 }}>
          저장하고 맞는 집 보기
        </Button>
      </Screen>
    </>
  );
}
