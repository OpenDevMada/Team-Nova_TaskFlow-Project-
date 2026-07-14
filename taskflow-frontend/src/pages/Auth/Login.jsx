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
  LogIn,
  AlertCircle,
  Loader2,
} from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setFieldErrors({ ...fieldErrors, [e.target.name]: '' });
  };

  const validate = () => {
    const errors = {};
    if (!formData.email) errors.email = "L'email est requis";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Email invalide";
    if (!formData.password) errors.password = "Le mot de passe est requis";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError('');

    try {
      await login(formData);
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', formData.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      window.location.replace(ROUTES.DASHBOARD);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Erreur lors de la connexion'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout imageSrc="/images/auth-bg.jpg">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2 text-center lg:text-left">
          <h2 className="text-2xl font-bold text-foreground">
            Content de vous revoir
          </h2>
          <p className="text-muted-foreground">
            Connectez-vous à votre compte TaskFlow
          </p>
        </div>

        {/* Error alert */}
        {error && (
          <div className="flex items-start gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
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
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Mot de passe</Label>
              <Link
                to={ROUTES.FORGOT_PASSWORD}
                className="text-xs text-primary hover:text-primary/80 transition-colors"
              >
                Mot de passe oublié ?
              </Link>
            </div>
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
            {fieldErrors.password && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {fieldErrors.password}
              </p>
            )}
          </div>

          {/* Remember me */}
          <div className="flex items-center gap-2">
            <input
              id="rememberMe"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary/50 cursor-pointer"
            />
            <label
              htmlFor="rememberMe"
              className="text-sm text-muted-foreground cursor-pointer select-none"
            >
              Se souvenir de moi
            </label>
          </div>

          {/* Submit */}
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
                Connexion en cours...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Se connecter
              </>
            )}
          </Button>
        </form>

        {/* Register link */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Pas encore de compte ?{' '}
            <Link
              to={ROUTES.REGISTER}
              className="font-medium text-primary hover:text-primary/80 transition-colors"
            >
              S'inscrire
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
