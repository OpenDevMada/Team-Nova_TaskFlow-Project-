import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MoreVertical, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ProjectCard({ title, description, progress, members, status, color }) {
    const statusColors = {
        active: "bg-chart-2 text-accent-foreground",
        completed: "bg-chart-4 text-accent-foreground",
        planning: "bg-chart-3 text-accent-foreground",
    }

    const statusLabels = {
        active: "En cours",
        completed: "Terminé",
        planning: "Planification",
    }

    return (
        <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className={`h-1 w-12 rounded-full mb-3`} style={{ backgroundColor: color }} />
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </div>
                <h3 className="font-semibold text-lg text-balance">{title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 text-pretty">{description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Progress */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progression</span>
                        <span className="font-medium">{progress}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                        <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{members} membres</span>
                    </div>
                    <Badge className={statusColors[status]} variant="secondary">
                        {statusLabels[status]}
                    </Badge>
                </div>
            </CardContent>
        </Card>
    )
}
