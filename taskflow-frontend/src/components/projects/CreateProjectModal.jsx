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
import { Loader2 } from "lucide-react"

// Utiliser des codes hexadécimaux au lieu de oklch
const colorOptions = [
    { value: "#33C1FF", label: "Bleu clair" },
    { value: "#8B5CF6", label: "Violet" },
    { value: "#06B6D4", label: "Cyan" },
    { value: "#10B981", label: "Vert" },
    { value: "#EAB308", label: "Jaune" },
    { value: "#F97316", label: "Orange" },
    { value: "#EF4444", label: "Rouge" },
]

export default function CreateProjectModal({ isOpen, onClose, onSubmit, loading }) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        color: colorOptions[0].value, // Défaut en hex
    })

    const [errors, setErrors] = useState({})

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
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

        // Validation de la couleur hexadécimale
        if (!formData.color.match(/^#[0-9A-F]{6}$/i)) {
            newErrors.color = "La couleur doit être au format hexadécimal (#FFFFFF)"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) return

        // N'envoyer que les champs requis par le backend
        const projectData = {
            name: formData.name.trim(),
            description: formData.description.trim(),
            color: formData.color
        }

        console.log("Données envoyées:", projectData) // Pour debug

        await onSubmit(projectData)

        // Réinitialiser le formulaire après soumission réussie
        setFormData({
            name: "",
            description: "",
            color: colorOptions[0].value,
        })
        setErrors({})
    }

    const handleClose = () => {
        setFormData({
            name: "",
            description: "",
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

                    {/* Couleur */}
                    <div className="space-y-2">
                        <Label htmlFor="color">Couleur</Label>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2">
                                <select
                                    value={formData.color}
                                    onChange={(e) => handleChange("color", e.target.value)}
                                    className="flex-1 p-2 border rounded-md bg-card text-card-foreground border-border"
                                >
                                    {colorOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label} ({option.value})
                                        </option>
                                    ))}
                                </select>
                                <div
                                    className="w-10 h-10 rounded-lg border-2"
                                    style={{ backgroundColor: formData.color }}
                                />
                            </div>
                            {errors.color && (
                                <p className="text-sm text-destructive">{errors.color}</p>
                            )}
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