export const COLOR_THEMES = [
  { name: "Teal", nav: "linear-gradient(135deg,#0f766e,#0d9488,#14b8a6)", primary: "175 70% 38%", darkPrimary: "175 65% 50%", dot: "#0d9488" },
  { name: "Blue", nav: "linear-gradient(135deg,#1e3a8a,#2563eb,#3b82f6)", primary: "224 76% 48%", darkPrimary: "217 91% 60%", dot: "#2563eb" },
  { name: "Indigo", nav: "linear-gradient(135deg,#312e81,#4338ca,#6366f1)", primary: "239 84% 67%", darkPrimary: "239 84% 67%", dot: "#4338ca" },
  { name: "Purple", nav: "linear-gradient(135deg,#581c87,#7c3aed,#a78bfa)", primary: "263 70% 50%", darkPrimary: "263 70% 58%", dot: "#7c3aed" },
  { name: "Violet", nav: "linear-gradient(135deg,#4c1d95,#6d28d9,#8b5cf6)", primary: "258 90% 66%", darkPrimary: "258 90% 66%", dot: "#6d28d9" },
  { name: "Fuchsia", nav: "linear-gradient(135deg,#86198f,#c026d3,#d946ef)", primary: "293 69% 49%", darkPrimary: "293 69% 58%", dot: "#c026d3" },
  { name: "Pink", nav: "linear-gradient(135deg,#9d174d,#db2777,#ec4899)", primary: "330 81% 60%", darkPrimary: "330 81% 60%", dot: "#db2777" },
  { name: "Rose", nav: "linear-gradient(135deg,#9f1239,#e11d48,#fb7185)", primary: "347 77% 50%", darkPrimary: "347 77% 60%", dot: "#e11d48" },
  { name: "Red", nav: "linear-gradient(135deg,#991b1b,#dc2626,#ef4444)", primary: "0 72% 51%", darkPrimary: "0 72% 58%", dot: "#dc2626" },
  { name: "Orange", nav: "linear-gradient(135deg,#9a3412,#ea580c,#f97316)", primary: "25 95% 53%", darkPrimary: "25 95% 58%", dot: "#ea580c" },
  { name: "Amber", nav: "linear-gradient(135deg,#92400e,#d97706,#f59e0b)", primary: "38 92% 50%", darkPrimary: "38 92% 58%", dot: "#d97706" },
  { name: "Yellow", nav: "linear-gradient(135deg,#854d0e,#ca8a04,#eab308)", primary: "48 96% 53%", darkPrimary: "48 96% 58%", dot: "#ca8a04" },
  { name: "Lime", nav: "linear-gradient(135deg,#3f6212,#65a30d,#84cc16)", primary: "84 81% 44%", darkPrimary: "84 81% 52%", dot: "#65a30d" },
  { name: "Green", nav: "linear-gradient(135deg,#166534,#16a34a,#22c55e)", primary: "142 71% 45%", darkPrimary: "142 71% 52%", dot: "#16a34a" },
  { name: "Emerald", nav: "linear-gradient(135deg,#065f46,#059669,#10b981)", primary: "160 84% 39%", darkPrimary: "160 84% 48%", dot: "#059669" },
  { name: "Cyan", nav: "linear-gradient(135deg,#155e75,#0891b2,#06b6d4)", primary: "189 94% 43%", darkPrimary: "189 94% 50%", dot: "#0891b2" },
  { name: "Sky", nav: "linear-gradient(135deg,#075985,#0284c7,#0ea5e9)", primary: "199 89% 48%", darkPrimary: "199 89% 55%", dot: "#0284c7" },
  { name: "Slate", nav: "linear-gradient(135deg,#1e293b,#475569,#64748b)", primary: "215 16% 47%", darkPrimary: "215 20% 55%", dot: "#475569" },
  { name: "Zinc", nav: "linear-gradient(135deg,#27272a,#52525b,#71717a)", primary: "240 4% 46%", darkPrimary: "240 5% 52%", dot: "#52525b" },
  { name: "Stone", nav: "linear-gradient(135deg,#44403c,#78716c,#a8a29e)", primary: "25 5% 45%", darkPrimary: "25 6% 52%", dot: "#78716c" },
  { name: "Maroon", nav: "linear-gradient(135deg,#7f1d1d,#b91c1c,#dc2626)", primary: "0 74% 42%", darkPrimary: "0 74% 50%", dot: "#b91c1c" },
  { name: "Navy", nav: "linear-gradient(135deg,#172554,#1e3a8a,#1e40af)", primary: "224 76% 38%", darkPrimary: "224 76% 48%", dot: "#1e3a8a" },
  { name: "Forest", nav: "linear-gradient(135deg,#14532d,#15803d,#16a34a)", primary: "142 76% 36%", darkPrimary: "142 76% 44%", dot: "#15803d" },
  { name: "Coffee", nav: "linear-gradient(135deg,#78350f,#a16207,#ca8a04)", primary: "38 88% 40%", darkPrimary: "38 88% 48%", dot: "#a16207" },
];

export const getThemeGradient = () => {
  const idx = parseInt(localStorage.getItem("colorTheme") || "0", 10);
  return COLOR_THEMES[idx]?.nav || COLOR_THEMES[0].nav;
};

export const getThemeIdx = () => {
  return parseInt(localStorage.getItem("colorTheme") || "0", 10);
};
