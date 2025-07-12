import {Request, Response} from 'express';
import {handlePrismaError} from '../../utils/helpers';
import {topCheckposts} from '../../services/districtAnalytics/checkpost';
import {districtMetadata} from '../../services/districtAnalytics/districtMetadata';
import {committeWiseAcheivement} from '../../services/districtAnalytics/committe';
import {getCurrentFinancialYearStart} from '../../utils/dateHelper';
import {getCommitteeDoubleBarChartData} from '../../services/districtAnalytics/collectionTrend';
import {getTopCommodities} from '../../services/districtAnalytics/commodity';
import {getCommitteeHeatmapData} from '../../services/districtAnalytics/committeHeatmap';

//what all this controller returns

//Filters and controls,can filter by financial year, month,committe, time

//---CommitteeMonthly Analytics table)
//Important data:- Total marketFees collected, achievementRate in comparision to the target in percentage, Total no.of reciepts, avg Transaction(average value of the receipt)-
//Target acheivement pie chart(acheived vs pending) also from the same table, add a new target field, but dont update in the transactions.
//Top committe performance
//Monthly collection trend, currentYear vs Previousyear
//committe monthly performance for the selected year in a heatMap
//Basic details of all the committies, for clickable detailed analytics(id,Name,Target,Acheived,Achievement%,Receipts,Status)

//----Commodities Table
//Top commodities by revenue, display the top 15 for the pie chart( commoditiesAnalytics table, overall Or monthly)

//----Checkpost Table
//Top checkposts performance all checkPosts

export async function getDistrictAnalyticsController(
  req: Request,
  res: Response
) {
  const financialYearStart = req.query.financialYearStart as string | undefined;
  const monthParam = req.query.month as string | undefined;

  const fyStart: number = financialYearStart
    ? parseInt(financialYearStart)
    : getCurrentFinancialYearStart();

  const month: number | undefined = monthParam
    ? parseInt(monthParam)
    : undefined;

  if (financialYearStart && isNaN(fyStart)) {
    return res.status(400).json({message: 'Invalid financialYearStart'});
  }
  if (month && isNaN(month)) {
    return res.status(400).json({message: 'Invalid month'});
  }

  const filters = {
    fyStart: fyStart,
    month: month,
  };

  try {
    const [
      districtMetadataRes,
      committeeWiseAcheivementRes,
      monthlyTrend,
      topCommodityRes,
      checkPostsRes,
      heatMapRes,
    ] = await Promise.all([
      districtMetadata(filters),
      committeWiseAcheivement(filters),
      getCommitteeDoubleBarChartData({comparisonFyStart: fyStart}),
      getTopCommodities(filters),
      topCheckposts(filters),
      getCommitteeHeatmapData({fyStart}),
    ]);

    return res.status(200).json({
      // Important Summary Data
      districtMetadataRes,

      // Committee Performance
      committeeWiseAcheivementRes,

      // Monthly Collection Trend (Current vs Previous Year)
      monthlyTrend,

      // Top Commodities for Pie Chart
      topCommodityRes,

      // Top Checkposts Performance
      checkPostsRes,

      // Committee Heatmap Data
      heatMapRes,
    });
  } catch (error) {
    return handlePrismaError(res, error);
  }
}
