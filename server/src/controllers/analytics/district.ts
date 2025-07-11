import {Request, Response} from 'express';
import prisma from '../../utils/database';
import {handlePrismaError} from '../../utils/helpers';

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

export async function getDailyAnalyticsController(req: Request, res: Response) {
  const {financialYear, month, time} = req.query;
  const filters = {
    financialYear: financialYear as string,
    month: month as string,
    time: time as string,
  };
  try {
    const [primaryData, committeRevenues, topCommodites, topCheckposts] =
      await Promise.all([]);

    return res.status(200).json({
      primaryData,
      committeRevenues,
      topCheckposts,
      topCommodites,
    });
  } catch (error) {
    return handlePrismaError(res, error);
  }
}
