"use client"

import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Link2,
  Plus,
  Trash2,
  MoreHorizontal,
  Search,
  Workflow,
  Bot,
  ArrowRight,
  ArrowDown,
  GitMerge,
  GitBranch,
  ExternalLink,
} from "lucide-react"

interface WorkflowItem {
  id: string
  name: string
  description: string
  type: "standard" | "ai"
  updatedAt: string
  dependencies: string[]
  subworkflows: string[]
}

export default function WorkflowDependencies() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null)
  const [addDependencyDialogOpen, setAddDependencyDialogOpen] = useState(false)
  const [addSubworkflowDialogOpen, setAddSubworkflowDialogOpen] = useState(false)
  const [dependencyGraphDialogOpen, setDependencyGraphDialogOpen] = useState(false)

  // Add local state and handlers
  const handleAddDependency = (workflowId: string, dependencyId: string) => {
    console.log(`Adding dependency ${dependencyId} to workflow ${workflowId}`)
  }

  const handleRemoveDependency = (workflowId: string, dependencyId: string) => {
    console.log(`Removing dependency ${dependencyId} from workflow ${workflowId}`)
  }

  const handleAddSubworkflow = (workflowId: string, subworkflowId: string) => {
    console.log(`Adding subworkflow ${subworkflowId} to workflow ${workflowId}`)
  }

  const handleRemoveSubworkflow = (workflowId: string, subworkflowId: string) => {
    console.log(`Removing subworkflow ${subworkflowId} from workflow ${workflowId}`)
  }

  const handleSelectWorkflow = (workflowId: string) => {
    console.log(`Selected workflow ${workflowId}`)
  }

  // Mock data - would come from API in real app
  const workflows: WorkflowItem[] = [
    {
      id: "w1",
      name: "Customer Onboarding",
      description: "Process new customer applications and send welcome emails",
      type: "standard",
      updatedAt: "2023-06-15",
      dependencies: ["w3"],
      subworkflows: ["w6"],
    },
    {
      id: "w2",
      name: "Transaction Monitoring",
      description: "Monitor transactions for suspicious activity",
      type: "standard",
      updatedAt: "2023-06-14",
      dependencies: [],
      subworkflows: [],
    },
    {
      id: "w3",
      name: "Account Reconciliation",
      description: "Daily account reconciliation process",
      type: "standard",
      updatedAt: "2023-06-10",
      dependencies: ["w2"],
      subworkflows: [],
    },
    {
      id: "w4",
      name: "AI Data Processing",
      description: "Process data from Google Sheets using AI models",
      type: "ai",
      updatedAt: "2023-06-20",
      dependencies: [],
      subworkflows: ["w5"],
    },
    {
      id: "w5",
      name: "Customer Support AI",
      description: "AI-powered customer support response generation",
      type: "ai",
      updatedAt: "2023-06-18",
      dependencies: [],
      subworkflows: [],
    },
    {
      id: "w6",
      name: "Email Campaign",
      description: "Automated email campaign workflow",
      type: "standard",
      updatedAt: "2023-06-05",
      dependencies: [],
      subworkflows: [],
    },
  ]

  // Filter workflows based on search query
  const filteredWorkflows = searchQuery
    ? workflows.filter(
        (workflow) =>
          workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          workflow.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : workflows

  // Get workflow by ID
  const getWorkflow = (id: string) => {
    return workflows.find((w) => w.id === id)
  }

  // Get dependencies for a workflow
  const getWorkflowDependencies = (workflowId: string) => {
    const workflow = getWorkflow(workflowId)
    if (!workflow) return []
    return workflow.dependencies.map((id) => getWorkflow(id)).filter(Boolean) as WorkflowItem[]
  }

  // Get subworkflows for a workflow
  const getWorkflowSubworkflows = (workflowId: string) => {
    const workflow = getWorkflow(workflowId)
    if (!workflow) return []
    return workflow.subworkflows.map((id) => getWorkflow(id)).filter(Boolean) as WorkflowItem[]
  }

  // Get workflows that depend on this workflow
  const getDependentWorkflows = (workflowId: string) => {
    return workflows.filter((w) => w.dependencies.includes(workflowId))
  }

  // Get workflows that use this workflow as a subworkflow
  const getParentWorkflows = (workflowId: string) => {
    return workflows.filter((w) => w.subworkflows.includes(workflowId))
  }

  // Get available workflows for dependencies (workflows that are not already dependencies and not the workflow itself)
  const getAvailableDependencies = (workflowId: string) => {
    const workflow = getWorkflow(workflowId)
    if (!workflow) return []

    // Check for circular dependencies
    const wouldCreateCircular = (dependencyId: string): boolean => {
      // If the potential dependency already depends on this workflow, it would create a circular dependency
      const potentialDependency = getWorkflow(dependencyId)
      if (!potentialDependency) return false

      // Direct circular dependency
      if (potentialDependency.dependencies.includes(workflowId)) return true

      // Check for indirect circular dependencies
      return potentialDependency.dependencies.some((id) => wouldCreateCircular(id))
    }

    return workflows.filter(
      (w) => w.id !== workflowId && !workflow.dependencies.includes(w.id) && !wouldCreateCircular(w.id),
    )
  }

  // Get available workflows for subworkflows (workflows that are not already subworkflows and not the workflow itself)
  const getAvailableSubworkflows = (workflowId: string) => {
    const workflow = getWorkflow(workflowId)
    if (!workflow) return []

    // Check for circular subworkflow references
    const wouldCreateCircular = (subworkflowId: string): boolean => {
      // If the potential subworkflow already includes this workflow as a subworkflow, it would create a circular reference
      const potentialSubworkflow = getWorkflow(subworkflowId)
      if (!potentialSubworkflow) return false

      // Direct circular reference
      if (potentialSubworkflow.subworkflows.includes(workflowId)) return true

      // Check for indirect circular references
      return potentialSubworkflow.subworkflows.some((id) => wouldCreateCircular(id))
    }

    return workflows.filter(
      (w) => w.id !== workflowId && !workflow.subworkflows.includes(w.id) && !wouldCreateCircular(w.id),
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold">Workflow Dependencies</h2>
        <Button onClick={() => setDependencyGraphDialogOpen(true)}>
          <GitBranch className="h-4 w-4 mr-2" />
          View Dependency Graph
        </Button>
      </div>

      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search workflows..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {filteredWorkflows.map((workflow) => (
            <div
              key={workflow.id}
              className="rounded-md border hover:bg-accent cursor-pointer"
              onClick={() => handleSelectWorkflow(workflow.id)}
            >
              <div className="p-3 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {workflow.type === "ai" ? (
                      <Bot className="h-4 w-4 text-cyan-500" />
                    ) : (
                      <Workflow className="h-4 w-4 text-blue-500" />
                    )}
                    <div>
                      <div className="font-medium">{workflow.name}</div>
                      <div className="text-xs text-muted-foreground">Updated: {workflow.updatedAt}</div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedWorkflow(workflow.id)
                          setAddDependencyDialogOpen(true)
                        }}
                      >
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Add Dependency
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedWorkflow(workflow.id)
                          setAddSubworkflowDialogOpen(true)
                        }}
                      >
                        <ArrowDown className="h-4 w-4 mr-2" />
                        Add Subworkflow
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="p-3 border-b">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                  <ArrowRight className="h-3.5 w-3.5" />
                  Dependencies
                </h4>
                <div className="flex flex-wrap gap-2">
                  {getWorkflowDependencies(workflow.id).map((dependency) => (
                    <Badge key={dependency.id} variant="outline" className="flex items-center gap-1">
                      {dependency.type === "ai" ? (
                        <Bot className="h-3 w-3 text-cyan-500" />
                      ) : (
                        <Workflow className="h-3 w-3 text-blue-500" />
                      )}
                      {dependency.name}
                      <button
                        className="ml-1 hover:bg-background/20 rounded-full"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveDependency(workflow.id, dependency.id)
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  {getWorkflowDependencies(workflow.id).length === 0 && (
                    <span className="text-xs text-muted-foreground">No dependencies</span>
                  )}
                </div>
              </div>

              <div className="p-3 border-b">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                  <ArrowDown className="h-3.5 w-3.5" />
                  Subworkflows
                </h4>
                <div className="flex flex-wrap gap-2">
                  {getWorkflowSubworkflows(workflow.id).map((subworkflow) => (
                    <Badge key={subworkflow.id} variant="outline" className="flex items-center gap-1">
                      {subworkflow.type === "ai" ? (
                        <Bot className="h-3 w-3 text-cyan-500" />
                      ) : (
                        <Workflow className="h-3 w-3 text-blue-500" />
                      )}
                      {subworkflow.name}
                      <button
                        className="ml-1 hover:bg-background/20 rounded-full"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveSubworkflow(workflow.id, subworkflow.id)
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  {getWorkflowSubworkflows(workflow.id).length === 0 && (
                    <span className="text-xs text-muted-foreground">No subworkflows</span>
                  )}
                </div>
              </div>

              <div className="p-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                      <Link2 className="h-3.5 w-3.5 rotate-180" />
                      Used by
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {getDependentWorkflows(workflow.id).map((dependent) => (
                        <Badge key={dependent.id} variant="outline" className="flex items-center gap-1">
                          {dependent.type === "ai" ? (
                            <Bot className="h-3 w-3 text-cyan-500" />
                          ) : (
                            <Workflow className="h-3 w-3 text-blue-500" />
                          )}
                          {dependent.name}
                        </Badge>
                      ))}
                      {getDependentWorkflows(workflow.id).length === 0 && (
                        <span className="text-xs text-muted-foreground">Not used by any workflow</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                      <GitMerge className="h-3.5 w-3.5" />
                      Parent workflows
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {getParentWorkflows(workflow.id).map((parent) => (
                        <Badge key={parent.id} variant="outline" className="flex items-center gap-1">
                          {parent.type === "ai" ? (
                            <Bot className="h-3 w-3 text-cyan-500" />
                          ) : (
                            <Workflow className="h-3 w-3 text-blue-500" />
                          )}
                          {parent.name}
                        </Badge>
                      ))}
                      {getParentWorkflows(workflow.id).length === 0 && (
                        <span className="text-xs text-muted-foreground">Not used as a subworkflow</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Add Dependency Dialog */}
      <Dialog open={addDependencyDialogOpen} onOpenChange={setAddDependencyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Dependency</DialogTitle>
            <DialogDescription>
              Select a workflow that "{getWorkflow(selectedWorkflow || "")?.name}" will depend on.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              {selectedWorkflow &&
                getAvailableDependencies(selectedWorkflow).map((workflow) => (
                  <div
                    key={workflow.id}
                    className="flex items-center justify-between p-3 rounded-md border hover:bg-accent cursor-pointer"
                    onClick={() => {
                      handleAddDependency(selectedWorkflow, workflow.id)
                      setAddDependencyDialogOpen(false)
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {workflow.type === "ai" ? (
                        <Bot className="h-4 w-4 text-cyan-500" />
                      ) : (
                        <Workflow className="h-4 w-4 text-blue-500" />
                      )}
                      <div>
                        <div className="font-medium">{workflow.name}</div>
                        <div className="text-xs text-muted-foreground">{workflow.description}</div>
                      </div>
                    </div>
                    <Plus className="h-4 w-4" />
                  </div>
                ))}
              {selectedWorkflow && getAvailableDependencies(selectedWorkflow).length === 0 && (
                <div className="text-center p-4 text-muted-foreground">
                  No available workflows to add as dependencies.
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDependencyDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Subworkflow Dialog */}
      <Dialog open={addSubworkflowDialogOpen} onOpenChange={setAddSubworkflowDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Subworkflow</DialogTitle>
            <DialogDescription>
              Select a workflow to add as a subworkflow to "{getWorkflow(selectedWorkflow || "")?.name}".
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              {selectedWorkflow &&
                getAvailableSubworkflows(selectedWorkflow).map((workflow) => (
                  <div
                    key={workflow.id}
                    className="flex items-center justify-between p-3 rounded-md border hover:bg-accent cursor-pointer"
                    onClick={() => {
                      handleAddSubworkflow(selectedWorkflow, workflow.id)
                      setAddSubworkflowDialogOpen(false)
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {workflow.type === "ai" ? (
                        <Bot className="h-4 w-4 text-cyan-500" />
                      ) : (
                        <Workflow className="h-4 w-4 text-blue-500" />
                      )}
                      <div>
                        <div className="font-medium">{workflow.name}</div>
                        <div className="text-xs text-muted-foreground">{workflow.description}</div>
                      </div>
                    </div>
                    <Plus className="h-4 w-4" />
                  </div>
                ))}
              {selectedWorkflow && getAvailableSubworkflows(selectedWorkflow).length === 0 && (
                <div className="text-center p-4 text-muted-foreground">
                  No available workflows to add as subworkflows.
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddSubworkflowDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dependency Graph Dialog */}
      <Dialog open={dependencyGraphDialogOpen} onOpenChange={setDependencyGraphDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Workflow Dependency Graph</DialogTitle>
            <DialogDescription>Visual representation of workflow dependencies and relationships.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="border rounded-md p-4 h-[500px] flex items-center justify-center">
              <div className="text-center">
                <GitBranch className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Dependency graph visualization would be rendered here.</p>
                <p className="text-xs text-muted-foreground mt-2">
                  This would typically use a graph visualization library like D3.js or Cytoscape.js
                </p>
                <Button variant="outline" className="mt-4">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in Full Screen
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setDependencyGraphDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
