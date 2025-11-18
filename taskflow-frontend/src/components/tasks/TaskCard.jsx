import { Card, CardContent } from "@/components/ui/Card"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/Badge"
import { Calendar, MessageSquare } from "lucide-react"
import { Link } from "react-router-dom"

const TaskCard = ({ title, priority, dueDate, assignee, comments, project }) => {
    const priorityColors = {
        high: "bg-red-100 text-red-800",
        medium: "bg-yellow-100 text-yellow-800",
        low: "bg-green-100 text-green-800",
    }

    const priorityLabels = {
        high: "Haute",
        medium: "Moyenne",
        low: "Basse",
    }

    return (
        <Link to="/tasks/1">
            <Card className="hover:shadow-md transition-all duration-200 cursor-pointer">
                <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                        <h4 className="font-medium text-sm flex-1">{title}</h4>
                        <Badge className={priorityColors[priority]}>
                            {priorityLabels[priority]}
                        </Badge>
                    </div>

                    {project && (
                        <div className="text-xs text-gray-500">
                            <span className="font-medium">{project}</span>
                        </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{dueDate}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            <span>{comments}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                        <Avatar
                            src={assignee?.avatar || "/placeholder.svg"}
                            alt="Photo de profil"
                            fallback={assignee?.name ? assignee.name.slice(0, 2).toUpperCase() : "?"}
                            className="h-8 w-8"
                        />
                        <span className="text-xs text-gray-600">{assignee?.name}</span>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}

export default TaskCard