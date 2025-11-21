import { useState } from 'react';
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
import { Loader2 } from 'lucide-react';

export default function CreateTaskModal({
    isOpen,
    onClose,
    projectId,
    defaultListId,
    lists,
    onTaskCreated
}) {
    const { createTask, loading } = useTasks();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        listId: defaultListId || '',
        priorityId: 2, // Medium par défaut
        assigneeId: '',
        dueDate: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const taskData = {
            ...formData,
            projectId
        };

        const newTask = await createTask(taskData);
        if (newTask) {
            onTaskCreated();
            handleClose();
        }
    };

    const handleClose = () => {
        setFormData({
            title: '',
            description: '',
            listId: defaultListId || '',
            priorityId: 2,
            assigneeId: '',
            dueDate: ''
        });
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Créer une nouvelle tâche</DialogTitle>
                    <DialogDescription>
                        Ajoutez une nouvelle tâche à votre projet
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
                            rows={3}
                        />
                    </div>

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

                    {/* Priorité */}
                    <div className="space-y-2">
                        <Label htmlFor="priority">Priorité</Label>
                        <Select
                            value={formData.priorityId.toString()}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, priorityId: parseInt(value) }))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez une priorité" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">Haute</SelectItem>
                                <SelectItem value="2">Moyenne</SelectItem>
                                <SelectItem value="3">Basse</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Date d'échéance */}
                    <div className="space-y-2">
                        <Label htmlFor="dueDate">Date d'échéance</Label>
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
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                            Créer la tâche
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}