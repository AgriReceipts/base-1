import React from "react";
import OverviewCard from "./OverviewCards";

interface OverviewProps {
  onNavigate: (nav: string) => void;
}

const Overview: React.FC<OverviewProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col w-full mx-auto min-h-screen">
      {/* Overview Cards Section */}
      <div className="relative  px-6">
        <OverviewCard />
      </div>
      <div>
        {/* Two Big Divs Side by Side */}
        <div className="relative  grid grid-cols-1 md:grid-cols-2 gap-8 px-6 ">
          {/* Add Receipt Card */}
          <div className="bg-white rounded-xl shadow-md p-8 border border-green-100 hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center justify-center">
              <div className="bg-green-100 p-4 rounded-full mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Add New Receipt
              </h2>
              <p className="text-gray-500 text-center mb-6">
                Record a new agricultural transaction receipt for purchases,
                sales, or other financial records.
              </p>
              <button
                onClick={() => onNavigate("addReceipt")}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Create Receipt
              </button>
            </div>
          </div>

          {/* View Receipts Card */}
          <div className="bg-white rounded-xl shadow-md p-8 border border-blue-100 hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center justify-center">
              <div className="bg-blue-100 p-4 rounded-full mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                View Receipts
              </h2>
              <p className="text-gray-500 text-center mb-6">
                Access and manage all your existing agricultural transaction
                receipts in one place.
              </p>
              <button
                onClick={() => onNavigate("viewReceipts")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                View All Receipts
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
