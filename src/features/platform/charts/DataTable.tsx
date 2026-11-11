import { cn } from "@/lib/cn";

export type TableColumn = { key: string; label: string; numeric?: boolean };

export type TableSpec = {
  caption: string;
  columns: TableColumn[];
  rows: Array<Record<string, string | number | null>>;
};

/** The accessible twin of a chart: every value, in order, with real headers. */
export function DataTable({ caption, columns, rows }: TableSpec) {
  return (
    <div className="-mx-1 overflow-x-auto px-1">
      <table className="w-full border-collapse text-[13.5px]">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-line">
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={cn(
                  "whitespace-nowrap pb-2.5 pr-4 font-medium text-muted last:pr-0",
                  column.numeric ? "text-right" : "text-left",
                )}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-line/70 last:border-0">
              {columns.map((column, c) => {
                const value = row[column.key];
                const Cell = c === 0 ? "th" : "td";
                return (
                  <Cell
                    key={column.key}
                    scope={c === 0 ? "row" : undefined}
                    className={cn(
                      "py-2.5 pr-4 text-ink last:pr-0",
                      c === 0 && "text-left font-normal",
                      column.numeric && "text-right tabular-nums",
                    )}
                  >
                    {value === null || value === undefined ? (
                      <>
                        <span aria-hidden="true" className="text-muted">
                          &mdash;
                        </span>
                        <span className="sr-only">Not available</span>
                      </>
                    ) : (
                      value
                    )}
                  </Cell>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
