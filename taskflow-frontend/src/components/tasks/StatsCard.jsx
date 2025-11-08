import { Card, CardContent } from "@/components/ui/Card"

const StatsCard = ({ title, value, icon: Icon, trend, color }) => {
    return (
        <Card className="p-4">
            <CardContent>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500">{title}</p>
                        <h3 className="text-xl font-bold">{value}</h3>
                    </div>
                    {Icon && <Icon className="h-6 w-6 text-gray-400" />}
                </div>
                {trend && (
                    <p className={`text-sm mt-2 ${trend.isPositive ? "text-green-500" : "text-red-500"}`}>
                        {trend.value > 0 ? `+${trend.value}` : trend.value}%
                    </p>
                )}
            </CardContent>
        </Card>
    )
}

export default StatsCard
