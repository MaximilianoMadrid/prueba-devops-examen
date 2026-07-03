import Image from "next/image"

const integrations = [
  { name: "Shopify", category: "eCommerce" },
  { name: "Amazon", category: "Marketplace" },
  { name: "WooCommerce", category: "eCommerce" },
  { name: "FedEx", category: "Transportista" },
  { name: "UPS", category: "Transportista" },
  { name: "DHL", category: "Transportista" },
  { name: "Stripe", category: "Pagos" },
  { name: "QuickBooks", category: "Contabilidad" },
  { name: "Salesforce", category: "CRM" },
  { name: "Slack", category: "Comunicacion" },
  { name: "Zapier", category: "Automatizacion" },
  { name: "Magento", category: "eCommerce" },
]

export function IntegrationsSection() {
  return (
    <section id="integrations" className="border-y border-border bg-card/30 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Integraciones
          </p>
          <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Conecta todo tu stack tecnologico
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Integra perfectamente con mas de 50 plataformas. Desde eCommerce hasta transportistas y contabilidad.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {integrations.map((integration) => (
            <div
              key={integration.name}
              className="group flex flex-col items-center justify-center rounded-xl border border-border bg-card/50 p-6 transition-all hover:border-primary/50 hover:bg-card"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-foreground">
                <span className="text-lg font-bold">{integration.name[0]}</span>
              </div>
              <span className="mt-3 text-sm font-medium text-foreground">{integration.name}</span>
              <span className="mt-1 text-xs text-muted-foreground">{integration.category}</span>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            Y muchas mas...{" "}
            <a href="#" className="text-primary hover:underline">
              Ver todas las integraciones
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
