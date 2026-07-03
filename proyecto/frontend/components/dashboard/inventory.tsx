"use client"

import { useState } from "react"
import {
  Search,
  Filter,
  Download,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  AlertTriangle,
  Package,
  TrendingUp,
  TrendingDown,
  BarChart3,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Warehouse,
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
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts"

// Sample inventory data
const inventoryItems = [
  {
    id: "SKU-4521",
    name: "Wireless Earbuds Pro",
    category: "Electronics",
    stock: 12,
    reserved: 5,
    threshold: 50,
    price: 79.99,
    cost: 35.00,
    warehouse: "LA Warehouse",
    status: "low",
    lastUpdated: "2024-01-15T10:30:00",
  },
  {
    id: "SKU-3892",
    name: "USB-C Charging Cable 6ft",
    category: "Accessories",
    stock: 28,
    reserved: 12,
    threshold: 100,
    price: 14.99,
    cost: 4.50,
    warehouse: "Chicago DC",
    status: "low",
    lastUpdated: "2024-01-15T09:15:00",
  },
  {
    id: "SKU-2156",
    name: "Phone Case Premium",
    category: "Accessories",
    stock: 8,
    reserved: 3,
    threshold: 30,
    price: 29.99,
    cost: 8.00,
    warehouse: "LA Warehouse",
    status: "critical",
    lastUpdated: "2024-01-15T08:45:00",
  },
  {
    id: "SKU-7823",
    name: "Bluetooth Speaker Mini",
    category: "Electronics",
    stock: 156,
    reserved: 24,
    threshold: 50,
    price: 49.99,
    cost: 22.00,
    warehouse: "Miami Hub",
    status: "healthy",
    lastUpdated: "2024-01-14T16:20:00",
  },
  {
    id: "SKU-9012",
    name: "Smart Watch Band",
    category: "Wearables",
    stock: 89,
    reserved: 15,
    threshold: 40,
    price: 24.99,
    cost: 7.50,
    warehouse: "Seattle Fulfillment",
    status: "healthy",
    lastUpdated: "2024-01-14T14:55:00",
  },
  {
    id: "SKU-5634",
    name: "Laptop Stand Aluminum",
    category: "Office",
    stock: 0,
    reserved: 0,
    threshold: 25,
    price: 69.99,
    cost: 28.00,
    warehouse: "LA Warehouse",
    status: "out",
    lastUpdated: "2024-01-14T12:30:00",
  },
  {
    id: "SKU-1278",
    name: "Webcam HD 1080p",
    category: "Electronics",
    stock: 234,
    reserved: 45,
    threshold: 75,
    price: 89.99,
    cost: 42.00,
    warehouse: "Chicago DC",
    status: "healthy",
    lastUpdated: "2024-01-14T10:00:00",
  },
  {
    id: "SKU-8456",
    name: "Desk Organizer Set",
    category: "Office",
    stock: 67,
    reserved: 8,
    threshold: 30,
    price: 34.99,
    cost: 12.00,
    warehouse: "Miami Hub",
    status: "healthy",
    lastUpdated: "2024-01-13T18:45:00",
  },
]

const stockHistoryData = [
  { date: "Mon", stock: 1250 },
  { date: "Tue", stock: 1180 },
  { date: "Wed", stock: 1320 },
  { date: "Thu", stock: 1290 },
  { date: "Fri", stock: 1150 },
  { date: "Sat", stock: 1080 },
  { date: "Sun", stock: 1200 },
]

const statusConfig = {
  healthy: { label: "Healthy", className: "bg-success/10 text-success" },
  low: { label: "Low Stock", className: "bg-warning/10 text-warning" },
  critical: { label: "Critical", className: "bg-destructive/10 text-destructive" },
  out: { label: "Out of Stock", className: "bg-muted text-muted-foreground" },
}

type InventoryStatus = keyof typeof statusConfig

export function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [addItemOpen, setAddItemOpen] = useState(false)

  const categories = [...new Set(inventoryItems.map((item) => item.category))]

  const filteredItems = inventoryItems.filter((item) => {
    const matchesSearch =
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    )
  }

  const toggleAllItems = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredItems.map((item) => item.id))
    }
  }

  const totalValue = inventoryItems.reduce((sum, item) => sum + item.stock * item.price, 0)
  const totalItems = inventoryItems.reduce((sum, item) => sum + item.stock, 0)
  const lowStockCount = inventoryItems.filter((item) => item.status === "low" || item.status === "critical").length
  const outOfStockCount = inventoryItems.filter((item) => item.status === "out").length

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Inventory</h1>
          <p className="text-muted-foreground">Track and manage your product inventory across warehouses.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" className="gap-2">
            <RefreshCcw className="h-4 w-4" />
            Sync
          </Button>
          <Dialog open={addItemOpen} onOpenChange={setAddItemOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Inventory Item</DialogTitle>
                <DialogDescription>Add a new product to your inventory.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input id="sku" placeholder="SKU-XXXX" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input id="name" placeholder="Enter product name" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="warehouse">Warehouse</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select warehouse" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="la">LA Warehouse</SelectItem>
                        <SelectItem value="chicago">Chicago DC</SelectItem>
                        <SelectItem value="miami">Miami Hub</SelectItem>
                        <SelectItem value="seattle">Seattle Fulfillment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="stock">Initial Stock</Label>
                    <Input id="stock" type="number" placeholder="0" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="price">Price</Label>
                    <Input id="price" type="number" placeholder="0.00" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="threshold">Low Stock Alert</Label>
                    <Input id="threshold" type="number" placeholder="50" />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddItemOpen(false)}>Cancel</Button>
                <Button onClick={() => setAddItemOpen(false)}>Add Item</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <TrendingUp className="h-4 w-4 text-success" />
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Total Items</p>
              <p className="text-2xl font-bold text-foreground">{totalItems.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-2/10">
                <BarChart3 className="h-6 w-6 text-chart-2" />
              </div>
              <TrendingUp className="h-4 w-4 text-success" />
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Total Value</p>
              <p className="text-2xl font-bold text-foreground">${totalValue.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
                <AlertTriangle className="h-6 w-6 text-warning" />
              </div>
              <TrendingDown className="h-4 w-4 text-warning" />
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Low Stock Items</p>
              <p className="text-2xl font-bold text-foreground">{lowStockCount}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
                <Warehouse className="h-6 w-6 text-destructive" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Out of Stock</p>
              <p className="text-2xl font-bold text-foreground">{outOfStockCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stock Trend Chart */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Stock Level Trend</CardTitle>
          <CardDescription>Total inventory levels over the past week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stockHistoryData}>
                <defs>
                  <linearGradient id="stockGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.68 0.18 45)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="oklch(0.68 0.18 45)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.02 250)" />
                <XAxis dataKey="date" stroke="oklch(0.65 0 0)" fontSize={12} />
                <YAxis stroke="oklch(0.65 0 0)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(0.16 0.02 250)",
                    border: "1px solid oklch(0.25 0.02 250)",
                    borderRadius: "8px",
                    color: "oklch(0.95 0 0)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="stock"
                  stroke="oklch(0.68 0.18 45)"
                  strokeWidth={2}
                  fill="url(#stockGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search inventory..."
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
                  <SelectItem value="healthy">Healthy</SelectItem>
                  <SelectItem value="low">Low Stock</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="out">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40 bg-secondary border-0">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            {selectedItems.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {selectedItems.length} selected
                </span>
                <Button variant="outline" size="sm">
                  Bulk Update
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card className="bg-card border-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                    onCheckedChange={toggleAllItems}
                  />
                </TableHead>
                <TableHead>
                  <Button variant="ghost" className="h-8 gap-1 -ml-3 font-medium">
                    Product <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Warehouse</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="text-right">Reserved</TableHead>
                <TableHead className="text-right">Available</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => {
                const status = statusConfig[item.status as InventoryStatus]
                const available = item.stock - item.reserved
                const stockPercentage = (item.stock / item.threshold) * 100
                return (
                  <TableRow key={item.id} className="border-border">
                    <TableCell>
                      <Checkbox
                        checked={selectedItems.includes(item.id)}
                        onCheckedChange={() => toggleItemSelection(item.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                          <Package className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-secondary">
                        {item.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{item.warehouse}</TableCell>
                    <TableCell className="text-right">
                      <div className="space-y-1">
                        <p className="font-medium">{item.stock}</p>
                        <Progress 
                          value={Math.min(stockPercentage, 100)} 
                          className="h-1 w-16 ml-auto"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">{item.reserved}</TableCell>
                    <TableCell className="text-right font-medium">{available}</TableCell>
                    <TableCell className="text-right font-medium">${item.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={status.className}>
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Item
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <RefreshCcw className="mr-2 h-4 w-4" />
                            Adjust Stock
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
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
              Showing {filteredItems.length} of {inventoryItems.length} items
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
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
