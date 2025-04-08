"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { History, GitBranch, GitMerge, Clock, GitCommit, GitCompare, ChevronRight, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import VersionHistoryPanel from "@/components/version-control/version-history-panel"
import VersionComparison from "@/components/version-control/version-comparison"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"

interface VersionControlPanelProps {
  workflowId: string
  workflowName: string
}

export default function VersionControlPanel({ workflowId, workflowName }: VersionControlPanelProps) {
  const [activeTab, setActiveTab] = useState("history")
  const [comparisonDialogOpen, setComparisonDialogOpen] = useState(false)
  const [compareVersions, setCompareVersions] = useState<{
    version1: { id: string; number: string; createdAt: string; author: string }
    version2: { id: string; number: string; createdAt: string; author: string }
  } | null>(null)
  const [commitDialogOpen, setCommitDialogOpen] = useState(false)
  const [hasUncommittedChanges, setHasUncommittedChanges] = useState(true)

  const handleRestore = (versionId: string) => {
    // In a real app, this would call an API to restore the workflow to this version
    console.log(`Restoring workflow to version ${versionId}`)
    toast({
      title: "Version Restored",
      description: `Workflow restored to version ${versionId}`,
    })
  }

  const handleCompare = (versionId1: string, versionId2: string) => {
    // Mock data for the comparison
    const version1 = {
      id: versionId1,
      number: "0.8",
      createdAt: "2023-06-13 11:20",
      author: "John Doe",
    }

    const version2 = {
      id: versionId2,
      number: "1.0",
      createdAt: "2023-06-15 14:30",
      author: "John Doe",
    }

    setCompareVersions({ version1, version2 })
    setComparisonDialogOpen(true)
  }

  const handleCreateBranch = (name: string, description: string, basedOn: string) => {
    // In a real app, this would call an API to create a new branch
    console.log(`Creating branch ${name} based on ${basedOn}`)
    toast({
      title: "Branch Created",
      description: `Branch "${name}" created successfully`,
    })
  }

  const handleMergeBranch = (branchId: string, targetBranchId: string) => {
    // In a real app, this would call an API to merge branches
    console.log(`Merging branch ${branchId} into ${targetBranchId}`)
    toast({
      title: "Branch Merged",
      description: `Branch merged successfully`,
    })
  }

  const handleSwitchBranch = (branchId: string) => {
    // In a real app, this would call an API to switch to a different branch
    console.log(`Switching to branch ${branchId}`)
    toast({
      title: "Branch Switched",
      description: `Switched to branch successfully`,
    })
  }

  const handleCommitChanges = () => {
    // In a real app, this would call an API to commit changes
    console.log("Committing changes")
    setCommitDialogOpen(false)
    setHasUncommittedChanges(false)
    toast({
      title: "Changes Committed",
      description: "Your changes have been committed successfully",
    })
  }

  return (
    <div className="h-full flex flex-col bg-background border rounded-md shadow-sm">
      <div className="p-4 border-b flex justify-between items-center bg-muted/30">
        <div className="flex items-center gap-3">
          <GitBranch className="h-5 w-5 text-primary" />
          <div>
            <h2 className="text-lg font-semibold flex items-center">
              Version Control
              {hasUncommittedChanges && (
                <Badge variant="outline" className="ml-2 bg-amber-500/10 text-amber-600 border-amber-200">
                  <Clock className="h-3 w-3 mr-1" />
                  Uncommitted Changes
                </Badge>
              )}
            </h2>
            <p className="text-sm text-muted-foreground">
              Current branch: <span className="font-medium">main</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className={hasUncommittedChanges ? "border-amber-200 text-amber-700 hover:bg-amber-50" : ""}
            onClick={() => setCommitDialogOpen(true)}
          >
            <GitCommit className="h-4 w-4 mr-2" />
            {hasUncommittedChanges ? "Commit Changes" : "Create Commit"}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <GitBranch className="h-4 w-4 mr-2" />
                Create Branch
              </DropdownMenuItem>
              <DropdownMenuItem>
                <GitMerge className="h-4 w-4 mr-2" />
                Merge Branch
              </DropdownMenuItem>
              <DropdownMenuItem>
                <GitCompare className="h-4 w-4 mr-2" />
                Compare Versions
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="px-4 pt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="history">
              <History className="h-4 w-4 mr-2" />
              History
            </TabsTrigger>
            <TabsTrigger value="branches">
              <GitBranch className="h-4 w-4 mr-2" />
              Branches
            </TabsTrigger>
            <TabsTrigger value="changes">
              <GitCompare className="h-4 w-4 mr-2" />
              Changes
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="history" className="flex-1 p-4 pt-0">
          <VersionHistoryPanel
            workflowId={workflowId}
            workflowName={workflowName}
            onRestore={handleRestore}
            onCompare={handleCompare}
            onCreateBranch={handleCreateBranch}
            onMergeBranch={handleMergeBranch}
            onSwitchBranch={handleSwitchBranch}
          />
        </TabsContent>

        <TabsContent value="branches" className="flex-1 p-4 pt-0">
          <VersionHistoryPanel
            workflowId={workflowId}
            workflowName={workflowName}
            onRestore={handleRestore}
            onCompare={handleCompare}
            onCreateBranch={handleCreateBranch}
            onMergeBranch={handleMergeBranch}
            onSwitchBranch={handleSwitchBranch}
          />
        </TabsContent>

        <TabsContent value="changes" className="flex-1 p-4 pt-0">
          <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium">Uncommitted Changes</h3>
              <Button size="sm" variant="default" onClick={handleCommitChanges}>
                <GitCommit className="h-3.5 w-3.5 mr-2" />
                Commit
              </Button>
            </div>

            <div className="border rounded-md flex-1 overflow-hidden">
              <div className="bg-muted/50 p-2 border-b flex justify-between items-center">
                <span className="text-sm font-medium">Modified Files</span>
                <Badge variant="outline">{hasUncommittedChanges ? 3 : 0}</Badge>
              </div>

              {hasUncommittedChanges ? (
                <div className="p-2 space-y-2">
                  <div className="p-2 rounded-md hover:bg-accent flex items-center justify-between cursor-pointer">
                    <div className="flex items-center">
                      <Badge className="mr-2 bg-amber-500/10 text-amber-600 border-amber-200">Modified</Badge>
                      <span>workflow-config.json</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>

                  <div className="p-2 rounded-md hover:bg-accent flex items-center justify-between cursor-pointer">
                    <div className="flex items-center">
                      <Badge className="mr-2 bg-green-500/10 text-green-600 border-green-200">Added</Badge>
                      <span>email-template.html</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>

                  <div className="p-2 rounded-md hover:bg-accent flex items-center justify-between cursor-pointer">
                    <div className="flex items-center">
                      <Badge className="mr-2 bg-red-500/10 text-red-600 border-red-200">Removed</Badge>
                      <span>old-node-config.json</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-muted-foreground">
                  <p>No uncommitted changes</p>
                  <p className="text-sm mt-1">Make changes to your workflow to see them here</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Version Comparison Dialog */}
      <Dialog open={comparisonDialogOpen} onOpenChange={setComparisonDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          {compareVersions && (
            <VersionComparison
              version1={compareVersions.version1}
              version2={compareVersions.version2}
              onClose={() => setComparisonDialogOpen(false)}
              onRestore={handleRestore}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Commit Dialog */}
      <Dialog open={commitDialogOpen} onOpenChange={setCommitDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Commit Changes</h2>
              <p className="text-sm text-muted-foreground">Save your changes with a descriptive message</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="commit-message" className="text-sm font-medium">
                Commit Message
              </label>
              <textarea
                id="commit-message"
                className="w-full min-h-[100px] p-2 border rounded-md"
                placeholder="Describe your changes..."
              />
            </div>

            <div className="border rounded-md">
              <div className="bg-muted/50 p-2 border-b">
                <span className="text-sm font-medium">Files to be committed</span>
              </div>
              <div className="p-2 max-h-[200px] overflow-y-auto space-y-1">
                <div className="text-sm flex items-center">
                  <Badge className="mr-2 bg-amber-500/10 text-amber-600 border-amber-200">M</Badge>
                  <span>workflow-config.json</span>
                </div>
                <div className="text-sm flex items-center">
                  <Badge className="mr-2 bg-green-500/10 text-green-600 border-green-200">A</Badge>
                  <span>email-template.html</span>
                </div>
                <div className="text-sm flex items-center">
                  <Badge className="mr-2 bg-red-500/10 text-red-600 border-red-200">D</Badge>
                  <span>old-node-config.json</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCommitDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCommitChanges}>
                <GitCommit className="h-4 w-4 mr-2" />
                Commit Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
