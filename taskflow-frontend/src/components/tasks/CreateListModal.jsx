import { useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

export default function CreateListModal({
    isOpen,
    onClose,
    projectId,
    onListCreated
}) {
    const { createList, loading } = useTasks();
    const [name, setName] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) return;

        const listData = {
            name: name.trim(),
            position: Date.now() // Utiliser timestamp pour position temporaire
        };

        const newList = await createList(listData, projectId);
        if (newList) {
            onListCreated();
            handleClose();
        }
    };

    const handleClose = () => {
        setName('');
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Créer une nouvelle liste</DialogTitle>
                    <DialogDescription>
                        Ajoutez une nouvelle colonne à votre tableau Kanban
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nom de la liste *</Label>
                        <Input
                            id="name"
                            placeholder="Ex: En cours, Terminé, Backlog..."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            autoFocus
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
                            disabled={loading || !name.trim()}
                        >
                            {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                            Créer la liste
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}