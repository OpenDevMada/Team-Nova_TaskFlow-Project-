import { Card, CardContent } from "@/components/ui/Card"

const StatsCard = ({ title, value, icon: Icon, trend }) => {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">{title}</p>
                        <h3 className="text-xl font-bold text-card-foreground">{value}</h3>
                    </div>
                    {Icon && <Icon className="h-6 w-6 text-muted-foreground" />}
                </div>
                {trend && (
                    <p className={`text-sm mt-2 ${trend.isPositive ? "text-success" : "text-destructive"}`}>
                        {trend.value > 0 ? `+${trend.value}` : trend.value}%
                    </p>
                )}
            </CardContent>
        </Card>
    )
}

export default StatsCard
