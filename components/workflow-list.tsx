"use client"

import { useState } from "react"
import Link from "next/link"
import { Calendar, MoreHorizontal, Play, Pause, Trash2, Copy, Edit, Bot, ArrowUpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

type Environment = "DEV" | "ETE" | "QA" | "PROD"

type Workflow = {
  id: string
  name: string
  description: string
  status: "active" | "inactive"
  lastRun: string
  createdAt: string
  type: "standard" | "ai"
  folder?: string
  tags?: string[]
  environment: Environment
  version: string
}

export default function WorkflowList() {
  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: "1",
      name: "Customer Onboarding",
      description: "Process new customer applications and send welcome emails",
      status: "active",
      lastRun: "2 hours ago",
      createdAt: "2023-04-01",
      type: "standard",
      folder: "Banking",
      tags: ["Production", "Automated"],
      environment: "PROD",
      version: "1.2.0",
    },
    {
      id: "2",
      name: "Transaction Monitoring",
      description: "Monitor transactions for suspicious activity",
      status: "active",
      lastRun: "5 minutes ago",
      createdAt: "2023-03-15",
      type: "standard",
      folder: "Banking",
      tags: ["Production", "Automated", "Critical"],
      environment: "QA",
      version: "2.0.1",
    },
    {
      id: "3",
      name: "Account Reconciliation",
      description: "Daily account reconciliation process",
      status: "inactive",
      lastRun: "1 day ago",
      createdAt: "2023-02-20",
      type: "standard",
      folder: "Banking",
      tags: ["Production", "Automated"],
      environment: "DEV",
      version: "0.9.5",
    },
    {
      id: "4",
      name: "AI Data Processing",
      description: "Process data from Google Sheets using AI models",
      status: "active",
      lastRun: "10 minutes ago",
      createdAt: "2023-05-10",
      type: "ai",
      folder: "AI Workflows",
      tags: ["Development", "AI"],
      environment: "ETE",
      version: "1.5.0",
    },
    {
      id: "5",
      name: "Customer Support AI",
      description: "AI-powered customer support response generation",
      status: "active",
      lastRun: "1 hour ago",
      createdAt: "2023-05-15",
      type: "ai",
      folder: "AI Workflows",
      tags: ["Production", "AI"],
      environment: "PROD",
      version: "2.1.0",
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [environmentFilter, setEnvironmentFilter] = useState<string>("all")

  // For promotion dialog
  const [promotionDialogOpen, setPromotionDialogOpen] = useState(false)
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(null)
  const [promotionNotes, setPromotionNotes] = useState("")

  const toggleStatus = (id: string) => {
    setWorkflows(
      workflows.map((workflow) => {
        if (workflow.id === id) {
          return {
            ...workflow,
            status: workflow.status === "active" ? "inactive" : "active",
          }
        }
        return workflow
      }),
    )
  }

  const deleteWorkflow = (id: string) => {
    setWorkflows(workflows.filter((workflow) => workflow.id !== id))
  }

  const duplicateWorkflow = (id: string) => {
    const workflowToDuplicate = workflows.find((workflow) => workflow.id === id)
    if (workflowToDuplicate) {
      const newWorkflow = {
        ...workflowToDuplicate,
        id: Date.now().toString(),
        name: `${workflowToDuplicate.name} (Copy)`,
        status: "inactive" as const,
        createdAt: new Date().toISOString().split("T")[0],
        environment: "DEV" as Environment,
      }
      setWorkflows([...workflows, newWorkflow])
    }
  }

  const openPromotionDialog = (id: string) => {
    setSelectedWorkflowId(id)
    setPromotionNotes("")
    setPromotionDialogOpen(true)
  }

  const getNextEnvironment = (current: Environment): Environment | null => {
    const environments: Environment[] = ["DEV", "ETE", "QA", "PROD"]
    const currentIndex = environments.indexOf(current)

    if (currentIndex < environments.length - 1) {
      return environments[currentIndex + 1]
    }

    return null
  }

  const promoteWorkflow = () => {
    if (!selectedWorkflowId) return

    setWorkflows(
      workflows.map((workflow) => {
        if (workflow.id === selectedWorkflowId) {
          const nextEnv = getNextEnvironment(workflow.environment)

          if (!nextEnv) {
            toast({
              title: "Cannot Promote",
              description: `Workflow is already in ${workflow.environment} environment`,
              variant: "destructive",
            })
            return workflow
          }

          // Increment version based on environment
          let newVersion = workflow.version
          const [major, minor, patch] = workflow.version.split(".").map(Number)

          if (nextEnv === "PROD") {
            // Major version bump for PROD
            newVersion = `${major + 1}.0.0`
          } else if (nextEnv === "QA") {
            // Minor version bump for QA
            newVersion = `${major}.${minor + 1}.0`
          } else {
            // Patch version bump for other environments
            newVersion = `${major}.${minor}.${patch + 1}`
          }

          toast({
            title: "Workflow Promoted",
            description: `${workflow.name} promoted to ${nextEnv} environment with version ${newVersion}`,
          })

          return {
            ...workflow,
            environment: nextEnv,
            version: newVersion,
          }
        }
        return workflow
      }),
    )

    setPromotionDialogOpen(false)
  }

  // Filter workflows based on search query and filters
  const filteredWorkflows = workflows.filter((workflow) => {
    // Search filter
    const matchesSearch =
      searchQuery === "" ||
      workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workflow.description.toLowerCase().includes(searchQuery.toLowerCase())

    // Status filter
    const matchesStatus = statusFilter === "all" || workflow.status === statusFilter

    // Type filter
    const matchesType = typeFilter === "all" || workflow.type === typeFilter

    // Environment filter
    const matchesEnvironment = environmentFilter === "all" || workflow.environment === environmentFilter

    return matchesSearch && matchesStatus && matchesType && matchesEnvironment
  })

  // Get environment badge color
  const getEnvironmentColor = (env: Environment) => {
    switch (env) {
      case "DEV":
        return "bg-slate-500/10 text-slate-500 hover:bg-slate-500/20 border-slate-500/20"
      case "ETE":
        return "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20"
      case "QA":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20"
      case "PROD":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Search workflows..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="standard">Standard</SelectItem>
            <SelectItem value="ai">AI</SelectItem>
          </SelectContent>
        </Select>
        <Select value={environmentFilter} onValueChange={setEnvironmentFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by environment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Environments</SelectItem>
            <SelectItem value="DEV">Development</SelectItem>
            <SelectItem value="ETE">End-to-End Testing</SelectItem>
            <SelectItem value="QA">Quality Assurance</SelectItem>
            <SelectItem value="PROD">Production</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredWorkflows.map((workflow) => (
        <Card key={workflow.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div
              className={`flex items-center border-l-4 ${workflow.type === "ai" ? "border-cyan-500" : "border-[#007A33]"} p-4`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-medium">{workflow.name}</h3>
                  <Badge
                    variant={workflow.status === "active" ? "default" : "outline"}
                    className={workflow.status === "active" ? "bg-[#007A33] hover:bg-[#006128]" : ""}
                  >
                    {workflow.status}
                  </Badge>
                  {workflow.type === "ai" && (
                    <Badge
                      variant="outline"
                      className="bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500/20 border-cyan-500/20"
                    >
                      <Bot className="h-3 w-3 mr-1" />
                      AI
                    </Badge>
                  )}
                  <Badge variant="outline" className={getEnvironmentColor(workflow.environment)}>
                    {workflow.environment}
                  </Badge>
                  <Badge variant="outline">v{workflow.version}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{workflow.description}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    Created: {workflow.createdAt}
                  </div>
                  <div>Last run: {workflow.lastRun}</div>
                  {workflow.folder && (
                    <div className="flex items-center">
                      <Badge variant="outline" className="text-xs">
                        Folder: {workflow.folder}
                      </Badge>
                    </div>
                  )}
                  {workflow.tags && workflow.tags.length > 0 && (
                    <div className="flex items-center gap-1 flex-wrap">
                      {workflow.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => toggleStatus(workflow.id)}
                  title={workflow.status === "active" ? "Deactivate" : "Activate"}
                >
                  {workflow.status === "active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Link href={`/workflows/${workflow.id}`}>
                  <Button variant="outline" size="icon" title="Edit">
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>
                {workflow.environment !== "PROD" && (
                  <Button
                    variant="outline"
                    size="icon"
                    title={`Promote to ${getNextEnvironment(workflow.environment)}`}
                    onClick={() => openPromotionDialog(workflow.id)}
                  >
                    <ArrowUpCircle className="h-4 w-4" />
                  </Button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => duplicateWorkflow(workflow.id)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    {workflow.environment !== "PROD" && (
                      <DropdownMenuItem onClick={() => openPromotionDialog(workflow.id)}>
                        <ArrowUpCircle className="h-4 w-4 mr-2" />
                        Promote to {getNextEnvironment(workflow.environment)}
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => deleteWorkflow(workflow.id)}
                      className="text-red-500 focus:text-red-500"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {filteredWorkflows.length === 0 && (
        <div className="text-center p-8 border rounded-md">
          <p className="text-muted-foreground">No workflows found matching your filters.</p>
        </div>
      )}

      {/* Promotion Dialog */}
      <Dialog open={promotionDialogOpen} onOpenChange={setPromotionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Promote Workflow</DialogTitle>
            <DialogDescription>
              {selectedWorkflowId && (
                <>
                  Promote "{workflows.find((w) => w.id === selectedWorkflowId)?.name}" from{" "}
                  {workflows.find((w) => w.id === selectedWorkflowId)?.environment} to{" "}
                  {getNextEnvironment(workflows.find((w) => w.id === selectedWorkflowId)?.environment as Environment)}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Promotion Notes</h4>
                <Textarea
                  placeholder="Add notes about this promotion (optional)"
                  value={promotionNotes}
                  onChange={(e) => setPromotionNotes(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="text-sm">
                <p className="font-medium">Version Change:</p>
                {selectedWorkflowId && (
                  <p className="text-muted-foreground">
                    {(() => {
                      const workflow = workflows.find((w) => w.id === selectedWorkflowId)
                      if (!workflow) return null

                      const nextEnv = getNextEnvironment(workflow.environment)
                      const [major, minor, patch] = workflow.version.split(".").map(Number)

                      if (nextEnv === "PROD") {
                        return `v${workflow.version} → v${major + 1}.0.0`
                      } else if (nextEnv === "QA") {
                        return `v${workflow.version} → v${major}.${minor + 1}.0`
                      } else {
                        return `v${workflow.version} → v${major}.${minor}.${patch + 1}`
                      }
                    })()}
                  </p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setPromotionDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={promoteWorkflow}>Promote Workflow</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
