import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Mail } from "lucide-react"
import Link from "next/link"

export default function ForgotPassword() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <Link
                        href="/login"
                        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Retour à la connexion
                    </Link>
                    <div className="flex justify-center mb-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Mail className="h-6 w-6" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-center">Mot de passe oublié ?</CardTitle>
                    <CardDescription className="text-center">
                        Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="nom@exemple.com" className="h-11" />
                    </div>

                    <Button className="w-full" size="lg">
                        Envoyer le lien de réinitialisation
                    </Button>

                    <div className="text-center text-sm text-muted-foreground">
                        Vous vous souvenez de votre mot de passe ?{" "}
                        <Link href="/login" className="text-primary hover:underline font-medium">
                            Se connecter
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
