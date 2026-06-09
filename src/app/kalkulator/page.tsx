"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function KalkulatorPage() {
  const router = useRouter();
  const [display, setDisplay] = useState("0");
  const [prev, setPrev] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [fresh, setFresh] = useState(true);

  useEffect(() => {
    document.title = "Kalkulator";
  }, []);

  const input = (val: string) => {
    if (fresh) {
      setDisplay(val === "." ? "0." : val);
      setFresh(false);
    } else {
      if (val === "." && display.includes(".")) return;
      setDisplay(display === "0" && val !== "." ? val : display + val);
    }
  };

  const operate = (operator: string) => {
    const current = parseFloat(display);
    if (prev !== null && op && !fresh) {
      const result = calculate(prev, current, op);
      setDisplay(String(result));
      setPrev(result);
    } else {
      setPrev(current);
    }
    setOp(operator);
    setFresh(true);
  };

  const calculate = (a: number, b: number, operator: string): number => {
    switch (operator) {
      case "+": return a + b;
      case "-": return a - b;
      case "×": return a * b;
      case "÷": return b !== 0 ? a / b : 0;
      default: return b;
    }
  };

  const equals = () => {
    if (prev === null || !op) return;
    const result = calculate(prev, parseFloat(display), op);
    setDisplay(String(result));
    setPrev(null);
    setOp(null);
    setFresh(true);
  };

  const clear = () => {
    setDisplay("0");
    setPrev(null);
    setOp(null);
    setFresh(true);
  };

  const buttons = [
    ["C", "±", "%", "÷"],
    ["7", "8", "9", "×"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["0", ".", "="],
  ];

  const handleButton = (btn: string) => {
    if (btn === "C") clear();
    else if (btn === "=") equals();
    else if (["+", "-", "×", "÷"].includes(btn)) operate(btn);
    else if (btn === "±") setDisplay(String(parseFloat(display) * -1));
    else if (btn === "%") setDisplay(String(parseFloat(display) / 100));
    else input(btn);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="flex-1 flex items-end justify-end px-6 pb-4">
        <p className="text-6xl font-light truncate max-w-full">{display}</p>
      </div>
      <div className="grid grid-cols-4 gap-px bg-gray-800">
        {buttons.flat().map((btn, i) => {
          const isOp = ["+", "-", "×", "÷", "="].includes(btn);
          const isFunc = ["C", "±", "%"].includes(btn);
          const isZero = btn === "0";

          return (
            <button
              key={`${btn}-${i}`}
              onClick={() => handleButton(btn)}
              className={`
                ${isZero ? "col-span-2" : ""}
                h-20 text-2xl font-medium transition-colors
                ${isOp ? "bg-orange-500 hover:bg-orange-400" : isFunc ? "bg-gray-600 hover:bg-gray-500" : "bg-gray-700 hover:bg-gray-600"}
              `}
            >
              {btn}
            </button>
          );
        })}
      </div>
      <button
        onClick={() => router.push("/")}
        className="sr-only"
        aria-hidden
      >
        Kembali
      </button>
    </div>
  );
}
