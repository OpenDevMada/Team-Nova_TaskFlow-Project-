import { useEffect, useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Plus, Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import TaskList from './TaskList';
import CreateTaskModal from './CreateTaskModal';
import CreateListModal from './CreateListModal';

export default function TaskBoard() {
    const { projectId } = useParams();
    const {
        lists,
        loading,
        error,
        fetchProjectLists,
        updateList,
        deleteList,
        moveTask,
        resetError
    } = useTasks(projectId);

    const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
    const [isCreateListModalOpen, setIsCreateListModalOpen] = useState(false);
    const [selectedListId, setSelectedListId] = useState(null);

    // Charger les listes au montage
    useEffect(() => {
        if (projectId) {
            console.log('🚀 Chargement des listes pour projectId:', projectId);
            fetchProjectLists(projectId);
        }
    }, [projectId]);

    // Debug: Afficher les listes chargées
    useEffect(() => {
        console.log('📋 Lists state mis à jour:', lists);
        console.log('📋 Nombre de listes:', lists?.length);
        if (lists?.length > 0) {
            console.log('📋 Première liste:', lists[0]);
        }
    }, [lists]);

    const handleCreateTask = (listId) => {
        console.log('🎯 Ouverture modal création tâche, listId:', listId);
        console.log('🎯 Lists disponibles:', lists);
        setSelectedListId(listId);
        setIsCreateTaskModalOpen(true);
    };

    const handleDragStart = (e, task) => {
        e.dataTransfer.setData('application/json', JSON.stringify({
            taskId: task.id,
            sourceListId: task.listId
        }));
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = async (e, targetListId) => {
        e.preventDefault();
        try {
            const data = JSON.parse(e.dataTransfer.getData('application/json'));
            const { taskId, sourceListId } = data;

            if (sourceListId !== targetListId) {
                await moveTask(taskId, targetListId);
                fetchProjectLists(projectId);
            }
        } catch (error) {
            console.error('Erreur lors du déplacement:', error);
        }
    };

    if (loading && (!lists || lists.length === 0)) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    // S'assurer que lists est un tableau
    const safeLists = Array.isArray(lists) ? lists : [];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Tableau des tâches</h1>
                    <p className="text-muted-foreground">
                        Gérez vos tâches avec une interface Kanban
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        onClick={() => setIsCreateListModalOpen(true)}
                        variant="outline"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Nouvelle liste
                    </Button>
                </div>
            </div>

            {/* Erreurs */}
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="flex items-center justify-between">
                        {error}
                        <Button variant="outline" size="sm" onClick={resetError} className="ml-4">
                            Fermer
                        </Button>
                    </AlertDescription>
                </Alert>
            )}

            {/* Debug info */}
            <div className="text-xs text-muted-foreground">
                Debug: {safeLists.length} liste(s) chargée(s) | ProjectId: {projectId}
            </div>

            {/* Board Kanban */}
            <div className="flex gap-4 overflow-x-auto pb-4 min-h-[600px]">
                {safeLists.map((list) => {
                    if (!list) return null;

                    const listTasks = list.tasks || [];

                    return (
                        <TaskList
                            key={list.id}
                            list={list}
                            tasks={listTasks}
                            onDragStart={handleDragStart}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            onCreateTask={() => handleCreateTask(list.id)}
                            onUpdateList={updateList}
                            onDeleteList={deleteList}
                        />
                    );
                })}

                {/* Nouvelle liste */}
                <div className="w-80 flex-shrink-0">
                    <button
                        onClick={() => setIsCreateListModalOpen(true)}
                        className="w-full h-full min-h-[600px] border-2 border-dashed border-muted-foreground/25 rounded-lg hover:border-muted-foreground/50 transition-colors flex items-center justify-center"
                    >
                        <div className="text-center">
                            <Plus className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">Nouvelle liste</p>
                        </div>
                    </button>
                </div>
            </div>

            {/* Modal Création Tâche */}
            <CreateTaskModal
                isOpen={isCreateTaskModalOpen}
                onClose={() => {
                    setIsCreateTaskModalOpen(false);
                    setSelectedListId(null);
                }}
                projectId={projectId}
                defaultListId={selectedListId}
                lists={safeLists}
                onTaskCreated={() => {
                    fetchProjectLists(projectId);
                    setIsCreateTaskModalOpen(false);
                    setSelectedListId(null);
                }}
            />

            {/* Modal Création Liste */}
            <CreateListModal
                isOpen={isCreateListModalOpen}
                onClose={() => setIsCreateListModalOpen(false)}
                projectId={projectId}
                onListCreated={() => {
                    fetchProjectLists(projectId);
                    setIsCreateListModalOpen(false);
                }}
            />
        </div>
    );
}