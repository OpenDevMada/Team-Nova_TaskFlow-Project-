import { Link, Navigate, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, CheckCircle2 } from "lucide-react"

export default function ResetPassword() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <div className="flex justify-center mb-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Lock className="h-6 w-6" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-center">Nouveau mot de passe</CardTitle>
                    <CardDescription className="text-center">
                        Choisissez un nouveau mot de passe sécurisé pour votre compte
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="password">Nouveau mot de passe</Label>
                        <Input id="password" type="password" placeholder="••••••••" className="h-11" />
                        <p className="text-xs text-muted-foreground">
                            Minimum 8 caractères avec au moins une majuscule et un chiffre
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                        <Input id="confirmPassword" type="password" placeholder="••••••••" className="h-11" />
                    </div>

                    <div className="rounded-lg border border-border bg-muted/50 p-3 space-y-2">
                        <p className="text-sm font-medium">Votre mot de passe doit contenir :</p>
                        <div className="space-y-1">
                            <div className="flex items-center text-sm text-muted-foreground">
                                <CheckCircle2 className="h-4 w-4 mr-2 text-muted-foreground" />
                                Au moins 8 caractères
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                                <CheckCircle2 className="h-4 w-4 mr-2 text-muted-foreground" />
                                Une lettre majuscule
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                                <CheckCircle2 className="h-4 w-4 mr-2 text-muted-foreground" />
                                Un chiffre
                            </div>
                        </div>
                    </div>

                    <Button className="w-full" size="lg">
                        Réinitialiser le mot de passe
                    </Button>

                    <div className="text-center text-sm text-muted-foreground">
                        <Link href="/login" className="text-primary hover:underline font-medium">
                            Retour à la connexion
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
