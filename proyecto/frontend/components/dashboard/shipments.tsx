"use client"

import { useState } from "react"
import {
  Search,
  Filter,
  Download,
  Truck,
  Package,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MapPin,
  Calendar,
  ChevronRight,
  ExternalLink,
  Plane,
  Ship,
  MoreHorizontal,
  Eye,
  Printer,
  RefreshCcw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

// Sample shipment data
const shipments = [
  {
    id: "SHP-78291",
    orderId: "ORD-7891",
    customer: "Maria Garcia",
    carrier: "FedEx",
    service: "Express",
    tracking: "794644790191",
    status: "in_transit",
    origin: "Los Angeles, CA",
    destination: "Miami, FL",
    estimatedDelivery: "2024-01-17",
    weight: "2.5 lbs",
    createdAt: "2024-01-15T10:30:00",
    events: [
      { status: "Picked up", location: "Los Angeles, CA", time: "2024-01-15T14:30:00" },
      { status: "In transit", location: "Phoenix, AZ", time: "2024-01-15T22:15:00" },
      { status: "Arrived at facility", location: "Houston, TX", time: "2024-01-16T06:45:00" },
    ],
  },
  {
    id: "SHP-78290",
    orderId: "ORD-7887",
    customer: "Sarah Davis",
    carrier: "UPS",
    service: "Ground",
    tracking: "1Z999AA10123456784",
    status: "delivered",
    origin: "Chicago, IL",
    destination: "Seattle, WA",
    estimatedDelivery: "2024-01-14",
    weight: "4.2 lbs",
    createdAt: "2024-01-10T09:15:00",
    events: [
      { status: "Picked up", location: "Chicago, IL", time: "2024-01-10T11:00:00" },
      { status: "In transit", location: "Denver, CO", time: "2024-01-12T08:30:00" },
      { status: "Out for delivery", location: "Seattle, WA", time: "2024-01-14T07:00:00" },
      { status: "Delivered", location: "Seattle, WA", time: "2024-01-14T14:23:00" },
    ],
  },
  {
    id: "SHP-78289",
    orderId: "ORD-7885",
    customer: "Lisa Anderson",
    carrier: "DHL",
    service: "Express",
    tracking: "1234567890",
    status: "processing",
    origin: "Denver, CO",
    destination: "New York, NY",
    estimatedDelivery: "2024-01-18",
    weight: "6.8 lbs",
    createdAt: "2024-01-15T08:45:00",
    events: [
      { status: "Label created", location: "Denver, CO", time: "2024-01-15T08:45:00" },
    ],
  },
  {
    id: "SHP-78288",
    orderId: "ORD-7884",
    customer: "David Kim",
    carrier: "USPS",
    service: "Priority",
    tracking: "9400111899223033005291",
    status: "delivered",
    origin: "Boston, MA",
    destination: "Philadelphia, PA",
    estimatedDelivery: "2024-01-13",
    weight: "1.8 lbs",
    createdAt: "2024-01-11T16:20:00",
    events: [
      { status: "Picked up", location: "Boston, MA", time: "2024-01-11T17:00:00" },
      { status: "Delivered", location: "Philadelphia, PA", time: "2024-01-13T11:45:00" },
    ],
  },
  {
    id: "SHP-78287",
    orderId: "ORD-7882",
    customer: "Jennifer White",
    carrier: "FedEx",
    service: "Ground",
    tracking: "794644790192",
    status: "delayed",
    origin: "San Francisco, CA",
    destination: "Austin, TX",
    estimatedDelivery: "2024-01-16",
    weight: "3.1 lbs",
    createdAt: "2024-01-12T14:55:00",
    events: [
      { status: "Picked up", location: "San Francisco, CA", time: "2024-01-12T16:00:00" },
      { status: "Delay - Weather conditions", location: "Albuquerque, NM", time: "2024-01-15T10:30:00" },
    ],
  },
  {
    id: "SHP-78286",
    orderId: "ORD-7880",
    customer: "Thomas Miller",
    carrier: "UPS",
    service: "Express",
    tracking: "1Z999AA10123456785",
    status: "out_for_delivery",
    origin: "Miami, FL",
    destination: "Atlanta, GA",
    estimatedDelivery: "2024-01-16",
    weight: "2.0 lbs",
    createdAt: "2024-01-14T10:00:00",
    events: [
      { status: "Picked up", location: "Miami, FL", time: "2024-01-14T12:00:00" },
      { status: "In transit", location: "Jacksonville, FL", time: "2024-01-15T05:30:00" },
      { status: "Out for delivery", location: "Atlanta, GA", time: "2024-01-16T07:00:00" },
    ],
  },
]

const statusConfig = {
  processing: { label: "Processing", icon: Package, className: "bg-chart-2/10 text-chart-2" },
  in_transit: { label: "In Transit", icon: Truck, className: "bg-primary/10 text-primary" },
  out_for_delivery: { label: "Out for Delivery", icon: MapPin, className: "bg-info/10 text-info" },
  delivered: { label: "Delivered", icon: CheckCircle2, className: "bg-success/10 text-success" },
  delayed: { label: "Delayed", icon: AlertTriangle, className: "bg-warning/10 text-warning" },
}

type ShipmentStatus = keyof typeof statusConfig

const carrierIcons: Record<string, React.ReactNode> = {
  FedEx: <Plane className="h-4 w-4" />,
  UPS: <Truck className="h-4 w-4" />,
  DHL: <Plane className="h-4 w-4" />,
  USPS: <Truck className="h-4 w-4" />,
}

export function ShipmentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [carrierFilter, setCarrierFilter] = useState<string>("all")
  const [selectedShipment, setSelectedShipment] = useState<typeof shipments[0] | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  const carriers = [...new Set(shipments.map((s) => s.carrier))]

  const filteredShipments = shipments.filter((shipment) => {
    const matchesSearch =
      shipment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.tracking.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.customer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || shipment.status === statusFilter
    const matchesCarrier = carrierFilter === "all" || shipment.carrier === carrierFilter
    return matchesSearch && matchesStatus && matchesCarrier
  })

  const openShipmentDetails = (shipment: typeof shipments[0]) => {
    setSelectedShipment(shipment)
    setDetailsOpen(true)
  }

  const inTransitCount = shipments.filter((s) => s.status === "in_transit").length
  const deliveredCount = shipments.filter((s) => s.status === "delivered").length
  const delayedCount = shipments.filter((s) => s.status === "delayed").length
  const processingCount = shipments.filter((s) => s.status === "processing").length

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Shipments</h1>
          <p className="text-muted-foreground">Track and manage all shipments across carriers.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" className="gap-2">
            <RefreshCcw className="h-4 w-4" />
            Sync All
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Truck className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">In Transit</p>
              <p className="text-2xl font-bold text-foreground">{inTransitCount}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                <CheckCircle2 className="h-6 w-6 text-success" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Delivered Today</p>
              <p className="text-2xl font-bold text-foreground">{deliveredCount}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
                <AlertTriangle className="h-6 w-6 text-warning" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Delayed</p>
              <p className="text-2xl font-bold text-foreground">{delayedCount}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-2/10">
                <Package className="h-6 w-6 text-chart-2" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Processing</p>
              <p className="text-2xl font-bold text-foreground">{processingCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by ID, tracking, or customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-secondary border-0"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-44 bg-secondary border-0">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="in_transit">In Transit</SelectItem>
                <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="delayed">Delayed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={carrierFilter} onValueChange={setCarrierFilter}>
              <SelectTrigger className="w-36 bg-secondary border-0">
                <SelectValue placeholder="Carrier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Carriers</SelectItem>
                {carriers.map((carrier) => (
                  <SelectItem key={carrier} value={carrier}>{carrier}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Shipments List */}
      <div className="grid gap-4">
        {filteredShipments.map((shipment) => {
          const status = statusConfig[shipment.status as ShipmentStatus]
          const StatusIcon = status.icon
          const progressPercentage = 
            shipment.status === "delivered" ? 100 :
            shipment.status === "out_for_delivery" ? 85 :
            shipment.status === "in_transit" ? 50 :
            shipment.status === "processing" ? 15 : 50

          return (
            <Card 
              key={shipment.id} 
              className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => openShipmentDetails(shipment)}
            >
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  {/* Left section */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                      {carrierIcons[shipment.carrier]}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">{shipment.id}</span>
                        <Badge variant="secondary" className={status.className}>
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {status.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{shipment.customer}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{shipment.carrier} {shipment.service}</span>
                        <span>•</span>
                        <span>{shipment.tracking}</span>
                      </div>
                    </div>
                  </div>

                  {/* Center section - Route */}
                  <div className="flex items-center gap-3 text-sm">
                    <div className="text-right">
                      <p className="font-medium text-foreground">{shipment.origin.split(",")[0]}</p>
                      <p className="text-xs text-muted-foreground">Origin</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <div className="relative h-1 w-24 rounded-full bg-secondary">
                        <div 
                          className="absolute h-full rounded-full bg-primary transition-all"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                      <div className="h-2 w-2 rounded-full bg-muted" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{shipment.destination.split(",")[0]}</p>
                      <p className="text-xs text-muted-foreground">Destination</p>
                    </div>
                  </div>

                  {/* Right section */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">ETA:</span>
                        <span className="font-medium text-foreground">
                          {new Date(shipment.estimatedDelivery).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{shipment.weight}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); openShipmentDetails(shipment); }}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Track on Carrier Site
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Printer className="mr-2 h-4 w-4" />
                          Print Label
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Shipment Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Shipment {selectedShipment?.id}
              {selectedShipment && (
                <Badge variant="secondary" className={statusConfig[selectedShipment.status as ShipmentStatus].className}>
                  {statusConfig[selectedShipment.status as ShipmentStatus].label}
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription>
              Order {selectedShipment?.orderId} • {selectedShipment?.carrier} {selectedShipment?.service}
            </DialogDescription>
          </DialogHeader>
          {selectedShipment && (
            <Tabs defaultValue="tracking" className="mt-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="tracking">Tracking</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>
              <TabsContent value="tracking" className="mt-4 space-y-4">
                {/* Progress bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery Progress</span>
                    <span className="font-medium text-foreground">
                      {selectedShipment.status === "delivered" ? "Completed" : "In Progress"}
                    </span>
                  </div>
                  <Progress 
                    value={
                      selectedShipment.status === "delivered" ? 100 :
                      selectedShipment.status === "out_for_delivery" ? 85 :
                      selectedShipment.status === "in_transit" ? 50 : 15
                    } 
                    className="h-2"
                  />
                </div>

                {/* Timeline */}
                <div className="space-y-4">
                  {selectedShipment.events.slice().reverse().map((event, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`h-3 w-3 rounded-full ${i === 0 ? "bg-primary" : "bg-muted"}`} />
                        {i < selectedShipment.events.length - 1 && (
                          <div className="h-12 w-px bg-border" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="font-medium text-foreground">{event.status}</p>
                        <p className="text-sm text-muted-foreground">{event.location}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(event.time).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="details" className="mt-4 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Tracking Number</h4>
                    <p className="text-foreground font-mono">{selectedShipment.tracking}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Carrier</h4>
                    <p className="text-foreground">{selectedShipment.carrier} {selectedShipment.service}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Origin</h4>
                    <p className="text-foreground">{selectedShipment.origin}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Destination</h4>
                    <p className="text-foreground">{selectedShipment.destination}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Weight</h4>
                    <p className="text-foreground">{selectedShipment.weight}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Estimated Delivery</h4>
                    <p className="text-foreground">
                      {new Date(selectedShipment.estimatedDelivery).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Track on {selectedShipment.carrier}
                  </Button>
                  <Button variant="outline" className="flex-1 gap-2">
                    <Printer className="h-4 w-4" />
                    Print Label
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
