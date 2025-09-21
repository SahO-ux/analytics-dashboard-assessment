import { useMemo, useState, useEffect, useRef, memo } from "react";

import { fmt } from "../../lib/constants";
import TooltipIcon from "../Common/TooltipIcon";

const KPICard = ({ label, value, hint, isFiltered, flash = false, title }) => {
  return (
    <div
      className={`bg-white rounded-2xl p-4 shadow-sm flex-1 min-w-[160px] transition-all
        ${isFiltered ? "ring-2 ring-blue-100" : ""}
        ${flash ? "animate-pulse" : ""}`}
      title={title}
      role="region"
      aria-label={label}
    >
      <div className="flex items-center gap-2">
        <div className="text-xs text-gray-500">{label}</div>
        {title && <TooltipIcon text={title} />}
      </div>

      <div
        className="mt-1 text-2xl font-semibold"
        aria-live="polite" // For Screen readers
        aria-atomic="true"
      >
        {value}
      </div>
      {hint && <div className="text-xs text-gray-400 mt-2">{hint}</div>}
    </div>
  );
};

const KPIs = ({ data = [], isFiltered = false }) => {
  // flash state: when isFiltered toggles, briefly flash KPI cards
  const prevFilteredRef = useRef(isFiltered);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    // If isFiltered changed since last render, trigger flash
    if (prevFilteredRef.current !== isFiltered) {
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 500); // 300ms flash
      prevFilteredRef.current = isFiltered;
      return () => clearTimeout(t);
    } else {
      prevFilteredRef.current = isFiltered;
    }
  }, [isFiltered]);

  // Memoize computations
  const { total, evTypeCounts, makeCounts, avgRange } = useMemo(() => {
    const evTypeCounts = {};
    const makeCounts = {};
    let rangeSum = 0;
    let rangeCount = 0;

    for (let i = 0; i < data.length; i++) {
      const r = data[i];

      // EV type counts
      const t = r["Electric Vehicle Type"] || "Unknown";
      evTypeCounts[t] = (evTypeCounts[t] || 0) + 1;

      // Make counts
      const mk = r.Make || "Unknown";
      makeCounts[mk] = (makeCounts[mk] || 0) + 1;

      // Range stats (ignore null/0)
      const rng = Number(r["Electric Range"]);
      if (!Number.isNaN(rng) && rng > 0) {
        rangeSum += rng;
        rangeCount++;
      }
    }

    const avgRange = rangeCount ? Math.round(rangeSum / rangeCount) : null;

    return {
      total: data.length,
      evTypeCounts,
      makeCounts,
      avgRange,
    };
  }, [data]);

  // derive top make (safely)
  const topMakeEntry = useMemo(() => {
    const entries = Object.entries(makeCounts);
    if (!entries.length) return ["-", 0];
    entries.sort((a, b) => b[1] - a[1]);
    return entries[0];
  }, [makeCounts]);

  const avgRangeDisplay = avgRange !== null ? `${avgRange} mi` : "N/A";

  return (
    <div className={"flex gap-4 flex-wrap"}>
      <KPICard
        isFiltered={isFiltered}
        flash={flash}
        label="Total EVs"
        value={fmt.format(total)}
      />
      <KPICard
        label="BEV (count)"
        value={fmt.format(evTypeCounts["Battery Electric Vehicle (BEV)"] || 0)}
        isFiltered={isFiltered}
        flash={flash}
      />
      <KPICard
        label="PHEV (count)"
        value={fmt.format(
          evTypeCounts["Plug-in Hybrid Electric Vehicle (PHEV)"] || 0
        )}
        isFiltered={isFiltered}
        flash={flash}
      />
      <KPICard
        label={`${isFiltered ? "Selected" : "Top"} Make`}
        value={`${topMakeEntry[0]} (${fmt.format(topMakeEntry[1])})`}
        isFiltered={isFiltered}
        flash={flash}
      />
      <KPICard
        label="Avg electric range"
        value={avgRangeDisplay}
        isFiltered={isFiltered}
        flash={flash}
        hint="ignores 0 / missing values"
        // tooltip via title - explains zeros excluded
        title="Average computed by excluding 0 / missing values in Electric Range."
      />
    </div>
  );
};

export default memo(KPIs);
