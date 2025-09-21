import { useMemo, useState, useCallback, useEffect, memo } from "react";
import { DataGrid } from "react-data-grid";
import Select from "react-select";
import _ from "lodash";

import "react-data-grid/lib/styles.css";
import {
  defaultColumns,
  downloadCsv,
  escapeRegexSearchTerm,
} from "../../lib/constants";

/**
 * DataGridView
 * Props:
 *   - data: full array of row objects
 */
const DataGridView = ({ data = [] }) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [debouncedFilter, setDebouncedFilter] = useState(""); // actual filter used
  const [makeFilter, setMakeFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [yearMin, setYearMin] = useState("");
  const [yearMax, setYearMax] = useState("");
  const [sortColumns, setSortColumns] = useState([]);

  // sensible default columns — adjust keys to match your CSV
  const columns = useMemo(() => defaultColumns(), []);

  // debounce handler
  const updateDebouncedFilter = useCallback(
    _.debounce((value) => {
      setDebouncedFilter(value.trim().toLowerCase());
    }, 500),
    []
  );

  // whenever user types, update debounced value
  useEffect(() => {
    updateDebouncedFilter(globalFilter);
  }, [globalFilter, updateDebouncedFilter]);

  const rowsWithId = useMemo(() => {
    return data.map((r, idx) => {
      const vin = r["VIN (1-10)"] || "no-vin";
      const make = (r.Make || "no-make").replace(/\s+/g, "_");
      const model = (r.Model || "no-model").replace(/\s+/g, "_");
      const year = r["Model Year"] || "no-year";
      return { __rowId: `${vin}-${make}-${model}-${year}-${idx}`, ...r };
    });
  }, [data]);

  // unique filter options
  const uniqueMakes = useMemo(() => {
    const s = new Set();
    rowsWithId.forEach((r) => {
      if (r.Make) s.add(r.Make);
    });
    return Array.from(s).sort();
  }, [rowsWithId]);

  const uniqueTypes = useMemo(() => {
    const s = new Set();
    rowsWithId.forEach((r) => {
      if (r["Electric Vehicle Type"]) s.add(r["Electric Vehicle Type"]);
    });
    return Array.from(s).sort();
  }, [rowsWithId]);

  // safer global search using escaped regex
  const matchesGlobal = (row, gf) => {
    if (!gf) return true;
    // escape user search term before building regex
    const esc = escapeRegexSearchTerm(gf);
    try {
      const re = new RegExp(esc, "i");
      const hay = `${row["VIN (1-10)"] || ""} ${row.Make || ""} ${
        row.Model || ""
      } ${row["Model Year"] || ""} ${row["Electric Vehicle Type"] || ""}`;
      return re.test(hay);
    } catch (e) {
      // fallback to includes
      return `${row.Make || ""} ${row.Model || ""}`
        .toLowerCase()
        .includes(gf.toLowerCase());
    }
  };

  // Filtering (uses debounced filter)
  const filteredRows = useMemo(() => {
    const gf = debouncedFilter; // already lowercased by updateDebouncedFilter
    return rowsWithId.filter((r) => {
      if (!r) return false;
      if (makeFilter && r.Make !== makeFilter) return false;
      if (typeFilter && r["Electric Vehicle Type"] !== typeFilter) return false;
      if (yearMin) {
        const y = Number(r["Model Year"]);
        if (!Number.isNaN(y) && y < Number(yearMin)) return false;
      }
      if (yearMax) {
        const y = Number(r["Model Year"]);
        if (!Number.isNaN(y) && y > Number(yearMax)) return false;
      }
      if (!matchesGlobal(r, gf)) return false;
      return true;
    });
  }, [rowsWithId, debouncedFilter, makeFilter, typeFilter, yearMin, yearMax]);

  // handle sorting requested by grid
  const sortedRows = useMemo(() => {
    if (!sortColumns || sortColumns.length === 0) return filteredRows;
    // react-data-grid provides sortColumns array; apply multi-sort
    const sort = sortColumns[0]; // single-column sort is fine for demo
    const sorted = _.cloneDeep(filteredRows).sort((a, b) => {
      const aVal = a[sort.columnKey];
      const bVal = b[sort.columnKey];
      const an = Number(aVal),
        bn = Number(bVal);
      if (!Number.isNaN(an) && !Number.isNaN(bn)) {
        return sort.direction === "ASC" ? an - bn : bn - an;
      }
      const sa = (aVal || "").toString().toLowerCase();
      const sb = (bVal || "").toString().toLowerCase();
      if (sa < sb) return sort.direction === "ASC" ? -1 : 1;
      if (sa > sb) return sort.direction === "ASC" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredRows, sortColumns]);

  // helper for DataGrid: stable row key
  const rowKeyGetter = (row) => row.__rowId;

  // react-select options
  const makeOptions = useMemo(
    () => [
      { value: "", label: "All makes" },
      ...uniqueMakes.map((m) => ({ value: m, label: m })),
    ],
    [uniqueMakes]
  );
  const typeOptions = useMemo(
    () => [
      { value: "", label: "All types" },
      ...uniqueTypes.map((t) => ({ value: t, label: t })),
    ],
    [uniqueTypes]
  );

  return (
    <div className="bg-white p-3 rounded shadow">
      <div className="flex flex-wrap gap-3 items-center mb-3">
        <input
          className="px-2 py-1 border rounded text-sm"
          placeholder="Global search..."
          onChange={(e) => setGlobalFilter(e.target.value)}
        />

        <div style={{ minWidth: 220 }}>
          <Select
            options={makeOptions}
            value={makeOptions.find((o) => o.value === makeFilter)}
            onChange={(opt) => setMakeFilter(opt ? opt.value : "")}
            isSearchable={true}
            placeholder="Filter by make..."
            styles={{ control: (p) => ({ ...p, minHeight: 36 }) }}
          />
        </div>

        <div style={{ minWidth: 200 }}>
          <Select
            options={typeOptions}
            value={typeOptions.find((o) => o.value === typeFilter)}
            onChange={(opt) => setTypeFilter(opt ? opt.value : "")}
            placeholder="Filter by type..."
            styles={{ control: (p) => ({ ...p, minHeight: 36 }) }}
          />
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-500 ml-auto">
          <label>Year</label>
          <input
            className="px-2 py-1 border rounded text-sm w-20"
            placeholder="min"
            value={yearMin}
            onChange={(e) => setYearMin(e.target.value)}
          />
          <input
            className="px-2 py-1 border rounded text-sm w-20"
            placeholder="max"
            value={yearMax}
            onChange={(e) => setYearMax(e.target.value)}
          />
        </div>
      </div>

      <div className="text-sm text-slate-500 mb-2">
        <span className="text-sm text-slate-500 mr-3">
          Showing <strong>{sortedRows.length.toLocaleString()}</strong> results
        </span>
        <button
          type="button"
          onClick={() =>
            downloadCsv(sortedRows, columns, `evs_filtered_${Date.now()}.csv`)
          }
          className="px-3 py-1 bg-green-600 text-white rounded font-medium  hover:bg-green-400"
        >
          Export CSV
        </button>
      </div>

      <div>
        <DataGrid
          className="rdg-light"
          style={{ height: "calc(100vh - 190px)" }}
          columns={columns}
          rows={sortedRows}
          rowKeyGetter={rowKeyGetter}
          defaultColumnOptions={{
            sortable: true,
            resizable: true,
          }}
          sortColumns={sortColumns}
          onSortColumnsChange={setSortColumns}
        />
      </div>
    </div>
  );
};

export default memo(DataGridView);
