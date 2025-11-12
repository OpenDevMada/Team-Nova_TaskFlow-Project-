import { Card, CardContent, CardHeader } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { MoreVertical, Users } from "lucide-react"
import { Button } from "@/components/ui/Button"

export default function ProjectCard({ title, description, progress, members, status, color }) {
    const statusColors = {
        active: "bg-blue-100 text-blue-800",
        completed: "bg-green-100 text-green-800",
        planning: "bg-yellow-100 text-yellow-800",
    }

    const statusLabels = {
        active: "En cours",
        completed: "Terminé",
        planning: "Planification",
    }

    return (
        <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-blue-200">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="h-1 w-12 rounded-full mb-3" style={{ backgroundColor: color }} />
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </div>

                <h3 className="font-semibold text-lg">{title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">{description}</p>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Progression */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Progression</span>
                        <span className="font-medium">{progress}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                        <div
                            className="h-full bg-blue-600 transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Pied de carte */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-500">{members} membres</span>
                    </div>
                    <Badge className={statusColors[status]}>
                        {statusLabels[status]}
                    </Badge>
                </div>
            </CardContent>
        </Card>
    )
}
