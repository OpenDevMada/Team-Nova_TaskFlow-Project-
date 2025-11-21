import { useState, useEffect } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/Select';
import { Loader2, Calendar, User } from 'lucide-react';
import { useProjectMembers } from '@/hooks/useProjectMembers';

export default function EditTaskModal({
    isOpen,
    onClose,
    task
}) {
    const { updateTask, loading, lists } = useTasks();
    const { getProjectMembers } = useProjectMembers();
    const [members, setMembers] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        listId: '',
        priorityId: 2,
        assigneeId: '',
        dueDate: '',
        statusId: 1
    });

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title || '',
                description: task.description || '',
                listId: task.listId || '',
                priorityId: task.priority?.id || 2,
                assigneeId: task.assignee?.id || '',
                dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
                statusId: task.status?.id || 1
            });

            // Charger les membres du projet
            if (task.project?.id) {
                loadMembers(task.project.id);
            }
        }
    }, [task]);

    const loadMembers = async (projectId) => {
        try {
            const membersData = await getProjectMembers(projectId);
            setMembers(membersData || []);
        } catch (error) {
            console.error('Erreur lors du chargement des membres:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim()) return;

        const updateData = {
            title: formData.title.trim(),
            description: formData.description,
            listId: formData.listId,
            priorityId: formData.priorityId,
            assigneeId: formData.assigneeId || null,
            dueDate: formData.dueDate || null,
            statusId: formData.statusId
        };

        const updatedTask = await updateTask(task.id, updateData);
        if (updatedTask) {
            onClose();
        }
    };

    const handleClose = () => {
        setFormData({
            title: '',
            description: '',
            listId: '',
            priorityId: 2,
            assigneeId: '',
            dueDate: '',
            statusId: 1
        });
        setMembers([]);
        onClose();
    };

    if (!task) return null;

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Modifier la tâche</DialogTitle>
                    <DialogDescription>
                        Modifiez les détails de votre tâche
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Titre */}
                    <div className="space-y-2">
                        <Label htmlFor="title">Titre *</Label>
                        <Input
                            id="title"
                            placeholder="Titre de la tâche..."
                            value={formData.title}
                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Description de la tâche..."
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            rows={4}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Liste */}
                        <div className="space-y-2">
                            <Label htmlFor="list">Liste *</Label>
                            <Select
                                value={formData.listId}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, listId: value }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionnez une liste" />
                                </SelectTrigger>
                                <SelectContent>
                                    {lists.map((list) => (
                                        <SelectItem key={list.id} value={list.id}>
                                            {list.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Statut */}
                        <div className="space-y-2">
                            <Label htmlFor="status">Statut</Label>
                            <Select
                                value={formData.statusId.toString()}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, statusId: parseInt(value) }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Statut" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">À faire</SelectItem>
                                    <SelectItem value="2">En cours</SelectItem>
                                    <SelectItem value="3">Terminé</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Priorité */}
                        <div className="space-y-2">
                            <Label htmlFor="priority">Priorité</Label>
                            <Select
                                value={formData.priorityId.toString()}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, priorityId: parseInt(value) }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Priorité" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">Haute</SelectItem>
                                    <SelectItem value="2">Moyenne</SelectItem>
                                    <SelectItem value="3">Basse</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Assigné à */}
                        <div className="space-y-2">
                            <Label htmlFor="assignee" className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Assigné à
                            </Label>
                            <Select
                                value={formData.assigneeId}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, assigneeId: value }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Non assigné" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">Non assigné</SelectItem>
                                    {members.map((member) => (
                                        <SelectItem key={member.user.id} value={member.user.id}>
                                            {member.user.firstName} {member.user.lastName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Date d'échéance */}
                    <div className="space-y-2">
                        <Label htmlFor="dueDate" className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Date d'échéance
                        </Label>
                        <Input
                            id="dueDate"
                            type="date"
                            value={formData.dueDate}
                            onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={loading}
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading || !formData.title.trim()}
                        >
                            {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                            Modifier la tâche
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}