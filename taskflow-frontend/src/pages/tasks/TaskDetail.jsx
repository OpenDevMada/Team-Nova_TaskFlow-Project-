import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Calendar, User, Flag, FolderKanban, Clock, Send, Paperclip } from "lucide-react"
import Link from "next/link"
import { TaskComments } from "@/components/task-comments"
import { TaskActivity } from "@/components/task-activity"

export default function TaskDetail() {
    const task = {
        title: "Créer les maquettes de la page d'accueil",
        description:
            "Concevoir et créer les maquettes haute fidélité pour la nouvelle page d'accueil du site web. Inclure les versions desktop, tablette et mobile. Respecter la charte graphique et les guidelines UX établies.",
        priority: "high",
        status: "in-progress",
        dueDate: "15 Octobre 2024",
        createdDate: "10 Octobre 2024",
        project: "Refonte du site web",
        assignee: { name: "Sophie M.", avatar: "/diverse-woman-portrait.png" },
        reporter: { name: "Julie K.", avatar: "/diverse-woman-portrait.png" },
    }

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />

            <div className="flex flex-col flex-1 overflow-hidden">
                <Header />

                <main className="flex-1 overflow-y-auto bg-background">
                    <div className="max-w-7xl mx-auto p-6">
                        <div className="flex items-center gap-4 mb-6">
                            <Link href="/tasks">
                                <Button variant="ghost" size="icon">
                                    <ArrowLeft className="h-5 w-5" />
                                </Button>
                            </Link>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <Badge variant="secondary" className="text-xs">
                                        TASK-1234
                                    </Badge>
                                    <Badge variant="secondary" className="bg-chart-2 text-accent-foreground">
                                        En cours
                                    </Badge>
                                </div>
                                <h1 className="text-2xl font-bold text-balance">{task.title}</h1>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Main Content */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Description */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Description</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground leading-relaxed text-pretty">{task.description}</p>
                                    </CardContent>
                                </Card>

                                {/* Comments */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Commentaires</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <TaskComments />

                                        <Separator />

                                        {/* Add Comment */}
                                        <div className="space-y-3">
                                            <div className="flex items-start gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src="/abstract-geometric-shapes.png" />
                                                    <AvatarFallback>AK</AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 space-y-2">
                                                    <Textarea placeholder="Ajouter un commentaire..." className="min-h-20" />
                                                    <div className="flex items-center justify-between">
                                                        <Button variant="ghost" size="sm" className="gap-2">
                                                            <Paperclip className="h-4 w-4" />
                                                            Joindre un fichier
                                                        </Button>
                                                        <Button size="sm" className="gap-2">
                                                            <Send className="h-4 w-4" />
                                                            Envoyer
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Activity */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Activité</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <TaskActivity />
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-4">
                                {/* Details Card */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Détails</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {/* Assignee */}
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <User className="h-4 w-4" />
                                                <span>Assigné à</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={task.assignee.avatar || "/placeholder.svg"} />
                                                    <AvatarFallback>{task.assignee.name.slice(0, 2)}</AvatarFallback>
                                                </Avatar>
                                                <span className="text-sm font-medium">{task.assignee.name}</span>
                                            </div>
                                        </div>

                                        <Separator />

                                        {/* Reporter */}
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <User className="h-4 w-4" />
                                                <span>Créé par</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={task.reporter.avatar || "/placeholder.svg"} />
                                                    <AvatarFallback>{task.reporter.name.slice(0, 2)}</AvatarFallback>
                                                </Avatar>
                                                <span className="text-sm font-medium">{task.reporter.name}</span>
                                            </div>
                                        </div>

                                        <Separator />

                                        {/* Priority */}
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Flag className="h-4 w-4" />
                                                <span>Priorité</span>
                                            </div>
                                            <Badge className="bg-destructive text-destructive-foreground">Haute</Badge>
                                        </div>

                                        <Separator />

                                        {/* Project */}
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <FolderKanban className="h-4 w-4" />
                                                <span>Projet</span>
                                            </div>
                                            <Link href="/projects/1">
                                                <Button variant="link" className="h-auto p-0 text-sm font-medium">
                                                    {task.project}
                                                </Button>
                                            </Link>
                                        </div>

                                        <Separator />

                                        {/* Due Date */}
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Calendar className="h-4 w-4" />
                                                <span>Date d'échéance</span>
                                            </div>
                                            <p className="text-sm font-medium">{task.dueDate}</p>
                                        </div>

                                        <Separator />

                                        {/* Created Date */}
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Clock className="h-4 w-4" />
                                                <span>Date de création</span>
                                            </div>
                                            <p className="text-sm font-medium">{task.createdDate}</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Actions Card */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Actions</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <Button className="w-full bg-transparent" variant="outline">
                                            Changer le statut
                                        </Button>
                                        <Button className="w-full bg-transparent" variant="outline">
                                            Modifier la tâche
                                        </Button>
                                        <Button className="w-full bg-transparent" variant="outline">
                                            Assigner à quelqu'un
                                        </Button>
                                        <Button className="w-full" variant="destructive">
                                            Supprimer la tâche
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
