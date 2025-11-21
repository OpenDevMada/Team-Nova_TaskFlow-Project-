import { useState, useEffect } from 'react';
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

export default function EditListModal({
    isOpen,
    onClose,
    list,
    onUpdate
}) {
    const { updateList, loading } = useTasks();
    const [name, setName] = useState('');

    useEffect(() => {
        if (list) {
            setName(list.name || '');
        }
    }, [list]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim() || name === list.name) {
            onClose();
            return;
        }

        const updatedList = await updateList(list.id, { name: name.trim() });
        if (updatedList) {
            onUpdate(updatedList);
            handleClose();
        }
    };

    const handleClose = () => {
        setName('');
        onClose();
    };

    if (!list) return null;

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Modifier la liste</DialogTitle>
                    <DialogDescription>
                        Modifiez le nom de votre liste
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
                            disabled={loading || !name.trim() || name === list.name}
                        >
                            {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                            Modifier
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}