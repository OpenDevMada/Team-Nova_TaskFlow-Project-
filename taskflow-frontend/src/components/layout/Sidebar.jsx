"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LayoutDashboard, FolderKanban, CheckSquare, Users, Plus, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"

export function Sidebar() {
    const [collapsed, setCollapsed] = useState(false)
    const pathname = usePathname()

    const navigation = [
        { name: "Dashboard", icon: LayoutDashboard, href: "/" },
        { name: "Projets", icon: FolderKanban, href: "/projects" },
        { name: "Mes tâches", icon: CheckSquare, href: "/tasks" },
        { name: "Équipe", icon: Users, href: "/team" },
    ]

    const isActive = (href) => {
        if (href === "/") return pathname === "/"
        return pathname.startsWith(href)
    }

    return (
        <aside
            className={`flex flex-col border-r border-border bg-card transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}
        >
            {/* Header */}
            <div className="flex h-16 items-center justify-between border-b border-border px-4">
                {!collapsed && (
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
                            TF
                        </div>
                        <span className="font-semibold text-lg">TaskFlow</span>
                    </div>
                )}
                <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="h-8 w-8">
                    <ChevronLeft className={`h-4 w-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
                </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 p-3">
                {navigation.map((item) => (
                    <Link key={item.name} href={item.href}>
                        <Button
                            variant="ghost"
                            className={cn(
                                "w-full justify-start gap-3",
                                collapsed ? "px-2" : "px-3",
                                isActive(item.href) &&
                                "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                            )}
                        >
                            <item.icon className="h-5 w-5 shrink-0" />
                            {!collapsed && <span>{item.name}</span>}
                        </Button>
                    </Link>
                ))}

                {!collapsed && (
                    <div className="pt-4">
                        <Button className="w-full justify-start gap-2" size="sm">
                            <Plus className="h-4 w-4" />
                            Nouveau projet
                        </Button>
                    </div>
                )}
            </nav>

            {/* User Profile */}
            <div className="border-t border-border p-3">
                <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
                    <Avatar className="h-9 w-9">
                        <AvatarImage src="/abstract-geometric-shapes.png" />
                        <AvatarFallback>AK</AvatarFallback>
                    </Avatar>
                    {!collapsed && (
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-medium truncate">Aryaman K.</p>
                            <p className="text-xs text-muted-foreground truncate">Admin</p>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    )
}
