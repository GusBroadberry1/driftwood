import React, { useState } from "react";

// ─── DRIFTWOOD BRAND TOKENS ───────────────────────────────
const C = {
  bg: "#F5F0E8",
  surface: "#FDFAF5",
  surfaceAlt: "#EDE8DE",
  drift: "#5C4A32",
  driftLight: "#F0E8D8",
  driftMid: "#8B6F4E",
  ocean: "#2E5B6B",
  oceanLight: "#E3EEF2",
  foam: "#A8C5CE",
  text: "#1E1A14",
  textMid: "#4A3F30",
  muted: "#8A7D6A",
  border: "#DDD5C4",
  borderDark: "#C4B89E",
  success: "#3A6B4A",
  warning: "#B8860B",
  error: "#8B2020",
};

const font = {
  display: "'Cormorant Garamond', serif",
  body: "'DM Sans', sans-serif",
};

const TOTAL_STEPS = 4;

const vibeQuestions = [
  {
    id: "arrival",
    q: "You've just landed. First move?",
    options: [
      { label: "Drop bags, hit the streets immediately", icon: "🏃" },
      { label: "Find a local café, get my bearings", icon: "☕" },
      { label: "Check into the hostel and meet people", icon: "🤝" },
      { label: "Research the best spots for tomorrow", icon: "📍" },
    ],
  },
  {
    id: "meal",
    q: "It's dinner time in a city you don't know.",
    options: [
      { label: "Street food stall with the longest queue", icon: "🍜" },
      { label: "Ask a local for their favourite spot", icon: "💬" },
      { label: "Wander until something smells good", icon: "👃" },
      { label: "Book somewhere well-reviewed in advance", icon: "⭐" },
    ],
  },
  {
    id: "unplanned",
    q: "Your plans fall through. You:",
    options: [
      { label: "Love it — best trips are unplanned", icon: "🌊" },
      { label: "Slightly anxious but roll with it", icon: "😅" },
      { label: "Quickly find an alternative online", icon: "🔍" },
      { label: "Use it as a rest day", icon: "😴" },
    ],
  },
  {
    id: "memory",
    q: "What do you want to go home with?",
    options: [
      { label: "Stories that sound unbelievable", icon: "🔥" },
      { label: "A real sense of the local culture", icon: "🏛" },
      { label: "New friendships from the road", icon: "❤️" },
      { label: "Photos that make people jealous", icon: "📸" },
    ],
  },
  {
    id: "budget_style",
    q: "How do you think about money on the road?",
    options: [
      { label: "Track every penny — the game is the point", icon: "🧮" },
      { label: "Roughly aware, splurge on the right things", icon: "⚖️" },
      { label: "Spend freely, figure it out after", icon: "💸" },
      { label: "Saved hard so I can actually enjoy it", icon: "🎯" },
    ],
  },
];

const accomOptions = [
  { value: "solo_private", label: "Solo & Private", desc: "Private rooms, still budget", icon: "🔒" },
  { value: "social_nomad", label: "Social Nomad", desc: "4–8 bed dorms, hostel bars", icon: "🛏" },
  { value: "party_hostel", label: "Party Hostel", desc: "8–16 bed, events every night", icon: "🎉" },
  { value: "mixed", label: "Flexible", desc: "Dorms on transit nights, private when resting", icon: "⚖️" },
];

const paceOptions = [
  { value: "slow_deep", label: "Slow & Deep", desc: "1–2 places, really absorb them", icon: "🐢" },
  { value: "balanced", label: "Balanced", desc: "A few spots without rushing", icon: "🚶" },
  { value: "fast_packed", label: "Fast & Packed", desc: "Maximise every day", icon: "⚡" },
];

const groupOptions = [
  { value: "solo", label: "Solo", icon: "🧍" },
  { value: "couple", label: "Couple", icon: "👫" },
  { value: "small_group", label: "Small Group", icon: "👥" },
  { value: "mixed_group", label: "Mixed Group", icon: "🎒" },
];

const durationOptions = [
  { value: "3", label: "Weekend Getaway", desc: "2–4 days", icon: "⚡" },
  { value: "7", label: "One Week", desc: "5–8 days", icon: "📅" },
  { value: "12", label: "Two Weeks", desc: "10–14 days", icon: "🗺" },
  { value: "21", label: "Extended Trip", desc: "3–4 weeks", icon: "✈️" },
  { value: "90", label: "Extended Travel", desc: "2–3+ months", icon: "🌍" },
];

const interestOptions = [
  { label: "Food & Markets", icon: "🍜" },
  { label: "Nature & Trekking", icon: "🏔" },
  { label: "Nightlife", icon: "🌙" },
  { label: "History & Culture", icon: "🏛" },
  { label: "Beaches & Water", icon: "🏖" },
  { label: "Art & Architecture", icon: "🎨" },
  { label: "Adventure Sports", icon: "🪂" },
  { label: "Local Life", icon: "🏘" },
  { label: "Photography", icon: "📸" },
  { label: "Wellness & Yoga", icon: "🧘" },
  { label: "Budget Hacks", icon: "💡" },
  { label: "Digital Nomad", icon: "💻" },
];

const avoidOptions = [
  { label: "Touristy crowds", icon: "🚫" },
  { label: "Expensive tours", icon: "💰" },
  { label: "Long bus journeys", icon: "🚌" },
  { label: "Party scenes", icon: "🎊" },
  { label: "Street food risk", icon: "🌶" },
  { label: "Remote areas", icon: "🗺" },
  { label: "Extreme heat", icon: "☀️" },
  { label: "Strenuous activities", icon: "⛰" },
];

const derivePersonality = (vibeAnswers) => {
  const counts = { "0": 0, "1": 0, "2": 0, "3": 0 };
  Object.values(vibeAnswers).forEach((v) => {
    counts[v] = (counts[v] || 0) + 1;
  });
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  const types = {
    "0": { name: "The Chaos Merchant", desc: "You travel fast, trust your gut, and collect stories others don't believe.", emoji: "🔥" },
    "1": { name: "The Culture Vulture", desc: "Depth over breadth. You leave knowing a place from the inside out.", emoji: "🏛" },
    "2": { name: "The Social Connector", desc: "Your trip is defined by the people you meet along the way.", emoji: "❤️" },
    "3": { name: "The Savvy Explorer", desc: "Planned enough to never miss the best stuff, flexible enough to find the magic.", emoji: "🧭" },
  };
  return types[top] || types["3"];
};

const DriftwoodLogo = ({ size = "normal" }) => {
  const large = size === "large";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: large ? "12px" : "8px" }}>
      <svg width={large ? 36 : 24} height={large ? 22 : 15} viewBox="0 0 36 22" fill="none">
        <path d="M2 16 C6 8, 12 8, 18 11 C24 14, 30 14, 34 6" stroke={C.drift} strokeWidth={large ? 2.5 : 2} strokeLinecap="round" fill="none"/>
        <path d="M2 20 C6 12, 12 12, 18 15 C24 18, 30 18, 34 10" stroke={C.foam} strokeWidth={large ? 2 : 1.5} strokeLinecap="round" fill="none" opacity="0.6"/>
      </svg>
      <div>
        <span style={{ fontFamily: font.display, fontSize: large ? "32px" : "20px", fontWeight: 600, color: C.drift, letterSpacing: large ? "0.04em" : "0.02em", lineHeight: 1 }}>
          Driftwood
        </span>
        {large && (
          <div style={{ fontSize: "11px", fontFamily: font.body, color: C.muted, letterSpacing: "0.18em", textTransform: "uppercase", marginTop: "3px" }}>
            Travel, your way
          </div>
        )}
      </div>
    </div>
  );
};

const WaveDivider = () => (
  <svg width="100%" height="12" viewBox="0 0 400 12" preserveAspectRatio="none" style={{ display: "block", margin: "4px 0" }}>
    <path d="M0 6 C50 0, 100 12, 150 6 C200 0, 250 12, 300 6 C350 0, 375 10, 400 6" stroke={C.borderDark} strokeWidth="1" fill="none" opacity="0.5"/>
  </svg>
);

const ProgressBar = ({ step }) => {
  const labels = ["Your Vibe", "Trip Details", "Travel Style", "Interests"];
  return (
    <div style={{ marginBottom: "36px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        {labels.map((label, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div style={{
              width: "20px", height: "20px", borderRadius: "50%",
              background: i < step ? C.drift : i === step ? C.drift : "transparent",
              border: `2px solid ${i <= step ? C.drift : C.border}`,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              {i < step && <span style={{ color: "#fff", fontSize: "10px" }}>✓</span>}
              {i === step && <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#fff" }} />}
            </div>
          </div>
        ))}
      </div>
      <div style={{ height: "2px", background: C.border, borderRadius: "2px", overflow: "hidden" }}>
        <div style={{ height: "100%", background: `linear-gradient(90deg, ${C.drift}, ${C.driftMid})`, width: `${(step / TOTAL_STEPS) * 100}%`, borderRadius: "2px", transition: "width 0.4s ease" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
        {labels.map((label, i) => (
          <span key={i} style={{ fontSize: "10px", fontFamily: font.body, color: i <= step ? C.driftMid : C.muted, fontWeight: i === step ? 600 : 400 }}>
            {label}
          </span>
        ))}
      </div>
    </div>
  );
};

const Label = ({ children, hint }) => (
  <div style={{ marginBottom: "10px" }}>
    <div style={{ fontSize: "13px", fontWeight: 600, color: C.textMid, fontFamily: font.body }}>{children}</div>
    {hint && <div style={{ fontSize: "12px", color: C.muted, marginTop: "2px", fontFamily: font.body }}>{hint}</div>}
  </div>
);

const TextInput = ({ placeholder, value, onChange, type = "text" }) => {
  const [focused, setFocused] = useState(false);
  return (
    <input type={type} placeholder={placeholder} value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={{
        width: "100%", boxSizing: "border-box",
        border: `1.5px solid ${focused ? C.drift : C.border}`,
        borderRadius: "10px", padding: "13px 16px",
        fontSize: "15px", fontFamily: font.body, color: C.text,
        background: C.surface, outline: "none", transition: "border-color 0.2s",
        boxShadow: focused ? `0 0 0 3px ${C.driftLight}` : "none",
      }}
    />
  );
};

const SelectCard = ({ options, value, onChange, cols = 2 }) => (
  <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: "10px" }}>
    {options.map((opt) => {
      const selected = value === opt.value;
      return (
        <button key={opt.value} onClick={() => onChange(opt.value)} style={{
          background: selected ? C.driftLight : C.surface,
          border: `1.5px solid ${selected ? C.drift : C.border}`,
          borderRadius: "12px", padding: "14px 12px", cursor: "pointer",
          textAlign: "left", transition: "all 0.15s",
          boxShadow: selected ? `0 0 0 1px ${C.drift}20` : "none",
        }}>
          <div style={{ fontSize: "20px", marginBottom: "6px" }}>{opt.icon}</div>
          <div style={{ fontSize: "13px", fontWeight: 600, color: selected ? C.drift : C.text, fontFamily: font.body }}>{opt.label}</div>
          {opt.desc && <div style={{ fontSize: "11px", color: C.muted, marginTop: "3px", fontFamily: font.body, lineHeight: 1.4 }}>{opt.desc}</div>}
        </button>
      );
    })}
  </div>
);

const PillToggle = ({ options, values, onChange }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
    {options.map((opt) => {
      const selected = values.includes(opt.label);
      return (
        <button key={opt.label} onClick={() => onChange(opt.label)} style={{
          background: selected ? C.driftLight : C.surface,
          border: `1.5px solid ${selected ? C.drift : C.border}`,
          borderRadius: "24px", padding: "8px 16px", cursor: "pointer",
          fontSize: "13px", fontFamily: font.body, fontWeight: selected ? 600 : 400,
          color: selected ? C.drift : C.textMid, transition: "all 0.15s",
          display: "flex", alignItems: "center", gap: "6px",
        }}>
          <span>{opt.icon}</span><span>{opt.label}</span>
        </button>
      );
    })}
  </div>
);

const NavButtons = ({ onBack, onNext, nextLabel = "Continue", nextDisabled }) => (
  <div style={{ display: "flex", gap: "12px", marginTop: "36px" }}>
    {onBack && (
      <button onClick={onBack} style={{
        flex: "0 0 auto", background: "transparent",
        border: `1.5px solid ${C.border}`, borderRadius: "10px",
        padding: "14px 20px", cursor: "pointer",
        fontSize: "14px", fontFamily: font.body, color: C.muted,
      }}>← Back</button>
    )}
    <button onClick={onNext} disabled={nextDisabled} style={{
      flex: 1,
      background: nextDisabled ? C.surfaceAlt : `linear-gradient(135deg, ${C.drift}, ${C.driftMid})`,
      border: "none", borderRadius: "10px", padding: "15px",
      cursor: nextDisabled ? "not-allowed" : "pointer",
      fontSize: "15px", fontWeight: 600, fontFamily: font.body,
      color: nextDisabled ? C.muted : "#fff",
      transition: "all 0.2s", letterSpacing: "0.02em",
      boxShadow: nextDisabled ? "none" : `0 4px 14px ${C.drift}40`,
    }}>{nextLabel} →</button>
  </div>
);

const OutputSection = ({ emoji, title, children, last }) => (
  <div style={{ marginBottom: last ? 0 : "28px", paddingBottom: last ? 0 : "28px", borderBottom: last ? "none" : `1px solid ${C.border}` }}>
    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
      <span style={{ fontSize: "18px" }}>{emoji}</span>
      <h3 style={{ margin: 0, fontFamily: font.display, fontSize: "20px", color: C.drift, fontWeight: 600, letterSpacing: "0.02em" }}>{title}</h3>
    </div>
    {children}
  </div>
);

const BudgetVisualiser = ({ budget, duration }) => {
  const total = budget * duration;
  const splits = [
    { label: "Accommodation", pct: 0.3, color: C.drift },
    { label: "Food & Drink", pct: 0.28, color: C.driftMid },
    { label: "Transport", pct: 0.2, color: C.ocean },
    { label: "Activities", pct: 0.15, color: C.foam },
    { label: "Buffer", pct: 0.07, color: C.border },
  ];
  let cumulative = 0;
  const size = 150;
  const cx = size / 2, cy = size / 2, r = 54, stroke = 24;
  const circumference = 2 * Math.PI * r;
  const arcs = splits.map((s) => {
    const arc = { ...s, offset: circumference * (1 - cumulative), dash: circumference * s.pct };
    cumulative += s.pct;
    return arc;
  });

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "28px", flexWrap: "wrap" }}>
        <svg width={size} height={size} style={{ flexShrink: 0 }}>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.surfaceAlt} strokeWidth={stroke} />
          {arcs.map((arc, i) => (
            <circle key={i} cx={cx} cy={cy} r={r} fill="none"
              stroke={arc.color} strokeWidth={stroke}
              strokeDasharray={`${arc.dash} ${circumference}`}
              strokeDashoffset={arc.offset}
              style={{ transform: "rotate(-90deg)", transformOrigin: `${cx}px ${cy}px` }}
            />
          ))}
          <text x={cx} y={cy - 8} textAnchor="middle" style={{ fontSize: "14px", fontFamily: font.body, fontWeight: 700, fill: C.text }}>£{total.toLocaleString()}</text>
          <text x={cx} y={cy + 8} textAnchor="middle" style={{ fontSize: "10px", fontFamily: font.body, fill: C.muted }}>estimated</text>
          <text x={cx} y={cy + 20} textAnchor="middle" style={{ fontSize: "10px", fontFamily: font.body, fill: C.muted }}>total</text>
        </svg>
        <div style={{ flex: 1, minWidth: "200px" }}>
          {splits.map((s, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "3px", background: s.color, flexShrink: 0 }} />
                <span style={{ fontSize: "13px", fontFamily: font.body, color: C.textMid }}>{s.label}</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: "13px", fontWeight: 600, fontFamily: font.body, color: C.text }}>£{Math.round(budget * s.pct)}</span>
               <span style={{ fontSize: "11px", color: C.muted, fontFamily: font.body }}>/day</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: "16px", background: C.driftLight, borderRadius: "10px", padding: "13px 16px", border: `1px solid ${C.borderDark}` }}>
        <div style={{ fontSize: "13px", fontFamily: font.body, color: C.drift, fontWeight: 600 }}>
          💡 Total trip estimate: £{total.toLocaleString()} — £{Math.round(total * 1.12).toLocaleString()}
        </div>
        <div style={{ fontSize: "12px", fontFamily: font.body, color: C.muted, marginTop: "3px" }}>
          Includes a 12% variance buffer for unexpected costs
        </div>
      </div>
    </div>
  );
};
const renderMarkdown = (text) => {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    const parts = line.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, j) => {
  if (part.startsWith("**") && part.endsWith("**")) {
    return <strong key={j} style={{ color: C.drift, fontWeight: 700 }}>{part.slice(2, -2)}</strong>;
  }
  if (part.startsWith("*") && part.endsWith("*")) {
    return <strong key={j} style={{ color: C.drift, fontWeight: 700 }}>{part.slice(1, -1)}</strong>;
  }
  return part;
});

    if (line.trim().startsWith("- ")) {
      return (
        <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "6px", paddingLeft: "4px" }}>
          <span style={{ color: C.drift }}>•</span>
          <span>{parts.map(p => typeof p === "string" ? p.replace(/^-\s*/, "") : p)}</span>
        </div>
      );
    }

    if (line.trim().startsWith("###")) {
      return <div key={i} style={{ fontWeight: 700, fontSize: "15px", color: C.drift, marginTop: "14px", marginBottom: "6px" }}>{line.replace(/^###\s*/, "")}</div>;
    }

    if (line.trim() === "---") {
      return <div key={i} style={{ height: "1px", background: C.border, margin: "12px 0" }} />;
    }

    if (line.trim() === "") {
      return <div key={i} style={{ height: "8px" }} />;
    }

    return <div key={i} style={{ marginBottom: "4px" }}>{parts}</div>;
  });
};

const parseOutput = (text) => {
  const sectionMap = {
    ROUTE: { emoji: "🗺", title: "Route Overview" },
    ACCOMMODATION: { emoji: "🏨", title: "Where to Stay" },
    "DAY-BY-DAY": { emoji: "📅", title: "Day-by-Day" },
    SEASON: { emoji: "🌤", title: "Season & Timing" },
    SAFETY: { emoji: "🛡", title: "Safety & Health" },
    VISA: { emoji: "✈️", title: "Visa & Entry" },
    APPS: { emoji: "📱", title: "Essential Apps" },
    LANGUAGE: { emoji: "💬", title: "Language Cheat Sheet" },
    PACKING: { emoji: "🎒", title: "Packing & Prep" },
  };
  const parts = text.split(/\n(?=##\s)/);
  return parts
    .filter((p) => p.trim())
    .map((part, i) => {
      const lines = part.trim().split("\n");
      const header = lines[0].replace(/^##\s*/, "").toUpperCase();
      const body = lines.slice(1).join("\n").trim();
      const key = Object.keys(sectionMap).find((k) => header.includes(k));
      const meta = key ? sectionMap[key] : { emoji: "📌", title: lines[0].replace(/^##\s*/, "") };
      return { ...meta, body, id: i };
    });
};

export default function App() {
  const [step, setStep] = useState(0);
  const [vibeAnswers, setVibeAnswers] = useState({});
  const [vibeQ, setVibeQ] = useState(0);
  const [form, setForm] = useState({
    destination: "", duration: "", budget: "", departure:"",
    startDate: "", group: "", accom: "", pace: "",
    transit: "3", interests: [], avoids: [], notes: "",
  });
  const [previewResult, setPreviewResult] = useState(null);
const [fullResult1, setFullResult1] = useState(null);
const [fullResult2, setFullResult2] = useState(null);
const [unlocked, setUnlocked] = useState(false);
const [loadingStage, setLoadingStage] = useState(null);
const [error, setError] = useState(null);


  const personality = Object.keys(vibeAnswers).length >= 3 ? derivePersonality(vibeAnswers) : null;
  const toggle = (field, val) =>
    setForm((f) => ({
      ...f,
      [field]: f[field].includes(val) ? f[field].filter((x) => x !== val) : [...f[field], val],
    }));
  const setField = (field, val) => setForm((f) => ({ ...f, [field]: val }));
  const canGenerate = form.destination && form.duration && form.budget && form.accom && form.pace && form.interests.length >= 1;

  const callAI = async (prompt) => {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  const data = await res.json();
  const text = data.content?.map((b) => b.text || "").join("\n") || "";
  return text || "Something went wrong generating this part — please try again.";
};

const generatePreview = async () => {
  setLoadingStage("preview");
  setError(null);
  const p = personality || { name: "The Savvy Explorer", desc: "" };
  const prompt = `You are an expert backpacker travel planner. Generate a SHORT preview for this trip.

TRAVELLER PROFILE:
- Travel Personality: ${p.name} — ${p.desc}
- Destination: ${form.destination}
- Duration: ${form.duration} days
- Daily Budget: £${form.budget}/day GBP
- Travel Dates: ${form.startDate || "Flexible"}
- Group: ${groupOptions.find((g) => g.value === form.group)?.label || "Not specified"}
- Accommodation: ${accomOptions.find((o) => o.value === form.accom)?.label}
- Pace: ${paceOptions.find((o) => o.value === form.pace)?.label}
- Interests: ${form.interests.join(", ")}
- Avoid: ${form.avoids.length ? form.avoids.join(", ") : "Nothing specified"}

Respond with EXACTLY these two sections:

## Route Overview
2-3 sentences on the geographic flow (A → B → C) tailored to their pace.

## Day 1
Morning / Afternoon / Evening for day one only, matched to their interests. Short bullet points, not paragraphs.

Write like a well-travelled friend. Concise, specific. Under 250 words total.`;

  try {
    const text = await callAI(prompt);
    setPreviewResult(text);
  } catch {
    setError("Something went wrong. Please try again.");
  } finally {
    setLoadingStage(null);
  }
};

const generateFull1 = async () => {
  setLoadingStage("call1");
  const p = personality || { name: "The Savvy Explorer", desc: "" };
  const isLong = Number(form.duration) > 21;
  const prompt = `You are an expert backpacker travel planner. Continue planning this trip in detail.

TRAVELLER PROFILE:
- Travel Personality: ${p.name}
- Destination: ${form.destination}
- Duration: ${form.duration} days
- Group: ${groupOptions.find((g) => g.value === form.group)?.label || "Not specified"}
- Accommodation: ${accomOptions.find((o) => o.value === form.accom)?.label}
- Pace: ${paceOptions.find((o) => o.value === form.pace)?.label}
- Transit Comfort: ${form.transit}/5
- Interests: ${form.interests.join(", ")}
- Avoid: ${form.avoids.length ? form.avoids.join(", ") : "Nothing specified"}
- Notes: ${form.notes || "None"}

Respond with EXACTLY these sections:

## Top Picks
3 standout highlights of this trip, one line each, the things they absolutely shouldn't miss.

## Accommodation
Personality-matched picks. 2 specific hostels/stays per main location with nightly cost, neighbourhood context, and whether to book ahead or walk in.

${isLong
  ? `## Trip Breakdown
This is a longer trip (${form.duration} days). Structure as phases, covering roughly 2 weeks each — for a 90 day trip this means about 6 phases total, not one per week. Keep each phase to 4-5 sentences maximum, no exceptions.. For each phase: location/region, vibe summary, 3-4 key activities matched to interests, one restaurant recommendation, transit note for the next phase.`
  : `## Day-by-Day Breakdown
Days 2 onwards (day 1 was already covered). Each day: Morning / Afternoon / Evening as short bullet points, matched to interests. Include one restaurant recommendation per day, plus a transit note and one insider tip.`
}

Write like a well-travelled friend. Specific, practical, concise bullet points over long paragraphs. Around 1200 words total.`;

  try {
    const text = await callAI(prompt);
    setFullResult1(text);
  } catch {
    setError("Error in Call 1 + err.message");
  } finally {
    setLoadingStage("call2");
    generateFull2();
  }
};

const generateFull2 = async () => {
  const prompt = `You are an expert backpacker travel planner. Provide the practical essentials for this trip.

Destination: ${form.destination}
Duration: ${form.duration} days
Travel Dates: ${form.startDate || "Flexible"}
Departure location: ${form.departure || "UK"}

Respond with EXACTLY these sections:

## Season & Timing
Weather and crowd expectations for their dates. Include a "Best time to book" subheading with flight booking timing advice.

## Health & Safety
Destination-specific safety tips, vaccinations, common scams. Include an "Emergency Contacts" subheading with local emergency number and nearest embassy/consulate guidance.

## Visa & Entry
Entry requirements for UK, US, EU passport holders. Costs and method.

## Flight Estimate
Rough return flight cost range from ${form.departure || "the UK"} to ${form.destination}, and the best time to book for this trip date.

## Essential Apps
6-8 specific apps for this destination with a reason for each.

## Language Cheat Sheet
10 essential phrases with phonetic pronunciation.

## Packing & Prep
4 highly specific tips for this exact route.

Be specific and concise. Bullet points over paragraphs where possible. Around 1400 words total.`;

    try {
    const text = await callAI(prompt);
    setFullResult2(text);
    setUnlocked(true);
  } catch {
    try {
      const text = await callAI(prompt);
      setFullResult2(text);
      setUnlocked(true);
    } catch (err) {
      setError("Something went wrong loading the final details: " + err.message);
    }
  } finally {
    setLoadingStage(null);
  }
};
    const resetAll = () => {
    setPreviewResult(null);
    setFullResult1(null);
    setFullResult2(null);
    setUnlocked(false);
    setStep(0);
    setVibeQ(0);
    setVibeAnswers({});
    setForm({ destination: "", duration: "", budget: "", departure: "", startDate: "", group: "", accom: "", pace: "", transit: "3", interests: [], avoids: [], notes: "" });
  };

  const renderVibeQuiz = () => {
    const q = vibeQuestions[vibeQ];
    return (
      <div>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <DriftwoodLogo size="large" />
          <div style={{ marginTop: "28px", marginBottom: "8px" }}>
            <span style={{ fontSize: "11px", fontFamily: font.body, fontWeight: 600, color: C.driftMid, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              {vibeQ + 1} of {vibeQuestions.length}
            </span>
          </div>
          <h2 style={{ fontFamily: font.display, fontSize: "26px", color: C.text, margin: "0 0 6px", lineHeight: 1.2, fontWeight: 600 }}>{q.q}</h2>
          <p style={{ color: C.muted, fontSize: "13px", fontFamily: font.body, margin: 0 }}>Tell us who you are as a traveller</p>
        </div>
        <WaveDivider />
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "20px" }}>
          {q.options.map((opt, i) => {
            const selected = vibeAnswers[q.id] === String(i);
            return (
              <button key={i} onClick={() => {
                const next = { ...vibeAnswers, [q.id]: String(i) };
                setVibeAnswers(next);
                setTimeout(() => {
                  if (vibeQ < vibeQuestions.length - 1) setVibeQ((v) => v + 1);
                  else setStep(1);
                }, 280);
              }} style={{
                display: "flex", alignItems: "center", gap: "14px",
                background: selected ? C.driftLight : C.surface,
                border: `1.5px solid ${selected ? C.drift : C.border}`,
                borderRadius: "12px", padding: "15px 18px", cursor: "pointer",
                textAlign: "left", transition: "all 0.15s",
                boxShadow: selected ? `0 2px 8px ${C.drift}20` : "none",
              }}>
                <span style={{ fontSize: "24px", flexShrink: 0 }}>{opt.icon}</span>
                <span style={{ fontSize: "14px", fontFamily: font.body, color: selected ? C.drift : C.textMid, fontWeight: selected ? 600 : 400, lineHeight: 1.4 }}>{opt.label}</span>
              </button>
            );
          })}
        </div>
        {vibeQ > 0 && (
          <button onClick={() => setVibeQ((v) => v - 1)} style={{ marginTop: "16px", background: "transparent", border: "none", color: C.muted, cursor: "pointer", fontSize: "13px", fontFamily: font.body }}>
            ← Previous
          </button>
        )}
      </div>
    );
  };

  const renderTripBasics = () => (
    <div>
      {personality && (
        <div style={{ background: C.driftLight, border: `1px solid ${C.borderDark}`, borderRadius: "12px", padding: "16px 18px", marginBottom: "28px", display: "flex", gap: "12px", alignItems: "flex-start" }}>
          <span style={{ fontSize: "24px" }}>{personality.emoji}</span>
          <div>
            <div style={{ fontSize: "12px", fontFamily: font.body, color: C.driftMid, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "3px" }}>Your travel personality</div>
            <div style={{ fontSize: "15px", fontFamily: font.display, color: C.drift, fontWeight: 600 }}>{personality.name}</div>
            <div style={{ fontSize: "12px", fontFamily: font.body, color: C.muted, marginTop: "2px" }}>{personality.desc}</div>
          </div>
        </div>
      )}
      <h2 style={{ fontFamily: font.display, fontSize: "24px", color: C.text, margin: "0 0 4px", fontWeight: 600 }}>Trip details</h2>
      <p style={{ color: C.muted, fontSize: "13px", fontFamily: font.body, margin: "0 0 28px" }}>Where are you headed and when?</p>
      <div style={{ marginBottom: "22px" }}>
        <Label hint="Country, region, or city — as specific as you like">Destination</Label>
        <TextInput placeholder="e.g. Southern Thailand, Bali, Colombia" value={form.destination} onChange={(v) => setField("destination", v)} />
      </div>
      <div style={{ marginBottom: "22px" }}>
  <Label>How long is the trip?</Label>
  <SelectCard options={durationOptions} value={form.duration} onChange={(v) => setField("duration", v)} cols={2} />
</div>
<div style={{ marginBottom: "22px" }}>
  <Label>Daily Budget (£)</Label>
  <TextInput type="number" placeholder="e.g. 40" value={form.budget} onChange={(v) => setField("budget", v)} />
</div>

      <div style={{ marginBottom: "22px" }}>
        <Label hint="Used to flag weather, crowds and seasonal alerts">Approximate start date</Label>
        <TextInput type="date" value={form.startDate} onChange={(v) => setField("startDate", v)} />
      </div>
      <div style={{ marginBottom: "22px" }}>
        <Label>Who's travelling?</Label>
        <SelectCard options={groupOptions} value={form.group} onChange={(v) => setField("group", v)} cols={4} />
      </div>
            <div style={{ marginBottom: "22px" }}>
        <Label hint="Used to estimate flight costs">Departure airport or region</Label>
        <TextInput placeholder="e.g. Manchester, London Gatwick" value={form.departure} onChange={(v) => setField("departure", v)} />
      </div>
      <NavButtons onBack={() => { setStep(0); setVibeQ(vibeQuestions.length - 1); }} onNext={() => setStep(2)} nextDisabled={!form.destination || !form.duration || !form.budget} />
    </div>
  );

  const renderPreferences = () => (
    <div>
      <h2 style={{ fontFamily: font.display, fontSize: "24px", color: C.text, margin: "0 0 4px", fontWeight: 600 }}>Travel style</h2>
      <p style={{ color: C.muted, fontSize: "13px", fontFamily: font.body, margin: "0 0 28px" }}>How do you like to move through the world?</p>
      <div style={{ marginBottom: "24px" }}><Label>Accommodation vibe</Label><SelectCard options={accomOptions} value={form.accom} onChange={(v) => setField("accom", v)} cols={2} /></div>
      <div style={{ marginBottom: "24px" }}><Label>Travel pace</Label><SelectCard options={paceOptions} value={form.pace} onChange={(v) => setField("pace", v)} cols={3} /></div>
      <div style={{ marginBottom: "24px" }}>
        <Label hint="1 = taxis only  ·  5 = local buses, tuk-tuks, anything goes">Local transit comfort — {form.transit}/5</Label>
        <input type="range" min="1" max="5" value={form.transit} onChange={(e) => setField("transit", e.target.value)}
          style={{ width: "100%", accentColor: C.drift, cursor: "pointer", marginBottom: "4px" }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: C.muted, fontFamily: font.body }}>
          <span>Comfort only</span><span>Local everything</span>
        </div>
      </div>
      <NavButtons onBack={() => setStep(1)} onNext={() => setStep(3)} nextDisabled={!form.accom || !form.pace} />
    </div>
  );

  const renderFinalDetails = () => (
    <div>
      <h2 style={{ fontFamily: font.display, fontSize: "24px", color: C.text, margin: "0 0 4px", fontWeight: 600 }}>Final touches</h2>
      <p style={{ color: C.muted, fontSize: "13px", fontFamily: font.body, margin: "0 0 28px" }}>Almost there — what makes this trip yours?</p>
      <div style={{ marginBottom: "24px" }}><Label hint="Pick as many as you like">Top interests</Label><PillToggle options={interestOptions} values={form.interests} onChange={(v) => toggle("interests", v)} /></div>
      <div style={{ marginBottom: "24px" }}><Label hint="Optional — we'll steer well clear">Absolute avoids</Label><PillToggle options={avoidOptions} values={form.avoids} onChange={(v) => toggle("avoids", v)} /></div>
      <div style={{ marginBottom: "24px" }}>
        <Label hint="Dietary needs, injuries, first solo trip, travelling with kids...">Anything else?</Label>
        <textarea value={form.notes} onChange={(e) => setField("notes", e.target.value)} placeholder="e.g. vegetarian, bad knee, want to avoid tourist traps..."
          style={{ width: "100%", boxSizing: "border-box", minHeight: "90px", border: `1.5px solid ${C.border}`, borderRadius: "10px", padding: "13px 16px", fontSize: "14px", fontFamily: font.body, color: C.text, background: C.surface, outline: "none", resize: "vertical" }} />
      </div>
      {error && <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "10px", padding: "12px 16px", color: C.error, fontSize: "13px", fontFamily: font.body, marginBottom: "16px" }}>{error}</div>}
      <NavButtons onBack={() => setStep(2)} onNext={generatePreview} nextLabel={loadingStage ? "Building your itinerary…" : "Build My Itinerary"} nextDisabled={!canGenerate || loadingStage} />
      {!canGenerate && <p style={{ fontSize: "12px", color: C.muted, textAlign: "center", marginTop: "10px", fontFamily: font.body }}>Select at least one interest to continue</p>}
    </div>
  );

  const renderPreview = () => {
    const sections = parseOutput(previewResult);
  const p = personality || { name: "The Savvy Explorer", emoji: "🧭" };
  return (
    <div>
      <div style={{ background: `linear-gradient(135deg, ${C.drift} 0%, #3D2B1A 100%)`, borderRadius: "16px", padding: "28px", marginBottom: "20px", color: "#fff" }}>
        <div style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, opacity: 0.7, marginBottom: "8px", fontFamily: font.body }}>Your Driftwood Preview</div>
        <h2 style={{ fontFamily: font.display, fontSize: "30px", margin: "0 0 4px", fontWeight: 600 }}>{form.destination}</h2>
        <div style={{ fontSize: "14px", opacity: 0.8, fontFamily: font.body }}>{form.duration} days · £{form.budget}/day · {p.emoji} {p.name}</div>
      </div>

      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "16px", padding: "24px", marginBottom: "16px" }}>
        <OutputSection emoji="💰" title="Budget Breakdown">
          <BudgetVisualiser budget={Number(form.budget)} duration={Number(form.duration)} />
        </OutputSection>
      </div>

      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "16px", padding: "24px", marginBottom: "20px" }}>
        {sections.map((s, i) => (
          <OutputSection key={s.id} emoji={s.emoji} title={s.title} last={i === sections.length - 1}>
            <div style={{ fontSize: "14px", lineHeight: "1.85", color: C.textMid, fontFamily: font.body }}>{renderMarkdown(s.body)}</div>
          </OutputSection>
        ))}
      </div>

{error && (
  <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "10px", padding: "12px 16px", color: C.error, fontSize: "13px", fontFamily: font.body, marginBottom: "16px" }}>
    {error}
  </div>
)}
      {!fullResult1 && !fullResult2 && loadingStage !== "call1" && loadingStage !== "call2" && (
        <div style={{ background: C.driftLight, border: `1px solid ${C.borderDark}`, borderRadius: "16px", padding: "24px", textAlign: "center", marginBottom: "20px" }}>
          <div style={{ fontSize: "13px", fontFamily: font.body, color: C.muted, marginBottom: "14px" }}>
            🔒 The full itinerary includes day-by-day plans, accommodation, safety, visas, apps, language and packing
          </div>
          <button onClick={generateFull1} style={{ width: "100%", background: `linear-gradient(135deg, ${C.drift}, ${C.driftMid})`, border: "none", borderRadius: "10px", padding: "16px", fontSize: "15px", fontWeight: 600, color: "#fff", cursor: "pointer", fontFamily: font.body }}>
            Unlock Full Itinerary — £5.99
          </button>
        </div>
      )}

      {(loadingStage === "call1" || loadingStage === "call2") && (
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <div style={{ fontSize: "13px", fontFamily: font.body, color: C.muted }}>
            {loadingStage === "call1" ? "Building your days and stays…" : "Adding the essentials…"}
          </div>
        </div>
      )}

      {fullResult1 && (
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "16px", padding: "24px", marginBottom: "16px" }}>
          {parseOutput(fullResult1).map((s, i) => (
            <OutputSection key={s.id} emoji={s.emoji} title={s.title} last={i === parseOutput(fullResult1).length - 1}>
              <div style={{ fontSize: "14px", lineHeight: "1.85", color: C.textMid, fontFamily: font.body }}>{renderMarkdown(s.body)}</div>
            </OutputSection>
          ))}
        </div>
      )}

      {fullResult2 && (
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "16px", padding: "24px", marginBottom: "20px" }}>
          {parseOutput(fullResult2).map((s, i) => (
            <OutputSection key={s.id} emoji={s.emoji} title={s.title} last={i === parseOutput(fullResult2).length - 1}>
              <div style={{ fontSize: "14px", lineHeight: "1.85", color: C.textMid, fontFamily: font.body }}>{renderMarkdown(s.body)}</div>
            </OutputSection>
          ))}
        </div>
      )}

      {unlocked && (
        <button onClick={resetAll} style={{ width: "100%", background: "transparent", border: `1.5px solid ${C.drift}`, color: C.drift, borderRadius: "10px", padding: "14px", fontSize: "15px", fontWeight: 600, cursor: "pointer", fontFamily: font.body }}>
          ← Plan Another Trip
        </button>
            )}
    </div>
  );
};

  return (

    <div style={{ minHeight: "100vh", background: C.bg }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10, boxShadow: "0 1px 8px rgba(0,0,0,0.04)" }}>
        <DriftwoodLogo />
        {!previewResult && (
          <span style={{ fontSize: "10px", fontFamily: font.body, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", background: C.driftLight, color: C.driftMid, padding: "4px 10px", borderRadius: "20px", border: `1px solid ${C.borderDark}` }}>
            Beta
          </span>
        )}
      </div>

      <div style={{ maxWidth: "580px", margin: "0 auto", padding: "36px 20px 80px" }}>
        <>
{!previewResult && !loadingStage && step === 0 && <div><ProgressBar step={0} />{renderVibeQuiz()}</div>}
{!previewResult && !loadingStage && step === 1 && <div><ProgressBar step={1} />{renderTripBasics()}</div>}
{!previewResult && !loadingStage && step === 2 && <div><ProgressBar step={2} />{renderPreferences()}</div>}
{!previewResult && !loadingStage && step === 3 && <div><ProgressBar step={3} />{renderFinalDetails()}</div>}
{loadingStage === "preview" && (
  <div style={{ textAlign: "center", padding: "80px 20px" }}>
    <DriftwoodLogo size="large" />
    <div style={{ marginTop: "40px", fontSize: "13px", fontFamily: font.body, color: C.muted }}>Plotting your route…</div>
  </div>
)}

{previewResult && renderPreview()}
</>
      </div>
    </div>
  );
}
