import { useState, useEffect } from "react"
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

const colorOptions = [
    { value: "#33C1FF", label: "Bleu clair" },
    { value: "#8B5CF6", label: "Violet" },
    { value: "#06B6D4", label: "Cyan" },
    { value: "#10B981", label: "Vert" },
    { value: "#EAB308", label: "Jaune" },
    { value: "#F97316", label: "Orange" },
    { value: "#EF4444", label: "Rouge" },
]

export default function EditProjectModal({ 
    isOpen, 
    onClose, 
    onSubmit, 
    loading, 
    project 
}) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        color: colorOptions[0].value,
    })

    const [errors, setErrors] = useState({})

    // Initialiser le formulaire avec les données du projet
    useEffect(() => {
        if (project) {
            setFormData({
                name: project.name || "",
                description: project.description || "",
                color: project.color || colorOptions[0].value,
            })
        }
    }, [project])

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

        if (!formData.color.match(/^#[0-9A-F]{6}$/i)) {
            newErrors.color = "La couleur doit être au format hexadécimal (#FFFFFF)"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) return

        // N'envoyer que les champs modifiables
        const projectData = {
            name: formData.name.trim(),
            description: formData.description.trim(),
            color: formData.color
        }

        console.log("Données de modification:", projectData)
        await onSubmit(projectData)
    }

    const handleClose = () => {
        setErrors({})
        onClose()
    }

    if (!project) return null

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>Modifier le projet</DialogTitle>
                    <DialogDescription>
                        Modifiez les informations de votre projet
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Nom du projet */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-name">
                            Nom du projet <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="edit-name"
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
                        <Label htmlFor="edit-description">
                            Description <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                            id="edit-description"
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
                        <Label htmlFor="edit-color">Couleur</Label>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2">
                                <select
                                    id="edit-color"
                                    value={formData.color}
                                    onChange={(e) => handleChange("color", e.target.value)}
                                    className="flex-1 p-2 border rounded-md"
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
                            Modifier le projet
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}