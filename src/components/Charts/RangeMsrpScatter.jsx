import { useMemo, memo } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import TooltipIcon from "../Common/TooltipIcon";

const formatMsrpTick = (v) => {
  if (!v && v !== 0) return v;
  if (Math.abs(v) >= 1000) return `$${Math.round(v / 1000)}k`;
  return `$${v}`;
};

const CustomDot = (props) => {
  // props contain cx, cy, fill etc.
  const { cx, cy, fill } = props;
  if (cx === undefined || cy === undefined) return null;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={4} // radius, tweak for size
      fill={fill}
      stroke="#ffffff"
      strokeWidth={0.6}
      opacity={0.85}
    />
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;
  const p = payload[0].payload; // our data point
  return (
    <div
      style={{
        background: "white",
        padding: 8,
        borderRadius: 6,
        boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
        fontSize: 13,
        color: "#111827",
      }}
    >
      {p.model ? (
        <div style={{ fontWeight: 600, marginBottom: 6 }}>Model: {p.model}</div>
      ) : null}
      <div>
        MSRP: <strong>{`$${Math.round(p.y).toLocaleString()}`}</strong>
      </div>
      <div>
        Range: <strong>{p.x} mi</strong>
      </div>
    </div>
  );
};

const RangeMsrpScatter = ({ data = [] }) => {
  const points = useMemo(() => {
    const filtered = data.filter(
      (d) =>
        d["Electric Range"] &&
        d["Electric Range"] > 0 &&
        d["Base MSRP"] &&
        d["Base MSRP"] > 0
    );
    const sample = filtered.slice();
    return sample.map((d) => ({
      x: d["Electric Range"],
      y: d["Base MSRP"],
      model: d.Model,
      type: d["Electric Vehicle Type"],
    }));
  }, [data]);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-sm font-medium mb-2">
        Range vs Base MSRP (sample){" "}
        <TooltipIcon text="Each dot is a vehicle model (sampled). X-axis = electric range in miles, Y-axis = MSRP in USD." />
      </h3>
      <div style={{ width: "100%", height: 320 }}>
        <ResponsiveContainer>
          <ScatterChart margin={{ top: 10, right: 12, left: 12, bottom: 10 }}>
            <XAxis
              type="number"
              dataKey="x"
              name="Range"
              tickFormatter={(v) => `${v} mi`}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="MSRP"
              tickFormatter={formatMsrpTick}
              width={80}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ strokeDasharray: "3 3" }}
            />
            <Legend
              verticalAlign="top"
              height={28}
              iconSize={12}
              wrapperStyle={{ paddingRight: 20 }}
            />
            <Scatter
              data={points.filter(
                (p) => p.type === "Battery Electric Vehicle (BEV)"
              )}
              fill="#22c55e"
              name="BEV"
              shape={CustomDot}
            />
            <Scatter
              data={points.filter(
                (p) => p.type === "Plug-in Hybrid Electric Vehicle (PHEV)"
              )}
              fill="#3b82f6"
              name="PHEV"
              shape={CustomDot}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <div className="text-xs text-gray-500 mt-2">
        Note: MSRP has many missing/zero values in the sample dataset.
      </div>
    </div>
  );
};

export default memo(RangeMsrpScatter);
