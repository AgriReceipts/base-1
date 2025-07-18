import api from "@/lib/axiosInstance";
import { useAuthStore } from "@/stores/authStore";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Loader2,
  Search,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ReceiptModal from "./ReceiptModal";
import type { DetailedReceipt } from "@/types/receipt";
import toast from "react-hot-toast";
import { useDebounce } from "use-debounce";

interface Committee {
  id: string;
  name: string;
}

type FilterChangeEvent = React.ChangeEvent<
  HTMLInputElement | HTMLSelectElement
>;

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const ViewReceipts = () => {
  const { user, committee } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const [receipts, setReceipts] = useState<DetailedReceipt[]>([]);
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [, setError] = useState("");
  const [selectedReceiptId, setSelectedReceiptId] = useState<string | null>(
    null,
  );

  // Filters state
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    natureOfReceipt: searchParams.get("natureOfReceipt") || "",
    committeeId: searchParams.get("committeeId") || "",
    startDate: searchParams.get("startDate") || "",
    endDate: searchParams.get("endDate") || "",
  });

  // Debounce search input
  const [debouncedSearch] = useDebounce(filters.search, 500);

  // Memoize query params
  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", searchParams.get("page") || "1");
    params.set("limit", searchParams.get("limit") || "10");
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (filters.natureOfReceipt)
      params.set("natureOfReceipt", filters.natureOfReceipt);
    if (user?.designation === "ad" && filters.committeeId)
      params.set("committeeId", filters.committeeId);
    if (filters.startDate) params.set("startDate", filters.startDate);
    if (filters.endDate) params.set("endDate", filters.endDate);
    return params;
  }, [
    searchParams,
    debouncedSearch,
    filters.natureOfReceipt,
    filters.committeeId,
    filters.startDate,
    filters.endDate,
    user?.designation,
  ]);

  const fetchAllCommittees = async () => {
    try {
      const response = await api.get("/metaData/committees");
      return response.data.data;
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  // Data fetching effect
  useEffect(() => {
    const fetchReceipts = async () => {
      setIsLoading(true);
      setError("");
      try {
        const response = await api.get(
          `/receipts/getAllReceipts?${queryParams.toString()}`,
        );
        setReceipts(response.data.data || []);
        setPagination(response.data.pagination || null);
      } catch (err) {
        setReceipts([]);
        setPagination(null);
        setError(
          "Failed to fetch receipts. Please check your connection and try again.",
        );
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReceipts();
  }, [queryParams]);

  // Fetch committees if user is admin
  useEffect(() => {
    if (user?.designation === "ad") {
      fetchAllCommittees().then(setCommittees);
    }
  }, [user?.designation]);

  //  a separate effect to update URL params only when debounced search changes:
  useEffect(() => {
    const currentSearch = searchParams.get("search") || "";

    // Only update URL if the debounced search is different from current URL search
    if (debouncedSearch !== currentSearch) {
      const newParams = new URLSearchParams(searchParams);

      if (debouncedSearch) {
        newParams.set("search", debouncedSearch);
      } else {
        newParams.delete("search");
      }

      // Only reset to first page when search actually changes
      newParams.set("page", "1");

      setSearchParams(newParams, { replace: true });
    }
  }, [debouncedSearch, searchParams, setSearchParams]);

  // Update the handleFilterChange function to not reset page for search:
  const handleFilterChange = (e: FilterChangeEvent) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));

    // Only reset page and update URL for non-search filters
    if (name !== "search") {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("page", "1");
      if (value) {
        newParams.set(name, value);
      } else {
        newParams.delete(name);
      }
      setSearchParams(newParams);
    }
  };

  // Add this effect to sync filters when URL changes
  useEffect(() => {
    setFilters({
      search: searchParams.get("search") || "",
      natureOfReceipt: searchParams.get("natureOfReceipt") || "",
      committeeId: searchParams.get("committeeId") || "",
      startDate: searchParams.get("startDate") || "",
      endDate: searchParams.get("endDate") || "",
    });
  }, [searchParams]);

  const resetFilters = () => {
    setFilters({
      search: "",
      natureOfReceipt: "",
      committeeId: "",
      startDate: "",
      endDate: "",
    });
    const newParams = new URLSearchParams();
    newParams.set("page", "1");
    newParams.set("limit", searchParams.get("limit") || "10");
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage: number) => {
    if (pagination && newPage > 0 && newPage <= pagination.totalPages) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("page", newPage.toString());
      setSearchParams(newParams);
    }
  };

  const handleDownload = useCallback(async (receiptId: string) => {
    try {
      const response = await api.get(`/receipts/download/${receiptId}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `receipt-${receiptId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (err) {
      console.error("Download failed:", err);
      toast.error("Cannot download the receipt");
    }
  }, []);

  const areFiltersActive = Object.values(filters).some((val) => val);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-white p-4 md:p-8">
      <div className="max-w-full mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Receipt Management
          </h1>
          <p className="text-gray-600 max-w-3xl">
            View, search, and manage all receipt records with advanced filtering
            options.
          </p>
        </div>
        {/* Committee Info Banner */}
        {user?.designation !== "ad" && (
          <div className="mb-8 p-4 rounded-xl bg-white border border-blue-100 shadow-xs">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-blue-100 text-blue-600 mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-800">
                  Committee:{" "}
                  <span className="text-blue-600">{committee?.name}</span>
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  You are viewing receipts filtered for your assigned committee.
                </p>
              </div>
            </div>
          </div>
        )}
        {/* Filters Card */}
        <div className="mb-8 bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blue-500 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                  clipRule="evenodd"
                />
              </svg>
              Filter Receipts
            </h3>
            <button
              onClick={resetFilters}
              disabled={!areFiltersActive}
              className={`inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                areFiltersActive
                  ? "bg-white text-gray-700 hover:bg-gray-50"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              <X className="h-4 w-4 mr-2" />
              Reset Filters
            </button>
          </div>
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Input */}
            <div>
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Search Receipts
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="search"
                  id="search"
                  placeholder="Receipt #, Book #"
                  value={filters.search}
                  onChange={handleFilterChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {filters.search && (
                  <button
                    onClick={() => setFilters({ ...filters, search: "" })}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
            </div>

            {/* Nature of Receipt Filter */}
            <div>
              <label
                htmlFor="natureOfReceipt"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Receipt Type
              </label>
              <select
                name="natureOfReceipt"
                id="natureOfReceipt"
                value={filters.natureOfReceipt}
                onChange={handleFilterChange}
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Types</option>
                <option value="mf">Market Fees (MF)</option>
                <option value="lc">License Fees (LF)</option>
                <option value="others">Other</option>
              </select>
            </div>

            {/* Date Range */}
            <div className="md:col-span-2 grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  From Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  id="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                  className="block w-full py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="endDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  To Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  id="endDate"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                  className="block w-full py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Committee Filter for Admin */}
            {user?.designation === "ad" && (
              <div className="md:col-span-2">
                <label
                  htmlFor="committeeId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Committee
                </label>
                <select
                  name="committeeId"
                  id="committeeId"
                  value={filters.committeeId}
                  onChange={handleFilterChange}
                  className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Committees</option>
                  {committees.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
        {/* Receipts Table Card */}
        <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">Receipt Records</h3>
            {pagination && (
              <div className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-medium">
                  {(pagination.page - 1) * pagination.limit + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total,
                  )}
                </span>{" "}
                of <span className="font-medium">{pagination.total}</span>{" "}
                results
              </div>
            )}
          </div>
          <div className="relative overflow-x-auto">
            {/* Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 bg-white/80 z-10 flex flex-col items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="relative">
                    <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                      <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                    </div>
                    <div className="absolute inset-0 rounded-full border-t-2 border-b-2 border-blue-500 animate-spin"></div>
                  </div>
                  <p className="mt-4 text-gray-600">Loading receipts...</p>
                </div>
              </div>
            )}
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Receipt/Book #
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Trader
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Payee
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Fees Paid
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Signed By
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {receipts.length > 0 ? (
                  receipts.map((receipt) => (
                    <tr
                      key={receipt.id}
                      className="hover:bg-blue-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {receipt.receiptNumber}
                        </div>
                        <div className="text-sm text-gray-500">
                          {receipt.bookNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(receipt.receiptDate).toLocaleDateString(
                            "en-IN",
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {receipt.trader?.name || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {receipt.payeeName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ₹{Number(receipt.feesPaid).toLocaleString("en-IN")}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            receipt.natureOfReceipt === "mf"
                              ? "bg-blue-100 text-blue-800"
                              : receipt.natureOfReceipt === "lc"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {receipt.natureOfReceipt === "mf"
                            ? "Market Fees"
                            : receipt.natureOfReceipt === "lc"
                              ? "License Fees"
                              : "Other"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {receipt.receiptSignedBy}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => setSelectedReceiptId(receipt.id)}
                          className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-100 transition-colors"
                          aria-label="View receipt details"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        {" "}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12 text-gray-400 mb-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          {" "}
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />{" "}
                        </svg>{" "}
                        <p className="text-lg font-medium">No receipts found</p>{" "}
                        <p className="mt-1">
                          {" "}
                          Try adjusting your search or filter criteria{" "}
                        </p>{" "}
                      </div>{" "}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>{" "}
          {/* Pagination */}{" "}
          {pagination && pagination.total > 0 && (
            <div className="px-5 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between">
              {" "}
              <div className="mb-4 sm:mb-0">
                {" "}
                <p className="text-sm text-gray-700">
                  {" "}
                  Page <span className="font-medium">
                    {pagination.page}
                  </span> of{" "}
                  <span className="font-medium">
                    {pagination.totalPages}
                  </span>{" "}
                </p>{" "}
              </div>{" "}
              <div className="flex items-center space-x-2">
                {" "}
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className={`relative inline-flex items-center px-3 py-2 rounded-lg border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${pagination.page <= 1 ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"}`}
                >
                  {" "}
                  <ChevronLeft className="h-4 w-4" />{" "}
                  <span className="ml-1">Previous</span>{" "}
                </button>{" "}
                <div className="flex items-center space-x-1">
                  {" "}
                  {Array.from(
                    { length: Math.min(5, pagination.totalPages) },
                    (_, i) => {
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.page <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.page >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = pagination.page - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`relative inline-flex items-center px-3 py-2 rounded-lg border text-sm font-medium ${pageNum === pagination.page ? "bg-blue-50 border-blue-500 text-blue-600 z-10" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"}`}
                        >
                          {" "}
                          {pageNum}{" "}
                        </button>
                      );
                    },
                  )}{" "}
                </div>{" "}
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className={`relative inline-flex items-center px-3 py-2 rounded-lg border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${pagination.page >= pagination.totalPages ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"}`}
                >
                  {" "}
                  <span className="mr-1">Next</span>{" "}
                  <ChevronRight className="h-4 w-4" />{" "}
                </button>{" "}
              </div>{" "}
            </div>
          )}{" "}
        </div>{" "}
        {/* Receipt Modal */}{" "}
        {selectedReceiptId && (
          <ReceiptModal
            receiptId={selectedReceiptId}
            onClose={() => setSelectedReceiptId(null)}
            onDownload={handleDownload}
          />
        )}
      </div>
    </div>
  );
};

export default ViewReceipts;
