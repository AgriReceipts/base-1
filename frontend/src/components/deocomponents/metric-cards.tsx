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
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <Card
          key={index}
          className="relative overflow-hidden shadow-md rounded-xl bg-gradient-to-br from-white/95 to-gray-50/80 backdrop-blur-sm transition-all duration-500 hover:shadow-lg hover:-translate-y-0.5 border border-white/80 hover:border-gray-200/90 p-3"
        >
          {/* Subtle glow effect */}
          <div className={`absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
            metric.trend === "up" ? "bg-emerald-100/20" : "bg-red-100/20"
          }`} />

          <CardHeader className="relative pb-2 space-y-1.5">
            <CardDescription className="text-xs font-medium text-gray-600">
              {metric.title}
            </CardDescription>
            <CardTitle className="text-xl font-semibold tracking-tight text-gray-900">
              {metric.value}
            </CardTitle>
            <div className="absolute right-3 top-3">
              <Badge
                variant="outline"
                className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium transition-all duration-300 ${
                  metric.trend === "up" 
                    ? "bg-emerald-50/80 text-emerald-700 border-emerald-200/70 hover:bg-emerald-100/60" 
                    : "bg-red-50/80 text-red-700 border-red-200/70 hover:bg-red-100/60"
                }`}
              >
                {metric.trend === "up" ? (
                  <TrendingUpIcon className="w-3 h-3 text-emerald-600" />
                ) : (
                  <TrendingDownIcon className="w-3 h-3 text-red-600" />
                )}
                {metric.change}
              </Badge>
            </div>
          </CardHeader>

          <CardFooter className="flex-col items-start gap-1 pt-0">
            <div className={`flex items-center gap-1.5 text-xs font-medium ${
              metric.trend === "up" ? "text-emerald-700" : "text-red-700"
            }`}>
              {metric.trend === "up" ? (
                <TrendingUpIcon className="w-4 h-4 text-emerald-500" />
              ) : (
                <TrendingDownIcon className="w-4 h-4 text-red-500" />
              )}
              <span>{metric.description}</span>
            </div>
            <div className="text-[11px] text-gray-600">{metric.context}</div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
