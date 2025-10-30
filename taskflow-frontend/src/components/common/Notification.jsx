import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCheck, Trash2, Bell, MessageSquare, UserPlus, Flag, Calendar } from "lucide-react"
import Link from "next/link"

export default function Notifications() {
    const notifications = [
        {
            id: 1,
            type: "comment",
            icon: MessageSquare,
            title: "Nouveau commentaire",
            message: "Marc L. a commenté sur Créer les maquettes de la page d'accueil",
            timestamp: "Il y a 5 minutes",
            read: false,
            avatar: "/man.jpg",
            link: "/tasks/1",
        },
        {
            id: 2,
            type: "assignment",
            icon: UserPlus,
            title: "Nouvelle assignation",
            message: "Julie K. vous a assigné la tâche Tests utilisateurs interface mobile",
            timestamp: "Il y a 1 heure",
            read: false,
            avatar: "/diverse-woman-portrait.png",
            link: "/tasks/2",
        },
        {
            id: 3,
            type: "mention",
            icon: MessageSquare,
            title: "Mention",
            message: "Sophie M. vous a mentionné dans un commentaire",
            timestamp: "Il y a 2 heures",
            read: false,
            avatar: "/diverse-woman-portrait.png",
            link: "/tasks/3",
        },
        {
            id: 4,
            type: "status",
            icon: Flag,
            title: "Changement de statut",
            message: "La tâche Documentation technique API v2 est passée en révision",
            timestamp: "Il y a 3 heures",
            read: true,
            avatar: "/diverse-group-friends.png",
            link: "/tasks/4",
        },
        {
            id: 5,
            type: "deadline",
            icon: Calendar,
            title: "Date d'échéance proche",
            message: "La tâche Optimisation des requêtes SQL est due demain",
            timestamp: "Il y a 5 heures",
            read: true,
            avatar: null,
            link: "/tasks/5",
        },
        {
            id: 6,
            type: "comment",
            icon: MessageSquare,
            title: "Nouveau commentaire",
            message: "Thomas B. a répondu à votre commentaire",
            timestamp: "Il y a 1 jour",
            read: true,
            avatar: "/diverse-group-friends.png",
            link: "/tasks/6",
        },
        {
            id: 7,
            type: "assignment",
            icon: UserPlus,
            title: "Nouvelle assignation",
            message: "Vous avez été ajouté au projet Migration base de données",
            timestamp: "Il y a 2 jours",
            read: true,
            avatar: "/diverse-woman-portrait.png",
            link: "/projects/3",
        },
    ]

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />

            <div className="flex flex-col flex-1 overflow-hidden">
                <Header />

                <main className="flex-1 overflow-y-auto bg-background p-6">
                    <div className="max-w-4xl mx-auto space-y-6">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-balance">Notifications</h1>
                                <p className="text-muted-foreground mt-1">Restez informé de toutes les activités</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" className="gap-2 bg-transparent">
                                    <CheckCheck className="h-4 w-4" />
                                    Tout marquer comme lu
                                </Button>
                                <Button variant="outline" className="gap-2 bg-transparent">
                                    <Trash2 className="h-4 w-4" />
                                    Tout supprimer
                                </Button>
                            </div>
                        </div>

                        {/* Tabs */}
                        <Tabs defaultValue="all" className="space-y-4">
                            <TabsList>
                                <TabsTrigger value="all">Toutes</TabsTrigger>
                                <TabsTrigger value="unread">Non lues (3)</TabsTrigger>
                                <TabsTrigger value="comments">Commentaires</TabsTrigger>
                                <TabsTrigger value="assignments">Assignations</TabsTrigger>
                                <TabsTrigger value="mentions">Mentions</TabsTrigger>
                            </TabsList>

                            <TabsContent value="all" className="space-y-3">
                                {notifications.map((notification) => (
                                    <Link key={notification.id} href={notification.link}>
                                        <Card
                                            className={`hover:shadow-md transition-all duration-200 cursor-pointer ${!notification.read ? "border-primary/50 bg-muted/30" : ""
                                                }`}
                                        >
                                            <CardContent className="p-4">
                                                <div className="flex items-start gap-4">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 shrink-0">
                                                        <notification.icon className="h-5 w-5 text-primary" />
                                                    </div>
                                                    <div className="flex-1 space-y-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-2">
                                                            <p className="text-sm font-medium">{notification.title}</p>
                                                            {!notification.read && <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1" />}
                                                        </div>
                                                        <p className="text-sm text-muted-foreground text-pretty">{notification.message}</p>
                                                        <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
                                                    </div>
                                                    {notification.avatar && (
                                                        <Avatar className="h-10 w-10 shrink-0">
                                                            <AvatarImage src={notification.avatar || "/placeholder.svg"} />
                                                            <AvatarFallback>
                                                                <Bell className="h-4 w-4" />
                                                            </AvatarFallback>
                                                        </Avatar>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </TabsContent>

                            <TabsContent value="unread" className="space-y-3">
                                {notifications
                                    .filter((n) => !n.read)
                                    .map((notification) => (
                                        <Link key={notification.id} href={notification.link}>
                                            <Card className="hover:shadow-md transition-all duration-200 cursor-pointer border-primary/50 bg-muted/30">
                                                <CardContent className="p-4">
                                                    <div className="flex items-start gap-4">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 shrink-0">
                                                            <notification.icon className="h-5 w-5 text-primary" />
                                                        </div>
                                                        <div className="flex-1 space-y-1 min-w-0">
                                                            <div className="flex items-start justify-between gap-2">
                                                                <p className="text-sm font-medium">{notification.title}</p>
                                                                <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1" />
                                                            </div>
                                                            <p className="text-sm text-muted-foreground text-pretty">{notification.message}</p>
                                                            <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
                                                        </div>
                                                        {notification.avatar && (
                                                            <Avatar className="h-10 w-10 shrink-0">
                                                                <AvatarImage src={notification.avatar || "/placeholder.svg"} />
                                                                <AvatarFallback>
                                                                    <Bell className="h-4 w-4" />
                                                                </AvatarFallback>
                                                            </Avatar>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    ))}
                            </TabsContent>

                            <TabsContent value="comments" className="space-y-3">
                                {notifications
                                    .filter((n) => n.type === "comment" || n.type === "mention")
                                    .map((notification) => (
                                        <Link key={notification.id} href={notification.link}>
                                            <Card
                                                className={`hover:shadow-md transition-all duration-200 cursor-pointer ${!notification.read ? "border-primary/50 bg-muted/30" : ""
                                                    }`}
                                            >
                                                <CardContent className="p-4">
                                                    <div className="flex items-start gap-4">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 shrink-0">
                                                            <notification.icon className="h-5 w-5 text-primary" />
                                                        </div>
                                                        <div className="flex-1 space-y-1 min-w-0">
                                                            <div className="flex items-start justify-between gap-2">
                                                                <p className="text-sm font-medium">{notification.title}</p>
                                                                {!notification.read && (
                                                                    <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1" />
                                                                )}
                                                            </div>
                                                            <p className="text-sm text-muted-foreground text-pretty">{notification.message}</p>
                                                            <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
                                                        </div>
                                                        {notification.avatar && (
                                                            <Avatar className="h-10 w-10 shrink-0">
                                                                <AvatarImage src={notification.avatar || "/placeholder.svg"} />
                                                                <AvatarFallback>
                                                                    <Bell className="h-4 w-4" />
                                                                </AvatarFallback>
                                                            </Avatar>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    ))}
                            </TabsContent>

                            <TabsContent value="assignments" className="space-y-3">
                                {notifications
                                    .filter((n) => n.type === "assignment")
                                    .map((notification) => (
                                        <Link key={notification.id} href={notification.link}>
                                            <Card
                                                className={`hover:shadow-md transition-all duration-200 cursor-pointer ${!notification.read ? "border-primary/50 bg-muted/30" : ""
                                                    }`}
                                            >
                                                <CardContent className="p-4">
                                                    <div className="flex items-start gap-4">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 shrink-0">
                                                            <notification.icon className="h-5 w-5 text-primary" />
                                                        </div>
                                                        <div className="flex-1 space-y-1 min-w-0">
                                                            <div className="flex items-start justify-between gap-2">
                                                                <p className="text-sm font-medium">{notification.title}</p>
                                                                {!notification.read && (
                                                                    <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1" />
                                                                )}
                                                            </div>
                                                            <p className="text-sm text-muted-foreground text-pretty">{notification.message}</p>
                                                            <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
                                                        </div>
                                                        {notification.avatar && (
                                                            <Avatar className="h-10 w-10 shrink-0">
                                                                <AvatarImage src={notification.avatar || "/placeholder.svg"} />
                                                                <AvatarFallback>
                                                                    <Bell className="h-4 w-4" />
                                                                </AvatarFallback>
                                                            </Avatar>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    ))}
                            </TabsContent>

                            <TabsContent value="mentions" className="space-y-3">
                                {notifications
                                    .filter((n) => n.type === "mention")
                                    .map((notification) => (
                                        <Link key={notification.id} href={notification.link}>
                                            <Card
                                                className={`hover:shadow-md transition-all duration-200 cursor-pointer ${!notification.read ? "border-primary/50 bg-muted/30" : ""
                                                    }`}
                                            >
                                                <CardContent className="p-4">
                                                    <div className="flex items-start gap-4">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 shrink-0">
                                                            <notification.icon className="h-5 w-5 text-primary" />
                                                        </div>
                                                        <div className="flex-1 space-y-1 min-w-0">
                                                            <div className="flex items-start justify-between gap-2">
                                                                <p className="text-sm font-medium">{notification.title}</p>
                                                                {!notification.read && (
                                                                    <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1" />
                                                                )}
                                                            </div>
                                                            <p className="text-sm text-muted-foreground text-pretty">{notification.message}</p>
                                                            <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
                                                        </div>
                                                        {notification.avatar && (
                                                            <Avatar className="h-10 w-10 shrink-0">
                                                                <AvatarImage src={notification.avatar || "/placeholder.svg"} />
                                                                <AvatarFallback>
                                                                    <Bell className="h-4 w-4" />
                                                                </AvatarFallback>
                                                            </Avatar>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    ))}
                            </TabsContent>
                        </Tabs>
                    </div>
                </main>
            </div>
        </div>
    )
}
