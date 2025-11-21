import { useState, useEffect } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { useProjectMembers } from '@/hooks/useProjectMembers';
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
import { Loader2, User, Calendar } from 'lucide-react';

export default function CreateTaskModal({
    isOpen,
    onClose,
    projectId,
    defaultListId,
    lists = [], // ✅ Valeur par défaut
    onTaskCreated
}) {
    const { createTask, loading } = useTasks(projectId);
    const { getProjectMembers } = useProjectMembers();
    const [members, setMembers] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        listId: '',
        priorityId: 2,
        assigneeId: '',
        dueDate: ''
    });

    // ✅ Mettre à jour listId quand defaultListId change
    useEffect(() => {
        if (defaultListId) {
            setFormData(prev => ({ ...prev, listId: defaultListId }));
        }
    }, [defaultListId]);

    // ✅ Charger les membres du projet
    useEffect(() => {
        const loadMembers = async () => {
            if (projectId && isOpen) {
                try {
                    const membersData = await getProjectMembers(projectId);
                    setMembers(membersData || []);
                } catch (error) {
                    console.error('Erreur chargement membres:', error);
                }
            }
        };
        loadMembers();
    }, [projectId, isOpen, getProjectMembers]);

    // ✅ S'assurer que lists est un tableau
    const safeLists = Array.isArray(lists) ? lists : [];

    console.log('📋 CreateTaskModal - Lists reçues:', safeLists);
    console.log('📋 CreateTaskModal - defaultListId:', defaultListId);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            alert('Le titre est requis');
            return;
        }

        if (!formData.listId) {
            alert('Veuillez sélectionner une liste');
            return;
        }

        const taskData = {
            title: formData.title.trim(),
            description: formData.description,
            listId: formData.listId,
            priorityId: formData.priorityId,
            assigneeId: formData.assigneeId || null,
            dueDate: formData.dueDate || null
            // projectId n'est pas nécessaire car le backend le récupère via listId
        };

        console.log('📤 Création tâche avec:', taskData);

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
                            autoFocus
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
                                {safeLists.length === 0 ? (
                                    <SelectItem value="" disabled>
                                        Aucune liste disponible
                                    </SelectItem>
                                ) : (
                                    safeLists.map((list) => (
                                        <SelectItem key={list.id} value={list.id}>
                                            {list.name}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                        {safeLists.length === 0 && (
                            <p className="text-xs text-muted-foreground">
                                Créez d'abord une liste pour ajouter des tâches
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Priorité */}
                        <div className="space-y-2">
                            <Label htmlFor="priority">Priorité</Label>
                            <Select
                                value={formData.priorityId.toString()}
                                onValueChange={(value) => setFormData(prev => ({
                                    ...prev,
                                    priorityId: parseInt(value)
                                }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Priorité" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="3">Haute</SelectItem>
                                    <SelectItem value="2">Moyenne</SelectItem>
                                    <SelectItem value="1">Basse</SelectItem>
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
                                onValueChange={(value) => setFormData(prev => ({
                                    ...prev,
                                    assigneeId: value
                                }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Non assigné" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">Non assigné</SelectItem>
                                    {members.map((member) => (
                                        <SelectItem
                                            key={member.user?.id || member.id}
                                            value={member.user?.id || member.id}
                                        >
                                            {member.user?.firstName || member.firstName} {member.user?.lastName || member.lastName}
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
                            disabled={loading || !formData.title.trim() || !formData.listId}
                        >
                            {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                            Créer la tâche
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}