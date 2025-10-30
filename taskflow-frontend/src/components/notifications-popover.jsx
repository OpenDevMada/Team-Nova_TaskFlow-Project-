import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, CheckCheck, Settings } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"

export function NotificationsPopover() {
    const [unreadCount, setUnreadCount] = useState(3)

    const notifications = [
        {
            id: 1,
            type: "comment",
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
            title: "Date d'échéance proche",
            message: "La tâche Optimisation des requêtes SQL est due demain",
            timestamp: "Il y a 5 heures",
            read: true,
            avatar: null,
            link: "/tasks/5",
        },
    ]

    const markAsRead = (id) => {
        setUnreadCount((prev) => Math.max(0, prev - 1))
    }

    const markAllAsRead = () => {
        setUnreadCount(0)
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-accent animate-pulse" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-0" align="end">
                <div className="flex items-center justify-between border-b border-border p-4">
                    <h3 className="font-semibold">Notifications</h3>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-8 text-xs">
                            <CheckCheck className="h-3 w-3 mr-1" />
                            Tout marquer comme lu
                        </Button>
                        <Link href="/notifications/settings">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Settings className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>

                <Tabs defaultValue="all" className="w-full">
                    <TabsList className="w-full rounded-none border-b border-border bg-transparent p-0">
                        <TabsTrigger
                            value="all"
                            className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
                        >
                            Toutes
                        </TabsTrigger>
                        <TabsTrigger
                            value="unread"
                            className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
                        >
                            Non lues ({unreadCount})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="m-0">
                        <ScrollArea className="h-96">
                            <div className="divide-y divide-border">
                                {notifications.map((notification) => (
                                    <Link key={notification.id} href={notification.link}>
                                        <div
                                            className={`flex items-start gap-3 p-4 hover:bg-muted/50 transition-colors cursor-pointer ${!notification.read ? "bg-muted/30" : ""
                                                }`}
                                            onClick={() => !notification.read && markAsRead(notification.id)}
                                        >
                                            <Avatar className="h-10 w-10 shrink-0">
                                                <AvatarImage src={notification.avatar || "/placeholder.svg"} />
                                                <AvatarFallback>
                                                    <Bell className="h-4 w-4" />
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 space-y-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <p className="text-sm font-medium">{notification.title}</p>
                                                    {!notification.read && <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1" />}
                                                </div>
                                                <p className="text-sm text-muted-foreground line-clamp-2 text-pretty">{notification.message}</p>
                                                <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </ScrollArea>
                    </TabsContent>

                    <TabsContent value="unread" className="m-0">
                        <ScrollArea className="h-96">
                            <div className="divide-y divide-border">
                                {notifications
                                    .filter((n) => !n.read)
                                    .map((notification) => (
                                        <Link key={notification.id} href={notification.link}>
                                            <div
                                                className="flex items-start gap-3 p-4 hover:bg-muted/50 transition-colors cursor-pointer bg-muted/30"
                                                onClick={() => markAsRead(notification.id)}
                                            >
                                                <Avatar className="h-10 w-10 shrink-0">
                                                    <AvatarImage src={notification.avatar || "/placeholder.svg"} />
                                                    <AvatarFallback>
                                                        <Bell className="h-4 w-4" />
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 space-y-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <p className="text-sm font-medium">{notification.title}</p>
                                                        <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1" />
                                                    </div>
                                                    <p className="text-sm text-muted-foreground line-clamp-2 text-pretty">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                            </div>
                        </ScrollArea>
                    </TabsContent>
                </Tabs>

                <div className="border-t border-border p-2">
                    <Link href="/notifications">
                        <Button variant="ghost" className="w-full text-sm">
                            Voir toutes les notifications
                        </Button>
                    </Link>
                </div>
            </PopoverContent>
        </Popover>
    )
}
