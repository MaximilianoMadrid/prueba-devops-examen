import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Package, Truck, BarChart3, Zap } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-chart-2/10 blur-3xl" />
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(oklch(0.68 0.18 45 / 0.1) 1px, transparent 1px),
                              linear-gradient(90deg, oklch(0.68 0.18 45 / 0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-sm text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-success pulse-dot" />
            Plataforma v2.0 Disponible
          </div>
          
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Plataforma{" "}
            <span className="text-primary">Logistica</span>{" "}
            Unificada
          </h1>
          
          <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Desbloquea un rendimiento empresarial sin igual con informacion en tiempo real, automatizacion 
            e integraciones perfectas. Unete a la revolucion logistica para el eCommerce moderno.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/dashboard">
              <Button size="lg" className="group gap-2 px-8">
                Comenzar Gratis
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg" className="px-8">
                Explorar Caracteristicas
              </Button>
            </Link>
          </div>

         {/* Stats */}
          <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4">
            {[
              { label: "Usuarios Activos", value: "10K+" },
              { label: "Pedidos Procesados", value: "5M+" },
              { label: "Integraciones", value: "50+" },
              { label: "SLA de Disponibilidad", value: "99.9%" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-foreground sm:text-3xl">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature preview cards */}
        <div className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Package, title: "Inventario", desc: "Seguimiento de stock en tiempo real" },
            { icon: Truck, title: "Envios", desc: "Soporte multi-transportista" },
            { icon: BarChart3, title: "Analiticas", desc: "Informacion accionable" },
            { icon: Zap, title: "Automatizacion", desc: "Flujos inteligentes" },
          ].map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-xl border border-border bg-card/50 p-6 transition-all hover:border-primary/50 hover:bg-card"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
