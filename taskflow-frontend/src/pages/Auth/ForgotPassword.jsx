import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from "@/utils/constants";
import { authService } from '@/services/authService';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import {
  Mail,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Loader2,
  Send,
} from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [fieldError, setFieldError] = useState('');

  const validate = () => {
    if (!email) {
      setFieldError("L'email est requis");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setFieldError('Email invalide');
      return false;
    }
    setFieldError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError('');

    try {
      await authService.forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Erreur lors de l\'envoi du lien'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2 text-center lg:text-left">
          <h2 className="text-2xl font-bold text-foreground">
            Mot de passe oublié
          </h2>
          <p className="text-muted-foreground">
            {sent
              ? 'Vérifiez votre boîte de réception'
              : 'Entrez votre email pour recevoir un lien de réinitialisation'}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {sent ? (
          /* Success state */
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <p className="text-center text-sm text-muted-foreground max-w-sm">
                Si un compte existe avec cette adresse email, vous recevrez un
                lien pour réinitialiser votre mot de passe.
              </p>
            </div>
            <Button
              variant="outline"
              size="xl"
              className="w-full"
              onClick={() => {
                setSent(false);
                setEmail('');
              }}
            >
              <Send className="mr-2 h-4 w-4" />
              Renvoyer le lien
            </Button>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Adresse email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="vous@exemple.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                    setFieldError('');
                  }}
                  className={`pl-10 ${fieldError ? 'border-destructive ring-destructive/50' : ''}`}
                />
              </div>
              {fieldError && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {fieldError}
                </p>
              )}
            </div>

            <Button
              type="submit"
              variant="default"
              size="xl"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Envoyer le lien
                </>
              )}
            </Button>
          </form>
        )}

        {/* Back to login */}
        <div className="text-center">
          <Link
            to={ROUTES.LOGIN}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à la connexion
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
