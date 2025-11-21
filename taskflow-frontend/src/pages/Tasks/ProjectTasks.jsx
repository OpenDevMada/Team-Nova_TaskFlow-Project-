import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../Layout/Layout';
import TaskBoard from '@/components/tasks/TaskBoard';
import { useProjects } from '@/hooks/useProjects';
import { Loader2 } from 'lucide-react';

export default function ProjectTasks() {
    const { projectId } = useParams();
    const { getProject, loading } = useProjects();
    const [project, setProject] = useState(null);

    useEffect(() => {
        const loadProject = async () => {
            if (projectId) {
                const projectData = await getProject(projectId);
                setProject(projectData);
            }
        };
        loadProject();
    }, [projectId, getProject]);

    if (loading && !project) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="p-6 mx-auto max-w-7xl">
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: project?.color }}
                        />
                        <h1 className="text-2xl font-bold">{project?.name}</h1>
                    </div>
                    <p className="text-muted-foreground">{project?.description}</p>
                </div>
                <TaskBoard />
            </div>
        </Layout>
    );
}