import { Card, CardContent } from "@/components/ui/card"

export function StatsCard({ title, value, icon: Icon, trend, color }) {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">{title}</p>
                        <p className="text-3xl font-bold">{value}</p>
                        {trend && (
                            <p className={`text-xs ${trend.isPositive ? "text-chart-4" : "text-destructive"}`}>
                                {trend.isPositive ? "+" : ""}
                                {trend.value}% ce mois
                            </p>
                        )}
                    </div>
                    <div
                        className="flex h-12 w-12 items-center justify-center rounded-xl text-white"
                        style={{ backgroundColor: color }}
                    >
                        <Icon className="h-6 w-6" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
