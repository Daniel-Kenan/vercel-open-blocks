"use client"

import { DialogTrigger } from "@/components/ui/dialog"

import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  FolderTree,
  FolderPlus,
  FolderEdit,
  FolderX,
  MoreHorizontal,
  Search,
  Workflow,
  Bot,
  ArrowRight,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface Folder {
  id: string
  name: string
  description: string
  workflows: number
  parent: string | null
  createdAt: string
  updatedAt: string
}

interface WorkflowItem {
  id: string
  name: string
  description: string
  type: "standard" | "ai"
  updatedAt: string
  folderId: string
}

export default function FolderManagement() {
  // Add local state and handlers
  const handleCreateFolder = (name: string, description: string, parentId?: string) => {
    console.log(`Creating folder ${name}`)
  }

  const handleUpdateFolder = (id: string, name: string, description: string) => {
    console.log(`Updating folder ${id}`)
  }

  const handleDeleteFolder = (id: string) => {
    console.log(`Deleting folder ${id}`)
  }

  const handleMoveWorkflow = (workflowId: string, folderId: string) => {
    console.log(`Moving workflow ${workflowId} to folder ${folderId}`)
  }

  const handleSelectFolder = (folderId: string) => {
    console.log(`Selected folder ${folderId}`)
  }

  const handleSelectWorkflow = (workflowId: string) => {
    console.log(`Selected workflow ${workflowId}`)
  }

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [newFolderDialogOpen, setNewFolderDialogOpen] = useState(false)
  const [editFolderDialogOpen, setEditFolderDialogOpen] = useState(false)
  const [deleteFolderDialogOpen, setDeleteFolderDialogOpen] = useState(false)
  const [moveWorkflowDialogOpen, setMoveWorkflowDialogOpen] = useState(false)
  const [selectedWorkflowForMove, setSelectedWorkflowForMove] = useState<string | null>(null)
  const [targetFolderForMove, setTargetFolderForMove] = useState<string | null>(null)
  const [newFolderName, setNewFolderName] = useState("")
  const [newFolderDescription, setNewFolderDescription] = useState("")
  const [newFolderParent, setNewFolderParent] = useState<string | null>(null)
  const [editFolderName, setEditFolderName] = useState("")
  const [editFolderDescription, setEditFolderDescription] = useState("")

  // Mock data - would come from API in real app
  const folders: Folder[] = [
    {
      id: "f1",
      name: "Banking",
      description: "Banking automation workflows",
      workflows: 5,
      parent: null,
      createdAt: "2023-05-10",
      updatedAt: "2023-06-15",
    },
    {
      id: "f2",
      name: "Customer Service",
      description: "Customer service automation workflows",
      workflows: 3,
      parent: null,
      createdAt: "2023-05-12",
      updatedAt: "2023-06-10",
    },
    {
      id: "f3",
      name: "Marketing",
      description: "Marketing automation workflows",
      workflows: 2,
      parent: null,
      createdAt: "2023-05-15",
      updatedAt: "2023-06-05",
    },
    {
      id: "f4",
      name: "AI Workflows",
      description: "AI-powered automation workflows",
      workflows: 4,
      parent: null,
      createdAt: "2023-05-20",
      updatedAt: "2023-06-20",
    },
    {
      id: "f5",
      name: "Transaction Processing",
      description: "Transaction processing workflows",
      workflows: 2,
      parent: "f1",
      createdAt: "2023-05-25",
      updatedAt: "2023-06-18",
    },
    {
      id: "f6",
      name: "Account Management",
      description: "Account management workflows",
      workflows: 3,
      parent: "f1",
      createdAt: "2023-05-28",
      updatedAt: "2023-06-12",
    },
  ]

  const workflows: WorkflowItem[] = [
    {
      id: "w1",
      name: "Customer Onboarding",
      description: "Process new customer applications and send welcome emails",
      type: "standard",
      updatedAt: "2023-06-15",
      folderId: "f1",
    },
    {
      id: "w2",
      name: "Transaction Monitoring",
      description: "Monitor transactions for suspicious activity",
      type: "standard",
      updatedAt: "2023-06-14",
      folderId: "f5",
    },
    {
      id: "w3",
      name: "Account Reconciliation",
      description: "Daily account reconciliation process",
      type: "standard",
      updatedAt: "2023-06-10",
      folderId: "f6",
    },
    {
      id: "w4",
      name: "AI Data Processing",
      description: "Process data from Google Sheets using AI models",
      type: "ai",
      updatedAt: "2023-06-20",
      folderId: "f4",
    },
    {
      id: "w5",
      name: "Customer Support AI",
      description: "AI-powered customer support response generation",
      type: "ai",
      updatedAt: "2023-06-18",
      folderId: "f4",
    },
    {
      id: "w6",
      name: "Email Campaign",
      description: "Automated email campaign workflow",
      type: "standard",
      updatedAt: "2023-06-05",
      folderId: "f3",
    },
  ]

  // Filter folders and workflows based on search query
  const filteredFolders = searchQuery
    ? folders.filter(
        (folder) =>
          folder.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          folder.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : folders

  const filteredWorkflows = searchQuery
    ? workflows.filter(
        (workflow) =>
          workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          workflow.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : workflows

  // Get top-level folders
  const topLevelFolders = filteredFolders.filter((folder) => folder.parent === null)

  // Get child folders for a parent folder
  const getChildFolders = (parentId: string) => {
    return filteredFolders.filter((folder) => folder.parent === parentId)
  }

  // Get workflows for a folder
  const getFolderWorkflows = (folderId: string) => {
    return filteredWorkflows.filter((workflow) => workflow.folderId === folderId)
  }

  const handleCreateFolderInternal = () => {
    if (newFolderName.trim()) {
      handleCreateFolder(newFolderName, newFolderDescription, newFolderParent)
      setNewFolderDialogOpen(false)
      setNewFolderName("")
      setNewFolderDescription("")
      setNewFolderParent(null)
      toast({
        title: "Folder Created",
        description: `Folder "${newFolderName}" created successfully`,
      })
    }
  }

  const handleEditFolderInternal = () => {
    if (selectedFolder && editFolderName.trim()) {
      handleUpdateFolder(selectedFolder, editFolderName, editFolderDescription)
      setEditFolderDialogOpen(false)
      setEditFolderName("")
      setEditFolderDescription("")
      toast({
        title: "Folder Updated",
        description: `Folder "${editFolderName}" updated successfully`,
      })
    }
  }

  const handleDeleteFolderInternal = () => {
    if (selectedFolder) {
      const folder = folders.find((f) => f.id === selectedFolder)
      handleDeleteFolder(selectedFolder)
      setDeleteFolderDialogOpen(false)
      setSelectedFolder(null)
      toast({
        title: "Folder Deleted",
        description: `Folder "${folder?.name}" deleted successfully`,
      })
    }
  }

  const handleMoveWorkflowInternal = () => {
    if (selectedWorkflowForMove && targetFolderForMove) {
      const workflow = workflows.find((w) => w.id === selectedWorkflowForMove)
      const folder = folders.find((f) => f.id === targetFolderForMove)
      handleMoveWorkflow(selectedWorkflowForMove, targetFolderForMove)
      setMoveWorkflowDialogOpen(false)
      setSelectedWorkflowForMove(null)
      setTargetFolderForMove(null)
      toast({
        title: "Workflow Moved",
        description: `Workflow "${workflow?.name}" moved to "${folder?.name}"`,
      })
    }
  }

  const handleSelectEditFolder = (folder: Folder) => {
    setSelectedFolder(folder.id)
    setEditFolderName(folder.name)
    setEditFolderDescription(folder.description)
    setEditFolderDialogOpen(true)
  }

  const handleSelectDeleteFolder = (folderId: string) => {
    setSelectedFolder(folderId)
    setDeleteFolderDialogOpen(true)
  }

  const handleSelectMoveWorkflow = (workflowId: string) => {
    setSelectedWorkflowForMove(workflowId)
    setMoveWorkflowDialogOpen(true)
  }

  const renderFolder = (folder: Folder) => {
    const childFolders = getChildFolders(folder.id)
    const folderWorkflows = getFolderWorkflows(folder.id)

    return (
      <div key={folder.id} className="mb-4">
        <div
          className="flex items-center justify-between p-3 rounded-md border hover:bg-accent cursor-pointer"
          onClick={() => handleSelectFolder(folder.id)}
        >
          <div className="flex items-center gap-2">
            <FolderTree className="h-5 w-5 text-[#007A33]" />
            <div>
              <div className="font-medium">{folder.name}</div>
              <div className="text-xs text-muted-foreground">{folder.description}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{folder.workflows}</Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleSelectEditFolder(folder)}>
                  <FolderEdit className="h-4 w-4 mr-2" />
                  Edit Folder
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setNewFolderParent(folder.id) || setNewFolderDialogOpen(true)}>
                  <FolderPlus className="h-4 w-4 mr-2" />
                  Add Subfolder
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleSelectDeleteFolder(folder.id)}
                  className="text-red-500 focus:text-red-500"
                >
                  <FolderX className="h-4 w-4 mr-2" />
                  Delete Folder
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Child folders */}
        {childFolders.length > 0 && (
          <div className="ml-6 mt-2 border-l pl-4">{childFolders.map((childFolder) => renderFolder(childFolder))}</div>
        )}

        {/* Workflows in this folder */}
        {folderWorkflows.length > 0 && (
          <div className="ml-6 mt-2 border-l pl-4 space-y-2">
            {folderWorkflows.map((workflow) => (
              <div
                key={workflow.id}
                className="flex items-center justify-between p-2 rounded-md border hover:bg-accent cursor-pointer"
                onClick={() => handleSelectWorkflow(workflow.id)}
              >
                <div className="flex items-center gap-2">
                  {workflow.type === "ai" ? (
                    <Bot className="h-4 w-4 text-cyan-500" />
                  ) : (
                    <Workflow className="h-4 w-4 text-blue-500" />
                  )}
                  <div>
                    <div className="text-sm font-medium">{workflow.name}</div>
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
                    <DropdownMenuItem onClick={() => handleSelectMoveWorkflow(workflow.id)}>
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Move Workflow
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold">Folder Management</h2>
        <Dialog open={newFolderDialogOpen} onOpenChange={setNewFolderDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <FolderPlus className="h-4 w-4 mr-2" />
              New Folder
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Folder</DialogTitle>
              <DialogDescription>Create a new folder to organize your workflows.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="folder-name">Folder Name</Label>
                <Input
                  id="folder-name"
                  placeholder="My Folder"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="folder-description">Description</Label>
                <Input
                  id="folder-description"
                  placeholder="Folder description"
                  value={newFolderDescription}
                  onChange={(e) => setNewFolderDescription(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parent-folder">Parent Folder (Optional)</Label>
                <select
                  id="parent-folder"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={newFolderParent || ""}
                  onChange={(e) => setNewFolderParent(e.target.value || null)}
                >
                  <option value="">None (Top Level)</option>
                  {folders.map((folder) => (
                    <option key={folder.id} value={folder.id}>
                      {folder.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewFolderDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateFolderInternal} disabled={!newFolderName.trim()}>
                Create Folder
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search folders and workflows..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">{topLevelFolders.map((folder) => renderFolder(folder))}</div>
      </ScrollArea>

      {/* Edit Folder Dialog */}
      <Dialog open={editFolderDialogOpen} onOpenChange={setEditFolderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Folder</DialogTitle>
            <DialogDescription>Update folder details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-folder-name">Folder Name</Label>
              <Input id="edit-folder-name" value={editFolderName} onChange={(e) => setEditFolderName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-folder-description">Description</Label>
              <Input
                id="edit-folder-description"
                value={editFolderDescription}
                onChange={(e) => setEditFolderDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditFolderDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditFolderInternal} disabled={!editFolderName.trim()}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Folder Dialog */}
      <Dialog open={deleteFolderDialogOpen} onOpenChange={setDeleteFolderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Folder</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this folder? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              All workflows in this folder will be moved to the parent folder or root level.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteFolderDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteFolderInternal}>
              Delete Folder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Move Workflow Dialog */}
      <Dialog open={moveWorkflowDialogOpen} onOpenChange={setMoveWorkflowDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Move Workflow</DialogTitle>
            <DialogDescription>Select a destination folder for this workflow.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="target-folder">Destination Folder</Label>
              <select
                id="target-folder"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={targetFolderForMove || ""}
                onChange={(e) => setTargetFolderForMove(e.target.value)}
              >
                <option value="" disabled>
                  Select a folder
                </option>
                {folders.map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMoveWorkflowDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleMoveWorkflowInternal} disabled={!targetFolderForMove}>
              Move Workflow
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
