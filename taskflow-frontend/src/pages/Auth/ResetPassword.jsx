import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ROUTES } from "@/utils/constants";
import { authService } from '@/services/authService';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import {
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Loader2,
  KeyRound,
} from 'lucide-react';

const ResetPassword = () => {
  const { token } = useParams();
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
    setFieldErrors({ ...fieldErrors, [e.target.name]: '' });
  };

  const validate = () => {
    const errors = {};
    if (!formData.newPassword)
      errors.newPassword = 'Le mot de passe est requis';
    else if (formData.newPassword.length < 6)
      errors.newPassword = 'Minimum 6 caractères';
    if (!formData.confirmPassword)
      errors.confirmPassword = 'Confirmation requise';
    else if (formData.newPassword !== formData.confirmPassword)
      errors.confirmPassword = 'Les mots de passe ne correspondent pas';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError('');

    try {
      await authService.resetPassword(token, formData.newPassword);
      setSuccess('Mot de passe réinitialisé avec succès !');
      setTimeout(() => {
        window.location.replace(ROUTES.LOGIN);
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Erreur lors de la réinitialisation'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <AuthLayout>
        <div className="space-y-6 text-center">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            Lien invalide
          </h2>
          <p className="text-muted-foreground">
            Ce lien de réinitialisation est invalide ou a expiré.
          </p>
          <Link
            to={ROUTES.FORGOT_PASSWORD}
            className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Demander un nouveau lien
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2 text-center lg:text-left">
          <h2 className="text-2xl font-bold text-foreground">
            Nouveau mot de passe
          </h2>
          <p className="text-muted-foreground">
            Choisissez un nouveau mot de passe sécurisé
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="flex items-start gap-3 rounded-lg border border-green-500/50 bg-green-500/10 p-4 text-sm text-green-700 dark:text-green-400">
            <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* New password */}
          <div className="space-y-2">
            <Label htmlFor="newPassword">Nouveau mot de passe</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                id="newPassword"
                name="newPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.newPassword}
                onChange={handleChange}
                className={`pl-10 pr-10 ${fieldErrors.newPassword ? 'border-destructive ring-destructive/50' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {fieldErrors.newPassword ? (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {fieldErrors.newPassword}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Minimum 6 caractères
              </p>
            )}
          </div>

          {/* Confirm password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">
              Confirmer le nouveau mot de passe
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`pl-10 pr-10 ${fieldErrors.confirmPassword ? 'border-destructive ring-destructive/50' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {fieldErrors.confirmPassword && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {fieldErrors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            variant="default"
            size="xl"
            className="w-full"
            disabled={loading || !!success}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Réinitialisation...
              </>
            ) : success ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Mot de passe modifié !
              </>
            ) : (
              <>
                <KeyRound className="mr-2 h-4 w-4" />
                Réinitialiser le mot de passe
              </>
            )}
          </Button>
        </form>

        {/* Back to login */}
        {!success && (
          <div className="text-center">
            <Link
              to={ROUTES.LOGIN}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour à la connexion
            </Link>
          </div>
        )}
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;
