import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="border-t border-border bg-card/30 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-card to-chart-2/20 p-8 sm:p-16">
          {/* Decoraciones de fondo */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-chart-2/20 blur-3xl" />
          
          <div className="relative mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Listo para transformar tu logistica?
            </h2>
            <p className="mt-4 text-pretty text-lg text-muted-foreground">
              Unete a miles de negocios de eCommerce que ya usan SmartLogix 
              para optimizar sus operaciones y deleitar a sus clientes.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/dashboard">
                <Button size="lg" className="group gap-2 px-8">
                  Iniciar Prueba Gratis
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="#pricing">
                <Button variant="outline" size="lg" className="px-8">
                  Ver Precios
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Sin tarjeta de credito. Prueba gratis de 14 dias.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
