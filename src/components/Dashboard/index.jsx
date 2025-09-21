import { useEffect, useState, useMemo, useTransition } from "react";
import Select from "react-select";

import { loadCSV } from "../../lib/loadCSV";
import DashboardHeaderSection from "./DashboardHeaderSection";
import TopMakesChart from "../Charts/TopMakesChart";
import RangeMsrpScatter from "../Charts/RangeMsrpScatter";
import InlineLoader from "../Common/InlineLoader";
import FilterStroke from "../Common/FilterStroke";
import { rsStyles, viewOptions } from "../../lib/constants";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [selectedMake, setSelectedMake] = useState(null);
  const [makesView, setMakesView] = useState(12); // default top 12
  const [makeSearch, setMakeSearch] = useState("");

  const [isPending, startTransition] = useTransition();

  const makesSorted = useMemo(() => {
    const counts = {};
    data.forEach((d) => {
      if (!d.Make) return;
      counts[d.Make] = (counts[d.Make] || 0) + 1;
    });
    const arr = Object.entries(counts).map(([make, count]) => ({
      make,
      count,
    }));
    arr.sort((a, b) => b.count - a.count); // descending
    return arr; // full sorted list
  }, [data]);

  const filteredMakes = useMemo(() => {
    const searched = makeSearch.trim().toLowerCase();
    const base = makesSorted.filter((m) =>
      m.make.toLowerCase().includes(searched)
    );
    if (makesView === "all") return base;
    return base.slice(0, Number(makesView));
  }, [makesSorted, makesView, makeSearch]);

  // Pre-index dataset by Make once for faster filtering
  const makeIndex = useMemo(() => {
    const index = {};
    data.forEach((d) => {
      if (!index[d.Make]) index[d.Make] = [];
      index[d.Make].push(d);
    });
    return index;
  }, [data]);

  useEffect(() => {
    getCsvData();
  }, []);

  const handleSelectMake = (make) => {
    startTransition(() => {
      setSelectedMake(make);
    });
  };

  const getCsvData = () => {
    setLoading(true);
    loadCSV()
      .then((rows) => {
        setData(rows);
        setLoading(false);
      })
      .catch((e) => {
        setErr(e.message || String(e));
        setLoading(false);
      });
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <InlineLoader />
      </div>
    );

  if (err)
    return (
      <div className="p-8 text-center text-red-600">
        Error loading CSV: {err}
      </div>
    );

  const filtered = selectedMake ? makeIndex[selectedMake] || [] : data;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">MapUp — EV Population Dashboard</h1>
        <div className="text-sm text-gray-500">Rows: {data.length}</div>
      </header>

      {/* Show filter status */}
      {selectedMake ? (
        <div className="mb-2 flex items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-sm font-medium shadow-sm">
              <FilterStroke />
              Filtering by{" "}
              <span className="ml-2 font-semibold uppercase">
                {selectedMake}
              </span>
            </span>

            <button
              onClick={() => setSelectedMake(null)}
              type="button"
              className="px-3 py-1 text-sm font-medium rounded-full bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="Reset filter"
            >
              Reset filter
            </button>
          </div>
          {isPending && (
            <div className="text-xs text-slate-400">Updating dashboard...</div>
          )}
        </div>
      ) : (
        <div className="mb-2 text-sm text-slate-500">
          Click any make in <span className="font-medium">Top Makes</span> to
          filter the dashboard. This will update KPIs, Model Year Distribution,
          and the EV Type Split.
        </div>
      )}

      {/* Filter-dependent section */}
      <DashboardHeaderSection isFiltered={!!selectedMake} data={filtered} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        {/* Left column: controls + chart */}
        <div>
          {/* Controls above TopMakesChart */}
          <div className="flex items-center gap-3 mb-3">
            <label className="text-sm text-slate-600">View:</label>

            <div style={{ minWidth: 160 }}>
              <Select
                options={viewOptions}
                value={viewOptions.find((o) => o.value === makesView)}
                onChange={(opt) => setMakesView(opt.value)}
                styles={rsStyles}
                isSearchable={false}
                aria-label="Select Top N makes"
              />
            </div>

            <input
              value={makeSearch}
              onChange={(e) => setMakeSearch(e.target.value)}
              placeholder="Search makes..."
              className="ml-4 px-2 py-1 border rounded text-sm"
            />
          </div>

          {/* Chart itself */}
          <TopMakesChart
            makesList={filteredMakes}
            onSelectMake={handleSelectMake}
            selectedMake={selectedMake}
          />
        </div>

        {/* Right column: scatter plot */}
        <RangeMsrpScatter data={data} />
      </div>

      <div className="mt-6 bg-white rounded p-4 shadow">
        <details>
          <summary className="cursor-pointer">
            Raw data preview (first 50 rows)
          </summary>
          <div className="overflow-auto mt-2">
            <table className="min-w-full text-sm">
              <thead className="text-left text-xs text-gray-500">
                <tr>
                  <th>VIN</th>
                  <th>Make</th>
                  <th>Model</th>
                  <th>Year</th>
                  <th>Type</th>
                  <th>Range</th>
                  <th>MSRP</th>
                </tr>
              </thead>
              <tbody>
                {data.slice(0, 50).map((r, idx) => (
                  <tr
                    key={
                      r["VIN (1-10)"]
                        ? `${r["VIN (1-10)"]}-${idx}`
                        : `row-${idx}`
                    }
                    className="border-t"
                  >
                    <td>{r["VIN (1-10)"]}</td>
                    <td>{r.Make}</td>
                    <td>{r.Model}</td>
                    <td>{r["Model Year"]}</td>
                    <td>{r["Electric Vehicle Type"]}</td>
                    <td>{r["Electric Range"]}</td>
                    <td>{r["Base MSRP"]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </div>
    </div>
  );
}
