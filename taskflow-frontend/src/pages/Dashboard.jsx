import React from "react"
import Layout from "../pages/Layout/Layout"
import ProjectCard from "@/components/projects/ProjectCard"
import TaskCard from "@/components/tasks/TaskCard"
import StatsCard from "@/components/tasks/StatsCard"
import { Button } from "@/components/ui/Button"
import { FolderKanban, CheckSquare, Users, TrendingUp, Plus } from "lucide-react"

const Dashboard = () => {
    const stats = [
        {
            title: "Projets actifs",
            value: 12,
            icon: FolderKanban,
            trend: { value: 8, isPositive: true },
            color: "oklch(0.55 0.18 264)",
        },
        {
            title: "Tâches en cours",
            value: 48,
            icon: CheckSquare,
            trend: { value: 12, isPositive: true },
            color: "oklch(0.65 0.20 310)",
        },
        {
            title: "Membres d'équipe",
            value: 24,
            icon: Users,
            color: "oklch(0.70 0.15 200)",
        },
        {
            title: "Taux de complétion",
            value: "87%",
            icon: TrendingUp,
            trend: { value: 5, isPositive: true },
            color: "oklch(0.60 0.18 150)",
        },
    ]

    const projects = [
        {
            title: "Refonte du site web",
            description: "Modernisation complète de l'interface utilisateur et amélioration de l'expérience",
            progress: 65,
            members: 6,
            status: "active",
            color: "oklch(0.55 0.18 264)",
        },
        {
            title: "Application mobile",
            description: "Développement de l'application iOS et Android pour les clients",
            progress: 40,
            members: 8,
            status: "active",
            color: "oklch(0.65 0.20 310)",
        },
        {
            title: "Migration base de données",
            description: "Migration vers une nouvelle infrastructure cloud plus performante",
            progress: 90,
            members: 4,
            status: "active",
            color: "oklch(0.70 0.15 200)",
        },
        {
            title: "Campagne marketing Q2",
            description: "Planification et exécution de la stratégie marketing du deuxième trimestre",
            progress: 15,
            members: 5,
            status: "planning",
            color: "oklch(0.60 0.18 150)",
        },
    ]

    const recentTasks = [
        {
            title: "Créer les maquettes de la page d'accueil",
            priority: "high",
            dueDate: "15 Oct",
            assignee: { name: "Sophie M.", avatar: "/diverse-woman-portrait.png" },
            comments: 5,
        },
        {
            title: "Révision du code backend API",
            priority: "medium",
            dueDate: "16 Oct",
            assignee: { name: "Marc L.", avatar: "/man.jpg" },
            comments: 3,
        },
        {
            title: "Tests utilisateurs interface mobile",
            priority: "high",
            dueDate: "17 Oct",
            assignee: { name: "Julie K.", avatar: "/diverse-woman-portrait.png" },
            comments: 8,
        },
        {
            title: "Documentation technique API v2",
            priority: "low",
            dueDate: "20 Oct",
            assignee: { name: "Thomas B.", avatar: "/diverse-group-friends.png" },
            comments: 2,
        },
    ]
 
    return (
        <Layout>
            <div className="p-6 mx-auto space-y-8">
                {/* Welcome Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Bienvenue, Aryaman</h1>
                        <p className="text-gray-500 mt-1">Voici un aperçu de vos projets et tâches</p>
                    </div>
                    <Button size="lg" className="gap-2">
                        <Plus className="h-5 w-5" />
                        Nouveau projet
                    </Button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat) => (
                        <StatsCard key={stat.title} {...stat} />
                    ))}
                </div>

                {/* Projects Section */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold">Projets récents</h2>
                        <Button variant="ghost">Voir tout</Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {projects.map((project) => (
                            <ProjectCard key={project.title} {...project} />
                        ))}
                    </div>
                </section>

                {/* Recent Tasks Section */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold">Tâches récentes</h2>
                        <Button variant="ghost">Voir tout</Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {recentTasks.map((task, index) => (
                            <TaskCard key={index} {...task} />
                        ))}
                    </div>
                </section>
            </div>
        </Layout>
    )
}

export default Dashboard
