import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/textarea"
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
import { Loader2 } from "lucide-react"

const statusOptions = [
    { value: "planning", label: "Planification" },
    { value: "active", label: "En cours" },
    { value: "completed", label: "Terminé" },
]

const colorOptions = [
    { value: "oklch(0.55 0.18 264)", label: "Bleu" },
    { value: "oklch(0.65 0.20 310)", label: "Violet" },
    { value: "oklch(0.70 0.15 200)", label: "Cyan" },
    { value: "oklch(0.60 0.18 150)", label: "Vert" },
    { value: "oklch(0.75 0.12 80)", label: "Jaune" },
    { value: "oklch(0.65 0.20 30)", label: "Orange" },
    { value: "oklch(0.60 0.20 0)", label: "Rouge" },
]

export default function CreateProjectModal({ isOpen, onClose, onSubmit, loading }) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        status: "planning",
        color: colorOptions[0].value,
    })

    const [errors, setErrors] = useState({})

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
        // Réinitialiser l'erreur du champ modifié
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: null }))
        }
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.name.trim()) {
            newErrors.name = "Le nom du projet est requis"
        } else if (formData.name.trim().length < 3) {
            newErrors.name = "Le nom doit contenir au moins 3 caractères"
        }

        if (!formData.description.trim()) {
            newErrors.description = "La description est requise"
        } else if (formData.description.trim().length < 10) {
            newErrors.description = "La description doit contenir au moins 10 caractères"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) return

        await onSubmit(formData)

        // Réinitialiser le formulaire après soumission réussie
        setFormData({
            name: "",
            description: "",
            status: "planning",
            color: colorOptions[0].value,
        })
        setErrors({})
    }

    const handleClose = () => {
        setFormData({
            name: "",
            description: "",
            status: "planning",
            color: colorOptions[0].value,
        })
        setErrors({})
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>Créer un nouveau projet</DialogTitle>
                    <DialogDescription>
                        Remplissez les informations pour créer un nouveau projet
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Nom du projet */}
                    <div className="space-y-2">
                        <Label htmlFor="name">
                            Nom du projet <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="name"
                            placeholder="Ex: Refonte du site web"
                            value={formData.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            className={errors.name ? "border-destructive" : ""}
                        />
                        {errors.name && (
                            <p className="text-sm text-destructive">{errors.name}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">
                            Description <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                            id="description"
                            placeholder="Décrivez brièvement votre projet..."
                            value={formData.description}
                            onChange={(e) => handleChange("description", e.target.value)}
                            rows={4}
                            className={errors.description ? "border-destructive" : ""}
                        />
                        {errors.description && (
                            <p className="text-sm text-destructive">{errors.description}</p>
                        )}
                    </div>

                    {/* Statut */}
                    <div className="space-y-2">
                        <Label htmlFor="status">Statut</Label>
                        <Select
                            value={formData.status}
                            onValueChange={(value) => handleChange("status", value)}
                        >
                            <SelectTrigger id="status">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {statusOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Couleur */}
                    <div className="space-y-2">
                        <Label htmlFor="color">Couleur</Label>
                        <div className="flex items-center gap-2">
                            <Select
                                value={formData.color}
                                onValueChange={(value) => handleChange("color", value)}
                            >
                                <SelectTrigger id="color" className="flex-1">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {colorOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-4 h-4 rounded-full"
                                                    style={{ backgroundColor: option.value }}
                                                />
                                                {option.label}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <div
                                className="w-10 h-10 rounded-lg border-2"
                                style={{ backgroundColor: formData.color }}
                            />
                        </div>
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
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Créer le projet
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}