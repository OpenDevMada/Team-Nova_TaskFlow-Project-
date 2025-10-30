import { Clock, User, Flag, CheckCircle2 } from "lucide-react"

export function TaskActivity() {
    const activities = [
        {
            type: "status",
            icon: CheckCircle2,
            content: "a changé le statut de À faire à En cours",
            author: "Sophie M.",
            timestamp: "Il y a 3 heures",
        },
        {
            type: "assignment",
            icon: User,
            content: "a assigné cette tâche à Sophie M.",
            author: "Julie K.",
            timestamp: "Il y a 5 heures",
        },
        {
            type: "priority",
            icon: Flag,
            content: "a changé la priorité de Moyenne à Haute",
            author: "Julie K.",
            timestamp: "Il y a 6 heures",
        },
        {
            type: "created",
            icon: Clock,
            content: "a créé cette tâche",
            author: "Julie K.",
            timestamp: "Il y a 1 jour",
        },
    ]

    return (
        <div className="space-y-4">
            {activities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                        <activity.icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 space-y-1">
                        <p className="text-sm">
                            <span className="font-medium">{activity.author}</span>{" "}
                            <span className="text-muted-foreground">{activity.content}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}
