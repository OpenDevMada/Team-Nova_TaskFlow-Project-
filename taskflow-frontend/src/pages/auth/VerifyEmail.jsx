import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, CheckCircle2, XCircle } from "lucide-react"
import { Link, Navigate, useNavigate } from "react-router-dom"

export default function VerifyEmail() {
    const isVerified = true

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <div className="flex justify-center mb-4">
                        {isVerified ? (
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                                <CheckCircle2 className="h-8 w-8" />
                            </div>
                        ) : (
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                                <XCircle className="h-8 w-8" />
                            </div>
                        )}
                    </div>
                    <CardTitle className="text-2xl font-bold text-center">
                        {isVerified ? "Email vérifié !" : "Vérification échouée"}
                    </CardTitle>
                    <CardDescription className="text-center">
                        {isVerified
                            ? "Votre adresse email a été vérifiée avec succès. Vous pouvez maintenant accéder à votre compte."
                            : "Le lien de vérification est invalide ou a expiré. Veuillez demander un nouveau lien."}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {isVerified ? (
                        <Button className="w-full" size="lg" asChild>
                            <Link href="/login">Se connecter</Link>
                        </Button>
                    ) : (
                        <>
                            <Button className="w-full" size="lg">
                                Renvoyer l'email de vérification
                            </Button>
                            <Button variant="outline" className="w-full bg-transparent" size="lg" asChild>
                                <Link href="/login">Retour à la connexion</Link>
                            </Button>
                        </>
                    )}

                    {isVerified && (
                        <div className="rounded-lg border border-border bg-muted/50 p-4 space-y-2">
                            <div className="flex items-start gap-3">
                                <Mail className="h-5 w-5 text-primary mt-0.5" />
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">Prochaines étapes</p>
                                    <p className="text-sm text-muted-foreground">
                                        Connectez-vous pour commencer à créer des projets et collaborer avec votre équipe.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
