import { useEffect, useRef } from "react";
// @ts-ignore
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export const COMMUTE_LOCATIONS = {
  연세대: { lat: 37.5629, lng: 126.9404 },
  홍대입구역: { lat: 37.5547, lng: 126.9212 },
  강남역: { lat: 37.4979, lng: 127.0276 },
  여의도: { lat: 37.5233, lng: 126.9238 },
  판교: { lat: 37.3947, lng: 127.1147 },
};

interface CommuteMapPickerProps {
  selected: string;
  onSelect: (location: string) => void;
}

export default function CommuteMapPicker({ selected, onSelect }: CommuteMapPickerProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // 지도 초기화
    const map = L.map(containerRef.current).setView([37.55, 126.95], 11);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
      maxZoom: 19,
    }).addTo(map);

    // 마커 생성
    Object.entries(COMMUTE_LOCATIONS).forEach(([name, { lat, lng }]) => {
      const marker = L.marker([lat, lng], {
        title: name,
      })
        .addTo(map)
        .on("click", () => onSelect(name));

      markersRef.current[name] = marker;

      // 선택된 위치는 다른 색으로
      updateMarkerColor(marker, name === selected);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // 선택 변경 시 마커 색 업데이트
  useEffect(() => {
    Object.entries(markersRef.current).forEach(([name, marker]) => {
      updateMarkerColor(marker, name === selected);
    });
  }, [selected]);

  return <div ref={containerRef} style={{ width: "100%", height: 320, borderRadius: 8, overflow: "hidden" }} />;
}

function updateMarkerColor(marker: L.Marker, isSelected: boolean) {
  const html = isSelected
    ? `<div style="background: var(--primary); color: white; padding: 8px 12px; border-radius: 6px; font-weight: 700; font-size: 13px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">📍</div>`
    : `<div style="background: #f5f5f5; color: #666; padding: 8px 12px; border-radius: 6px; font-weight: 700; font-size: 13px; border: 1px solid #ddd;">📍</div>`;

  marker.setIcon(L.divIcon({ html, iconSize: [40, 40], className: "" }));
}
