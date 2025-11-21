import { useEffect, useState } from 'react';
import Layout from "@/pages/Layout/Layout";
import TaskCard from "@/components/tasks/TaskCard";
import { Button } from "@/components/ui/Button";
import { Plus, Filter, SortAsc, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { useTasks } from '@/hooks/useTasks';
import { useProjects } from '@/hooks/useProjects';
import CreateTaskModal from '@/components/tasks/CreateTaskModal';

export default function Tasks() {
    const { tasks, lists, loading, error, fetchProjectTasks, fetchProjectLists } = useTasks();
    const { projects, fetchProjects } = useProjects();

    const [selectedProject, setSelectedProject] = useState('all');
    const [selectedPriority, setSelectedPriority] = useState('all');
    const [sortBy, setSortBy] = useState('dueDate');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [allTasks, setAllTasks] = useState([]);

    // Charger les projets au montage
    useEffect(() => {
        fetchProjects();
    }, []);

    // Charger les tâches quand un projet est sélectionné
    useEffect(() => {
        const loadTasks = async () => {
            if (selectedProject === 'all') {
                // Charger les tâches de tous les projets
                const allProjectTasks = [];
                for (const project of projects) {
                    const projectTasks = await fetchProjectTasks(project.id);
                    if (projectTasks) {
                        allProjectTasks.push(...projectTasks);
                    }
                }
                setAllTasks(allProjectTasks);
            } else {
                const projectTasks = await fetchProjectTasks(selectedProject);
                setAllTasks(projectTasks || []);
            }
        };

        if (projects.length > 0) {
            loadTasks();
        }
    }, [selectedProject, projects]);

    // Filtrer les tâches
    const filteredTasks = allTasks.filter(task => {
        if (selectedPriority !== 'all' && task.priority?.name !== selectedPriority) {
            return false;
        }
        return true;
    });

    // Trier les tâches
    const sortedTasks = [...filteredTasks].sort((a, b) => {
        switch (sortBy) {
            case 'dueDate':
                return new Date(a.dueDate || '9999') - new Date(b.dueDate || '9999');
            case 'priority':
                return (b.priority?.id || 0) - (a.priority?.id || 0);
            case 'status':
                return (a.status?.id || 0) - (b.status?.id || 0);
            default:
                return 0;
        }
    });

    // Mapper les statuts du backend vers le frontend
    const getStatusKey = (task) => {
        if (!task.status) return 'todo';
        switch (task.status.id) {
            case 1: return 'todo';
            case 2: return 'in-progress';
            case 3: return 'done';
            default: return 'todo';
        }
    };

    const getTasksByStatus = (status) => {
        return sortedTasks.filter(task => getStatusKey(task) === status);
    };

    if (loading && allTasks.length === 0) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="p-6 mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-balance">Mes tâches</h1>
                        <p className="text-muted-foreground mt-1">
                            Gérez et suivez toutes vos tâches assignées
                        </p>
                    </div>
                    <Button size="lg" className="gap-2" onClick={() => setIsCreateModalOpen(true)}>
                        <Plus className="h-5 w-5" />
                        Nouvelle tâche
                    </Button>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-3">
                    <Select value={selectedProject} onValueChange={setSelectedProject}>
                        <SelectTrigger className="w-48">
                            <Filter className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Filtrer par projet" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tous les projets</SelectItem>
                            {projects.map(project => (
                                <SelectItem key={project.id} value={project.id}>
                                    {project.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={selectedPriority} onValueChange={setSelectedPriority}>
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

                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-48">
                            <SortAsc className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Trier par" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="dueDate">Date d'échéance</SelectItem>
                            <SelectItem value="priority">Priorité</SelectItem>
                            <SelectItem value="status">Statut</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="all" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="all">Toutes ({sortedTasks.length})</TabsTrigger>
                        <TabsTrigger value="todo">
                            À faire ({getTasksByStatus('todo').length})
                        </TabsTrigger>
                        <TabsTrigger value="in-progress">
                            En cours ({getTasksByStatus('in-progress').length})
                        </TabsTrigger>
                        <TabsTrigger value="done">
                            Terminées ({getTasksByStatus('done').length})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {sortedTasks.map((task) => (
                                <TaskCard key={task.id} task={task} />
                            ))}
                        </div>
                        {sortedTasks.length === 0 && (
                            <p className="text-center text-muted-foreground py-8">
                                Aucune tâche trouvée
                            </p>
                        )}
                    </TabsContent>

                    <TabsContent value="todo" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {getTasksByStatus('todo').map((task) => (
                                <TaskCard key={task.id} task={task} />
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="in-progress" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {getTasksByStatus('in-progress').map((task) => (
                                <TaskCard key={task.id} task={task} />
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="done" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {getTasksByStatus('done').map((task) => (
                                <TaskCard key={task.id} task={task} />
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Modal de création */}
            {selectedProject !== 'all' && (
                <CreateTaskModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    projectId={selectedProject}
                    lists={lists}
                    onTaskCreated={() => {
                        fetchProjectTasks(selectedProject);
                        setIsCreateModalOpen(false);
                    }}
                />
            )}
        </Layout>
    );
}