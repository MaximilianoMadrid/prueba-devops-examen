"use client"

import { useState } from "react"
import {
  Search,
  Filter,
  Download,
  Plus,
  MoreHorizontal,
  Eye,
  Printer,
  Truck,
  CheckCircle2,
  Clock,
  Package,
  XCircle,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"

// Sample order data
const orders = [
  {
    id: "ORD-7891",
    customer: "Maria Garcia",
    email: "maria.garcia@email.com",
    items: 3,
    total: 128.50,
    status: "shipped",
    channel: "Shopify",
    date: "2024-01-15T10:30:00",
    shipping: "FedEx Express",
    address: "123 Main St, Los Angeles, CA 90001",
  },
  {
    id: "ORD-7890",
    customer: "James Wilson",
    email: "james.w@email.com",
    items: 1,
    total: 89.00,
    status: "processing",
    channel: "Amazon",
    date: "2024-01-15T09:15:00",
    shipping: "UPS Ground",
    address: "456 Oak Ave, Chicago, IL 60601",
  },
  {
    id: "ORD-7889",
    customer: "Emma Thompson",
    email: "emma.t@email.com",
    items: 5,
    total: 256.75,
    status: "pending",
    channel: "WooCommerce",
    date: "2024-01-15T08:45:00",
    shipping: "USPS Priority",
    address: "789 Pine Rd, Miami, FL 33101",
  },
  {
    id: "ORD-7888",
    customer: "Michael Chen",
    email: "m.chen@email.com",
    items: 2,
    total: 175.25,
    status: "delivered",
    channel: "Shopify",
    date: "2024-01-14T16:20:00",
    shipping: "DHL Express",
    address: "321 Elm St, San Francisco, CA 94102",
  },
  {
    id: "ORD-7887",
    customer: "Sarah Davis",
    email: "sarah.d@email.com",
    items: 4,
    total: 342.00,
    status: "shipped",
    channel: "Amazon",
    date: "2024-01-14T14:55:00",
    shipping: "FedEx Ground",
    address: "654 Maple Dr, Seattle, WA 98101",
  },
  {
    id: "ORD-7886",
    customer: "Robert Brown",
    email: "r.brown@email.com",
    items: 1,
    total: 59.99,
    status: "cancelled",
    channel: "Direct",
    date: "2024-01-14T12:30:00",
    shipping: "N/A",
    address: "987 Cedar Ln, Austin, TX 78701",
  },
  {
    id: "ORD-7885",
    customer: "Lisa Anderson",
    email: "lisa.a@email.com",
    items: 6,
    total: 489.50,
    status: "processing",
    channel: "Shopify",
    date: "2024-01-14T10:00:00",
    shipping: "UPS Express",
    address: "147 Birch St, Denver, CO 80201",
  },
  {
    id: "ORD-7884",
    customer: "David Kim",
    email: "d.kim@email.com",
    items: 2,
    total: 134.75,
    status: "delivered",
    channel: "WooCommerce",
    date: "2024-01-13T18:45:00",
    shipping: "USPS Priority",
    address: "258 Walnut Ave, Boston, MA 02101",
  },
]

const statusConfig = {
  pending: { label: "Pending", icon: Clock, className: "bg-warning/10 text-warning" },
  processing: { label: "Processing", icon: Package, className: "bg-chart-2/10 text-chart-2" },
  shipped: { label: "Shipped", icon: Truck, className: "bg-primary/10 text-primary" },
  delivered: { label: "Delivered", icon: CheckCircle2, className: "bg-success/10 text-success" },
  cancelled: { label: "Cancelled", icon: XCircle, className: "bg-destructive/10 text-destructive" },
}

type OrderStatus = keyof typeof statusConfig

export function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [selectedOrder, setSelectedOrder] = useState<typeof orders[0] | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    )
  }

  const toggleAllOrders = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(filteredOrders.map((order) => order.id))
    }
  }

  const openOrderDetails = (order: typeof orders[0]) => {
    setSelectedOrder(order)
    setDetailsOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Orders</h1>
          <p className="text-muted-foreground">Manage and fulfill customer orders across all channels.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Order
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { label: "All Orders", value: "2,345", change: "+12.5%" },
          { label: "Pending", value: "45", change: "-5.2%" },
          { label: "Processing", value: "120", change: "+8.1%" },
          { label: "Shipped", value: "456", change: "+15.3%" },
          { label: "Delivered", value: "1,724", change: "+22.4%" },
        ].map((stat) => (
          <Card key={stat.label} className="bg-card border-border">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <span className="text-xs text-success">{stat.change}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and Search */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-secondary border-0"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 bg-secondary border-0">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            {selectedOrders.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {selectedOrders.length} selected
                </span>
                <Button variant="outline" size="sm">
                  Bulk Actions
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="bg-card border-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                    onCheckedChange={toggleAllOrders}
                  />
                </TableHead>
                <TableHead>
                  <Button variant="ghost" className="h-8 gap-1 -ml-3 font-medium">
                    Order <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => {
                const status = statusConfig[order.status as OrderStatus]
                const StatusIcon = status.icon
                return (
                  <TableRow
                    key={order.id}
                    className="border-border cursor-pointer"
                    onClick={() => openOrderDetails(order)}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedOrders.includes(order.id)}
                        onCheckedChange={() => toggleOrderSelection(order.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium text-foreground">{order.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="text-foreground">{order.customer}</p>
                        <p className="text-xs text-muted-foreground">{order.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-secondary">
                        {order.channel}
                      </Badge>
                    </TableCell>
                    <TableCell>{order.items}</TableCell>
                    <TableCell className="font-medium">${order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={status.className}>
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(order.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => openOrderDetails(order)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Printer className="mr-2 h-4 w-4" />
                            Print Label
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Truck className="mr-2 h-4 w-4" />
                            Ship Order
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-border px-4 py-3">
            <p className="text-sm text-muted-foreground">
              Showing {filteredOrders.length} of {orders.length} orders
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="h-8 min-w-8">
                1
              </Button>
              <Button variant="ghost" size="sm" className="h-8 min-w-8">
                2
              </Button>
              <Button variant="ghost" size="sm" className="h-8 min-w-8">
                3
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order {selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              Placed on {selectedOrder && new Date(selectedOrder.date).toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <Tabs defaultValue="details" className="mt-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="items">Items</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="space-y-4 mt-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Customer</h4>
                    <p className="text-foreground">{selectedOrder.customer}</p>
                    <p className="text-sm text-muted-foreground">{selectedOrder.email}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Shipping Address</h4>
                    <p className="text-foreground">{selectedOrder.address}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Shipping Method</h4>
                    <p className="text-foreground">{selectedOrder.shipping}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                    <Badge variant="secondary" className={statusConfig[selectedOrder.status as OrderStatus].className}>
                      {statusConfig[selectedOrder.status as OrderStatus].label}
                    </Badge>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium">Total</span>
                  <span className="text-2xl font-bold">${selectedOrder.total.toFixed(2)}</span>
                </div>
              </TabsContent>
              <TabsContent value="items" className="mt-4">
                <div className="space-y-3">
                  {Array.from({ length: selectedOrder.items }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border border-border p-3">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-lg bg-secondary" />
                        <div>
                          <p className="font-medium">Product Item {i + 1}</p>
                          <p className="text-sm text-muted-foreground">SKU-{1000 + i}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${(selectedOrder.total / selectedOrder.items).toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">Qty: 1</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="history" className="mt-4">
                <div className="space-y-4">
                  {[
                    { event: "Order placed", time: "10:30 AM", date: "Jan 15" },
                    { event: "Payment confirmed", time: "10:31 AM", date: "Jan 15" },
                    { event: "Processing started", time: "11:00 AM", date: "Jan 15" },
                    { event: "Shipped", time: "2:30 PM", date: "Jan 15" },
                  ].map((event, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        {i < 3 && <div className="h-8 w-px bg-border" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{event.event}</p>
                        <p className="text-xs text-muted-foreground">
                          {event.date} at {event.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
