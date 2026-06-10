"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

const DESIGN_W = 436;
const DESIGN_H = 406;

function measureScale(width: number) {
  return width > 0 ? Math.min(1, width / DESIGN_W) : 1;
}

export function GuidePhoneWrap({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      setScale(measureScale(el.getBoundingClientRect().width));
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={ref} className="guide-p-wrap" style={{ height: DESIGN_H * scale }}>
      <div
        className="guide-p-inner"
        style={{
          transform: `scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
