import { useEffect, useState } from "react"
import Layout from "../pages/Layout/Layout"
import ProjectCard from "@/components/projects/ProjectCard"
import TaskCard from "@/components/tasks/TaskCard"
import StatsCard from "@/components/tasks/StatsCard"
import { Button } from "@/components/ui/Button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FolderKanban, CheckSquare, Users, TrendingUp, Plus, Loader2, AlertCircle } from "lucide-react"
import {
    getDisplayName,
    getProjectStatus,
    getTaskStatus,
    mapProjectToCard,
    mapTaskToCard,
} from "@/utils/constants"
import { dashboardService } from "@/services/dashboardService"

const STAT_COLORS = {
    totalProjects: "oklch(0.55 0.18 264)",
    myTasks: "oklch(0.65 0.20 310)",
    totalMembers: "oklch(0.70 0.15 200)",
    completionRate: "oklch(0.60 0.18 150)",
}

const statsConfig = [
    {
        title: "Projets actifs",
        key: "totalProjects",
        icon: FolderKanban,
        color: STAT_COLORS.totalProjects,
    },
    {
        title: "Tâches en cours",
        key: "myTasks",
        icon: CheckSquare,
        color: STAT_COLORS.myTasks,
    },
    {
        title: "Membres d'équipe",
        key: "totalMembers",
        icon: Users,
        color: STAT_COLORS.totalMembers,
    },
    {
        title: "Taux de complétion",
        key: "completionRate",
        icon: TrendingUp,
        color: STAT_COLORS.completionRate,
        suffix: "%",
    },
]

export default function Dashboard() {
    const [stats, setStats] = useState(null)
    const [projects, setProjects] = useState([])
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchDashboard = async () => {
        setLoading(true)
        setError(null)

        try {
            const [statsResponse, projectsResponse, tasksResponse] = await Promise.all([
                dashboardService.getStats(),
                dashboardService.getRecentProjects(4),
                dashboardService.getRecentTasks(4),
            ])

            setStats(statsResponse.data?.data || {})
            setProjects(projectsResponse.data?.data || [])
            setTasks(tasksResponse.data?.data || [])
        } catch (apiError) {
            console.error("Dashboard fetch error:", apiError)
            setError("Impossible de charger le dashboard. Vérifiez que l'API est disponible.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDashboard()
    }, [])

    const dashboardStats = statsConfig.map((config) => ({
        title: config.title,
        value: `${stats?.[config.key] || 0}${config.suffix || ""}`,
        icon: config.icon,
        color: config.color,
    }))

    const mappedProjects = projects.map((project) => ({
        ...mapProjectToCard(project),
        status: getProjectStatus(project),
        members: project.members?.length || project.memberCount || 0,
        createdAt: project.created_at || project.createdAt,
    }))

    const mappedTasks = tasks.map((task) => ({
        ...mapTaskToCard(task),
        status: getTaskStatus(task),
        assignee: {
            name: getDisplayName(task.assignee),
            avatar: task.assignee?.avatarUrl || "/placeholder.svg",
        },
        comments: task.comments?.length || 0,
        project: task.project?.name || "",
    }))

    if (loading) {
        return (
            <Layout>
                <div className="flex min-h-screen items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            <div className="p-6 mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Tableau de bord</h1>
                        <p className="text-gray-500 mt-1">Voici un aperçu de vos projets et tâches</p>
                    </div>
                    <Button size="lg" className="gap-2">
                        <Plus className="h-5 w-5" />
                        Nouveau projet
                    </Button>
                </div>

                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {dashboardStats.map((stat) => (
                        <StatsCard key={stat.title} {...stat} />
                    ))}
                </div>

                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold">Projets récents</h2>
                        <Button variant="ghost">Voir tout</Button>
                    </div>
                    {mappedProjects.length === 0 ? (
                        <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
                            Aucun projet récent pour le moment.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {mappedProjects.map((project) => (
                                <ProjectCard key={project.id || project.title} {...project} />
                            ))}
                        </div>
                    )}
                </section>

                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold">Tâches récentes</h2>
                        <Button variant="ghost">Voir tout</Button>
                    </div>
                    {mappedTasks.length === 0 ? (
                        <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
                            Aucune tâche récente pour le moment.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {mappedTasks.map((task) => (
                                <TaskCard key={task.id || task.title} {...task} />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </Layout>
    )
}
