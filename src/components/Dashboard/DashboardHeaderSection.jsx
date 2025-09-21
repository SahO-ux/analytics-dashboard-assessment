import KPIs from "../Charts/KPIs";
import ModelYearChart from "../Charts/ModelYearChart";
import EVTypePie from "../Charts/EVTypePie";

const DashboardHeaderSection = ({ data, isFiltered }) => {
  return (
    <>
      <KPIs isFiltered={isFiltered} data={data} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        <div className="col-span-2">
          <ModelYearChart isFiltered={isFiltered} data={data} />
        </div>
        <div>
          <EVTypePie isFiltered={isFiltered} data={data} />
        </div>
      </div>
    </>
  );
};

export default DashboardHeaderSection;
