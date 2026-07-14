import { useEffect, useState } from 'react'
import { useTasks } from '@/hooks/useTasks'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Loader2, Plus, Trash2, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

const TaskManager = ({ projectId }) => {
    const {
        lists,
        loading,
        error,
        fetchProjectTasks,
        fetchProjectLists,
        createTask,
        deleteTask,
        getTasksByList,
    } = useTasks(projectId)

    const [creating, setCreating] = useState(false)

    useEffect(() => {
        if (projectId) {
            fetchProjectTasks()
            fetchProjectLists()
        }
    }, [projectId, fetchProjectTasks, fetchProjectLists])

    const handleCreateTask = async () => {
        if (!lists[0]?.id) return
        setCreating(true)
        await createTask({
            title: 'Nouvelle tâche',
            description: '',
            listId: lists[0].id,
            projectId,
        })
        setCreating(false)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-card-foreground">Tâches</h2>
                <Button size="sm" onClick={handleCreateTask} disabled={creating || !lists[0]}>
                    <Plus className="h-4 w-4 mr-1" />
                    {creating ? 'Création...' : 'Nouvelle tâche'}
                </Button>
            </div>

            {lists.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-muted-foreground">Aucune liste de tâches</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {lists.map(list => {
                        const listTasks = getTasksByList(list.id)
                        return (
                            <Card key={list.id}>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium flex items-center justify-between">
                                        <span>{list.name}</span>
                                        <Badge variant="secondary" className="text-xs">
                                            {listTasks.length}
                                        </Badge>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {listTasks.length === 0 ? (
                                        <p className="text-xs text-muted-foreground text-center py-4">
                                            Aucune tâche
                                        </p>
                                    ) : (
                                        listTasks.map(task => (
                                            <div
                                                key={task.id}
                                                className="flex items-center justify-between gap-2 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium truncate text-card-foreground">
                                                        {task.title}
                                                    </p>
                                                    {task.description && (
                                                        <p className="text-xs text-muted-foreground truncate">
                                                            {task.description}
                                                        </p>
                                                    )}
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() => deleteTask(task.id)}
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        ))
                                    )}
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default TaskManager