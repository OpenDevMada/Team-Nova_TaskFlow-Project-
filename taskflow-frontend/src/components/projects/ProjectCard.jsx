import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/Badge"
import {
  MoreVertical,
  Users,
  Calendar,
  Trash2,
  Edit,
  ExternalLink,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const statusLabels = {
  planning: "Planification",
  active: "En cours",
  completed: "Terminé",
}

const statusVariants = {
  planning: "secondary",
  active: "default",
  completed: "success",
}

export default function ProjectCard({
  id,
  name,
  title,
  description,
  progress = 0,
  members = 0,
  status = "active",
  color = "#33C1FF",
  createdAt,
  onDelete,
  onEdit,
  viewMode = "grid",
}) {
  const navigate = useNavigate()
  const displayTitle = name || title

  const handleCardClick = (e) => {
    // Ne pas naviguer si on clique sur le menu ou les boutons
    if (
      e.target.closest('[role="menu"]') ||
      e.target.closest('button')
    ) {
      return
    }
    navigate(`/projects/${id}`)
  }

  const handleEdit = () => {
    navigate(`/projects/${id}/edit`)
  }

  const handleViewDetails = () => {
    navigate(`/projects/${id}`)
  }

  // Formater la date
  const formatDate = (date) => {
    if (!date) return ""
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  // Vue Grille
  if (viewMode === "grid") {
    return (
      <Card
        className="group hover:shadow-lg transition-all duration-200 cursor-pointer relative overflow-hidden"
        onClick={handleCardClick}
      >
        {/* Barre de couleur en haut */}
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ backgroundColor: color }}
        />

        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
              {displayTitle}
            </h3>
            <Badge variant={statusVariants[status]} className="mt-2">
              {statusLabels[status]}
            </Badge>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleViewDetails}>
                <ExternalLink className="mr-2 h-4 w-4" />
                Voir les détails
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Modifier
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onDelete}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>

          {/* Progression */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progression</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-sm text-muted-foreground pt-2">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{members} membres</span>
            </div>
            {createdAt && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(createdAt)}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Vue Liste
  return (
    <Card
      className="group hover:shadow-md transition-all duration-200 cursor-pointer"
      onClick={handleCardClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Indicateur de couleur */}
          <div
            className="w-1 h-16 rounded-full flex-shrink-0"
            style={{ backgroundColor: color }}
          />

          {/* Contenu principal */}
          <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Titre et description */}
            <div className="md:col-span-5 min-w-0">
              <h3 className="font-semibold text-base truncate group-hover:text-primary transition-colors">
                {displayTitle}
              </h3>
              <p className="text-sm text-muted-foreground truncate">
                {description}
              </p>
            </div>

            {/* Statut */}
            <div className="md:col-span-2">
              <Badge variant={statusVariants[status]}>
                {statusLabels[status]}
              </Badge>
            </div>

            {/* Progression */}
            <div className="md:col-span-2">
              <div className="space-y-1">
                <Progress value={progress} className="h-2" />
                <span className="text-xs text-muted-foreground">
                  {progress}%
                </span>
              </div>
            </div>

            {/* Membres */}
            <div className="md:col-span-2 flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {members} membres
              </span>
            </div>

            {/* Actions */}
            <div className="md:col-span-1 flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleViewDetails}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Voir les détails
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleEdit}>
                    <Edit className="mr-2 h-4 w-4" />
                    Modifier
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={onDelete}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}