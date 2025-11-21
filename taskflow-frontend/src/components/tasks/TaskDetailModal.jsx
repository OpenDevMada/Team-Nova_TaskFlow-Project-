import { useState } from 'react';
import { useTask } from '@/hooks/useTasks';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Calendar, User, MessageSquare, FileText, Edit, Loader2 } from 'lucide-react';

const priorityConfig = {
    high: { label: 'Haute', variant: 'destructive' },
    medium: { label: 'Moyenne', variant: 'default' },
    low: { label: 'Basse', variant: 'secondary' }
};

export default function TaskDetailModal({
    isOpen,
    onClose,
    taskId,
    onEdit
}) {
    const { task, loading } = useTask(taskId);
    const [activeTab, setActiveTab] = useState('details');

    const formatDate = (dateString) => {
        if (!dateString) return 'Non définie';
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const getInitials = (user) => {
        if (!user) return '?';
        return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
    };

    if (loading) {
        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent>
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    if (!task) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <DialogTitle className="text-xl mb-2">
                                {task.title}
                            </DialogTitle>
                            <DialogDescription>
                                Dans la liste <strong>{task.list?.name}</strong>
                            </DialogDescription>
                        </div>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => onEdit(task)}
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                    </div>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Métadonnées */}
                    <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">
                            {task.status?.name || 'Non défini'}
                        </Badge>
                        <Badge variant={priorityConfig[task.priority?.name]?.variant || 'default'}>
                            {priorityConfig[task.priority?.name]?.label || task.priority?.name}
                        </Badge>
                    </div>

                    {/* Description */}
                    {task.description && (
                        <div className="space-y-2">
                            <h4 className="font-medium flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                Description
                            </h4>
                            <p className="text-sm text-muted-foreground whitespace-pre-line">
                                {task.description}
                            </p>
                        </div>
                    )}

                    {/* Informations */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        {/* Assigné */}
                        <div className="space-y-1">
                            <Label className="flex items-center gap-2 text-muted-foreground">
                                <User className="h-4 w-4" />
                                Assigné à
                            </Label>
                            <div className="flex items-center gap-2">
                                {task.assignee ? (
                                    <>
                                        <Avatar className="h-6 w-6">
                                            <AvatarFallback className="text-xs">
                                                {getInitials(task.assignee)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span>{task.assignee.firstName} {task.assignee.lastName}</span>
                                    </>
                                ) : (
                                    <span className="text-muted-foreground">Non assigné</span>
                                )}
                            </div>
                        </div>

                        {/* Date d'échéance */}
                        <div className="space-y-1">
                            <Label className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                Échéance
                            </Label>
                            <div>{formatDate(task.dueDate)}</div>
                        </div>

                        {/* Créé par */}
                        <div className="space-y-1">
                            <Label className="text-muted-foreground">Créé par</Label>
                            <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                    <AvatarFallback className="text-xs">
                                        {getInitials(task.creator)}
                                    </AvatarFallback>
                                </Avatar>
                                <span>{task.creator.firstName} {task.creator.lastName}</span>
                            </div>
                        </div>

                        {/* Date de création */}
                        <div className="space-y-1">
                            <Label className="text-muted-foreground">Créé le</Label>
                            <div>{formatDate(task.createdAt)}</div>
                        </div>
                    </div>

                    {/* Commentaires (à implémenter) */}
                    <div className="space-y-2">
                        <h4 className="font-medium flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            Commentaires ({task.comments?.length || 0})
                        </h4>
                        {(!task.comments || task.comments.length === 0) && (
                            <p className="text-sm text-muted-foreground">
                                Aucun commentaire pour le moment
                            </p>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}