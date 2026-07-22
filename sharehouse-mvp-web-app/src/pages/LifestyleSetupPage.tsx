import { Screen, TopBar } from "../components/Layout";
import { Button, Card } from "../components/Primitives";
import { useNavigation } from "../hooks/useNavigation";
import { useSeeker } from "../hooks/useSeeker";
import { LIFESTYLE_AXES, COMMUTE_HUBS } from "../data/lifestyle";

export default function LifestyleSetupPage() {
  const { goBack } = useNavigation();
  const { my, setAxis, setNoSmoke, setCommuteHub, markSet } = useSeeker();

  const save = () => {
    markSet();
    goBack();
  };

  return (
    <>
      <TopBar title="내 생활습관" sub="맞는 집을 골라내는 기준이 돼요" />
      <Screen>
        <Card>
          <div className="stack gap-14">
            {LIFESTYLE_AXES.map((axis) => (
              <div key={axis.key}>
                <div style={{ fontWeight: 850, fontSize: 14, marginBottom: 8 }}>{axis.label}</div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  step={1}
                  value={my.axes[axis.key]}
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

        <Card style={{ marginTop: 12 }}>
          <div
            className="row-between pressable"
            role="button"
            onClick={() => setNoSmoke(!my.noSmoke)}
            style={{ cursor: "pointer" }}
          >
            <div>
              <div style={{ fontWeight: 850, fontSize: 14 }}>비흡연 하우스 선호</div>
              <div className="caption" style={{ marginTop: 2 }}>흡연 허용 하우스는 궁합에서 낮게 잡아요</div>
            </div>
            <Toggle on={my.noSmoke} />
          </div>
        </Card>

        <div style={{ fontWeight: 850, fontSize: 14, margin: "18px 4px 10px" }}>통근 목적지</div>
        <div className="chip-row">
          {COMMUTE_HUBS.map((hub) => (
            <button key={hub} className={`chip${my.commuteHub === hub ? " chip--active" : ""}`} onClick={() => setCommuteHub(hub)}>
              {hub}
            </button>
          ))}
        </div>

        <Button variant="primary" block onClick={save} icon="check" style={{ marginTop: 22 }}>
          저장하고 맞는 집 보기
        </Button>
      </Screen>
    </>
  );
}

function Toggle({ on }: { on: boolean }) {
  return (
    <span
      style={{
        width: 46,
        height: 28,
        borderRadius: 999,
        background: on ? "var(--primary)" : "var(--line)",
        position: "relative",
        transition: "background 0.2s",
        flex: "0 0 auto",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 3,
          left: on ? 21 : 3,
          width: 22,
          height: 22,
          borderRadius: 999,
          background: "#fff",
          boxShadow: "var(--shadow-sm)",
          transition: "left 0.2s",
        }}
      />
    </span>
  );
}
