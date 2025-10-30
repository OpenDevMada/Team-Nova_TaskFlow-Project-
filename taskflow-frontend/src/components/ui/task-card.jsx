import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, MessageSquare } from "lucide-react"
import { Link, Navigate, useNavigate } from "react-router-dom"

export function TaskCard({ title, priority, dueDate, assignee, comments, project }) {
  const priorityColors = {
    high: "bg-destructive text-destructive-foreground",
    medium: "bg-chart-2 text-accent-foreground",
    low: "bg-chart-4 text-accent-foreground",
  }

  const priorityLabels = {
    high: "Haute",
    medium: "Moyenne",
    low: "Basse",
  }

  return (
    <Link href="/tasks/1">
      <Card className="hover:shadow-md transition-all duration-200 cursor-pointer">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-medium text-sm text-balance flex-1">{title}</h4>
            <Badge className={priorityColors[priority]} variant="secondary" size="sm">
              {priorityLabels[priority]}
            </Badge>
          </div>

          {project && (
            <div className="text-xs text-muted-foreground">
              <span className="font-medium">{project}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-muted-foreground">
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
            <Avatar className="h-6 w-6">
              <AvatarImage src={assignee.avatar || "/placeholder.svg"} />
              <AvatarFallback>{assignee.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">{assignee.name}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
