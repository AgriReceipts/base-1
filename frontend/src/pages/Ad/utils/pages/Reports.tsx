import React, { useState } from 'react';
import { FileText, Download, Calendar, Filter, BarChart3, MapPin, Package } from 'lucide-react';
import type { Receipt, Target as TargetType } from '../types';
import { committees, commodities } from '../data/committees';
import { useLocalStorage } from '../hooks/useLocalStorage';
import ExportButton from '../components/ExportButton';

const Reports: React.FC = () => {
  const [receipts] = useLocalStorage<Receipt[]>('receipts', []);
  const [targets] = useLocalStorage<TargetType[]>('targets', []);
  const [selectedYear, setSelectedYear] = useState<'2024-25' | '2025-26'>('2025-26');
  const [reportType, setReportType] = useLocalStorage<'market-fees' | 'checkpost' | 'commodity'>('reportType', 'market-fees');
  const [selectedCommodity, setSelectedCommodity] = useLocalStorage<string>('selectedCommodity', '');
  const [selectedMonth, setSelectedMonth] = useLocalStorage<string>('selectedMonth', 'May');
  const [selectedCommittee, setSelectedCommittee] = useLocalStorage<string>('selectedCommittee', 'all');

  const months = ['May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March', 'April'];

  // Market Fees Report (Statement No.1) - Already implemented
  const generateMarketFeesData = () => {
    const marketFeeReceipts = receipts.filter(r => r.natureOfReceipt === 'mf');
    
    let committeesToInclude = committees;
    if (selectedCommittee !== 'all') {
      committeesToInclude = committees.filter(c => c.id === selectedCommittee);
    }

    return committeesToInclude.map((committee, index) => {
      const committeeReceipts = marketFeeReceipts.filter(r => r.committeeId === committee.id);
      
      // Get receipts for current month and year
      const currentMonthReceipts = committeeReceipts.filter(r => {
        const receiptDate = new Date(r.date);
        const receiptMonth = receiptDate.toLocaleString('default', { month: 'long' });
        return r.financialYear === selectedYear && receiptMonth === selectedMonth;
      });

      // Get receipts for same month previous year
      const prevYearMonth = selectedYear === '2025-26' ? '2024-25' : '2023-24';
      const prevMonthReceipts = committeeReceipts.filter(r => {
        const receiptDate = new Date(r.date);
        const receiptMonth = receiptDate.toLocaleString('default', { month: 'long' });
        return r.financialYear === prevYearMonth && receiptMonth === selectedMonth;
      });

      // Get cumulative receipts up to current month
      const monthIndex = months.indexOf(selectedMonth);
      const cumulativeMonths = monthIndex >= 0 ? months.slice(0, monthIndex + 1) : [selectedMonth];
      
      const cumulativeReceipts2024 = committeeReceipts.filter(r => {
        const receiptDate = new Date(r.date);
        const receiptMonth = receiptDate.toLocaleString('default', { month: 'long' });
        return r.financialYear === '2024-25' && cumulativeMonths.includes(receiptMonth);
      });

      const cumulativeReceipts2025 = committeeReceipts.filter(r => {
        const receiptDate = new Date(r.date);
        const receiptMonth = receiptDate.toLocaleString('default', { month: 'long' });
        return r.financialYear === '2025-26' && cumulativeMonths.includes(receiptMonth);
      });

      // Calculate amounts
      const yearlyTarget = targets.find(t => t.committeeId === committee.id && t.financialYear === selectedYear)?.yearlyTarget || 0;
      const monthlyTarget = targets.find(t => t.committeeId === committee.id && t.financialYear === selectedYear)?.monthlyTargets[selectedMonth] || 0;
      
      const currentMonthCollection = currentMonthReceipts.reduce((sum, r) => sum + r.marketFee, 0);
      const prevMonthCollection = prevMonthReceipts.reduce((sum, r) => sum + r.marketFee, 0);
      const difference = currentMonthCollection - prevMonthCollection;
      
      const cumulativeTarget = targets.find(t => t.committeeId === committee.id && t.financialYear === selectedYear)?.monthlyTargets 
        ? cumulativeMonths.reduce((sum, month) => {
            const target = targets.find(t => t.committeeId === committee.id && t.financialYear === selectedYear);
            return sum + (target?.monthlyTargets[month] || 0);
          }, 0) : 0;

      const progressiveTotal2024 = cumulativeReceipts2024.reduce((sum, r) => sum + r.marketFee, 0);
      const progressiveTotal2025 = cumulativeReceipts2025.reduce((sum, r) => sum + r.marketFee, 0);
      const progressiveDifference = progressiveTotal2025 - progressiveTotal2024;
      
      const percentageAchieved = yearlyTarget > 0 ? (progressiveTotal2025 / yearlyTarget) * 100 : 0;

      return {
        slNo: index + 1,
        amcName: committee.name,
        amcCode: committee.code,
        yearlyTarget: yearlyTarget / 100000, // Convert to lakhs
        monthlyTarget: monthlyTarget / 100000,
        currentMonthPrev: prevMonthCollection / 100000,
        currentMonthCurrent: currentMonthCollection / 100000,
        difference: difference / 100000,
        cumulativeTarget: cumulativeTarget / 100000,
        progressiveTotal2024: progressiveTotal2024 / 100000,
        progressiveTotal2025: progressiveTotal2025 / 100000,
        progressiveDifference: progressiveDifference / 100000,
        percentageAchieved: Math.round(percentageAchieved)
      };
    });
  };

  // Checkpost-wise Report (Statement No.2)
  const generateCheckpostData = () => {
    const marketFeeReceipts = receipts.filter(r => r.natureOfReceipt === 'mf');
    const checkpostData: any[] = [];

    (committees.filter(c => selectedCommittee === 'all' || c.id === selectedCommittee)).forEach((committee, committeeIndex) => {
      if (!committee.hasCheckposts) return;
      const committeeReceipts = marketFeeReceipts.filter(r => r.committeeId === committee.id);
      
      committee.checkposts.forEach((checkpost, checkpostIndex) => {
        const checkpostReceipts = committeeReceipts.filter(r => r.checkpostName === checkpost);
        
        // Current month receipts
        const currentMonthReceipts2024 = checkpostReceipts.filter(r => {
          const receiptDate = new Date(r.date);
          const receiptMonth = receiptDate.toLocaleString('default', { month: 'long' });
          return r.financialYear === '2024-25' && receiptMonth === selectedMonth;
        });

        const currentMonthReceipts2025 = checkpostReceipts.filter(r => {
          const receiptDate = new Date(r.date);
          const receiptMonth = receiptDate.toLocaleString('default', { month: 'long' });
          return r.financialYear === '2025-26' && receiptMonth === selectedMonth;
        });

        // Progressive totals up to current month
        const monthIndex = months.indexOf(selectedMonth);
        const cumulativeMonths = monthIndex >= 0 ? months.slice(0, monthIndex + 1) : [selectedMonth];
        
        const progressiveReceipts2024 = checkpostReceipts.filter(r => {
          const receiptDate = new Date(r.date);
          const receiptMonth = receiptDate.toLocaleString('default', { month: 'long' });
          return r.financialYear === '2024-25' && cumulativeMonths.includes(receiptMonth);
        });

        const progressiveReceipts2025 = checkpostReceipts.filter(r => {
          const receiptDate = new Date(r.date);
          const receiptMonth = receiptDate.toLocaleString('default', { month: 'long' });
          return r.financialYear === '2025-26' && cumulativeMonths.includes(receiptMonth);
        });

        // Get targets
        const yearlyTarget = targets.find(t => t.committeeId === committee.id && t.financialYear === selectedYear)?.checkpostTargets?.[checkpost] 
          ? Object.values(targets.find(t => t.committeeId === committee.id && t.financialYear === selectedYear)!.checkpostTargets![checkpost]).reduce((sum, val) => sum + val, 0) 
          : 0;
        
        const monthlyTarget = targets.find(t => t.committeeId === committee.id && t.financialYear === selectedYear)?.checkpostTargets?.[checkpost]?.[selectedMonth] || 0;

        // Calculate collections
        const currentMonthCollection2024 = currentMonthReceipts2024.reduce((sum, r) => sum + r.marketFee, 0);
        const currentMonthCollection2025 = currentMonthReceipts2025.reduce((sum, r) => sum + r.marketFee, 0);
        const monthlyDifference = currentMonthCollection2025 - currentMonthCollection2024;

        const progressiveTotal2024 = progressiveReceipts2024.reduce((sum, r) => sum + r.marketFee, 0);
        const progressiveTotal2025 = progressiveReceipts2025.reduce((sum, r) => sum + r.marketFee, 0);
        const progressiveDifference = progressiveTotal2025 - progressiveTotal2024;

        const achievementPercentage = yearlyTarget > 0 ? Math.round((progressiveTotal2025 / yearlyTarget) * 100) : 0;

        checkpostData.push({
          slNo: checkpostData.length + 1,
          amcName: committee.name,
          amcCode: committee.code,
          checkpostName: checkpost,
          yearlyTarget: yearlyTarget / 100000,
          monthlyTarget: monthlyTarget / 100000,
          currentMonth2024: currentMonthCollection2024 / 100000,
          currentMonth2025: currentMonthCollection2025 / 100000,
          monthlyDifference: monthlyDifference / 100000,
          progressiveTotal2024: progressiveTotal2024 / 100000,
          progressiveTotal2025: progressiveTotal2025 / 100000,
          progressiveDifference: progressiveDifference / 100000,
          achievementPercentage
        });
      });
    });

    return checkpostData;
  };

  // Commodity-wise Report
  const generateCommodityData = () => {
    const marketFeeReceipts = receipts.filter(r => r.natureOfReceipt === 'mf');
    
    let committeesToInclude = committees;
    if (selectedCommittee !== 'all') {
      committeesToInclude = committees.filter(c => c.id === selectedCommittee);
    }

    return committeesToInclude.map((committee, index) => {
      const committeeReceipts = marketFeeReceipts.filter(r => r.committeeId === committee.id);
      
      // Current month receipts
      const currentMonthReceipts = committeeReceipts.filter(r => {
        const receiptDate = new Date(r.date);
        const receiptMonth = receiptDate.toLocaleString('default', { month: 'long' });
        return r.financialYear === selectedYear && receiptMonth === selectedMonth;
      });

      // Progressive receipts up to current month
      const monthIndex = months.indexOf(selectedMonth);
      const cumulativeMonths = monthIndex >= 0 ? months.slice(0, monthIndex + 1) : [selectedMonth];
      
      const progressiveReceipts = committeeReceipts.filter(r => {
        const receiptDate = new Date(r.date);
        const receiptMonth = receiptDate.toLocaleString('default', { month: 'long' });
        return r.financialYear === selectedYear && cumulativeMonths.includes(receiptMonth);
      });

      // Calculate total collections
      const totalCurrentMonth = currentMonthReceipts.reduce((sum, r) => sum + r.marketFee, 0);
      const totalProgressive = progressiveReceipts.reduce((sum, r) => sum + r.marketFee, 0);

      // Calculate commodity-wise collections (example with different rates)
      const prawnsCollection025 = totalCurrentMonth * 0.25 / 100; // 0.25% rate
      const prawnsCollection050 = totalCurrentMonth * 0.50 / 100; // 0.50% rate
      
      const progressivePrawns025 = totalProgressive * 0.25 / 100;
      const progressivePrawns050 = totalProgressive * 0.50 / 100;

      return {
        slNo: index + 1,
        amcName: committee.name,
        amcCode: committee.code,
        totalCurrentMonth: totalCurrentMonth / 100000,
        prawnsCollection025: prawnsCollection025 / 100000,
        prawnsCollection050: prawnsCollection050 / 100000,
        totalProgressive: totalProgressive / 100000,
        progressivePrawns025: progressivePrawns025 / 100000,
        progressivePrawns050: progressivePrawns050 / 100000
      };
    });
  };

  // Get current report data and columns
  const getCurrentReportData = () => {
    switch (reportType) {
      case 'market-fees':
        return {
          data: generateMarketFeesData(),
          columns: [
            { key: 'slNo', label: 'Sl. No.' },
            { key: 'amcName', label: 'AMC Name' },
            { key: 'amcCode', label: 'AMC Code' },
            { key: 'yearlyTarget', label: 'Yearly Target (Lakhs)' },
            { key: 'monthlyTarget', label: 'Monthly Target (Lakhs)' },
            { key: 'currentMonthPrev', label: `${selectedMonth}-24 (Lakhs)` },
            { key: 'currentMonthCurrent', label: `${selectedMonth}-25 (Lakhs)` },
            { key: 'difference', label: 'Difference (Lakhs)' },
            { key: 'cumulativeTarget', label: 'Cumulative Target (Lakhs)' },
            { key: 'progressiveTotal2024', label: 'Progressive 2024-25 (Lakhs)' },
            { key: 'progressiveTotal2025', label: 'Progressive 2025-26 (Lakhs)' },
            { key: 'progressiveDifference', label: 'Progressive Difference (Lakhs)' },
            { key: 'percentageAchieved', label: 'Achievement %' }
          ],
          title: `Market Fee Income Statement - ${selectedMonth} ${selectedYear}`
        };
      case 'checkpost':
        return {
          data: generateCheckpostData(),
          columns: [
            { key: 'slNo', label: 'Sl. No.' },
            { key: 'amcName', label: 'AMC Name' },
            { key: 'amcCode', label: 'AMC Code' },
            { key: 'checkpostName', label: 'Checkpost Name' },
            { key: 'yearlyTarget', label: 'Yearly Target (Lakhs)' },
            { key: 'monthlyTarget', label: 'Monthly Target (Lakhs)' },
            { key: 'currentMonth2024', label: `${selectedMonth} 2024-25 (Lakhs)` },
            { key: 'currentMonth2025', label: `${selectedMonth} 2025-26 (Lakhs)` },
            { key: 'monthlyDifference', label: 'Monthly Difference (Lakhs)' },
            { key: 'progressiveTotal2024', label: 'Progressive 2024-25 (Lakhs)' },
            { key: 'progressiveTotal2025', label: 'Progressive 2025-26 (Lakhs)' },
            { key: 'progressiveDifference', label: 'Progressive Difference (Lakhs)' },
            { key: 'achievementPercentage', label: 'Achievement %' }
          ],
          title: `Checkpost-wise Progress Report - ${selectedMonth} ${selectedYear}`
        };
      case 'commodity':
        return {
          data: generateCommodityData(),
          columns: [
            { key: 'slNo', label: 'Sl. No.' },
            { key: 'amcName', label: 'AMC Name' },
            { key: 'amcCode', label: 'AMC Code' },
            { key: 'totalCurrentMonth', label: `Total MF ${selectedMonth} (Lakhs)` },
            { key: 'prawnsCollection025', label: 'Prawns 0.25% (Lakhs)' },
            { key: 'prawnsCollection050', label: 'Prawns 0.50% (Lakhs)' },
            { key: 'totalProgressive', label: 'Total Progressive (Lakhs)' },
            { key: 'progressivePrawns025', label: 'Progressive Prawns 0.25% (Lakhs)' },
            { key: 'progressivePrawns050', label: 'Progressive Prawns 0.50% (Lakhs)' }
          ],
          title: `Commodity-wise Market Fee Report - ${selectedMonth} ${selectedYear}`
        };
      default:
        return { data: [], columns: [], title: '' };
    }
  };

  const renderReportContent = () => {
    switch (reportType) {
      case 'market-fees':
        return renderMarketFeesReport();
      case 'checkpost':
        return renderCheckpostReport();
      case 'commodity':
        return renderCommodityReport();
      default:
        return renderMarketFeesReport();
    }
  };

  const renderMarketFeesReport = () => {
    const statementData = generateMarketFeesData();
    
    const totals = statementData.reduce((acc, item) => ({
      yearlyTarget: acc.yearlyTarget + item.yearlyTarget,
      monthlyTarget: acc.monthlyTarget + item.monthlyTarget,
      currentMonthPrev: acc.currentMonthPrev + item.currentMonthPrev,
      currentMonthCurrent: acc.currentMonthCurrent + item.currentMonthCurrent,
      difference: acc.difference + item.difference,
      cumulativeTarget: acc.cumulativeTarget + item.cumulativeTarget,
      progressiveTotal2024: acc.progressiveTotal2024 + item.progressiveTotal2024,
      progressiveTotal2025: acc.progressiveTotal2025 + item.progressiveTotal2025,
      progressiveDifference: acc.progressiveDifference + item.progressiveDifference,
    }), {
      yearlyTarget: 0,
      monthlyTarget: 0,
      currentMonthPrev: 0,
      currentMonthCurrent: 0,
      difference: 0,
      cumulativeTarget: 0,
      progressiveTotal2024: 0,
      progressiveTotal2025: 0,
      progressiveDifference: 0,
    });

    const totalPercentage = totals.yearlyTarget > 0 ? Math.round((totals.progressiveTotal2025 / totals.yearlyTarget) * 100) : 0;

    return (
      <>
        {/* Statement Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border-2 border-gray-800">
          <div className="text-center">
            <h1 className="text-xl font-bold mb-2">STATEMENT NO.1</h1>
            <h2 className="text-lg font-bold mb-4">
              STATEMENT SHOWING THE MARKET FEE INCOME FROM VARIOUS SOURCES IN RESPECT OF AMCs DURING<br />
              THE MONTH {selectedMonth.toUpperCase()} ' {selectedYear}
            </h2>
          </div>
          <div className="flex justify-between items-center">
            <div className="font-bold">Name of the District : KAKINADA</div>
            <div className="font-medium">(Rs. In Lakhs)</div>
          </div>
        </div>

        {/* Statement Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-800">
              <thead className="bg-gray-100">
                <tr>
                  <th rowSpan={2} className="border border-gray-800 px-2 py-3 text-xs font-bold text-center">
                    Sl.<br />No.
                  </th>
                  <th rowSpan={2} className="border border-gray-800 px-2 py-3 text-xs font-bold text-center">
                    Name of the AMC
                  </th>
                  <th rowSpan={2} className="border border-gray-800 px-2 py-3 text-xs font-bold text-center">
                    Target<br />Fixed for<br />2025-26
                  </th>
                  <th rowSpan={2} className="border border-gray-800 px-2 py-3 text-xs font-bold text-center">
                    Target<br />fixed for<br />the month<br />of {selectedMonth.toUpperCase()}<br />-2025
                  </th>
                  <th colSpan={2} className="border border-gray-800 px-2 py-3 text-xs font-bold text-center">
                    Market Fee<br />collected during the<br />month
                  </th>
                  <th rowSpan={2} className="border border-gray-800 px-2 py-3 text-xs font-bold text-center">
                    Differen<br />ce (+)<br />or (-)
                  </th>
                  <th rowSpan={2} className="border border-gray-800 px-2 py-3 text-xs font-bold text-center">
                    Cumulative<br />Target<br />fixed upto<br />end of the<br />month<br />{selectedMonth}<br />2025-26
                  </th>
                  <th colSpan={2} className="border border-gray-800 px-2 py-3 text-xs font-bold text-center">
                    Progressive total of<br />Market fee collected<br />up to {selectedMonth.toUpperCase()} '2025
                  </th>
                  <th rowSpan={2} className="border border-gray-800 px-2 py-3 text-xs font-bold text-center">
                    Differen<br />ce (+) or<br />(-)
                  </th>
                  <th rowSpan={2} className="border border-gray-800 px-2 py-3 text-xs font-bold text-center">
                    Percentage<br />of M.F.<br />collected for<br />2025-26 on<br />Annual<br />target
                  </th>
                </tr>
                <tr>
                  <th className="border border-gray-800 px-2 py-2 text-xs font-bold text-center">
                    {selectedMonth}-24
                  </th>
                  <th className="border border-gray-800 px-2 py-2 text-xs font-bold text-center">
                    {selectedMonth}-25
                  </th>
                  <th className="border border-gray-800 px-2 py-2 text-xs font-bold text-center">
                    2024-25
                  </th>
                  <th className="border border-gray-800 px-2 py-2 text-xs font-bold text-center">
                    2025-26
                  </th>
                </tr>
                <tr className="bg-gray-50">
                  <th className="border border-gray-800 px-2 py-1 text-xs font-bold">1</th>
                  <th className="border border-gray-800 px-2 py-1 text-xs font-bold">2</th>
                  <th className="border border-gray-800 px-2 py-1 text-xs font-bold">3</th>
                  <th className="border border-gray-800 px-2 py-1 text-xs font-bold">4</th>
                  <th className="border border-gray-800 px-2 py-1 text-xs font-bold">5</th>
                  <th className="border border-gray-800 px-2 py-1 text-xs font-bold">6</th>
                  <th className="border border-gray-800 px-2 py-1 text-xs font-bold">7</th>
                  <th className="border border-gray-800 px-2 py-1 text-xs font-bold">8</th>
                  <th className="border border-gray-800 px-2 py-1 text-xs font-bold">9</th>
                  <th className="border border-gray-800 px-2 py-1 text-xs font-bold">10</th>
                  <th className="border border-gray-800 px-2 py-1 text-xs font-bold">11</th>
                  <th className="border border-gray-800 px-2 py-1 text-xs font-bold">12</th>
                </tr>
              </thead>
              <tbody>
                {statementData.map((item) => (
                  <tr key={item.slNo} className="hover:bg-gray-50">
                    <td className="border border-gray-800 px-2 py-2 text-xs text-center">{item.slNo}</td>
                    <td className="border border-gray-800 px-2 py-2 text-xs text-left">{item.amcName}</td>
                    <td className="border border-gray-800 px-2 py-2 text-xs text-center">{item.yearlyTarget.toFixed(2)}</td>
                    <td className="border border-gray-800 px-2 py-2 text-xs text-center">{item.monthlyTarget.toFixed(2)}</td>
                    <td className="border border-gray-800 px-2 py-2 text-xs text-center">{item.currentMonthPrev.toFixed(2)}</td>
                    <td className="border border-gray-800 px-2 py-2 text-xs text-center">{item.currentMonthCurrent.toFixed(2)}</td>
                    <td className="border border-gray-800 px-2 py-2 text-xs text-center">{item.difference.toFixed(2)}</td>
                    <td className="border border-gray-800 px-2 py-2 text-xs text-center">{item.cumulativeTarget.toFixed(2)}</td>
                    <td className="border border-gray-800 px-2 py-2 text-xs text-center">{item.progressiveTotal2024.toFixed(2)}</td>
                    <td className="border border-gray-800 px-2 py-2 text-xs text-center">{item.progressiveTotal2025.toFixed(2)}</td>
                    <td className="border border-gray-800 px-2 py-2 text-xs text-center">{item.progressiveDifference.toFixed(2)}</td>
                    <td className="border border-gray-800 px-2 py-2 text-xs text-center">{item.percentageAchieved}%</td>
                  </tr>
                ))}
                <tr className="bg-gray-100 font-bold">
                  <td className="border border-gray-800 px-2 py-2 text-xs text-center"></td>
                  <td className="border border-gray-800 px-2 py-2 text-xs text-left">Total</td>
                  <td className="border border-gray-800 px-2 py-2 text-xs text-center">{totals.yearlyTarget.toFixed(2)}</td>
                  <td className="border border-gray-800 px-2 py-2 text-xs text-center">{totals.monthlyTarget.toFixed(2)}</td>
                  <td className="border border-gray-800 px-2 py-2 text-xs text-center">{totals.currentMonthPrev.toFixed(2)}</td>
                  <td className="border border-gray-800 px-2 py-2 text-xs text-center">{totals.currentMonthCurrent.toFixed(2)}</td>
                  <td className="border border-gray-800 px-2 py-2 text-xs text-center">{totals.difference.toFixed(2)}</td>
                  <td className="border border-gray-800 px-2 py-2 text-xs text-center">{totals.cumulativeTarget.toFixed(2)}</td>
                  <td className="border border-gray-800 px-2 py-2 text-xs text-center">{totals.progressiveTotal2024.toFixed(2)}</td>
                  <td className="border border-gray-800 px-2 py-2 text-xs text-center">{totals.progressiveTotal2025.toFixed(2)}</td>
                  <td className="border border-gray-800 px-2 py-2 text-xs text-center">{totals.progressiveDifference.toFixed(2)}</td>
                  <td className="border border-gray-800 px-2 py-2 text-xs text-center">{totalPercentage}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  };

  const renderCheckpostReport = () => {
    const checkpostData = generateCheckpostData();
    // Group checkposts by committee
    const grouped: Record<string, typeof checkpostData> = {};
    checkpostData.forEach((item: any) => {
      if (!grouped[item.amcName]) grouped[item.amcName] = [];
      grouped[item.amcName].push(item);
    });
    const committees = Object.keys(grouped);
    // Calculate totals
    const totals = checkpostData.reduce((acc: any, item: any) => ({
      yearlyTarget: acc.yearlyTarget + item.yearlyTarget,
      monthlyTarget: acc.monthlyTarget + item.monthlyTarget,
      currentMonth2024: acc.currentMonth2024 + item.currentMonth2024,
      currentMonth2025: acc.currentMonth2025 + item.currentMonth2025,
      monthlyDifference: acc.monthlyDifference + item.monthlyDifference,
      progressiveTotal2024: acc.progressiveTotal2024 + item.progressiveTotal2024,
      progressiveTotal2025: acc.progressiveTotal2025 + item.progressiveTotal2025,
      progressiveDifference: acc.progressiveDifference + item.progressiveDifference,
    }), {
      yearlyTarget: 0,
      monthlyTarget: 0,
      currentMonth2024: 0,
      currentMonth2025: 0,
      monthlyDifference: 0,
      progressiveTotal2024: 0,
      progressiveTotal2025: 0,
      progressiveDifference: 0,
    });
    const totalPercentage = totals.yearlyTarget > 0 ? Math.round((totals.progressiveTotal2025 / totals.yearlyTarget) * 100) : 0;
    return (
      <>
        {/* Statement Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border-2 border-gray-800">
          <div className="text-center">
            <h1 className="text-xl font-bold mb-2">STATEMENT NO.2</h1>
            <h2 className="text-lg font-bold mb-4">
              CHECK POST WISE PROGRESS REPORT ON MARKET FEE COLLECTION FOR THE MONTH OF {selectedMonth.toUpperCase()} {selectedYear}
            </h2>
          </div>
          <div className="flex justify-between items-center">
            <div className="font-bold">Name of the District : KAKINADA</div>
            <div className="font-medium">(Rs. In Lakhs)</div>
          </div>
        </div>

        {/* Checkpost Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-800">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-800 px-2 py-3 text-xs font-bold text-center">Sl.N<br />o.</th>
                  <th className="border border-gray-800 px-2 py-3 text-xs font-bold text-center">Name of the AMC</th>
                  <th className="border border-gray-800 px-2 py-3 text-xs font-bold text-center">Name of the Check<br />Post</th>
                  <th className="border border-gray-800 px-2 py-3 text-xs font-bold text-center">Target<br />forthe<br />year<br />2025-26</th>
                  <th className="border border-gray-800 px-2 py-3 text-xs font-bold text-center">Target for<br />the month<br />APR 2025</th>
                  <th colSpan={2} className="border border-gray-800 px-2 py-3 text-xs font-bold text-center">M.F. collection for<br />the month of {selectedMonth.toUpperCase()}</th>
                  <th className="border border-gray-800 px-2 py-3 text-xs font-bold text-center">Plus<br />(+) or<br />Minus<br />( - )</th>
                  <th colSpan={2} className="border border-gray-800 px-2 py-3 text-xs font-bold text-center">Progressive total<br />upto end of the<br />month {selectedMonth.toUpperCase()}</th>
                  <th className="border border-gray-800 px-2 py-3 text-xs font-bold text-center">Plus<br />(+) or<br />Minus<br />( - )</th>
                  <th className="border border-gray-800 px-2 py-3 text-xs font-bold text-center">% of<br />Achieveme<br />nt on<br />Target</th>
                </tr>
                <tr>
                  <th className="border border-gray-800 px-2 py-2 text-xs font-bold text-center"></th>
                  <th className="border border-gray-800 px-2 py-2 text-xs font-bold text-center"></th>
                  <th className="border border-gray-800 px-2 py-2 text-xs font-bold text-center"></th>
                  <th className="border border-gray-800 px-2 py-2 text-xs font-bold text-center"></th>
                  <th className="border border-gray-800 px-2 py-2 text-xs font-bold text-center"></th>
                  <th className="border border-gray-800 px-2 py-2 text-xs font-bold text-center">2024-25</th>
                  <th className="border border-gray-800 px-2 py-2 text-xs font-bold text-center">2025-26</th>
                  <th className="border border-gray-800 px-2 py-2 text-xs font-bold text-center"></th>
                  <th className="border border-gray-800 px-2 py-2 text-xs font-bold text-center">2024-25</th>
                  <th className="border border-gray-800 px-2 py-2 text-xs font-bold text-center">2025-26</th>
                  <th className="border border-gray-800 px-2 py-2 text-xs font-bold text-center"></th>
                  <th className="border border-gray-800 px-2 py-2 text-xs font-bold text-center"></th>
                </tr>
                <tr className="bg-gray-50">
                  <th className="border border-gray-800 px-2 py-1 text-xs font-bold">1</th>
                  <th className="border border-gray-800 px-2 py-1 text-xs font-bold">2</th>
                  <th className="border border-gray-800 px-2 py-1 text-xs font-bold">3</th>
                  <th className="border border-gray-800 px-2 py-1 text-xs font-bold">4</th>
                  <th className="border border-gray-800 px-2 py-1 text-xs font-bold">5</th>
                  <th className="border border-gray-800 px-2 py-1 text-xs font-bold">6</th>
                  <th className="border border-gray-800 px-2 py-1 text-xs font-bold">7</th>
                  <th className="border border-gray-800 px-2 py-1 text-xs font-bold">8</th>
                  <th className="border border-gray-800 px-2 py-1 text-xs font-bold">9</th>
                  <th className="border border-gray-800 px-2 py-1 text-xs font-bold">10</th>
                  <th className="border border-gray-800 px-2 py-1 text-xs font-bold">11</th>
                  <th className="border border-gray-800 px-2 py-1 text-xs font-bold">12</th>
                </tr>
              </thead>
              <tbody>
                {committees.map((committeeName: string, idx: number) => {
                  const rows = grouped[committeeName];
                  return rows.map((item: any, i: number) => (
                    <tr key={item.slNo} className="hover:bg-gray-50">
                      {i === 0 && (
                        <>
                          <td rowSpan={rows.length} className="border border-gray-800 px-2 py-2 text-xs text-center">{idx + 1}</td>
                          <td rowSpan={rows.length} className="border border-gray-800 px-2 py-2 text-xs text-left">{committeeName}</td>
                        </>
                      )}
                      <td className="border border-gray-800 px-2 py-2 text-xs text-left">{item.checkpostName}</td>
                      <td className="border border-gray-800 px-2 py-2 text-xs text-center">{item.yearlyTarget.toFixed(2)}</td>
                      <td className="border border-gray-800 px-2 py-2 text-xs text-center">{item.monthlyTarget.toFixed(2)}</td>
                      <td className="border border-gray-800 px-2 py-2 text-xs text-center">{item.currentMonth2024.toFixed(2)}</td>
                      <td className="border border-gray-800 px-2 py-2 text-xs text-center">{item.currentMonth2025.toFixed(2)}</td>
                      <td className="border border-gray-800 px-2 py-2 text-xs text-center">{item.monthlyDifference.toFixed(2)}</td>
                      <td className="border border-gray-800 px-2 py-2 text-xs text-center">{item.progressiveTotal2024.toFixed(2)}</td>
                      <td className="border border-gray-800 px-2 py-2 text-xs text-center">{item.progressiveTotal2025.toFixed(2)}</td>
                      <td className="border border-gray-800 px-2 py-2 text-xs text-center">{item.progressiveDifference.toFixed(2)}</td>
                      <td className="border border-gray-800 px-2 py-2 text-xs text-center">{item.achievementPercentage}%</td>
                    </tr>
                  ));
                })}
                <tr className="bg-gray-100 font-bold">
                  <td className="border border-gray-800 px-2 py-2 text-xs text-center"></td>
                  <td className="border border-gray-800 px-2 py-2 text-xs text-left" colSpan={2}>Ground Total :</td>
                  <td className="border border-gray-800 px-2 py-2 text-xs text-center">{totals.yearlyTarget.toFixed(2)}</td>
                  <td className="border border-gray-800 px-2 py-2 text-xs text-center">{totals.monthlyTarget.toFixed(2)}</td>
                  <td className="border border-gray-800 px-2 py-2 text-xs text-center">{totals.currentMonth2024.toFixed(2)}</td>
                  <td className="border border-gray-800 px-2 py-2 text-xs text-center">{totals.currentMonth2025.toFixed(2)}</td>
                  <td className="border border-gray-800 px-2 py-2 text-xs text-center">{totals.monthlyDifference.toFixed(2)}</td>
                  <td className="border border-gray-800 px-2 py-2 text-xs text-center">{totals.progressiveTotal2024.toFixed(2)}</td>
                  <td className="border border-gray-800 px-2 py-2 text-xs text-center">{totals.progressiveTotal2025.toFixed(2)}</td>
                  <td className="border border-gray-800 px-2 py-2 text-xs text-center">{totals.progressiveDifference.toFixed(2)}</td>
                  <td className="border border-gray-800 px-2 py-2 text-xs text-center">{totalPercentage}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  };

  const renderCommodityReport = () => {
    const commodityData = generateCommodityData();
    
    const totals = commodityData.reduce((acc, item) => ({
      totalCurrentMonth: acc.totalCurrentMonth + item.totalCurrentMonth,
      prawnsCollection025: acc.prawnsCollection025 + item.prawnsCollection025,
      prawnsCollection050: acc.prawnsCollection050 + item.prawnsCollection050,
      totalProgressive: acc.totalProgressive + item.totalProgressive,
      progressivePrawns025: acc.progressivePrawns025 + item.progressivePrawns025,
      progressivePrawns050: acc.progressivePrawns050 + item.progressivePrawns050,
    }), {
      totalCurrentMonth: 0,
      prawnsCollection025: 0,
      prawnsCollection050: 0,
      totalProgressive: 0,
      progressivePrawns025: 0,
      progressivePrawns050: 0,
    });

    return (
      <>
        {/* Statement Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border-2 border-blue-600">
          <div className="text-center">
            <h1 className="text-xl font-bold mb-2 text-blue-800">Sample for Commodity Wise Data</h1>
            <h2 className="text-lg font-bold mb-4">
              Market Fee collection on Prawns<br />
              up to the month of {selectedMonth.toUpperCase()} {selectedYear.split('-')[1]}
            </h2>
          </div>
          <div className="flex justify-between items-center">
            <div className="font-bold">Name of the District: KAKINADA</div>
            <div className="font-medium">(Rs. In Lakhs)</div>
          </div>
        </div>

        {/* Commodity Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-800">
              <thead className="bg-gray-100">
                <tr>
                  <th rowSpan={2} className="border border-gray-800 px-2 py-3 text-xs font-bold text-center">SL<br />No.</th>
                  <th rowSpan={2} className="border border-gray-800 px-2 py-3 text-xs font-bold text-center">Name of the<br />AMC</th>
                  <th colSpan={3} className="border border-gray-800 px-2 py-3 text-xs font-bold text-center">MF Collection during the month of {selectedMonth.toUpperCase()}</th>
                  <th colSpan={3} className="border border-gray-800 px-2 py-3 text-xs font-bold text-center">Progressive collection of MF up to the Month of<br />{selectedMonth.toUpperCase()}</th>
                </tr>
                <tr>
                  <th className="border border-gray-800 px-2 py-2 text-xs font-bold text-center">Total MF collection<br />for the month of<br />{selectedMonth.toUpperCase()}</th>
                  <th className="border border-gray-800 px-2 py-2 text-xs font-bold text-center">MF<br />Collection<br />(0.25%)</th>
                  <th className="border border-gray-800 px-2 py-2 text-xs font-bold text-center">MF<br />Collection<br />(0.50%)</th>
                  <th className="border border-gray-800 px-2 py-2 text-xs font-bold text-center">Total MF<br />collection upto<br />the month of<br />{selectedMonth.toUpperCase()}</th>
                  <th className="border border-gray-800 px-2 py-2 text-xs font-bold text-center">MF<br />Collection<br />(0.25%)</th>
                  <th className="border border-gray-800 px-2 py-2 text-xs font-bold text-center">MF Collection<br />(0.50%)</th>
                </tr>
                <tr className="bg-gray-50">
                  <th className="border border-gray-800 px-2 py-1 text-xs font-bold">1</th>
                  <th className="border border-gray-800 px-2 py-1 text-xs font-bold">2</th>
                  <th className="border border-gray-800 px-2 py-1 text-xs font-bold">3</th>
                  <th className="border border-gray-800 px-2 py-1 text-xs font-bold">4</th>
                  <th className="border border-gray-800 px-2 py-1 text-xs font-bold">5</th>
                  <th className="border border-gray-800 px-2 py-1 text-xs font-bold">6</th>
                  <th className="border border-gray-800 px-2 py-1 text-xs font-bold">7</th>
                  <th className="border border-gray-800 px-2 py-1 text-xs font-bold">8</th>
                </tr>
              </thead>
              <tbody>
                {commodityData.map((item) => (
                  <tr key={item.slNo} className="hover:bg-gray-50">
                    <td className="border border-gray-800 px-2 py-2 text-xs text-center">{item.slNo}</td>
                    <td className="border border-gray-800 px-2 py-2 text-xs text-left">{item.amcName}</td>
                    <td className="border border-gray-800 px-2 py-2 text-xs text-center">{item.totalCurrentMonth.toFixed(2)}</td>
                    <td className="border border-gray-800 px-2 py-2 text-xs text-center">{item.prawnsCollection025.toFixed(2)}</td>
                    <td className="border border-gray-800 px-2 py-2 text-xs text-center">{item.prawnsCollection050.toFixed(2)}</td>
                    <td className="border border-gray-800 px-2 py-2 text-xs text-center">{item.totalProgressive.toFixed(2)}</td>
                    <td className="border border-gray-800 px-2 py-2 text-xs text-center">{item.progressivePrawns025.toFixed(2)}</td>
                    <td className="border border-gray-800 px-2 py-2 text-xs text-center">{item.progressivePrawns050.toFixed(2)}</td>
                  </tr>
                ))}
                <tr className="bg-gray-100 font-bold">
                  <td className="border border-gray-800 px-2 py-2 text-xs text-center"></td>
                  <td className="border border-gray-800 px-2 py-2 text-xs text-left">Total</td>
                  <td className="border border-gray-800 px-2 py-2 text-xs text-center">{totals.totalCurrentMonth.toFixed(2)}</td>
                  <td className="border border-gray-800 px-2 py-2 text-xs text-center">{totals.prawnsCollection025.toFixed(2)}</td>
                  <td className="border border-gray-800 px-2 py-2 text-xs text-center">{totals.prawnsCollection050.toFixed(2)}</td>
                  <td className="border border-gray-800 px-2 py-2 text-xs text-center">{totals.totalProgressive.toFixed(2)}</td>
                  <td className="border border-gray-800 px-2 py-2 text-xs text-center">{totals.progressivePrawns025.toFixed(2)}</td>
                  <td className="border border-gray-800 px-2 py-2 text-xs text-center">{totals.progressivePrawns050.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  };

  const currentReportData = getCurrentReportData();

  return (
    <div className="max-w-full mx-auto p-4 lg:p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
        <div className="flex items-center">
          <FileText className="w-6 h-6 text-indigo-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-900">Market Data Reports</h2>
        </div>
        
        {/* Export Buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          <ExportButton
            data={currentReportData.data}
            columns={currentReportData.columns}
            filename={`${reportType}_report_${selectedMonth}_${selectedYear}`}
            title={currentReportData.title}
            variant="both"
            size="md"
            className="w-full sm:w-auto"
          />
        </div>
      </div>

      {/* Report Type Selection */}
      <div className="bg-white rounded-lg shadow-lg p-4 lg:p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Report Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setReportType('market-fees')}
            className={`flex items-center p-4 rounded-lg border-2 transition-all duration-200 ${
              reportType === 'market-fees'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300 text-gray-700'
            }`}
          >
            <BarChart3 className="w-6 h-6 mr-3 flex-shrink-0" />
            <div className="text-left">
              <div className="font-semibold">1. Market Fees Report</div>
              <div className="text-sm opacity-75">Statement No.1 - Overall market fee income</div>
            </div>
          </button>

          <button
            onClick={() => setReportType('checkpost')}
            className={`flex items-center p-4 rounded-lg border-2 transition-all duration-200 ${
              reportType === 'checkpost'
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-gray-200 hover:border-gray-300 text-gray-700'
            }`}
          >
            <MapPin className="w-6 h-6 mr-3 flex-shrink-0" />
            <div className="text-left">
              <div className="font-semibold">2. Checkpost-wise Report</div>
              <div className="text-sm opacity-75">Statement No.2 - Checkpost progress report</div>
            </div>
          </button>

          <button
            onClick={() => setReportType('commodity')}
            className={`flex items-center p-4 rounded-lg border-2 transition-all duration-200 ${
              reportType === 'commodity'
                ? 'border-purple-500 bg-purple-50 text-purple-700'
                : 'border-gray-200 hover:border-gray-300 text-gray-700'
            }`}
          >
            <Package className="w-6 h-6 mr-3 flex-shrink-0" />
            <div className="text-left">
              <div className="font-semibold">3. Commodity-wise Report</div>
              <div className="text-sm opacity-75">Commodity-specific market fee data</div>
            </div>
          </button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-white rounded-lg shadow-lg p-4 lg:p-6 mb-6">
        <div className="flex items-center space-x-4 flex-wrap">
          <Filter className="w-5 h-5 text-gray-500 flex-shrink-0" />
          <div className="flex flex-wrap gap-4 flex-1">
            <div className="min-w-0 flex-1 sm:flex-none sm:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Financial Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value as '2024-25' | '2025-26')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="2024-25">2024-25</option>
                <option value="2025-26">2025-26</option>
              </select>
            </div>
            <div className="min-w-0 flex-1 sm:flex-none sm:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Month
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
            <div className="min-w-0 flex-1 sm:flex-none sm:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Committee
              </label>
              <select
                value={selectedCommittee}
                onChange={(e) => setSelectedCommittee(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Committees</option>
                {committees.map((committee) => (
                  <option key={committee.id} value={committee.id}>
                    {committee.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div className="print:shadow-none">
        {renderReportContent()}
      </div>
    </div>
  );
};

export default Reports;