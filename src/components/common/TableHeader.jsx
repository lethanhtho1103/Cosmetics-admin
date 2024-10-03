import { ChevronUp, ChevronDown } from "lucide-react";

const TableHeader = ({ columns, sortConfig, handleSort }) => {
  return (
    <thead>
      <tr>
        {columns.map((col) => (
          <th
            key={col.key}
            className={`px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider ${
              col.sortable ? "cursor-pointer" : ""
            }`}
            onClick={() => col.sortable && handleSort(col.key)}
          >
            {col.label}
            {sortConfig.key === col.key &&
              (sortConfig.direction === "ascending" ? (
                <ChevronUp className="inline ml-2 text-blue-400" />
              ) : (
                <ChevronDown className="inline ml-2 text-blue-400" />
              ))}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;
