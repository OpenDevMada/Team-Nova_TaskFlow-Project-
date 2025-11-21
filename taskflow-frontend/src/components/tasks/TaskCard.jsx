import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, MessageSquare, MoreVertical, Edit, Trash2 } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTasks } from '@/hooks/useTasks';
// import EditTaskModal from './EditTaskModal';

const priorityConfig = {
    high: { label: 'Haute', variant: 'destructive' },
    medium: { label: 'Moyenne', variant: 'default' },
    low: { label: 'Basse', variant: 'secondary' }
};

const statusConfig = {
    1: { label: 'À faire', color: 'bg-gray-100 text-gray-800' },
    2: { label: 'En cours', color: 'bg-blue-100 text-blue-800' },
    3: { label: 'Terminé', color: 'bg-green-100 text-green-800' }
};

export default function TaskCard({ task }) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const { deleteTask } = useTasks();

    const handleDelete = async () => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer la tâche "${task.title}" ?`)) {
            await deleteTask(task.id);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return null;
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short'
        });
    };

    const getInitials = (user) => {
        if (!user) return '?';
        return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
    };

    return (
        <>
            <Card className="cursor-grab hover:shadow-md transition-shadow active:cursor-grabbing">
                <CardContent className="p-3 space-y-2">
                    {/* En-tête avec titre et menu */}
                    <div className="flex items-start justify-between gap-2">
                        <h4 className="font-medium text-sm flex-1 leading-tight">
                            {task.title}
                        </h4>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="h-6 w-6 flex items-center justify-center rounded hover:bg-muted">
                                    <MoreVertical className="h-3 w-3" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Modifier
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={handleDelete}
                                    className="text-destructive focus:text-destructive"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Supprimer
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Description */}
                    {task.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                            {task.description}
                        </p>
                    )}

                    {/* Badges de statut et priorité */}
                    <div className="flex flex-wrap gap-1">
                        {task.status && (
                            <Badge variant="outline" className="text-xs">
                                {statusConfig[task.status.id]?.label || task.status.name}
                            </Badge>
                        )}
                        {task.priority && (
                            <Badge
                                variant={priorityConfig[task.priority.name]?.variant || 'default'}
                                className="text-xs"
                            >
                                {priorityConfig[task.priority.name]?.label || task.priority.name}
                            </Badge>
                        )}
                    </div>

                    {/* Métadonnées */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-3">
                            {/* Date d'échéance */}
                            {task.dueDate && (
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>{formatDate(task.dueDate)}</span>
                                </div>
                            )}

                            {/* Commentaires */}
                            {task.comments && task.comments.length > 0 && (
                                <div className="flex items-center gap-1">
                                    <MessageSquare className="h-3 w-3" />
                                    <span>{task.comments.length}</span>
                                </div>
                            )}
                        </div>

                        {/* Assigné */}
                        {task.assignee && (
                            <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-[10px]">
                                    {getInitials(task.assignee)}
                                </AvatarFallback>
                            </Avatar>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Modal d'édition */}
            <EditTaskModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                task={task}
            />
        </>
    );
}