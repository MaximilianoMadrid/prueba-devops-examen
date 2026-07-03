import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

const tiers = [
  {
    name: "Inicial",
    price: "$49",
    description: "Perfecto para pequenas empresas que comienzan con logistica.",
    features: [
      "Hasta 500 pedidos/mes",
      "2 miembros del equipo",
      "Analiticas basicas",
      "Soporte por email",
      "5 integraciones",
    ],
    cta: "Iniciar Prueba Gratis",
    highlighted: false,
  },
  {
    name: "Profesional",
    price: "$149",
    description: "Para negocios en crecimiento que necesitan mas poder y flexibilidad.",
    features: [
      "Hasta 5,000 pedidos/mes",
      "10 miembros del equipo",
      "Analiticas avanzadas",
      "Soporte prioritario",
      "Integraciones ilimitadas",
      "Flujos personalizados",
      "Acceso a API",
    ],
    cta: "Iniciar Prueba Gratis",
    highlighted: true,
  },
  {
    name: "Empresarial",
    price: "Personalizado",
    description: "Para grandes operaciones con requisitos complejos.",
    features: [
      "Pedidos ilimitados",
      "Miembros ilimitados",
      "Analiticas personalizadas",
      "Soporte dedicado",
      "Integraciones a medida",
      "Garantia SLA",
      "Opcion on-premise",
      "Capacitacion personalizada",
    ],
    cta: "Contactar Ventas",
    highlighted: false,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Precios
          </p>
          <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Precios simples y transparentes
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Elige el plan que se ajuste a tu negocio. Escala cuando quieras.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative flex flex-col rounded-2xl border p-8 ${
                tier.highlighted
                  ? "border-primary bg-card shadow-lg shadow-primary/10"
                  : "border-border bg-card/50"
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-sm font-medium text-primary-foreground">
                  Mas Popular
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground">{tier.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-foreground">{tier.price}</span>
                  {tier.price !== "Personalizado" && (
                    <span className="text-muted-foreground">/mes</span>
                  )}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{tier.description}</p>
              </div>

              <ul className="mb-8 flex-1 space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <Check className="h-5 w-5 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link href="/dashboard">
                <Button
                  className="w-full"
                  variant={tier.highlighted ? "default" : "outline"}
                >
                  {tier.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
