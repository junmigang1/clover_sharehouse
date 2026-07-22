import { useState } from "react";
import { Screen, TopBar } from "../components/Layout";
import { Button, Card, Tag } from "../components/Primitives";
import Icon from "../components/Icon";
import { houseInfoItems, INFO_CATEGORIES, addHouseInfoItem } from "../data/houseInfo";
import type { HouseInfoItem, HouseInfoCategory } from "../types";

const CAT_COLOR: Record<HouseInfoCategory, string> = {
  "생활규칙": "var(--primary)",
  "동네정보": "var(--green)",
  "쓰레기·재활용": "var(--amber)",
  "긴급연락": "var(--coral)",
};

const CAT_VARIANT: Record<HouseInfoCategory, "violet" | "green" | "amber" | "coral"> = {
  "생활규칙": "violet",
  "동네정보": "green",
  "쓰레기·재활용": "amber",
  "긴급연락": "coral",
};

export default function HouseInfoPage() {
  const [items, setItems] = useState(houseInfoItems);
  const [filter, setFilter] = useState<HouseInfoCategory | "전체">("전체");
  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ category: "동네정보" as HouseInfoCategory, title: "", body: "" });

  const filtered = items
    .filter(i => filter === "전체" || i.category === filter)
    .filter(i => !search || i.title.includes(search) || i.body.includes(search))
    .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  const submit = () => {
    if (!form.title.trim() || !form.body.trim()) return;
    const newItem: HouseInfoItem = {
      id: `hi${Date.now()}`,
      category: form.category,
      title: form.title.trim(),
      body: form.body.trim(),
      author: "유빈",
      updatedAt: "방금",
    };
    addHouseInfoItem(newItem);
    setItems([...houseInfoItems]);
    setForm({ category: "동네정보", title: "", body: "" });
    setAdding(false);
  };

  return (
    <>
      <TopBar title="집 정보" sub="함께 만드는 공유 메모장" />
      <div style={{ padding: "0 12px" }}>
        {/* 검색 */}
        <div style={{ position: "relative", marginTop: 8, marginBottom: 8 }}>
          <Icon name="search" size={16} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)", pointerEvents: "none" }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="쓰레기, 맛집, 연락처 등 검색"
            style={{
              width: "100%", border: "1px solid var(--line)", borderRadius: 14,
              padding: "10px 12px 10px 36px", fontSize: 14, fontFamily: "var(--font)",
              background: "var(--bg)", color: "var(--text)", boxSizing: "border-box",
            }}
          />
        </div>
        {/* 카테고리 필터 */}
        <div className="chip-row">
          <button className={`chip${filter === "전체" ? " chip--active" : ""}`} onClick={() => setFilter("전체")}>전체</button>
          {INFO_CATEGORIES.map(c => (
            <button key={c} className={`chip${filter === c ? " chip--active" : ""}`} onClick={() => setFilter(c)}>{c}</button>
          ))}
        </div>
      </div>

      <Screen>
        {/* 항목 추가 폼 */}
        {adding ? (
          <Card style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 900, fontSize: 15, marginBottom: 12 }}>새 정보 추가</div>
            <div className="chip-row" style={{ marginBottom: 12 }}>
              {INFO_CATEGORIES.map(c => (
                <button key={c} className={`chip${form.category === c ? " chip--active" : ""}`} onClick={() => setForm(f => ({ ...f, category: c }))}>{c}</button>
              ))}
            </div>
            <input
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="제목"
              style={{ width: "100%", border: "1px solid var(--line)", borderRadius: 12, padding: "10px 12px", fontSize: 14, fontFamily: "var(--font)", background: "var(--bg)", color: "var(--text)", boxSizing: "border-box", marginBottom: 8 }}
            />
            <textarea
              value={form.body}
              onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
              placeholder="내용을 적어주세요. 여러 입주자가 볼 수 있어요."
              rows={3}
              style={{ width: "100%", border: "1px solid var(--line)", borderRadius: 12, padding: "10px 12px", fontSize: 14, fontFamily: "var(--font)", background: "var(--bg)", color: "var(--text)", resize: "vertical", boxSizing: "border-box" }}
            />
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <Button variant="neutral" onClick={() => setAdding(false)} style={{ flex: 1 }}>취소</Button>
              <Button variant="primary" onClick={submit} style={{ flex: 2 }} icon="check" disabled={!form.title.trim() || !form.body.trim()}>추가하기</Button>
            </div>
          </Card>
        ) : (
          <button
            onClick={() => setAdding(true)}
            style={{ width: "100%", marginBottom: 12, padding: "12px", borderRadius: 14, border: "2px dashed var(--line)", background: "var(--bg)", color: "var(--primary)", fontWeight: 850, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
          >
            <Icon name="plus" size={16} /> 정보 추가하기
          </button>
        )}

        {/* 항목 목록 */}
        {filtered.length === 0 ? (
          <Card><div className="caption" style={{ textAlign: "center", padding: "16px 0" }}>검색 결과가 없어요.</div></Card>
        ) : (
          <div className="stack gap-10">
            {filtered.map(item => (
              <Card key={item.id}>
                <div className="row-between" style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    {item.pinned && <Icon name="info" size={14} style={{ color: CAT_COLOR[item.category] }} />}
                    <Tag variant={CAT_VARIANT[item.category]}>{item.category}</Tag>
                  </div>
                  <span className="caption">{item.updatedAt} · {item.author}</span>
                </div>
                <div style={{ fontWeight: 900, fontSize: 15.5, marginBottom: 8 }}>{item.title}</div>
                <div style={{ fontSize: 14, lineHeight: 1.65, whiteSpace: "pre-line", color: "var(--text)" }}>{item.body}</div>
              </Card>
            ))}
          </div>
        )}
      </Screen>
    </>
  );
}
