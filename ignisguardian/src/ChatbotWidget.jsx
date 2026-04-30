import { useEffect, useRef, useState } from "react";

export default function ChatbotWidget() {
  const [open, setOpen] = useState(true); // true cho dễ test MVP
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState([
    { role: "assistant", content: "Chào bạn! Đây là chatbot MVP. Bạn muốn hỏi gì?" }
  ]);
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, open]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    const next = [...msgs, { role: "user", content: text }];
    setMsgs(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next })
      });

      const data = await res.json();
      setMsgs((m) => [...m, { role: "assistant", content: data.reply || "No reply" }]);
    } catch {
      setMsgs((m) => [...m, { role: "assistant", content: "Lỗi gọi API." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="w-80 h-[420px] bg-white rounded-2xl shadow-xl border flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b flex items-center justify-between">
            <div className="font-semibold">Ignis Chat (MVP)</div>
            <button className="text-sm" onClick={() => setOpen(false)}>
              Đóng
            </button>
          </div>

          <div className="flex-1 p-3 overflow-auto space-y-2">
            {msgs.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] text-sm px-3 py-2 rounded-2xl ${
                  m.role === "user" ? "ml-auto bg-black text-white" : "bg-gray-100"
                }`}
              >
                {m.content}
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <div className="p-3 border-t flex gap-2">
            <input
              className="flex-1 border rounded-xl px-3 py-2 text-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập câu hỏi…"
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <button
              className="px-3 py-2 rounded-xl bg-black text-white text-sm disabled:opacity-60"
              onClick={send}
              disabled={loading}
            >
              {loading ? "…" : "Gửi"}
            </button>
          </div>
        </div>
      )}

      {!open && (
        <button
          className="w-14 h-14 rounded-full bg-black text-white shadow-lg"
          onClick={() => setOpen(true)}
          aria-label="Open chatbot"
        >
          💬
        </button>
      )}
    </div>
  );
}
