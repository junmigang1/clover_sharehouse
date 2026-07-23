import { useRef, useState } from "react";
import { Screen, TopBar } from "../components/Layout";
import { Button, Card, SectionHeader } from "../components/Primitives";
import { useNavigation } from "../hooks/useNavigation";
import { addMarketItem } from "../data/marketplace";
import { fileToResizedDataUrl } from "../data/imageUtils";
import Icon from "../components/Icon";
import type { MarketItem } from "../types";

const CATEGORIES = ["책상", "의자", "침구", "주방", "가전", "기타"] as const;
type Cat = typeof CATEGORIES[number];

const CONDITIONS = ["거의 새것", "상태 좋음", "양호", "사용감 있음"] as const;

const BG_MAP: Record<Cat, string> = {
  책상: "linear-gradient(135deg,#ede9fe,#f8fafc)",
  의자: "linear-gradient(135deg,#e0f2fe,#ffffff)",
  침구: "linear-gradient(135deg,#fef3c7,#f5f3ff)",
  주방: "linear-gradient(135deg,#dcfce7,#fff7ed)",
  가전: "linear-gradient(135deg,#ccfbf1,#eef2ff)",
  기타: "linear-gradient(135deg,#f3f4f6,#ffffff)",
};

export default function MarketComposePage() {
  const { goBack } = useNavigation();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Cat>("책상");
  const [price, setPrice] = useState<number | "">("");
  const [isFree, setIsFree] = useState(false);
  const [condition, setCondition] = useState<typeof CONDITIONS[number]>("상태 좋음");
  const [desc, setDesc] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [submitted, setSubmitted] = useState(false);

  const MAX_PHOTOS = 4;

  const pickPhotos = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const room = MAX_PHOTOS - photos.length;
      const picked = Array.from(files).slice(0, room);
      const urls = await Promise.all(picked.map((f) => fileToResizedDataUrl(f)));
      setPhotos((prev) => [...prev, ...urls].slice(0, MAX_PHOTOS));
    } catch {
      /* 실패한 파일은 조용히 건너뛴다 */
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const removePhoto = (i: number) => setPhotos((prev) => prev.filter((_, idx) => idx !== i));

  const canSubmit = title.trim() && desc.trim();

  const submit = () => {
    if (!canSubmit) return;
    const newItem: MarketItem = {
      id: `mkt${Date.now()}`,
      category,
      title: title.trim(),
      price: isFree ? 0 : (typeof price === "number" ? price : 0),
      seller: "유빈",
      sellerColor: "#7c3aed",
      room: "네스트허브 연남",
      time: "방금",
      condition,
      emoji: category,
      bg: BG_MAP[category],
      desc: desc.trim(),
      status: "판매중",
      photos: photos.length ? photos : undefined,
    };
    addMarketItem(newItem);
    setSubmitted(true);
    setTimeout(goBack, 800);
  };

  return (
    <>
      <TopBar title="물건 올리기" sub="함께 나눔해요" />
      <Screen>
        <Card style={{ marginTop: 8 }}>
          <div className="row-between" style={{ marginBottom: 8 }}>
            <span className="caption">사진</span>
            <span className="caption">{photos.length}/{MAX_PHOTOS}</span>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {photos.map((src, i) => (
              <div key={i} style={{ position: "relative", width: 78, height: 78, borderRadius: 14, overflow: "hidden", border: "1px solid var(--line)" }}>
                <img src={src} alt={`업로드 사진 ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                {i === 0 && (
                  <span style={{ position: "absolute", left: 4, bottom: 4, background: "rgba(23,19,33,0.7)", color: "#fff", fontSize: 9, fontWeight: 850, padding: "2px 5px", borderRadius: 6 }}>대표</span>
                )}
                <button
                  onClick={() => removePhoto(i)}
                  aria-label="사진 삭제"
                  style={{ position: "absolute", top: 3, right: 3, width: 20, height: 20, borderRadius: 999, border: "none", background: "rgba(23,19,33,0.65)", color: "#fff", fontSize: 12, lineHeight: 1, cursor: "pointer" }}
                >
                  ×
                </button>
              </div>
            ))}
            {photos.length < MAX_PHOTOS && (
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                style={{ width: 78, height: 78, borderRadius: 14, border: "2px dashed var(--line)", background: "var(--bg)", color: "var(--primary)", cursor: "pointer", display: "grid", placeItems: "center", gap: 2 }}
              >
                <Icon name="plus" size={18} />
                <span style={{ fontSize: 10, fontWeight: 800 }}>{uploading ? "처리 중" : "사진"}</span>
              </button>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => pickPhotos(e.target.files)}
            style={{ display: "none" }}
          />
          <div className="caption" style={{ marginTop: 8 }}>
            첫 번째 사진이 목록의 대표 이미지로 쓰여요.
          </div>
        </Card>

        <Card style={{ marginTop: 10 }}>
          <div className="caption" style={{ marginBottom: 6 }}>카테고리</div>
          <div className="chip-row" style={{ flexWrap: "wrap" }}>
            {CATEGORIES.map(c => (
              <button key={c} className={`chip${category === c ? " chip--active" : ""}`} onClick={() => setCategory(c)}>{c}</button>
            ))}
          </div>
        </Card>

        <Card style={{ marginTop: 10 }}>
          <div className="caption" style={{ marginBottom: 6 }}>제목</div>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="예: 화이트 책상 120cm"
            maxLength={40}
            style={{ width: "100%", border: "none", outline: "none", fontSize: 17, fontWeight: 850, fontFamily: "var(--font)", background: "transparent", color: "var(--text)", boxSizing: "border-box" }}
          />
        </Card>

        <Card style={{ marginTop: 10 }}>
          <div
            className="row-between pressable"
            role="button"
            onClick={() => setIsFree(v => !v)}
            style={{ cursor: "pointer", marginBottom: isFree ? 0 : 12 }}
          >
            <div>
              <div style={{ fontWeight: 850, fontSize: 14 }}>나눔 (무료)</div>
              <div className="caption" style={{ marginTop: 2 }}>가격 없이 무료로 넘겨요</div>
            </div>
            <Toggle on={isFree} />
          </div>
          {!isFree && (
            <div>
              <div className="caption" style={{ marginBottom: 6 }}>가격 (원)</div>
              <input
                type="number"
                value={price}
                onChange={e => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="0"
                step={1000}
                style={{ width: "100%", border: "1px solid var(--line)", borderRadius: 12, padding: "10px 12px", fontSize: 15, fontFamily: "var(--font)", background: "var(--bg)", color: "var(--text)", boxSizing: "border-box", fontVariantNumeric: "tabular-nums" }}
              />
            </div>
          )}
        </Card>

        <Card style={{ marginTop: 10 }}>
          <div className="caption" style={{ marginBottom: 8 }}>상태</div>
          <div className="chip-row">
            {CONDITIONS.map(c => (
              <button key={c} className={`chip${condition === c ? " chip--active" : ""}`} onClick={() => setCondition(c)}>{c}</button>
            ))}
          </div>
        </Card>

        <Card style={{ marginTop: 10 }}>
          <div className="caption" style={{ marginBottom: 6 }}>설명</div>
          <textarea
            value={desc}
            onChange={e => setDesc(e.target.value)}
            placeholder="물건 상태, 구매 시기, 인수 방법 등을 알려주세요."
            rows={4}
            style={{ width: "100%", border: "none", outline: "none", resize: "vertical", fontSize: 14.5, lineHeight: 1.65, fontFamily: "var(--font)", background: "transparent", color: "var(--text)", boxSizing: "border-box" }}
          />
        </Card>

        <Button variant="primary" block icon={submitted ? "check-circle" : "send"} style={{ marginTop: 18 }} onClick={submit} disabled={!canSubmit}>
          {submitted ? "올렸어요" : "물건 올리기"}
        </Button>
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
