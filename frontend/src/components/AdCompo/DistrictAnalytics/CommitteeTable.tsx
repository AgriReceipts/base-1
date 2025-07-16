import type { CommitteeWiseAchievement } from "@/types/districtAnalytics";
import { formatMoney } from "./PieChart";

interface CommitteeTableProps {
  data: CommitteeWiseAchievement[];
}

export const CommitteeTable: React.FC<CommitteeTableProps> = ({ data }) => {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Committee
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Target (₹ Lakhs)
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Achieved (₹ Lakhs)
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Achievement %
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Receipts
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item) => (
            <tr key={item.committeeId} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {item.committeeName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatMoney(item.marketFeesTarget)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatMoney(item.marketFees)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.achievementPercentage}%
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.totalReceipts.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${
                    item.status === "Met"
                      ? "bg-green-100 text-green-800"
                      : item.status === "On Track"
                        ? "bg-blue-100 text-blue-800"
                        : item.status === "Lagging"
                          ? "bg-yellow-100 text-yellow-800"
                          : item.status === "Not Met"
                            ? "bg-orange-100 text-orange-500"
                            : "bg-red-100 text-red-900"
                  }`}
                >
                  {item.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
