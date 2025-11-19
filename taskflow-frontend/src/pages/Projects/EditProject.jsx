import { useParams, useNavigate } from "react-router-dom"
import Layout from "../Layout/Layout"
import EditProjectModal from "@/components/projects/EditProjectModal"
import { useProjects } from "@/hooks/useProjects"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

export default function EditProject() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { getProject, updateProject, loading } = useProjects()
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

    const handleSubmit = async (projectData) => {
        const updated = await updateProject(id, projectData)
        if (updated) {
            navigate(`/projects/${id}`)
        }
    }

    const handleClose = () => {
        navigate(`/projects/${id}`)
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
                    <p>Projet non trouvé</p>
                    <button onClick={() => navigate('/projects')}>
                        Retour aux projets
                    </button>
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            <EditProjectModal
                isOpen={true}
                onClose={handleClose}
                onSubmit={handleSubmit}
                loading={loading}
                project={project}
            />
        </Layout>
    )
}