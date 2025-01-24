import {
  CreditCard,
  DollarSign,
  LineChart,
  Package,
} from 'lucide-react';
import { getGraphRevenueAction } from '@/actions/get-graph-revenue.action';
import { getSalesCountAction } from '@/actions/get-sales-count.action';
import { getStockCountAction } from '@/actions/get-stock-count.action';
import { getTotalRevenueAction } from '@/actions/get-total-revenue.action';
import { Heading } from '@/components/heading';
import { OverviewChart } from '@/components/overview-chart';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { WithParams } from '@/lib/types';
import { currencyFormatter } from '@/lib/utils';

export default async function DashboardPage({ params }: WithParams) {
  const { storeId } = await params;
  const totalRevenue = await getTotalRevenueAction(storeId);
  const sales = await getSalesCountAction(storeId);
  const productsInStock = await getStockCountAction(storeId);
  const graphData = await getGraphRevenueAction(storeId);

  console.log(graphData);

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <h1>Dashboard Page</h1>
        <Heading title="Dashboard" description="This is the dashboard page" />
        <Separator />
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {currencyFormatter.format(totalRevenue)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Sales Count
              </CardTitle>
              <CreditCard className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {sales}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Products In Stock
              </CardTitle>
              <Package className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {productsInStock}
              </div>
            </CardContent>
          </Card>
        </div>
        <Card className="col-span-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Overview</CardTitle>
            <LineChart className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pl-2">
            <OverviewChart data={graphData} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
