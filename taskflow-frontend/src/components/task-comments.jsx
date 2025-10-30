import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function TaskComments() {
    const comments = [
        {
            author: { name: "Julie K.", avatar: "/diverse-woman-portrait.png" },
            content:
                "Peux-tu inclure aussi une version pour les écrans ultra-larges ? Nous avons de plus en plus d'utilisateurs avec ce type d'écran.",
            timestamp: "Il y a 2 heures",
        },
        {
            author: { name: "Sophie M.", avatar: "/diverse-woman-portrait.png" },
            content:
                "Bien sûr ! Je vais ajouter une version pour les écrans 2K et 4K. Je devrais avoir terminé d'ici demain.",
            timestamp: "Il y a 1 heure",
        },
        {
            author: { name: "Marc L.", avatar: "/man.jpg" },
            content:
                "N'oublie pas de prendre en compte les contraintes techniques que nous avons discutées hier concernant les animations.",
            timestamp: "Il y a 30 minutes",
        },
    ]

    return (
        <div className="space-y-4">
            {comments.map((comment, index) => (
                <div key={index} className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.author.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{comment.author.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{comment.author.name}</span>
                            <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed text-pretty">{comment.content}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}
