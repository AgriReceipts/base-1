import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function MetricCards() {
  const metrics = [
    {
      title: "Total Revenue",
      value: "$1,250.00",
      change: "+12.5%",
      trend: "up",
      description: "Trending up this month",
      context: "Visitors for the last 6 months",
    },
    {
      title: "New Customers",
      value: "1,234",
      change: "-20%",
      trend: "down",
      description: "Down 20% this period",
      context: "Acquisition needs attention",
    },
    {
      title: "Active Accounts",
      value: "45,678",
      change: "+12.5%",
      trend: "up",
      description: "Strong user retention",
      context: "Engagement exceed targets",
    },
    {
      title: "Growth Rate",
      value: "4.5%",
      change: "+4.5%",
      trend: "up",
      description: "Steady performance",
      context: "Meets growth projections",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <Card
          key={index}
          className="relative overflow-hidden shadow-soft-lg rounded-2xl bg-gradient-to-br from-white/95 to-gray-50/80 backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:shadow-soft-xl hover:-translate-y-1 border border-white/80 hover:border-gray-200/90"
        >
          {/* Subtle glow effect */}
          <div className={`absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
            metric.trend === "up" ? "bg-emerald-100/20" : "bg-red-100/20"
          }`} />
          
          <CardHeader className="relative pb-3">
            <CardDescription className="text-sm font-medium text-gray-600">
              {metric.title}
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tracking-tight text-gray-900 lg:text-3xl">
              {metric.value}
            </CardTitle>
            <div className="absolute right-4 top-4">
              <Badge
                variant="outline"
                className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-all duration-300 ${
                  metric.trend === "up" 
                    ? "bg-emerald-50/80 text-emerald-700 border-emerald-200/70 hover:bg-emerald-100/60" 
                    : "bg-red-50/80 text-red-700 border-red-200/70 hover:bg-red-100/60"
                }`}
              >
                {metric.trend === "up" ? (
                  <TrendingUpIcon className="size-3.5 text-emerald-600" />
                ) : (
                  <TrendingDownIcon className="size-3.5 text-red-600" />
                )}
                {metric.change}
              </Badge>
            </div>
          </CardHeader>
          
          <CardFooter className="flex-col items-start gap-1.5 pt-0">
            <div className={`flex items-center gap-1.5 text-sm font-medium ${
              metric.trend === "up" ? "text-emerald-700" : "text-red-700"
            }`}>
              {metric.trend === "up" ? (
                <TrendingUpIcon className="size-4 text-emerald-500" />
              ) : (
                <TrendingDownIcon className="size-4 text-red-500" />
              )}
              <span>{metric.description}</span>
            </div>
            <div className="text-xs text-gray-600">{metric.context}</div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}