import { useState, useEffect } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/Select"
import { Loader2, Search, UserPlus, X, Users, Check } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/Badge"
import { useProjectMembers } from "@/hooks/useProjectMembers"
import Swal from 'sweetalert2'

const roleOptions = [
    { value: "viewer", label: "Observateur", description: "Peut voir le projet mais pas modifier" },
    { value: "member", label: "Membre", description: "Peut créer et modifier des tâches" },
    { value: "admin", label: "Administrateur", description: "Gestion complète du projet" },
]

export default function AddMemberModal({ project, isOpen, onClose, onMemberAdded }) {
    const { loading, error, addMember, getAllUsers, resetError } = useProjectMembers()
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedRole, setSelectedRole] = useState("member")
    const [allUsers, setAllUsers] = useState([])
    const [filteredUsers, setFilteredUsers] = useState([])
    const [selectedUsers, setSelectedUsers] = useState([]) // ← Changé pour multiple
    const [isLoadingUsers, setIsLoadingUsers] = useState(false)

    // Charger tous les utilisateurs au montage
    useEffect(() => {
        if (isOpen) {
            loadAllUsers()
            setSelectedUsers([]) // Réinitialiser la sélection
        }
    }, [isOpen])

    // Filtrer les utilisateurs en fonction de la recherche
    useEffect(() => {
        if (!searchQuery) {
            setFilteredUsers(allUsers)
        } else {
            const filtered = allUsers.filter(user =>
                user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchQuery.toLowerCase())
            )
            setFilteredUsers(filtered)
        }
    }, [searchQuery, allUsers])

    const loadAllUsers = async () => {
        setIsLoadingUsers(true);
        try {
            const users = await getAllUsers();
            const existingMemberIds = new Set(project.members?.map(m => m.userId) || []);
            const availableUsers = (users || []).filter(user =>
                !existingMemberIds.has(user.id) &&
                user.id !== project.ownerId
            );
            setAllUsers(availableUsers);
            setFilteredUsers(availableUsers);
        } catch (error) {
            console.error("Erreur lors du chargement des utilisateurs:", error);
            setAllUsers([]);
            setFilteredUsers([]);
        } finally {
            setIsLoadingUsers(false);
        }
    };

    const handleUserSelect = (user) => {
        setSelectedUsers(prev => {
            const isAlreadySelected = prev.some(u => u.id === user.id);
            if (isAlreadySelected) {
                return prev.filter(u => u.id !== user.id);
            } else {
                return [...prev, user];
            }
        });
    }

    const handleRemoveUser = (userId) => {
        setSelectedUsers(prev => prev.filter(user => user.id !== userId));
    }

    const handleRemoveAllUsers = () => {
        setSelectedUsers([]);
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (selectedUsers.length === 0) {
            Swal.fire({
                title: 'Aucun utilisateur sélectionné',
                text: 'Veuillez sélectionner au moins un utilisateur à ajouter',
                icon: 'warning',
                confirmButtonColor: '#3b82f6',
            })
            return
        }

        const result = await Swal.fire({
            title: 'Confirmer l\'ajout',
            html: `
                <div class="text-left">
                    <p>Ajouter ${selectedUsers.length} utilisateur(s) au projet ?</p>
                    <div class="mt-2 max-h-32 overflow-y-auto">
                        ${selectedUsers.map(user =>
                `<p class="text-sm">• ${user.firstName} ${user.lastName}</p>`
            ).join('')}
                    </div>
                    <p class="text-sm text-gray-500 mt-2">Rôle : ${roleOptions.find(r => r.value === selectedRole)?.label}</p>
                </div>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: `Ajouter ${selectedUsers.length} membre(s)`,
            cancelButtonText: 'Annuler',
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#6b7280',
        })

        if (result.isConfirmed) {
            let successCount = 0;
            let errorCount = 0;

            // Ajouter tous les utilisateurs sélectionnés
            for (const user of selectedUsers) {
                const newMember = await addMember(project.id, user.id, selectedRole);
                if (newMember) {
                    successCount++;
                } else {
                    errorCount++;
                }
            }

            if (successCount > 0) {
                await Swal.fire({
                    title: 'Membres ajoutés !',
                    html: `
                        <div class="text-left">
                            <p>${successCount} membre(s) ajouté(s) avec succès</p>
                            ${errorCount > 0 ?
                            `<p class="text-sm text-orange-600 mt-1">${errorCount} erreur(s) lors de l'ajout</p>` :
                            ''
                        }
                        </div>
                    `,
                    icon: successCount === selectedUsers.length ? 'success' : 'warning',
                    timer: 3000,
                    showConfirmButton: false
                });

                // Recharger la liste des utilisateurs disponibles
                loadAllUsers();
                onMemberAdded?.();
                handleClose();
            }
        }
    }

    const handleClose = () => {
        setSelectedUsers([]);
        setSearchQuery("");
        setSelectedRole("member");
        resetError();
        onClose();
    }

    const getInitials = (user) => {
        return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
    }

    const isUserSelected = (user) => {
        return selectedUsers.some(u => u.id === user.id);
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <UserPlus className="h-5 w-5" />
                        Ajouter des membres
                    </DialogTitle>
                    <DialogDescription>
                        Sélectionnez un ou plusieurs utilisateurs à ajouter au projet "{project.name}"
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-4">
                    {/* Utilisateurs sélectionnés */}
                    {selectedUsers.length > 0 && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label>Utilisateurs sélectionnés ({selectedUsers.length})</Label>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleRemoveAllUsers}
                                    className="h-8 text-xs"
                                >
                                    Tout effacer
                                </Button>
                            </div>
                            <div className="border rounded-lg max-h-32 overflow-y-auto">
                                {selectedUsers.map((user) => (
                                    <div key={user.id} className="flex items-center justify-between p-3 border-b last:border-b-0">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback className="text-xs">
                                                    {getInitials(user)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-sm font-medium">
                                                    {user.firstName} {user.lastName}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleRemoveUser(user.id)}
                                            className="h-6 w-6"
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recherche et liste des utilisateurs */}
                    <div className="space-y-3 flex-1 flex flex-col">
                        <div className="space-y-2">
                            <Label htmlFor="user-search">
                                Rechercher des utilisateurs
                            </Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="user-search"
                                    placeholder="Rechercher par nom ou email..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                        </div>

                        {/* En-tête de la liste */}
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                Utilisateurs disponibles ({filteredUsers.length})
                            </h4>
                            {selectedUsers.length > 0 && (
                                <span className="text-xs text-muted-foreground">
                                    {selectedUsers.length} sélectionné(s)
                                </span>
                            )}
                        </div>

                        {/* Liste des utilisateurs */}
                        <div className="border rounded-lg flex-1 overflow-y-auto">
                            {isLoadingUsers ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                                    <span className="text-sm text-muted-foreground">Chargement des utilisateurs...</span>
                                </div>
                            ) : filteredUsers.length > 0 ? (
                                <div className="divide-y">
                                    {filteredUsers.map((user) => {
                                        const isSelected = isUserSelected(user);
                                        return (
                                            <button
                                                key={user.id}
                                                type="button"
                                                onClick={() => handleUserSelect(user)}
                                                className={`w-full p-3 text-left transition-colors duration-150 ${isSelected
                                                        ? 'bg-primary/10 border-l-4 border-l-primary'
                                                        : 'hover:bg-muted/50'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center gap-3 flex-1">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarFallback className="text-xs">
                                                                {getInitials(user)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium truncate">
                                                                {user.firstName} {user.lastName}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground truncate">
                                                                {user.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {isSelected && (
                                                        <Check className="h-4 w-4 text-primary flex-shrink-0" />
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                                    <p className="text-sm text-muted-foreground">
                                        {searchQuery ? 'Aucun utilisateur trouvé' : 'Aucun utilisateur disponible'}
                                    </p>
                                    {!searchQuery && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Tous les utilisateurs sont déjà membres de ce projet
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sélection du rôle */}
                    <div className="space-y-2">
                        <Label htmlFor="role">Rôle pour tous les membres sélectionnés</Label>
                        <Select value={selectedRole} onValueChange={setSelectedRole}>
                            <SelectTrigger id="role">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {roleOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{option.label}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {option.description}
                                            </span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Affichage des erreurs */}
                    {error && (
                        <div className="p-3 border border-destructive/50 bg-destructive/10 rounded-lg">
                            <p className="text-sm text-destructive">{error}</p>
                        </div>
                    )}

                    <DialogFooter className="mt-auto">
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
                            disabled={loading || selectedUsers.length === 0}
                            className="gap-2"
                        >
                            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                            <UserPlus className="h-4 w-4" />
                            Ajouter {selectedUsers.length > 0 ? `(${selectedUsers.length})` : ''}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}