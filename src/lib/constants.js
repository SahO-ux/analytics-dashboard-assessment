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

const defaultColumns = () => [
  { key: "VIN (1-10)", name: "VIN", width: 140, frozen: true },
  { key: "Make", name: "Make", width: 140, frozen: true },
  { key: "Model", name: "Model", width: 220 },
  { key: "Model Year", name: "Year", width: 90 },
  { key: "Electric Vehicle Type", name: "Type", width: 220 },
  {
    key: "Electric Range",
    name: "Range (mi)",
    width: 110,
    renderCell: ({ row }) =>
      row["Electric Range"] ? row["Electric Range"] : "-",
  },
  {
    key: "Base MSRP",
    name: "MSRP",
    width: 120,
    renderCell: ({ row }) => (row["Base MSRP"] ? row["Base MSRP"] : "-"),
  },
  { key: "State", name: "State", width: 90 },
  { key: "City", name: "City", width: 140 },
];

const rowsToCsv = (rows, columns) => {
  if (!rows || !rows.length) return "";
  const header = columns
    .map((c) => `"${(c.name || c.key).replace(/"/g, '""')}"`)
    .join(",");
  const lines = rows.map((r) =>
    columns
      .map((c) => {
        const v = r[c.key];
        if (v == null) return '""';
        return `"${String(v).replace(/"/g, '""')}"`;
      })
      .join(",")
  );
  return [header, ...lines].join("\n");
};

const downloadCsv = (rows, columns, filename = "export.csv") => {
  const csv = rowsToCsv(rows, columns);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

const escapeRegexSearchTerm = (term = "") => {
  return term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

export {
  viewOptions,
  rsStyles,
  MAX_MAKES_IN_CHART,
  fmt,
  COLORS,
  downloadCsv,
  escapeRegexSearchTerm,
  defaultColumns,
};
