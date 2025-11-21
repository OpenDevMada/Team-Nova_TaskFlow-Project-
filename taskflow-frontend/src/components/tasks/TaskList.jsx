import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { MoreVertical, Plus, Trash2, Edit } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import TaskCard from './TaskCard';
// import EditListModal from './EditListModal';
import { useTasks } from '@/hooks/useTasks';

export default function TaskList({
    list,
    tasks,
    onDragStart,
    onDragOver,
    onDrop,
    onCreateTask,
    onUpdateList,
    onDeleteList
}) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const { deleteList } = useTasks();

    const handleDeleteList = async () => {
        if (tasks.length > 0) {
            alert('Impossible de supprimer une liste contenant des tâches');
            return;
        }

        if (confirm(`Êtes-vous sûr de vouloir supprimer la liste "${list.name}" ?`)) {
            await onDeleteList(list.id);
        }
    };

    return (
        <>
            <div className="w-80 flex-shrink-0">
                <Card
                    className="h-full"
                    onDragOver={onDragOver}
                    onDrop={(e) => onDrop(e, list.id)}
                >
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <CardTitle className="text-base">{list.name}</CardTitle>
                                <Badge variant="secondary" className="text-xs">
                                    {tasks.length}
                                </Badge>
                            </div>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
                                        <Edit className="h-4 w-4 mr-2" />
                                        Modifier
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={onCreateTask}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Ajouter une tâche
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={handleDeleteList}
                                        className="text-destructive focus:text-destructive"
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Supprimer
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-3">
                        {/* Bouton pour ajouter une tâche */}
                        <Button
                            variant="outline"
                            className="w-full justify-start text-muted-foreground"
                            onClick={onCreateTask}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Ajouter une tâche
                        </Button>

                        {/* Liste des tâches */}
                        <div className="space-y-2 max-h-[500px] overflow-y-auto">
                            {tasks.map((task) => (
                                <div
                                    key={task.id}
                                    draggable
                                    onDragStart={(e) => onDragStart(e, task)}
                                >
                                    <TaskCard task={task} />
                                </div>
                            ))}
                        </div>

                        {tasks.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                <p className="text-sm">Aucune tâche</p>
                                <p className="text-xs">Glissez-déposez une tâche ici</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Modal d'édition de liste */}
            <EditListModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                list={list}
                onUpdate={onUpdateList}
            />
        </>
    );
}