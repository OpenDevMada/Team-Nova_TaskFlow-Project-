// Projects.jsx
import { useState } from "react"
import Swal from 'sweetalert2' // ← Importer SweetAlert
import Layout from "../Layout/Layout"
import ProjectCard from "@/components/projects/ProjectCard"
import CreateProjectModal from "@/components/projects/CreateProjectModal"
import EditProjectModal from "@/components/projects/EditProjectModal"
import { Button } from "@/components/ui/Button"
import { Plus, Grid3x3, List, Loader2, AlertCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useProjects } from "@/hooks/useProjects"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function Projects() {
  const {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    resetError
  } = useProjects()

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const [viewMode, setViewMode] = useState("grid")

  const projectsList = Array.isArray(projects) ? projects : []

  const calculateProgress = (project) => {
    if (!project.tasks || project.tasks.length === 0) return 0;
    const completedTasks = project.tasks.filter(task => task.status === 'completed').length;
    return Math.round((completedTasks / project.tasks.length) * 100);
  };

  const getProjectsByStatus = (status) => {
    if (status === "all") return projectsList
    return projectsList.filter((p) => p.status === status)
  }

  const handleCreateProject = async (projectData) => {
    const newProject = await createProject(projectData)
    if (newProject) {
      setIsCreateModalOpen(false)
    }
  }

  const handleEditProject = async (projectData) => {
    if (!selectedProject) return

    const updatedProject = await updateProject(selectedProject.id, projectData)
    if (updatedProject) {
      setIsEditModalOpen(false)
      setSelectedProject(null)
    }
  }

  const handleOpenEditModal = (project) => {
    setSelectedProject(project)
    setIsEditModalOpen(true)
  }

  // Nouvelle fonction de suppression avec SweetAlert
  const handleDeleteProject = async (projectId) => {
    const projectToDelete = projects.find(p => p.id === projectId)

    const result = await Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: `Vous êtes sur le point de supprimer le projet "${projectToDelete?.name}". Cette action est irréversible !`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler',
      reverseButtons: true,
      background: '#fff',
      customClass: {
        title: 'text-lg font-semibold',
        confirmButton: 'px-4 py-2 rounded-md',
        cancelButton: 'px-4 py-2 rounded-md'
      }
    })

    if (result.isConfirmed) {
      const success = await deleteProject(projectId)

      if (success) {
        await Swal.fire({
          title: 'Supprimé !',
          text: 'Le projet a été supprimé avec succès.',
          icon: 'success',
          confirmButtonColor: '#10b981',
          confirmButtonText: 'OK',
          timer: 2000,
          timerProgressBar: true
        })
      } else {
        await Swal.fire({
          title: 'Erreur !',
          text: 'Une erreur est survenue lors de la suppression du projet.',
          icon: 'error',
          confirmButtonColor: '#ef4444',
          confirmButtonText: 'OK'
        })
      }
    }
  }

  // Version alternative plus simple si vous préférez
  const handleDeleteProjectSimple = async (projectId) => {
    const projectToDelete = projects.find(p => p.id === projectId)

    Swal.fire({
      title: 'Supprimer le projet ?',
      html: `
        <div class="text-left">
          <p class="mb-2">Vous allez supprimer le projet :</p>
          <p class="font-semibold text-red-600">${projectToDelete?.name}</p>
          <p class="mt-3 text-sm text-gray-500">Cette action ne peut pas être annulée.</p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      reverseButtons: true,
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          return await deleteProject(projectId)
        } catch (error) {
          Swal.showValidationMessage('Erreur lors de la suppression')
          return false
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        Swal.fire({
          title: 'Supprimé !',
          text: 'Le projet a été supprimé.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        })
      } else if (result.isConfirmed && !result.value) {
        Swal.fire({
          title: 'Erreur',
          text: 'La suppression a échoué.',
          icon: 'error',
          confirmButtonText: 'OK'
        })
      }
    })
  }

  // Fonction pour rendre les cartes de projet
  const renderProjectCard = (project) => (
    <ProjectCard
      key={project.id}
      id={project.id}
      title={project.name}
      description={project.description}
      color={project.color}
      status={project.status || "active"}
      progress={calculateProgress(project)}
      members={project.members?.length || 0}
      createdAt={project.created_at}
      onDelete={() => handleDeleteProject(project.id)} // Utiliser la version avec SweetAlert
      onEdit={() => handleOpenEditModal(project)}
      viewMode={viewMode}
    />
  );

  return (
    <Layout>
      <div className="p-6 mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">Projets</h1>
            <p className="text-muted-foreground mt-1">
              Gérez tous vos projets en un seul endroit
            </p>
          </div>
          <Button
            size="lg"
            className="gap-2"
            onClick={() => setIsCreateModalOpen(true)}
            disabled={loading}
          >
            <Plus className="h-5 w-5" />
            Nouveau projet
          </Button>
        </div>

        {/* Affichage des erreurs */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              {error}
              <Button
                variant="outline"
                size="sm"
                onClick={resetError}
                className="ml-4"
              >
                Fermer
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Loader initial */}
        {loading && projectsList.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {/* Tabs */}
            <Tabs defaultValue="all" className="space-y-6">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="all">
                    Tous ({projectsList.length})
                  </TabsTrigger>
                  <TabsTrigger value="active">
                    En cours ({getProjectsByStatus("active").length})
                  </TabsTrigger>
                  <TabsTrigger value="planning">
                    Planification ({getProjectsByStatus("planning").length})
                  </TabsTrigger>
                  <TabsTrigger value="completed">
                    Terminés ({getProjectsByStatus("completed").length})
                  </TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3x3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Tous les projets */}
              <TabsContent value="all" className="space-y-4">
                {projectsList.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">
                      Aucun projet pour le moment
                    </p>
                    <Button onClick={() => setIsCreateModalOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Créer votre premier projet
                    </Button>
                  </div>
                ) : (
                  <div
                    className={
                      viewMode === "grid"
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                        : "space-y-4"
                    }
                  >
                    {projectsList.map(renderProjectCard)}
                  </div>
                )}
              </TabsContent>

              {/* En cours */}
              <TabsContent value="active" className="space-y-4">
                {getProjectsByStatus("active").length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      Aucun projet en cours
                    </p>
                  </div>
                ) : (
                  <div
                    className={
                      viewMode === "grid"
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                        : "space-y-4"
                    }
                  >
                    {getProjectsByStatus("active").map(renderProjectCard)}
                  </div>
                )}
              </TabsContent>

              {/* Planification */}
              <TabsContent value="planning" className="space-y-4">
                {getProjectsByStatus("planning").length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      Aucun projet en planification
                    </p>
                  </div>
                ) : (
                  <div
                    className={
                      viewMode === "grid"
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                        : "space-y-4"
                    }
                  >
                    {getProjectsByStatus("planning").map(renderProjectCard)}
                  </div>
                )}
              </TabsContent>

              {/* Terminés */}
              <TabsContent value="completed" className="space-y-4">
                {getProjectsByStatus("completed").length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      Aucun projet terminé
                    </p>
                  </div>
                ) : (
                  <div
                    className={
                      viewMode === "grid"
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                        : "space-y-4"
                    }
                  >
                    {getProjectsByStatus("completed").map(renderProjectCard)}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>

      {/* Modal de création */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateProject}
        loading={loading}
      />

      {/* Modal d'édition */}
      <EditProjectModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedProject(null)
        }}
        onSubmit={handleEditProject}
        loading={loading}
        project={selectedProject}
      />
    </Layout>
  )
}