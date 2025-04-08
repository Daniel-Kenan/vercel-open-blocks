"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Save, History, Globe } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import WorkflowEditor from "@/components/workflow-editor"
import WorkflowExecutions from "@/components/workflow-executions"
import WorkflowSettings from "@/components/workflow-settings"
import VersionControlPanel from "@/components/version-control/version-control-panel"
import ApiTriggerDialog from "@/components/api-trigger-dialog"

interface WorkflowPageProps {
  params: {
    id: string
  }
}

export default function WorkflowPage({ params }: WorkflowPageProps) {
  const [workflowName, setWorkflowName] = useState("")
  const [workflowDescription, setWorkflowDescription] = useState("")
  const [activeTab, setActiveTab] = useState("editor")
  const [versionControlOpen, setVersionControlOpen] = useState(false)
  const [apiDialogOpen, setApiDialogOpen] = useState(false)

  // In a real app, we would fetch the workflow data from an API
  useEffect(() => {
    // Simulate API call
    const mockWorkflows = [
      {
        id: "1",
        name: "Customer Onboarding",
        description: "Process new customer applications and send welcome emails",
      },
      {
        id: "2",
        name: "Transaction Monitoring",
        description: "Monitor transactions for suspicious activity",
      },
      {
        id: "3",
        name: "Account Reconciliation",
        description: "Daily account reconciliation process",
      },
    ]

    const workflow = mockWorkflows.find((w) => w.id === params.id)
    if (workflow) {
      setWorkflowName(workflow.name)
      setWorkflowDescription(workflow.description)
    }
  }, [params.id])

  const toggleVersionControl = () => {
    setVersionControlOpen(!versionControlOpen)
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="font-medium">Edit Workflow</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="grid gap-1">
              <Input
                id="name"
                placeholder="Workflow Name"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                className="h-9 w-[250px]"
              />
            </div>
            <div className="grid gap-1">
              <Textarea
                id="description"
                placeholder="Description"
                value={workflowDescription}
                onChange={(e) => setWorkflowDescription(e.target.value)}
                className="h-9 min-h-0 py-1.5 w-[350px] resize-none"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setApiDialogOpen(true)}
              className="bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-400 border-blue-200 dark:border-blue-800"
            >
              <Globe className="h-4 w-4 mr-2" />
              API Access
            </Button>
            <Button className="bg-[#007A33] hover:bg-[#006128] text-white">
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
            <Button
              variant={versionControlOpen ? "default" : "outline"}
              size="icon"
              onClick={toggleVersionControl}
              title="Version Control"
            >
              <History className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden flex">
        <div className="flex-1 overflow-hidden flex">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <div className="border-b px-4 py-2">
              <TabsList className="workflow-tabs">
                <TabsTrigger value="editor" className="workflow-tab">
                  Editor
                </TabsTrigger>
                <TabsTrigger value="executions" className="workflow-tab">
                  Executions
                </TabsTrigger>
                <TabsTrigger value="settings" className="workflow-tab">
                  Settings
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="editor" className="flex-1 overflow-hidden">
              <WorkflowEditor />
            </TabsContent>
            <TabsContent value="executions" className="flex-1 p-6">
              <div className="container">
                <WorkflowExecutions />
              </div>
            </TabsContent>
            <TabsContent value="settings" className="flex-1 p-6">
              <div className="container">
                <WorkflowSettings />
              </div>
            </TabsContent>
          </Tabs>

          {versionControlOpen && (
            <div className="w-96 border-l overflow-hidden flex flex-col">
              <VersionControlPanel workflowId={params.id} workflowName={workflowName} />
            </div>
          )}
        </div>
      </main>
      {/* API Trigger Dialog */}
      <ApiTriggerDialog
        isOpen={apiDialogOpen}
        onClose={() => setApiDialogOpen(false)}
        workflowId={params.id}
        workflowName={workflowName}
      />
    </div>
  )
}
