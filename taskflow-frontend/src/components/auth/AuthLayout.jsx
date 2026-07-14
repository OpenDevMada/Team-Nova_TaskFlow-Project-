import { useEffect, useState } from 'react'

export function AuthLayout({ children, imageSrc = "/images/auth-bg.jpg", formSide = "right" }) {
  const [mounted, setMounted] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)
  const isFormLeft = formSide === "left"

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Animated blobs - only on form side */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10" aria-hidden="true">
        <div
          className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-10 blur-3xl"
          style={{
            background: 'var(--primary)',
            animation: 'blob 20s infinite',
          }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-10 blur-3xl"
          style={{
            background: 'var(--accent)',
            animation: 'blob 25s infinite reverse',
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-5 blur-3xl"
          style={{
            background: 'var(--primary)',
            animation: 'blob 30s infinite',
          }}
        />
      </div>

      <div className={`min-h-screen lg:grid lg:grid-cols-2 ${isFormLeft ? 'lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1' : ''}`}>
        {/* Brand Panel with Pexels image - hidden on mobile */}
        <div className="hidden lg:flex lg:flex-col relative overflow-hidden">
          {/* Loading skeleton */}
          {!imgLoaded && (
            <div className="absolute inset-0 bg-muted animate-pulse" />
          )}

          {/* Pexels background image */}
          <img
            src={imageSrc}
            srcSet={`${imageSrc.replace('.jpg', '@2x.jpg')} 2x`}
            alt=""
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              imgLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImgLoaded(true)}
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/60 to-accent/70" />

          {/* Extra gradient at bottom for footer text */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          {/* Content */}
          <div className="relative flex-1 flex flex-col justify-center px-12 xl:px-16 py-12 z-10">
            <div
              className={`space-y-6 transition-all duration-700 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <BrandContent />
            </div>
          </div>

          <div
            className={`relative px-12 xl:px-16 pb-8 z-10 transition-all duration-700 delay-300 ${
              mounted ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <p className="text-sm text-white/60">
              &copy; {new Date().getFullYear()} TaskFlow. Tous droits réservés.
            </p>
          </div>
        </div>

        {/* Form Panel */}
        <div className="flex items-center justify-center px-4 sm:px-6 lg:px-10 py-12 min-h-screen lg:min-h-0">
          <div
            className={`w-full max-w-xl transition-all duration-700 delay-150 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {/* Mobile brand header */}
            <div className="lg:hidden text-center mb-8">
              <MobileBrandHeader />
            </div>

            <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl p-8 sm:p-10">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function BrandContent() {
  return (
    <>
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm shadow-lg">
          <svg
            className="h-6 w-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-white">
          TaskFlow
        </h1>
      </div>

      <p className="text-lg text-white/80 leading-relaxed max-w-md">
        Simplifiez votre gestion de projets et boostez la productivité de votre équipe.
      </p>

      <div className="space-y-4">
        {[
          {
            icon: (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            ),
            title: 'Gestion des tâches',
            desc: 'Organisez, priorisez et suivez vos tâches en temps réel.',
          },
          {
            icon: (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            ),
            title: 'Collaboration d\'équipe',
            desc: 'Travaillez ensemble avec des tableaux Kanban et des listes partagées.',
          },
          {
            icon: (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            ),
            title: 'Statistiques avancées',
            desc: 'Visualisez la progression avec des graphiques et rapports détaillés.',
          },
        ].map((item, i) => (
          <div
            key={item.title}
            className="flex gap-4 group"
            style={{ animation: `fade-in-up 0.5s ${0.3 + i * 0.15}s both` }}
          >
            <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-white/15 text-white group-hover:bg-white/25 transition-colors backdrop-blur-sm">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                {item.icon}
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white">{item.title}</p>
              <p className="text-sm text-white/70">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

function MobileBrandHeader() {
  return (
    <div className="flex items-center justify-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/25">
        <svg
          className="h-5 w-5 text-primary-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
        TaskFlow
      </h1>
    </div>
  )
}
