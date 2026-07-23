import { useState } from "react";
import { Screen, TopBar } from "../components/Layout";
import { Button, Card, SectionHeader, Tag } from "../components/Primitives";
import Icon from "../components/Icon";
import { useNavigation } from "../hooks/useNavigation";
import { calcAverageLifestyle } from "../data/members";
import { houses } from "../data/houses";
import { LIFESTYLE_AXES } from "../data/lifestyle";
import type { LifestyleAxisKey, RoomInfo } from "../types";
import { won } from "../data/expenses";

const BLANK = {
  name: "",
  station: "",
  stationMins: 7,
  monthlyCost: 650000,
  deposit: 400,
  genderPolicy: "혼성" as const,
  smoking: "비흡연" as const,
  pet: "불가" as const,
  lifestyle: { sleep: 3, clean: 3, quiet: 3, social: 3, guests: 3 } as Record<LifestyleAxisKey, number>,
  desc: "",
};

const GENDERS = ["여성전용", "남성전용", "혼성"] as const;
const SMOKING = ["비흡연", "실외흡연", "허용"] as const;
const PETS = ["불가", "가능", "환영"] as const;

export default function LordHouseEditPage({ id }: { id: string }) {
  const { goBack } = useNavigation();
  const isNew = id === "new";
  const existing = isNew ? undefined : houses.find((h) => h.id === id);

  const [form, setForm] = useState(() =>
    existing
      ? {
          name: existing.name,
          station: existing.station,
          stationMins: existing.stationMins,
          monthlyCost: existing.monthlyCost,
          deposit: existing.deposit,
          genderPolicy: existing.genderPolicy,
          smoking: existing.smoking,
          pet: existing.pet,
          lifestyle: { ...existing.lifestyle },
          desc: existing.desc,
        }
      : { ...BLANK, lifestyle: { ...BLANK.lifestyle } }
  );
  const [rooms, setRooms] = useState<RoomInfo[]>(
    existing?.rooms ?? []
  );
  const [saved, setSaved] = useState(false);
  const [autoCalcDone, setAutoCalcDone] = useState(false);
  const [autoCalcLoading, setAutoCalcLoading] = useState(false);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const autoCalc = () => {
    setAutoCalcLoading(true);
    setTimeout(() => {
      const avg = calcAverageLifestyle();
      setForm(f => ({ ...f, lifestyle: {
        sleep: Math.round(avg.sleep),
        clean: Math.round(avg.clean),
        quiet: Math.round(avg.quiet),
        social: Math.round(avg.social),
        guests: Math.round(avg.guests),
      }}));
      setAutoCalcLoading(false);
      setAutoCalcDone(true);
    }, 1000);
  };

  const setAxis = (key: LifestyleAxisKey, value: number) =>
    setForm((f) => ({ ...f, lifestyle: { ...f.lifestyle, [key]: value } }));

  const addRoom = () => {
    const newRoom: RoomInfo = {
      id: `r${Date.now()}`,
      number: `${rooms.length + 1}01호`,
      type: "1인실",
      sizeSqm: 8.0,
      monthlyCost: form.monthlyCost,
      privateBath: false,
      privateAC: true,
      available: true,
      floor: 1,
    };
    setRooms(prev => [...prev, newRoom]);
  };

  const updateRoom = (id: string, key: keyof RoomInfo, value: unknown) => {
    setRooms(prev => prev.map(r => r.id === id ? { ...r, [key]: value } : r));
  };

  const removeRoom = (id: string) => {
    setRooms(prev => prev.filter(r => r.id !== id));
  };

  const save = () => {
    setSaved(true);
    setTimeout(goBack, 900);
  };

  const priceRange = () => {
    if (rooms.length === 0) return `${form.monthlyCost.toLocaleString("ko-KR")}원`;
    const costs = rooms.map(r => r.monthlyCost);
    const min = Math.min(...costs);
    const max = Math.max(...costs);
    return min === max ? `${min.toLocaleString("ko-KR")}원` : `${min.toLocaleString("ko-KR")}~${max.toLocaleString("ko-KR")}원`;
  };

  return (
    <>
      <TopBar title={isNew ? "새 매물 등록" : "매물 편집"} sub={isNew ? "생활습관 성격까지 함께" : form.name} />
      <Screen>
        <SectionHeader title="기본 정보" />
        <Card>
          <div className="stack gap-12">
            <Field label="하우스 이름">
              <Input value={form.name} onChange={(v) => set("name", v)} placeholder="예: 네스트허브 연남" />
            </Field>
            <div style={{ display: "flex", gap: 10 }}>
              <Field label="가까운 역" style={{ flex: 1.4 }}>
                <Input value={form.station} onChange={(v) => set("station", v)} placeholder="예: 홍대입구역" />
              </Field>
              <Field label="도보(분)" style={{ flex: 1 }}>
                <NumInput value={form.stationMins} onChange={(v) => set("stationMins", v)} />
              </Field>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <Field label="월 예상(원)" style={{ flex: 1 }}>
                <NumInput value={form.monthlyCost} onChange={(v) => set("monthlyCost", v)} step={10000} />
                <div className="caption" style={{ marginTop: 6, color: "var(--primary)", fontWeight: 700 }}>
                  실제 범위: {priceRange()}
                </div>
              </Field>
              <Field label="보증금(만원)" style={{ flex: 1 }}>
                <NumInput value={form.deposit} onChange={(v) => set("deposit", v)} step={50} />
              </Field>
            </div>
          </div>
        </Card>

        <SectionHeader title="입주 조건" />
        <Card>
          <div className="stack gap-12">
            <Field label="성별 구성">
              <ChipRow options={GENDERS} value={form.genderPolicy} onChange={(v) => set("genderPolicy", v)} />
            </Field>
            <Field label="흡연">
              <ChipRow options={SMOKING} value={form.smoking} onChange={(v) => set("smoking", v)} />
            </Field>
            <Field label="반려동물">
              <ChipRow options={PETS} value={form.pet} onChange={(v) => set("pet", v)} />
            </Field>
          </div>
        </Card>

        <SectionHeader title="이 집의 생활습관" />
        <div
          style={{
            display:"flex", alignItems:"center", gap:10, marginBottom:10,
            padding:"12px 14px", borderRadius:16,
            background: autoCalcDone ? "var(--green-soft)" : "var(--primary-soft)",
          }}
        >
          <Icon name="sparkle" size={17} style={{ color: autoCalcDone ? "var(--green)" : "var(--primary)", flex:"0 0 auto" }} fill />
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontWeight:850, fontSize:14, color: autoCalcDone ? "var(--green)" : "var(--primary-strong)" }}>
              {autoCalcDone ? "입주자 평균으로 자동 계산됐어요" : "AI로 입주자 평균 자동 계산"}
            </div>
            <div className="caption" style={{ marginTop:2 }}>
              {autoCalcDone ? "직접 수정할 수도 있어요." : "현재 입주자들의 성향을 평균내서 채워줘요."}
            </div>
          </div>
          {!autoCalcDone && (
            <button
              onClick={autoCalc}
              disabled={autoCalcLoading}
              style={{ padding:"7px 14px", borderRadius:12, border:"none", background:"var(--primary)", color:"#fff", fontWeight:850, fontSize:13, cursor:"pointer", flex:"0 0 auto" }}
            >
              {autoCalcLoading ? "계산 중…" : "자동 계산"}
            </button>
          )}
        </div>
        <Card>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 8,
              marginBottom: 14,
              padding: 11,
              borderRadius: 12,
              background: "var(--primary-soft)",
              color: "var(--primary-strong)",
              fontSize: 12.5,
              fontWeight: 700,
              lineHeight: 1.5,
            }}
          >
            <Icon name="info" size={15} style={{ flex: "0 0 auto", marginTop: 1 }} />
            여기 적은 값이 구하는 사람의 성향과 비교돼 궁합 점수가 됩니다. 실제보다 좋게 적으면 금방 나가는 입주자가 늘어요.
          </div>
          <div className="stack gap-14">
            {LIFESTYLE_AXES.map((axis) => (
              <div key={axis.key}>
                <div className="row-between" style={{ marginBottom: 7 }}>
                  <span style={{ fontWeight: 850, fontSize: 14 }}>{axis.label}</span>
                  <Tag variant="violet">{form.lifestyle[axis.key]}/5</Tag>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  step={1}
                  value={form.lifestyle[axis.key]}
                  onChange={(e) => setAxis(axis.key, Number(e.target.value))}
                  style={{ width: "100%", accentColor: "var(--primary)" }}
                />
                <div className="caption" style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
                  <span>{axis.left}</span>
                  <span>{axis.right}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <SectionHeader title="소개" />
        <Card>
          <textarea
            value={form.desc}
            onChange={(e) => set("desc", e.target.value)}
            placeholder="집 분위기, 규칙, 어떤 사람에게 맞는지 적어주세요."
            rows={4}
            style={{
              width: "100%",
              border: "1px solid var(--line)",
              borderRadius: 12,
              padding: 12,
              fontSize: 14,
              fontFamily: "var(--font)",
              resize: "vertical",
              background: "var(--bg)",
              color: "var(--text)",
            }}
          />
        </Card>

        <Button variant="primary" block icon={saved ? "check-circle" : "check"} style={{ marginTop: 20 }} onClick={save}>
          {saved ? "저장했어요" : isNew ? "매물 등록하기" : "변경사항 저장"}
        </Button>
      </Screen>
    </>
  );
}

function Field({ label, children, style }: { label: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={style}>
      <div className="caption" style={{ marginBottom: 6 }}>{label}</div>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid var(--line)",
  borderRadius: 12,
  padding: "11px 12px",
  fontSize: 14,
  fontFamily: "var(--font)",
  background: "var(--bg)",
  color: "var(--text)",
  boxSizing: "border-box",
};

function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={inputStyle} />;
}

function NumInput({ value, onChange, step = 1 }: { value: number; onChange: (v: number) => void; step?: number }) {
  return (
    <input
      type="number"
      value={value}
      step={step}
      onChange={(e) => onChange(Number(e.target.value))}
      style={{ ...inputStyle, fontVariantNumeric: "tabular-nums" }}
    />
  );
}

function ChipRow<T extends string>({ options, value, onChange }: { options: readonly T[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="chip-row">
      {options.map((o) => (
        <button key={o} className={`chip${value === o ? " chip--active" : ""}`} onClick={() => onChange(o)}>
          {o}
        </button>
      ))}
    </div>
  );
}
