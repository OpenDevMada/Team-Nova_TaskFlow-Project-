"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { KanbanCard } from "@/components/kanban-card"

export function KanbanBoard() {
    const columns = [
        {
            id: "todo",
            title: "À faire",
            color: "oklch(0.70 0.15 200)",
            tasks: [
                {
                    id: "1",
                    title: "Créer les maquettes de la page d'accueil",
                    priority: "high",
                    assignee: { name: "Sophie M.", avatar: "/diverse-woman-portrait.png" },
                    labels: ["Design", "UI"],
                },
                {
                    id: "2",
                    title: "Définir l'architecture de la base de données",
                    priority: "medium",
                    assignee: { name: "Marc L.", avatar: "/man.jpg" },
                    labels: ["Backend"],
                },
            ],
        },
        {
            id: "in-progress",
            title: "En cours",
            color: "oklch(0.55 0.18 264)",
            tasks: [
                {
                    id: "3",
                    title: "Développer le système d'authentification",
                    priority: "high",
                    assignee: { name: "Thomas B.", avatar: "/diverse-group-friends.png" },
                    labels: ["Backend", "Sécurité"],
                },
                {
                    id: "4",
                    title: "Intégration de l'API de paiement",
                    priority: "medium",
                    assignee: { name: "Marc L.", avatar: "/man.jpg" },
                    labels: ["Backend", "API"],
                },
                {
                    id: "5",
                    title: "Design du système de navigation",
                    priority: "low",
                    assignee: { name: "Sophie M.", avatar: "/diverse-woman-portrait.png" },
                    labels: ["Design", "UX"],
                },
            ],
        },
        {
            id: "review",
            title: "En révision",
            color: "oklch(0.65 0.20 310)",
            tasks: [
                {
                    id: "6",
                    title: "Révision du code frontend",
                    priority: "medium",
                    assignee: { name: "Julie K.", avatar: "/diverse-woman-portrait.png" },
                    labels: ["Frontend", "Review"],
                },
            ],
        },
        {
            id: "done",
            title: "Terminé",
            color: "oklch(0.60 0.18 150)",
            tasks: [
                {
                    id: "7",
                    title: "Configuration de l'environnement de développement",
                    priority: "low",
                    assignee: { name: "Lucas D.", avatar: "/man.jpg" },
                    labels: ["DevOps"],
                },
                {
                    id: "8",
                    title: "Documentation de l'API",
                    priority: "low",
                    assignee: { name: "Emma R.", avatar: "/diverse-woman-portrait.png" },
                    labels: ["Documentation"],
                },
            ],
        },
    ]

    return (
        <div className="flex gap-4 overflow-x-auto pb-4">
            {columns.map((column) => (
                <div key={column.id} className="flex-shrink-0 w-80">
                    <Card className="h-full">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: column.color }} />
                                    <CardTitle className="text-base">{column.title}</CardTitle>
                                    <span className="text-sm text-muted-foreground">({column.tasks.length})</span>
                                </div>
                                <Button variant="ghost" size="icon" className="h-7 w-7">
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {column.tasks.map((task) => (
                                <KanbanCard key={task.id} {...task} />
                            ))}
                        </CardContent>
                    </Card>
                </div>
            ))}
        </div>
    )
}
