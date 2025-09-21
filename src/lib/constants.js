const MAX_MAKES_IN_CHART = 40;

// formatter for readability
const fmt = new Intl.NumberFormat("en-IN");

// const COLORS = [
//   "#2563EB", // Blue
//   "#16A34A", // Green
//   "#F59E0B", // Amber
//   "#DC2626", // Red
//   "#9333EA", // Purple
//   "#0891B2", // Cyan
//   "#64748B", // Slate
//   "#E11D48", // Rose
//   "#0D9488", // Teal
//   "#CA8A04", // Yellow
// ];

const COLORS = [
  "#1E3A8A", // Navy Blue
  "#0369A1", // Teal Blue
  "#0F766E", // Deep Teal
  "#4D7C0F", // Olive Green
  "#CA8A04", // Muted Gold
  "#92400E", // Earthy Brown
  "#374151", // Neutral Gray
];

const viewOptions = [
  { value: 5, label: "Top 5" },
  { value: 10, label: "Top 10" },
  { value: 12, label: "Top 12" },
  { value: 25, label: "Top 25" },
  { value: "all", label: "All" },
];

// small custom style so react-select looks a bit softer with Tailwind
const rsStyles = {
  control: (provided) => ({ ...provided, minWidth: 140, borderRadius: 8 }),
  menu: (provided) => ({ ...provided, borderRadius: 8 }),
  singleValue: (provided) => ({ ...provided, fontSize: 14 }),
};

export { viewOptions, rsStyles, MAX_MAKES_IN_CHART, fmt, COLORS };
