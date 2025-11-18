import { useState } from "react"
import Layout from "../Layout/Layout"
import ProjectCard from "@/components/projects/ProjectCard"
import CreateProjectModal from "@/components/projects/CreateProjectModal"
import { Button } from "@/components/ui/Button"
import { Plus, Grid3x3, List, Loader2, AlertCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useProjects } from "@/hooks/useProjects"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function Projects() {
  const { projects, loading, error, createProject, deleteProject, resetError } = useProjects()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState("grid")

  // S'assurer que projects est toujours un tableau
  const projectsList = Array.isArray(projects) ? projects : []

  // Calculer la progression d'un projet
  const calculateProgress = (project) => {
    if (!project.tasks || project.tasks.length === 0) return 0;
    const completedTasks = project.tasks.filter(task => task.status === 'completed').length;
    return Math.round((completedTasks / project.tasks.length) * 100);
  };

  // Filtrer les projets par statut
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

  const handleDeleteProject = async (projectId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
      await deleteProject(projectId)
    }
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
      onDelete={() => handleDeleteProject(project.id)}
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
              <Button variant="outline" size="sm" onClick={resetError} className="ml-4">
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
                  <TabsTrigger value="all">Tous ({projectsList.length})</TabsTrigger>
                  <TabsTrigger value="active">En cours ({getProjectsByStatus("active").length})</TabsTrigger>
                  <TabsTrigger value="planning">Planification ({getProjectsByStatus("planning").length})</TabsTrigger>
                  <TabsTrigger value="completed">Terminés ({getProjectsByStatus("completed").length})</TabsTrigger>
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

              {/* Contenu des tabs */}
              {["all", "active", "planning", "completed"].map((tabValue) => (
                <TabsContent key={tabValue} value={tabValue} className="space-y-4">
                  {getProjectsByStatus(tabValue).length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground mb-4">
                        {tabValue === "all" 
                          ? "Aucun projet pour le moment" 
                          : `Aucun projet ${tabValue === "active" ? "en cours" : tabValue === "planning" ? "en planification" : "terminé"}`
                        }
                      </p>
                      {tabValue === "all" && (
                        <Button onClick={() => setIsCreateModalOpen(true)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Créer votre premier projet
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className={
                      viewMode === "grid" 
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" 
                        : "space-y-4"
                    }>
                      {getProjectsByStatus(tabValue).map(renderProjectCard)}
                    </div>
                  )}
                </TabsContent>
              ))}
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
    </Layout>
  )
}