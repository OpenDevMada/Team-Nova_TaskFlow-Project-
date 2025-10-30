import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function KanbanCard({ title, priority, assignee, labels }) {
    const priorityColors = {
        high: "bg-destructive text-destructive-foreground",
        medium: "bg-chart-2 text-accent-foreground",
        low: "bg-chart-4 text-accent-foreground",
    }

    return (
        <Card className="hover:shadow-md transition-all duration-200 cursor-pointer group">
            <CardContent className="p-3 space-y-3">
                <h4 className="font-medium text-sm text-balance leading-relaxed">{title}</h4>

                <div className="flex flex-wrap gap-1">
                    {labels.map((label) => (
                        <Badge key={label} variant="secondary" className="text-xs">
                            {label}
                        </Badge>
                    ))}
                </div>

                <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                            <AvatarImage src={assignee.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{assignee.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                    </div>
                    <Badge className={priorityColors[priority]} variant="secondary" size="sm">
                        {priority === "high" ? "Haute" : priority === "medium" ? "Moyenne" : "Basse"}
                    </Badge>
                </div>
            </CardContent>
        </Card>
    )
}
