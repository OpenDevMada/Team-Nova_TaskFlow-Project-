import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Layout from "../Layout/Layout"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Calendar,
  Users,
  FileText,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Clock,
  PlayCircle
} from "lucide-react"
import { useProjects } from "@/hooks/useProjects"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Swal from 'sweetalert2'

const statusConfig = {
  planning: { label: "Planification", variant: "secondary", icon: Clock },
  active: { label: "En cours", variant: "default", icon: PlayCircle },
  completed: { label: "Terminé", variant: "success", icon: CheckCircle2 },
}

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getProject, deleteProject, loading, error, resetError } = useProjects()

  const [project, setProject] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchProject()
  }, [id])

  const fetchProject = async () => {
    setIsLoading(true)
    try {
      const projectData = await getProject(id)
      setProject(projectData)
    } catch (error) {
      console.error("Erreur lors du chargement du projet:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Supprimer le projet ?',
      html: `
        <div class="text-left">
          <p class="mb-2">Vous allez supprimer définitivement le projet :</p>
          <p class="font-semibold text-red-600">${project.name}</p>
          <p class="mt-3 text-sm text-gray-500">Toutes les données associées seront perdues.</p>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      reverseButtons: true,
    })

    if (result.isConfirmed) {
      const success = await deleteProject(id)
      if (success) {
        await Swal.fire({
          title: 'Supprimé !',
          text: 'Le projet a été supprimé avec succès.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        })
        navigate('/projects')
      }
    }
  }

  const handleEdit = () => {
    navigate(`/projects/${id}/edit`)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const calculateProgress = () => {
    if (!project.tasks || project.tasks.length === 0) return 0
    const completedTasks = project.tasks.filter(task => task.status === 'completed').length
    return Math.round((completedTasks / project.tasks.length) * 100)
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    )
  }

  if (!project) {
    return (
      <Layout>
        <div className="p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Projet non trouvé
            </AlertDescription>
          </Alert>
          <Button onClick={() => navigate('/projects')} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux projets
          </Button>
        </div>
      </Layout>
    )
  }

  const StatusIcon = statusConfig[project.status]?.icon || Clock
  const progress = calculateProgress()

  return (
    <Layout>
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        {/* Header avec navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate('/projects')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{project.name}</h1>
              <p className="text-muted-foreground mt-1">
                Détails du projet
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer
            </Button>
          </div>
        </div>

        {/* Affichage des erreurs */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              {error}
              <Button variant="outline" size="sm" onClick={resetError} className="ml-4">
                Fermer
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-line">
                  {project.description || "Aucune description fournie."}
                </p>
              </CardContent>
            </Card>

            {/* Progression */}
            <Card>
              <CardHeader>
                <CardTitle>Progression du projet</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Avancement général</span>
                    <span className="font-medium">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-3" />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="font-semibold text-2xl">{project.tasks?.length || 0}</div>
                    <div className="text-muted-foreground">Tâches totales</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="font-semibold text-2xl text-green-600">
                      {project.tasks?.filter(t => t.status === 'completed').length || 0}
                    </div>
                    <div className="text-muted-foreground">Tâches terminées</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dernières activités */}
            <Card>
              <CardHeader>
                <CardTitle>Activités récentes</CardTitle>
              </CardHeader>
              <CardContent>
                {project.activities && project.activities.length > 0 ? (
                  <div className="space-y-3">
                    {project.activities.slice(0, 5).map((activity, index) => (
                      <div key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm">{activity.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(activity.created_at)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">Aucune activité récente</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Statut et informations */}
            <Card>
              <CardHeader>
                <CardTitle>Informations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Statut */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Statut</label>
                  <div className="flex items-center gap-2 mt-1">
                    <StatusIcon className="h-4 w-4" />
                    <Badge variant={statusConfig[project.status]?.variant || "secondary"}>
                      {statusConfig[project.status]?.label || "Inconnu"}
                    </Badge>
                  </div>
                </div>

                {/* Date de création */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Créé le
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{formatDate(project.created_at)}</span>
                  </div>
                </div>

                {/* Propriétaire */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Propriétaire
                  </label>
                  <div className="flex items-center gap-2 mt-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {project.owner?.firstName?.[0]}{project.owner?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">
                      {project.owner?.firstName} {project.owner?.lastName}
                    </span>
                  </div>
                </div>

                {/* Couleur */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Couleur
                  </label>
                  <div className="flex items-center gap-2 mt-2">
                    <div
                      className="w-6 h-6 rounded border"
                      style={{ backgroundColor: project.color }}
                    />
                    <span className="text-sm font-mono">{project.color}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Membres de l'équipe */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Équipe ({project.members?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {project.members && project.members.length > 0 ? (
                  <div className="space-y-3">
                    {project.members.map((member) => (
                      <div key={member.id} className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {member.user?.firstName?.[0]}{member.user?.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {member.user?.firstName} {member.user?.lastName}
                          </p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {member.role}
                          </p>
                        </div>
                        {member.role === 'admin' && (
                          <Badge variant="outline" className="text-xs">
                            Admin
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">Aucun membre</p>
                )}
              </CardContent>
            </Card>

            {/* Listes de tâches */}
            <Card>
              <CardHeader>
                <CardTitle>Listes de tâches</CardTitle>
              </CardHeader>
              <CardContent>
                {project.taskLists && project.taskLists.length > 0 ? (
                  <div className="space-y-2">
                    {project.taskLists.map((taskList) => (
                      <div key={taskList.id} className="flex justify-between items-center p-2 rounded-lg hover:bg-muted/50">
                        <span className="text-sm">{taskList.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {taskList.tasks?.length || 0} tâches
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">Aucune liste de tâches</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}