import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from "@/utils/constants";
import { useAuth } from "@/hooks/useAuth";
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  AlertCircle,
  CheckCircle2,
  Loader2,
  UserPlus,
} from 'lucide-react';

const Register = () => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
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
    if (!formData.firstName.trim())
      errors.firstName = 'Le prénom est requis';
    if (!formData.lastName.trim())
      errors.lastName = 'Le nom est requis';
    if (!formData.email) errors.email = "L'email est requis";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errors.email = 'Email invalide';
    if (!formData.password) errors.password = 'Le mot de passe est requis';
    else if (formData.password.length < 6)
      errors.password = 'Minimum 6 caractères';
    if (!formData.confirmPassword)
      errors.confirmPassword = 'Confirmation requise';
    else if (formData.password !== formData.confirmPassword)
      errors.confirmPassword = 'Les mots de passe ne correspondent pas';
    if (!acceptTerms)
      errors.terms = 'Vous devez accepter les conditions';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError('');

    try {
      const { confirmPassword: _confirmPassword, ...registerData } = formData;
      await register(registerData);
      setSuccess('Compte créé avec succès !');
      setTimeout(() => {
        window.location.replace(ROUTES.DASHBOARD);
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Erreur lors de la création du compte'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout formSide="left" imageSrc="/images/auth-register-bg.jpg">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2 text-center lg:text-left">
          <h2 className="text-2xl font-bold text-foreground">
            Créer un compte
          </h2>
          <p className="text-muted-foreground">
            Rejoignez TaskFlow et commencez à collaborer
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div className="flex items-start gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-start gap-3 rounded-lg border border-green-500/50 bg-green-500/10 p-4 text-sm text-green-700 dark:text-green-400">
            <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* First Name + Last Name */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="Jean"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`pl-10 ${fieldErrors.firstName ? 'border-destructive ring-destructive/50' : ''}`}
                />
              </div>
              {fieldErrors.firstName && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {fieldErrors.firstName}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Dupont"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`pl-10 ${fieldErrors.lastName ? 'border-destructive ring-destructive/50' : ''}`}
                />
              </div>
              {fieldErrors.lastName && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {fieldErrors.lastName}
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Adresse email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="vous@exemple.com"
                value={formData.email}
                onChange={handleChange}
                className={`pl-10 ${fieldErrors.email ? 'border-destructive ring-destructive/50' : ''}`}
              />
            </div>
            {fieldErrors.email && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {fieldErrors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className={`pl-10 pr-10 ${fieldErrors.password ? 'border-destructive ring-destructive/50' : ''}`}
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
            {fieldErrors.password ? (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {fieldErrors.password}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Minimum 6 caractères
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
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

          {/* Terms */}
          <div className="flex items-start gap-2">
            <input
              id="terms"
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => {
                setAcceptTerms(e.target.checked);
                if (e.target.checked)
                  setFieldErrors({ ...fieldErrors, terms: '' });
              }}
              className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary/50 cursor-pointer"
            />
            <label
              htmlFor="terms"
              className="text-sm text-muted-foreground cursor-pointer select-none"
            >
              J'accepte les{' '}
              <Link
                to="/terms"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                conditions d'utilisation
              </Link>{' '}
              et la{' '}
              <Link
                to="/privacy"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                politique de confidentialité
              </Link>
            </label>
          </div>
          {fieldErrors.terms && (
            <p className="text-xs text-destructive flex items-center gap-1 -mt-3">
              <AlertCircle className="h-3 w-3" />
              {fieldErrors.terms}
            </p>
          )}

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
                Création du compte...
              </>
            ) : success ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Compte créé !
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Créer mon compte
              </>
            )}
          </Button>
        </form>

        {/* Login link */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Déjà un compte ?{' '}
            <Link
              to={ROUTES.LOGIN}
              className="font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Register;
