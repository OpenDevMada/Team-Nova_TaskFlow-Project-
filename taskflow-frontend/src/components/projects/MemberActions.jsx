import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Label } from "@/components/ui/label"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { MoreVertical, Edit, UserX, Shield, ShieldCheck, ShieldOff } from "lucide-react"
import { useProjectMembers } from "@/hooks/useProjectMembers"
import Swal from 'sweetalert2'

const roleOptions = [
    { value: "viewer", label: "Observateur", icon: ShieldOff },
    { value: "member", label: "Membre", icon: Shield },
    { value: "admin", label: "Administrateur", icon: ShieldCheck },
]

export default function MemberActions({ member, project, onUpdate, onRemove }) {
    const { loading, updateMemberRole, removeMember } = useProjectMembers()
    const [isEditRoleOpen, setIsEditRoleOpen] = useState(false)
    const [selectedRole, setSelectedRole] = useState(member.role)

    const handleRoleUpdate = async () => {
        if (selectedRole === member.role) {
            setIsEditRoleOpen(false)
            return
        }

        const result = await Swal.fire({
            title: 'Modifier le rôle',
            html: `
                <div class="text-left">
                    <p>Changer le rôle de <strong>${member.user.firstName} ${member.user.lastName}</strong> ?</p>
                    <p class="text-sm text-gray-500 mt-2">
                        De <span class="font-medium">${roleOptions.find(r => r.value === member.role)?.label}</span> 
                        vers <span class="font-medium">${roleOptions.find(r => r.value === selectedRole)?.label}</span>
                    </p>
                </div>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Modifier',
            cancelButtonText: 'Annuler',
            confirmButtonColor: '#3b82f6',
            cancelButtonColor: '#6b7280',
        })

        if (result.isConfirmed) {
            const updatedMember = await updateMemberRole(member.id, selectedRole)
            if (updatedMember) {
                await Swal.fire({
                    title: 'Rôle modifié !',
                    text: `Le rôle de ${member.user.firstName} ${member.user.lastName} a été mis à jour`,
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                })
                onUpdate?.(updatedMember)
                setIsEditRoleOpen(false)
            }
        }
    }

    const handleRemoveMember = async () => {
        // Empêcher la suppression du propriétaire
        if (member.userId === project.ownerId) {
            Swal.fire({
                title: 'Action impossible',
                text: 'Le propriétaire du projet ne peut pas être retiré',
                icon: 'warning',
                confirmButtonColor: '#3b82f6',
            })
            return
        }

        const result = await Swal.fire({
            title: 'Retirer le membre',
            html: `
                <div class="text-left">
                    <p>Retirer <strong>${member.user.firstName} ${member.user.lastName}</strong> du projet ?</p>
                    <p class="text-sm text-red-600 mt-2">Cette action est irréversible.</p>
                </div>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Retirer',
            cancelButtonText: 'Annuler',
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            reverseButtons: true,
        })

        if (result.isConfirmed) {
            const success = await removeMember(member.id)
            if (success) {
                await Swal.fire({
                    title: 'Membre retiré !',
                    text: `${member.user.firstName} ${member.user.lastName} a été retiré du projet`,
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                })
                onRemove?.(member.id)
            }
        }
    }

    const getRoleIcon = (role) => {
        const option = roleOptions.find(r => r.value === role)
        const IconComponent = option?.icon || Shield
        return <IconComponent className="h-4 w-4" />
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setIsEditRoleOpen(true)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier le rôle
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={handleRemoveMember}
                        className="text-destructive focus:text-destructive"
                        disabled={member.userId === project.ownerId}
                    >
                        <UserX className="h-4 w-4 mr-2" />
                        Retirer du projet
                        {member.userId === project.ownerId && " (Propriétaire)"}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Modal de modification de rôle */}
            <Dialog open={isEditRoleOpen} onOpenChange={setIsEditRoleOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>Modifier le rôle</DialogTitle>
                        <DialogDescription>
                            Modifiez le rôle de {member.user.firstName} {member.user.lastName} dans le projet
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 border rounded-lg">
                            <div className="flex-1">
                                <p className="font-medium">{member.user.firstName} {member.user.lastName}</p>
                                <p className="text-sm text-muted-foreground">{member.user.email}</p>
                            </div>
                            <Badge variant="outline" className="flex items-center gap-1">
                                {getRoleIcon(member.role)}
                                {roleOptions.find(r => r.value === member.role)?.label}
                            </Badge>
                        </div>

                        <div className="space-y-2">
                            <Label>Nouveau rôle</Label>
                            <Select value={selectedRole} onValueChange={setSelectedRole}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {roleOptions.map((option) => {
                                        const IconComponent = option.icon
                                        return (
                                            <SelectItem key={option.value} value={option.value}>
                                                <div className="flex items-center gap-2">
                                                    <IconComponent className="h-4 w-4" />
                                                    <span>{option.label}</span>
                                                </div>
                                            </SelectItem>
                                        )
                                    })}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsEditRoleOpen(false)}
                            disabled={loading}
                        >
                            Annuler
                        </Button>
                        <Button
                            onClick={handleRoleUpdate}
                            disabled={loading || selectedRole === member.role}
                        >
                            Modifier le rôle
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}