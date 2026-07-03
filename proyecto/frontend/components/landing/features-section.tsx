import {
  Package,
  Truck,
  BarChart3,
  RefreshCcw,
  Shield,
  Zap,
  Globe,
  Layers,
} from "lucide-react"

const features = [
  {
    icon: Package,
    title: "Gestion de Inventario",
    description:
      "Seguimiento de stock en tiempo real en multiples almacenes. Alertas automaticas de bajo stock y pronostico de demanda.",
  },
  {
    icon: Truck,
    title: "Seguimiento de Envios",
    description:
      "Visibilidad completa desde el almacen hasta la puerta. Integracion multi-transportista con actualizaciones en vivo.",
  },
  {
    icon: BarChart3,
    title: "Analiticas Avanzadas",
    description:
      "Informacion basada en datos con dashboards personalizables. Rastrea KPIs, identifica tendencias y optimiza operaciones.",
  },
  {
    icon: RefreshCcw,
    title: "Cumplimiento de Pedidos",
    description:
      "Flujos optimizados de picking, empaque y envio. Procesamiento por lotes y enrutamiento inteligente de pedidos.",
  },
  {
    icon: Shield,
    title: "Seguridad Empresarial",
    description:
      "Infraestructura compatible con SOC 2 con encriptacion de extremo a extremo. Control de acceso basado en roles y registros de auditoria.",
  },
  {
    icon: Zap,
    title: "Automatizacion de Flujos",
    description:
      "Crea reglas de automatizacion personalizadas sin codigo. Activa acciones basadas en eventos y condiciones.",
  },
  {
    icon: Globe,
    title: "Soporte Multicanal",
    description:
      "Conecta todos tus canales de venta en un solo lugar. Shopify, Amazon, WooCommerce y mas de 50 integraciones.",
  },
  {
    icon: Layers,
    title: "Arquitectura de Microservicios",
    description:
      "Infraestructura escalable y resiliente construida para el crecimiento. Servicios independientes con tolerancia a fallos.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Caracteristicas
          </p>
          <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Todo lo que necesitas para escalar tu logistica
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Construido para negocios de eCommerce modernos que exigen confiabilidad, velocidad e inteligencia.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative rounded-xl border border-border bg-card/50 p-6 transition-all duration-300 hover:border-primary/50 hover:bg-card card-glow"
            >
              {/* Gradient accent line */}
              <div className="absolute top-0 left-6 right-6 h-px gradient-line opacity-0 transition-opacity group-hover:opacity-100" />
              
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-6 w-6" />
              </div>
              
              <h3 className="font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
