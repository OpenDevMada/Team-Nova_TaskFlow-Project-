import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { TaskCard } from "@/components/task-card"
import { Button } from "@/components/ui/button"
import { Plus, Filter, SortAsc } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Tasks() {
    const tasks = [
        {
            title: "Créer les maquettes de la page d'accueil",
            priority: "high",
            dueDate: "15 Oct",
            assignee: { name: "Sophie M.", avatar: "/diverse-woman-portrait.png" },
            comments: 5,
            project: "Refonte du site web",
            status: "todo",
        },
        {
            title: "Révision du code backend API",
            priority: "medium",
            dueDate: "16 Oct",
            assignee: { name: "Marc L.", avatar: "/man.jpg" },
            comments: 3,
            project: "Application mobile",
            status: "in-progress",
        },
        {
            title: "Tests utilisateurs interface mobile",
            priority: "high",
            dueDate: "17 Oct",
            assignee: { name: "Julie K.", avatar: "/diverse-woman-portrait.png" },
            comments: 8,
            project: "Application mobile",
            status: "in-progress",
        },
        {
            title: "Documentation technique API v2",
            priority: "low",
            dueDate: "20 Oct",
            assignee: { name: "Thomas B.", avatar: "/diverse-group-friends.png" },
            comments: 2,
            project: "Migration base de données",
            status: "todo",
        },
        {
            title: "Optimisation des requêtes SQL",
            priority: "high",
            dueDate: "18 Oct",
            assignee: { name: "Marc L.", avatar: "/man.jpg" },
            comments: 4,
            project: "Migration base de données",
            status: "in-progress",
        },
        {
            title: "Design du système de notifications",
            priority: "medium",
            dueDate: "22 Oct",
            assignee: { name: "Sophie M.", avatar: "/diverse-woman-portrait.png" },
            comments: 6,
            project: "Refonte du site web",
            status: "review",
        },
        {
            title: "Configuration CI/CD",
            priority: "low",
            dueDate: "12 Oct",
            assignee: { name: "Lucas D.", avatar: "/man.jpg" },
            comments: 1,
            project: "Migration base de données",
            status: "done",
        },
        {
            title: "Rédaction du guide utilisateur",
            priority: "medium",
            dueDate: "25 Oct",
            assignee: { name: "Emma R.", avatar: "/diverse-woman-portrait.png" },
            comments: 2,
            project: "Application mobile",
            status: "todo",
        },
    ]

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />

            <div className="flex flex-col flex-1 overflow-hidden">
                <Header />

                <main className="flex-1 overflow-y-auto bg-background p-6">
                    <div className="max-w-7xl mx-auto space-y-6">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-balance">Mes tâches</h1>
                                <p className="text-muted-foreground mt-1">Gérez et suivez toutes vos tâches assignées</p>
                            </div>
                            <Button size="lg" className="gap-2">
                                <Plus className="h-5 w-5" />
                                Nouvelle tâche
                            </Button>
                        </div>

                        {/* Filters */}
                        <div className="flex items-center gap-3">
                            <Select defaultValue="all">
                                <SelectTrigger className="w-48">
                                    <Filter className="h-4 w-4 mr-2" />
                                    <SelectValue placeholder="Filtrer par projet" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tous les projets</SelectItem>
                                    <SelectItem value="refonte">Refonte du site web</SelectItem>
                                    <SelectItem value="mobile">Application mobile</SelectItem>
                                    <SelectItem value="migration">Migration base de données</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select defaultValue="all">
                                <SelectTrigger className="w-48">
                                    <Filter className="h-4 w-4 mr-2" />
                                    <SelectValue placeholder="Filtrer par priorité" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Toutes les priorités</SelectItem>
                                    <SelectItem value="high">Haute</SelectItem>
                                    <SelectItem value="medium">Moyenne</SelectItem>
                                    <SelectItem value="low">Basse</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select defaultValue="dueDate">
                                <SelectTrigger className="w-48">
                                    <SortAsc className="h-4 w-4 mr-2" />
                                    <SelectValue placeholder="Trier par" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="dueDate">Date d'échéance</SelectItem>
                                    <SelectItem value="priority">Priorité</SelectItem>
                                    <SelectItem value="project">Projet</SelectItem>
                                    <SelectItem value="status">Statut</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Tabs */}
                        <Tabs defaultValue="all" className="space-y-6">
                            <TabsList>
                                <TabsTrigger value="all">Toutes ({tasks.length})</TabsTrigger>
                                <TabsTrigger value="todo">À faire ({tasks.filter((t) => t.status === "todo").length})</TabsTrigger>
                                <TabsTrigger value="in-progress">
                                    En cours ({tasks.filter((t) => t.status === "in-progress").length})
                                </TabsTrigger>
                                <TabsTrigger value="review">
                                    En révision ({tasks.filter((t) => t.status === "review").length})
                                </TabsTrigger>
                                <TabsTrigger value="done">Terminées ({tasks.filter((t) => t.status === "done").length})</TabsTrigger>
                            </TabsList>

                            <TabsContent value="all" className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {tasks.map((task, index) => (
                                        <TaskCard key={index} {...task} />
                                    ))}
                                </div>
                            </TabsContent>

                            <TabsContent value="todo" className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {tasks
                                        .filter((t) => t.status === "todo")
                                        .map((task, index) => (
                                            <TaskCard key={index} {...task} />
                                        ))}
                                </div>
                            </TabsContent>

                            <TabsContent value="in-progress" className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {tasks
                                        .filter((t) => t.status === "in-progress")
                                        .map((task, index) => (
                                            <TaskCard key={index} {...task} />
                                        ))}
                                </div>
                            </TabsContent>

                            <TabsContent value="review" className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {tasks
                                        .filter((t) => t.status === "review")
                                        .map((task, index) => (
                                            <TaskCard key={index} {...task} />
                                        ))}
                                </div>
                            </TabsContent>

                            <TabsContent value="done" className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {tasks
                                        .filter((t) => t.status === "done")
                                        .map((task, index) => (
                                            <TaskCard key={index} {...task} />
                                        ))}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </main>
            </div>
        </div>
    )
}
