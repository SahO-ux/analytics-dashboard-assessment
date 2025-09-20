import Papa from "papaparse";

/**
 * loadCSV(url) => Promise<rowsArray>
 * expects CSV placed in /data-to-visualize/Electric_Vehicle_Population_Data.csv
 */
export function loadCSV(
  url = "/data-to-visualize/Electric_Vehicle_Population_Data.csv"
) {
  return new Promise((resolve, reject) => {
    Papa.parse(url, {
      download: true, // Indicates to download the file from a URL
      header: true, // Indicates the first row contains headers
      dynamicTyping: false, // we'll sanitize manually
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors?.length) {
          console.warn("CSV parse warnings:", results.errors.slice(0, 5));
        }
        // Basic cleaning & normalize column names
        const rows = results.data.map((r) => {
          return {
            // keep raw fields, but parse numeric ones:
            ...r,
            "Model Year":
              parseInt((r["Model Year"] || "").toString().replace(/\D/g, "")) ||
              null,
            "Electric Range":
              Number(
                (r["Electric Range"] || "").toString().replace(/[^0-9.]/g, "")
              ) || null,
            "Base MSRP":
              Number(
                (r["Base MSRP"] || "").toString().replace(/[^0-9.]/g, "")
              ) || null,
          };
        });
        resolve(rows);
      },
      error: (err) => reject(err),
    });
  });
}
