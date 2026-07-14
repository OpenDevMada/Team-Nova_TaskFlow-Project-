import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/Select"
import { Loader2, Search, UserPlus, Users, Check } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useProjectMembers } from "@/hooks/useProjectMembers"
import { useAuth } from "@/hooks/useAuth"
import Swal from 'sweetalert2'
import { swalTheme } from "@/lib/swal"

const roleOptions = [
    { value: "viewer", label: "Observateur", description: "Peut voir le projet mais pas modifier" },
    { value: "member", label: "Membre", description: "Peut créer et modifier des tâches" },
    { value: "admin", label: "Administrateur", description: "Gestion complète du projet" },
]

export default function AddMemberModal({ project, isOpen, onClose, onMemberAdded }) {
    const { loading, addMember, getAllUsers, searchUsers, resetError } = useProjectMembers()
    const { user: currentUser } = useAuth()
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedRole, setSelectedRole] = useState("member")
    const [allUsers, setAllUsers] = useState([])
    const [filteredUsers, setFilteredUsers] = useState([])
    const [addingIds, setAddingIds] = useState(new Set())
    const [isLoadingUsers, setIsLoadingUsers] = useState(false)
    const searchTimer = useRef(null)

    useEffect(() => {
        if (isOpen) {
            loadAllUsers()
            setSearchQuery("")
        }
    }, [isOpen])

    useEffect(() => {
        if (!isOpen) return
        if (searchTimer.current) clearTimeout(searchTimer.current)
        if (!searchQuery) {
            setFilteredUsers(allUsers)
            return
        }
        searchTimer.current = setTimeout(async () => {
            setIsLoadingUsers(true)
            try {
                const result = await searchUsers(searchQuery)
                const users = Array.isArray(result) ? result : (result?.data || [])
                const excludedIds = new Set([
                    ...(project.members?.map(m => m.userId) || []),
                    project.ownerId,
                    currentUser?.id,
                ].filter(Boolean))
                const available = users.filter(user => !excludedIds.has(user.id))
                setFilteredUsers(available)
            } catch {
                setFilteredUsers([])
            } finally {
                setIsLoadingUsers(false)
            }
        }, 300)
        return () => { if (searchTimer.current) clearTimeout(searchTimer.current) }
    }, [searchQuery, allUsers, isOpen])

    const loadAllUsers = async () => {
        setIsLoadingUsers(true);
        try {
            const response = await getAllUsers();
            const users = Array.isArray(response) ? response : (response?.data || [])
            const excludedIds = new Set([
                ...(project.members?.map(m => m.userId) || []),
                project.ownerId,
                currentUser?.id,
            ].filter(Boolean))
            const availableUsers = users.filter(user => !excludedIds.has(user.id))
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

    const handleQuickAdd = async (user) => {
        if (addingIds.has(user.id)) return
        setAddingIds(prev => new Set(prev).add(user.id))
        try {
            const result = await addMember(project.id, user.id, selectedRole)
            if (result) {
                setFilteredUsers(prev => prev.filter(u => u.id !== user.id))
                setAllUsers(prev => prev.filter(u => u.id !== user.id))
                Swal.fire({
                    ...swalTheme(),
                    title: 'Ajouté',
                    text: `${user.firstName} ${user.lastName} a été ajouté(e)`,
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false,
                    toast: true,
                    position: 'top-end',
                })
                onMemberAdded?.()
            }
        } catch (err) {
            Swal.fire({
                ...swalTheme(),
                title: 'Erreur',
                text: `Impossible d'ajouter ${user.firstName} ${user.lastName}`,
                icon: 'error',
                timer: 2000,
                showConfirmButton: false,
                toast: true,
                position: 'top-end',
            })
        } finally {
            setAddingIds(prev => {
                const next = new Set(prev)
                next.delete(user.id)
                return next
            })
        }
    }

    const handleClose = () => {
        setSearchQuery("");
        setSelectedRole("member");
        setAddingIds(new Set())
        resetError();
        onClose();
    }

    const getInitials = (user) => {
        return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
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
                        Cliquez sur <strong>+</strong> à côté d'un utilisateur pour l'ajouter au projet &ldquo;{project.name}&rdquo;
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 flex flex-col gap-4">
                    {/* Recherche */}
                    <div className="space-y-3 flex-1 flex flex-col">
                        <div className="space-y-2">
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

                        {/* Sélection du rôle */}
                        <div className="flex items-center gap-3">
                            <div className="flex-1">
                                <Select value={selectedRole} onValueChange={setSelectedRole}>
                                    <SelectTrigger>
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
                            <p className="text-xs text-muted-foreground whitespace-nowrap">
                                {filteredUsers.length} disponible{filteredUsers.length > 1 ? 's' : ''}
                            </p>
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
                                        const isAdding = addingIds.has(user.id)
                                        return (
                                            <div
                                                key={user.id}
                                                className="flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors"
                                            >
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
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    disabled={isAdding || loading}
                                                    onClick={() => handleQuickAdd(user)}
                                                    className="gap-1 shrink-0"
                                                >
                                                    {isAdding ? (
                                                        <Loader2 className="h-3 w-3 animate-spin" />
                                                    ) : (
                                                        <UserPlus className="h-3 w-3" />
                                                    )}
                                                    Ajouter
                                                </Button>
                                            </div>
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
                </div>
            </DialogContent>
        </Dialog>
    )
}