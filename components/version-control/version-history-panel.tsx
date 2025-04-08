"use client"

import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  GitBranch,
  GitMerge,
  Save,
  Clock,
  ChevronDown,
  ChevronRight,
  GitCommit,
  Calendar,
  User,
  Info,
  Tag,
  Search,
  Filter,
  CheckCircle2,
} from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Version {
  id: string
  number: string
  createdAt: string
  author: string
  changes: string
  isCurrent: boolean
  branch: string
  commitHash: string
  tags?: string[]
}

interface Branch {
  id: string
  name: string
  lastUpdated: string
  author: string
  isCurrent: boolean
  description: string
  commits: number
  basedOn: string
  protected?: boolean
}

interface VersionHistoryPanelProps {
  workflowId: string
  workflowName: string
  onRestore: (versionId: string) => void
  onCompare: (versionId1: string, versionId2: string) => void
  onCreateBranch: (name: string, description: string, basedOn: string) => void
  onMergeBranch: (branchId: string, targetBranchId: string) => void
  onSwitchBranch: (branchId: string) => void
}

export default function VersionHistoryPanel({
  workflowId,
  workflowName,
  onRestore,
  onCompare,
  onCreateBranch,
  onMergeBranch,
  onSwitchBranch,
}: VersionHistoryPanelProps) {
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null)
  const [compareVersion, setCompareVersion] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("history")
  const [newBranchDialogOpen, setNewBranchDialogOpen] = useState(false)
  const [mergeBranchDialogOpen, setMergeBranchDialogOpen] = useState(false)
  const [selectedBranchForMerge, setSelectedBranchForMerge] = useState<string | null>(null)
  const [targetBranchForMerge, setTargetBranchForMerge] = useState<string>("main")
  const [newBranchName, setNewBranchName] = useState("")
  const [newBranchDescription, setNewBranchDescription] = useState("")
  const [baseBranch, setBaseBranch] = useState("main")
  const [expandedCommits, setExpandedCommits] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [showVersionDetails, setShowVersionDetails] = useState<string | null>(null)
  const [timelineView, setTimelineView] = useState(false)

  // Mock data - would come from API in real app
  const versions: Version[] = [
    {
      id: "v10",
      number: "1.0",
      createdAt: "2023-06-15 14:30",
      author: "John Doe",
      changes: "Initial version",
      isCurrent: true,
      branch: "main",
      commitHash: "8f7d3b2",
      tags: ["release", "stable"],
    },
    {
      id: "v9",
      number: "0.9",
      createdAt: "2023-06-14 16:45",
      author: "Jane Smith",
      changes: "Added error handling to transaction monitoring",
      isCurrent: false,
      branch: "main",
      commitHash: "3e5a1c9",
      tags: ["beta"],
    },
    {
      id: "v8",
      number: "0.8",
      createdAt: "2023-06-13 11:20",
      author: "John Doe",
      changes: "Implemented AI data processing node",
      isCurrent: false,
      branch: "feature-ai",
      commitHash: "2b7f9d4",
    },
    {
      id: "v7",
      number: "0.7",
      createdAt: "2023-06-12 09:15",
      author: "Sarah Johnson",
      changes: "Added email notification step",
      isCurrent: false,
      branch: "main",
      commitHash: "5c8e2a1",
    },
    {
      id: "v6",
      number: "0.6",
      createdAt: "2023-06-10 15:30",
      author: "John Doe",
      changes: "Fixed conditional logic bug",
      isCurrent: false,
      branch: "main",
      commitHash: "9d6f3b5",
    },
  ]

  const branches: Branch[] = [
    {
      id: "main",
      name: "main",
      lastUpdated: "2023-06-15 14:30",
      author: "John Doe",
      isCurrent: true,
      description: "Main production branch",
      commits: 15,
      basedOn: "",
      protected: true,
    },
    {
      id: "feature-ai",
      name: "feature/ai-integration",
      lastUpdated: "2023-06-13 11:20",
      author: "John Doe",
      isCurrent: false,
      description: "Adding AI capabilities to the workflow",
      commits: 7,
      basedOn: "main",
    },
    {
      id: "experimental",
      name: "experimental",
      lastUpdated: "2023-06-10 15:30",
      author: "Sarah Johnson",
      isCurrent: false,
      description: "Testing new workflow patterns",
      commits: 4,
      basedOn: "main",
    },
  ]

  // Group versions by branch
  const versionsByBranch = versions.reduce(
    (acc, version) => {
      if (!acc[version.branch]) {
        acc[version.branch] = []
      }
      acc[version.branch].push(version)
      return acc
    },
    {} as Record<string, Version[]>,
  )

  // Filter versions based on search query, selected branch, and selected tag
  const filteredVersions = versions.filter((version) => {
    const matchesSearch =
      searchQuery === "" ||
      version.changes.toLowerCase().includes(searchQuery.toLowerCase()) ||
      version.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      version.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      version.commitHash.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesBranch = selectedBranch === null || version.branch === selectedBranch

    const matchesTag = selectedTag === null || (version.tags && version.tags.includes(selectedTag))

    return matchesSearch && matchesBranch && matchesTag
  })

  // Get all unique tags from versions
  const allTags = versions.reduce((tags, version) => {
    if (version.tags) {
      version.tags.forEach((tag) => {
        if (!tags.includes(tag)) {
          tags.push(tag)
        }
      })
    }
    return tags
  }, [] as string[])

  const handleRestore = () => {
    if (selectedVersion) {
      onRestore(selectedVersion)
      toast({
        title: "Version Restored",
        description: `Workflow restored to version ${versions.find((v) => v.id === selectedVersion)?.number}`,
      })
    }
  }

  const handleCompare = () => {
    if (selectedVersion && compareVersion) {
      onCompare(selectedVersion, compareVersion)
      toast({
        title: "Comparing Versions",
        description: `Comparing versions ${versions.find((v) => v.id === selectedVersion)?.number} and ${versions.find((v) => v.id === compareVersion)?.number}`,
      })
    }
  }

  const handleSelectVersion = (versionId: string) => {
    if (selectedVersion === versionId) {
      setSelectedVersion(null)
    } else {
      setSelectedVersion(versionId)
    }
  }

  const handleSelectCompareVersion = (versionId: string) => {
    if (compareVersion === versionId) {
      setCompareVersion(null)
    } else {
      setCompareVersion(versionId)
    }
  }

  const handleCreateBranch = () => {
    if (newBranchName.trim()) {
      onCreateBranch(newBranchName, newBranchDescription, baseBranch)
      setNewBranchDialogOpen(false)
      setNewBranchName("")
      setNewBranchDescription("")
      toast({
        title: "Branch Created",
        description: `New branch "${newBranchName}" created successfully`,
      })
    }
  }

  const handleMergeBranch = () => {
    if (selectedBranchForMerge && targetBranchForMerge) {
      onMergeBranch(selectedBranchForMerge, targetBranchForMerge)
      setMergeBranchDialogOpen(false)
      setSelectedBranchForMerge(null)
      toast({
        title: "Branch Merged",
        description: `Branch "${branches.find((b) => b.id === selectedBranchForMerge)?.name}" merged into "${branches.find((b) => b.id === targetBranchForMerge)?.name}"`,
      })
    }
  }

  const handleSwitchBranch = (branchId: string) => {
    onSwitchBranch(branchId)
    toast({
      title: "Branch Switched",
      description: `Switched to branch "${branches.find((b) => b.id === branchId)?.name}"`,
    })
  }

  const toggleExpandCommits = (branchId: string) => {
    setExpandedCommits((prev) => (prev.includes(branchId) ? prev.filter((id) => id !== branchId) : [...prev, branchId]))
  }

  const toggleVersionDetails = (versionId: string) => {
    setShowVersionDetails(showVersionDetails === versionId ? null : versionId)
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedBranch(null)
    setSelectedTag(null)
  }

  // Format date for timeline view
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  // Group versions by date for timeline view
  const versionsByDate = filteredVersions.reduce(
    (acc, version) => {
      const date = formatDate(version.createdAt)
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(version)
      return acc
    },
    {} as Record<string, Version[]>,
  )

  return (
    <div className="h-full flex flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsContent value="history" className="flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search commits..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setTimelineView(!timelineView)}
                      className={timelineView ? "bg-primary/10" : ""}
                    >
                      <Calendar className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{timelineView ? "Switch to list view" : "Switch to timeline view"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <div className="relative">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className={selectedBranch || selectedTag ? "bg-primary/10" : ""}
                      >
                        <Filter className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Filter options</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <div className="absolute top-full left-0 mt-2 w-64 bg-background border rounded-md shadow-md z-10 p-3 space-y-3">
                  <div>
                    <Label className="text-xs">Branch</Label>
                    <select
                      className="w-full mt-1 p-2 text-sm border rounded-md"
                      value={selectedBranch || ""}
                      onChange={(e) => setSelectedBranch(e.target.value || null)}
                    >
                      <option value="">All branches</option>
                      {branches.map((branch) => (
                        <option key={branch.id} value={branch.id}>
                          {branch.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {allTags.length > 0 && (
                    <div>
                      <Label className="text-xs">Tag</Label>
                      <select
                        className="w-full mt-1 p-2 text-sm border rounded-md"
                        value={selectedTag || ""}
                        onChange={(e) => setSelectedTag(e.target.value || null)}
                      >
                        <option value="">All tags</option>
                        {allTags.map((tag) => (
                          <option key={tag} value={tag}>
                            {tag}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {(selectedBranch || selectedTag) && (
                    <Button variant="outline" size="sm" className="w-full mt-2" onClick={clearFilters}>
                      Clear Filters
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="space-x-2">
              {selectedVersion && compareVersion && (
                <Button size="sm" onClick={handleCompare}>
                  <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                  <ArrowRight className="h-3.5 w-3.5 mr-2" />
                  Compare
                </Button>
              )}
              {selectedVersion && !compareVersion && (
                <Button size="sm" onClick={handleRestore}>
                  <RotateCcw className="h-3.5 w-3.5 mr-2" />
                  Restore
                </Button>
              )}
            </div>
          </div>

          <ScrollArea className="flex-1 pr-4">
            {timelineView ? (
              <div className="space-y-6">
                {Object.entries(versionsByDate).map(([date, dateVersions]) => (
                  <div key={date} className="relative">
                    <div className="sticky top-0 bg-background z-10 py-2">
                      <h3 className="text-sm font-medium text-muted-foreground">{date}</h3>
                      <div className="absolute left-3 top-10 bottom-0 w-0.5 bg-border"></div>
                    </div>

                    <div className="space-y-4 ml-6 mt-2">
                      {dateVersions.map((version) => (
                        <div
                          key={version.id}
                          className={`p-3 rounded-md border relative ${
                            selectedVersion === version.id
                              ? "border-primary bg-primary/5"
                              : compareVersion === version.id
                                ? "border-blue-500 bg-blue-500/5"
                                : "hover:bg-accent"
                          } cursor-pointer transition-colors`}
                          onClick={() => {
                            if (selectedVersion && selectedVersion !== version.id) {
                              handleSelectCompareVersion(version.id)
                            } else {
                              handleSelectVersion(version.id)
                            }
                          }}
                        >
                          <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-background border-2 border-primary"></div>

                          <div className="flex justify-between items-start">
                            <div className="flex items-center">
                              <GitCommit className="h-4 w-4 mr-2 text-muted-foreground" />
                              <div className="font-medium">Version {version.number}</div>
                              {version.isCurrent && <Badge className="ml-2 bg-[#007A33]">Current</Badge>}
                              {version.tags &&
                                version.tags.map((tag) => (
                                  <Badge key={tag} variant="outline" className="ml-2">
                                    <Tag className="h-3 w-3 mr-1" />
                                    {tag}
                                  </Badge>
                                ))}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="h-3.5 w-3.5 mr-1" />
                              {version.createdAt.split(" ")[1]}
                            </div>
                          </div>

                          <div className="text-sm mt-1 flex items-center">
                            <User className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                            {version.author}
                          </div>

                          <div className="text-sm text-muted-foreground mt-2">{version.changes}</div>

                          <div className="flex items-center justify-between mt-2">
                            <div className="text-xs text-muted-foreground font-mono">{version.commitHash}</div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 text-xs"
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleVersionDetails(version.id)
                              }}
                            >
                              {showVersionDetails === version.id ? "Hide Details" : "View Details"}
                            </Button>
                          </div>

                          {showVersionDetails === version.id && (
                            <div className="mt-3 pt-3 border-t text-sm space-y-2">
                              <div className="flex items-start">
                                <GitBranch className="h-3.5 w-3.5 mr-2 mt-0.5 text-muted-foreground" />
                                <div>
                                  <span className="text-muted-foreground">Branch: </span>
                                  <span>{version.branch}</span>
                                </div>
                              </div>

                              <div className="flex items-start">
                                <Info className="h-3.5 w-3.5 mr-2 mt-0.5 text-muted-foreground" />
                                <div>
                                  <span className="text-muted-foreground">Full commit message: </span>
                                  <p>{version.changes}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Accordion type="multiple" className="w-full">
                {Object.entries(versionsByBranch).map(([branchName, branchVersions]) => {
                  // Filter versions based on search and tag
                  const filteredBranchVersions = branchVersions.filter((version) => {
                    const matchesSearch =
                      searchQuery === "" ||
                      version.changes.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      version.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      version.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      version.commitHash.toLowerCase().includes(searchQuery.toLowerCase())

                    const matchesTag = selectedTag === null || (version.tags && version.tags.includes(selectedTag))

                    return matchesSearch && matchesTag
                  })

                  // Skip empty branches after filtering
                  if (filteredBranchVersions.length === 0) return null

                  return (
                    <AccordionItem key={branchName} value={branchName}>
                      <AccordionTrigger className="hover:bg-accent px-2 rounded-md">
                        <div className="flex items-center">
                          <GitBranch className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{branchName}</span>
                          <Badge className="ml-2" variant="outline">
                            {filteredBranchVersions.length}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3 pl-6">
                          {filteredBranchVersions.map((version) => (
                            <div
                              key={version.id}
                              className={`p-3 rounded-md border ${
                                selectedVersion === version.id
                                  ? "border-primary bg-primary/5"
                                  : compareVersion === version.id
                                    ? "border-blue-500 bg-blue-500/5"
                                    : "hover:bg-accent"
                              } cursor-pointer transition-colors`}
                              onClick={() => {
                                if (selectedVersion && selectedVersion !== version.id) {
                                  handleSelectCompareVersion(version.id)
                                } else {
                                  handleSelectVersion(version.id)
                                }
                              }}
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex items-center flex-wrap gap-1">
                                  <div className="font-medium">Version {version.number}</div>
                                  {version.isCurrent && <Badge className="ml-1 bg-[#007A33]">Current</Badge>}
                                  {version.tags &&
                                    version.tags.map((tag) => (
                                      <Badge key={tag} variant="outline" className="ml-1">
                                        <Tag className="h-3 w-3 mr-1" />
                                        {tag}
                                      </Badge>
                                    ))}
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Clock className="h-3.5 w-3.5 mr-1" />
                                  {version.createdAt}
                                </div>
                              </div>
                              <div className="text-sm mt-1 flex items-center">
                                <User className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                                {version.author}
                              </div>
                              <div className="text-sm text-muted-foreground mt-2">{version.changes}</div>
                              <div className="text-xs text-muted-foreground mt-1 font-mono">
                                Commit: {version.commitHash}
                              </div>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )
                })}
              </Accordion>
            )}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="branches" className="flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-muted-foreground">Manage workflow branches</div>
            <Dialog open={newBranchDialogOpen} onOpenChange={setNewBranchDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <GitBranch className="h-3.5 w-3.5 mr-2" />
                  New Branch
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Branch</DialogTitle>
                  <DialogDescription>
                    Create a new branch to experiment with changes without affecting the main workflow.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="branch-name">Branch Name</Label>
                    <Input
                      id="branch-name"
                      placeholder="feature/new-functionality"
                      value={newBranchName}
                      onChange={(e) => setNewBranchName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="branch-description">Description</Label>
                    <Textarea
                      id="branch-description"
                      placeholder="What is this branch for?"
                      value={newBranchDescription}
                      onChange={(e) => setNewBranchDescription(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="base-branch">Base Branch</Label>
                    <select
                      id="base-branch"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={baseBranch}
                      onChange={(e) => setBaseBranch(e.target.value)}
                    >
                      {branches.map((branch) => (
                        <option key={branch.id} value={branch.id}>
                          {branch.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setNewBranchDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateBranch} disabled={!newBranchName.trim()}>
                    Create Branch
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <ScrollArea className="flex-1">
            <div className="space-y-4">
              {branches.map((branch) => (
                <div key={branch.id} className="rounded-md border">
                  <div className="p-3 flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <GitBranch className="h-4 w-4 mr-2 text-muted-foreground" />
                        <div className="font-medium">{branch.name}</div>
                        {branch.isCurrent && <Badge className="ml-2 bg-[#007A33]">Current</Badge>}
                        {branch.protected && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge className="ml-2" variant="outline">
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Protected
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>This branch is protected. Direct pushes are restricted.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                      <div className="text-sm mt-1">Last updated by {branch.author}</div>
                      <div className="text-sm text-muted-foreground mt-1">{branch.lastUpdated}</div>
                      <div className="text-sm mt-2">{branch.description}</div>
                      {branch.basedOn && (
                        <div className="text-xs text-muted-foreground mt-1">Based on: {branch.basedOn}</div>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      {!branch.isCurrent && (
                        <>
                          <Dialog
                            open={mergeBranchDialogOpen && selectedBranchForMerge === branch.id}
                            onOpenChange={(open) => {
                              setMergeBranchDialogOpen(open)
                              if (!open) setSelectedBranchForMerge(null)
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" onClick={() => setSelectedBranchForMerge(branch.id)}>
                                <GitMerge className="h-3.5 w-3.5 mr-1" />
                                Merge
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Merge Branch</DialogTitle>
                                <DialogDescription>
                                  Merge changes from "{branch.name}" into another branch.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label htmlFor="target-branch">Target Branch</Label>
                                  <select
                                    id="target-branch"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={targetBranchForMerge}
                                    onChange={(e) => setTargetBranchForMerge(e.target.value)}
                                  >
                                    {branches
                                      .filter((b) => b.id !== branch.id)
                                      .map((b) => (
                                        <option key={b.id} value={b.id}>
                                          {b.name}
                                        </option>
                                      ))}
                                  </select>
                                </div>
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setMergeBranchDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button onClick={handleMergeBranch}>Merge Branch</Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button size="sm" variant="outline" onClick={() => handleSwitchBranch(branch.id)}>
                            <Save className="h-3.5 w-3.5 mr-1" />
                            Switch
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="px-3 pb-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs w-full justify-between"
                      onClick={() => toggleExpandCommits(branch.id)}
                    >
                      <span>View {branch.commits} commits</span>
                      {expandedCommits.includes(branch.id) ? (
                        <ChevronDown className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronRight className="h-3.5 w-3.5" />
                      )}
                    </Button>

                    {expandedCommits.includes(branch.id) && (
                      <div className="mt-2 space-y-2 pl-4 border-l-2 border-muted">
                        {versionsByBranch[branch.name]?.map((version) => (
                          <div key={version.id} className="text-xs flex items-start gap-2 py-1">
                            <div className="font-mono text-muted-foreground">{version.commitHash}</div>
                            <div>
                              <div>{version.changes}</div>
                              <div className="text-muted-foreground mt-0.5">
                                {version.author} · {version.createdAt}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}
