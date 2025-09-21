const MAX_MAKES_IN_CHART = 40;

// formatter for readability
const fmt = new Intl.NumberFormat("en-IN");

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

export { viewOptions, rsStyles, MAX_MAKES_IN_CHART, fmt };
