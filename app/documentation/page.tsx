"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Code,
  FileText,
  Workflow,
  Zap,
  Bot,
  Search,
  ChevronRight,
  ExternalLink,
  Play,
  Database,
  Puzzle,
  ArrowRight,
  Copy,
  Check,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { CodeEditor } from "@/components/code-editor"

export default function DocumentationPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("getting-started")
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const handleCopyCode = (id: string) => {
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const webhookExample = `curl -X POST https://api.flowbank.com/api/webhooks/your-webhook-id \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "event": "transaction.created",
    "data": {
      "transaction_id": "txn_123456",
      "amount": 100.00,
      "currency": "USD",
      "status": "completed"
    }
  }'`

  const javascriptNodeExample = `// This is a JavaScript code node example
// Input data is available via the $input variable

// Process the transaction data
const transaction = $input.transaction;
let riskScore = 0;

// Calculate risk score based on various factors
if (transaction.amount > 10000) {
  riskScore += 50;
}

if (transaction.country === 'high-risk') {
  riskScore += 30;
}

if (transaction.customer.accountAge < 30) {
  riskScore += 20;
}

// Return the processed data
return {
  transactionId: transaction.id,
  riskScore: riskScore,
  riskLevel: riskScore > 70 ? 'high' : riskScore > 40 ? 'medium' : 'low',
  recommendation: riskScore > 70 ? 'manual-review' : 'approve'
};`

  const aiNodeExample = `// AI Node Configuration Example
{
  "model": "gpt-4",
  "systemPrompt": "You are a financial assistant helping to analyze transaction data.",
  "userPrompt": "Please analyze this transaction: {{$input.transaction}}",
  "temperature": 0.7,
  "maxTokens": 1000,
  "tools": ["database-lookup", "risk-assessment"]
}`

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 lg:w-72 flex-shrink-0">
          <div className="sticky top-20">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documentation..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <Button
                variant={activeTab === "getting-started" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("getting-started")}
              >
                <Zap className="mr-2 h-4 w-4" />
                Getting Started
              </Button>
              <Button
                variant={activeTab === "workflows" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("workflows")}
              >
                <Workflow className="mr-2 h-4 w-4" />
                Workflows
              </Button>
              <Button
                variant={activeTab === "nodes" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("nodes")}
              >
                <Puzzle className="mr-2 h-4 w-4" />
                Node Types
              </Button>
              <Button
                variant={activeTab === "code" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("code")}
              >
                <Code className="mr-2 h-4 w-4" />
                Code Nodes
              </Button>
              <Button
                variant={activeTab === "ai" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("ai")}
              >
                <Bot className="mr-2 h-4 w-4" />
                AI Integration
              </Button>
              <Button
                variant={activeTab === "api" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("api")}
              >
                <Database className="mr-2 h-4 w-4" />
                API Reference
              </Button>
              <Button
                variant={activeTab === "examples" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("examples")}
              >
                <FileText className="mr-2 h-4 w-4" />
                Examples
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="space-y-8">
            {activeTab === "getting-started" && (
              <div className="space-y-6">
                <h1 className="text-3xl font-bold">Getting Started with Flow</h1>
                <p className="text-lg text-muted-foreground">
                  Welcome to Flow, a powerful workflow automation platform designed for banking and financial services.
                  This guide will help you get started with creating your first workflow.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Workflow className="mr-2 h-5 w-5 text-primary" />
                        Create Your First Workflow
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4">
                        Start by creating a new workflow and connecting nodes to automate your processes.
                      </p>
                      <Link href="/workflows/create">
                        <Button>
                          Create Workflow
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <FileText className="mr-2 h-5 w-5 text-primary" />
                        Explore Templates
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4">Browse our pre-built templates to jumpstart your automation journey.</p>
                      <Button variant="outline">
                        View Templates
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <h2 className="text-2xl font-bold mt-8">Key Concepts</h2>

                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="text-lg font-medium flex items-center">
                      <Workflow className="mr-2 h-5 w-5 text-primary" />
                      Workflows
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      Workflows are visual representations of your business processes. They consist of nodes connected
                      together to define the flow of data and actions.
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h3 className="text-lg font-medium flex items-center">
                      <Puzzle className="mr-2 h-5 w-5 text-primary" />
                      Nodes
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      Nodes are the building blocks of workflows. Each node performs a specific function, such as
                      triggering an event, processing data, or executing an action.
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h3 className="text-lg font-medium flex items-center">
                      <ArrowRight className="mr-2 h-5 w-5 text-primary" />
                      Connections
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      Connections define how data flows between nodes. They determine the execution path of your
                      workflow.
                    </p>
                  </div>
                </div>

                <h2 className="text-2xl font-bold mt-8">Quick Start Video</h2>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Play className="h-12 w-12 mb-4 mx-auto text-primary" />
                    <p className="text-muted-foreground">Video tutorial would be embedded here</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "workflows" && (
              <div className="space-y-6">
                <h1 className="text-3xl font-bold">Working with Workflows</h1>
                <p className="text-lg text-muted-foreground">
                  Learn how to create, edit, and manage workflows to automate your business processes.
                </p>

                <h2 className="text-2xl font-bold mt-8">Creating a Workflow</h2>
                <p className="mb-4">
                  To create a new workflow, navigate to the Workflows page and click the "Create Workflow" button.
                  You'll be taken to the workflow editor where you can design your workflow.
                </p>

                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted p-4 border-b">
                    <h3 className="font-medium">Workflow Editor</h3>
                  </div>
                  <div className="p-4">
                    <img
                      src="/placeholder.svg?height=300&width=600"
                      alt="Workflow Editor"
                      className="rounded-lg border"
                    />
                    <p className="mt-4 text-sm text-muted-foreground">
                      The workflow editor provides a canvas where you can add nodes and connect them to create your
                      workflow.
                    </p>
                  </div>
                </div>

                <h2 className="text-2xl font-bold mt-8">Workflow Components</h2>

                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="text-lg font-medium">Trigger Nodes</h3>
                    <p className="mt-2 text-muted-foreground">
                      Trigger nodes are the starting points of your workflow. They define when your workflow should run.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Badge variant="outline" className="bg-[#007A33]/10 text-[#007A33] border-[#007A33]/20">
                        Webhook
                      </Badge>
                      <Badge variant="outline" className="bg-[#007A33]/10 text-[#007A33] border-[#007A33]/20">
                        Schedule
                      </Badge>
                      <Badge variant="outline" className="bg-[#007A33]/10 text-[#007A33] border-[#007A33]/20">
                        Manual Trigger
                      </Badge>
                      <Badge variant="outline" className="bg-[#007A33]/10 text-[#007A33] border-[#007A33]/20">
                        Database Change
                      </Badge>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h3 className="text-lg font-medium">Action Nodes</h3>
                    <p className="mt-2 text-muted-foreground">
                      Action nodes perform specific tasks in your workflow, such as sending emails, making API calls, or
                      updating databases.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                        HTTP Request
                      </Badge>
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                        Database Query
                      </Badge>
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                        Send Email
                      </Badge>
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                        File Operations
                      </Badge>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h3 className="text-lg font-medium">Logic Nodes</h3>
                    <p className="mt-2 text-muted-foreground">
                      Logic nodes control the flow of your workflow based on conditions and data.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
                        IF Condition
                      </Badge>
                      <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
                        Switch
                      </Badge>
                      <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
                        Loop
                      </Badge>
                      <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
                        Merge
                      </Badge>
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-bold mt-8">Testing and Debugging</h2>
                <p className="mb-4">
                  Flow provides tools to test and debug your workflows to ensure they work as expected.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Play className="mr-2 h-5 w-5 text-primary" />
                        Workflow Simulator
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        The Workflow Simulator allows you to test your workflow with sample data and see how it executes
                        step by step.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <FileText className="mr-2 h-5 w-5 text-primary" />
                        Execution Logs
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Execution logs provide detailed information about each workflow run, including input data,
                        output data, and any errors that occurred.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === "nodes" && (
              <div className="space-y-6">
                <h1 className="text-3xl font-bold">Node Types</h1>
                <p className="text-lg text-muted-foreground">
                  Explore the different types of nodes available in Flow and learn how to use them in your workflows.
                </p>

                <Tabs defaultValue="trigger">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="trigger">Trigger</TabsTrigger>
                    <TabsTrigger value="action">Action</TabsTrigger>
                    <TabsTrigger value="logic">Logic</TabsTrigger>
                    <TabsTrigger value="code">Code</TabsTrigger>
                    <TabsTrigger value="ai">AI</TabsTrigger>
                  </TabsList>

                  <TabsContent value="trigger" className="mt-6 space-y-6">
                    <h2 className="text-2xl font-bold">Trigger Nodes</h2>
                    <p>
                      Trigger nodes are the starting points of your workflow. They define when your workflow should run.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Webhook Trigger</CardTitle>
                          <CardDescription>Trigger workflow via HTTP request</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">
                            The Webhook Trigger node allows you to start a workflow when an HTTP request is received at
                            a specific endpoint.
                          </p>
                          <div className="bg-muted p-3 rounded-md text-sm">
                            <div className="font-medium">Configuration Options:</div>
                            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                              <li>Webhook Path</li>
                              <li>HTTP Method</li>
                              <li>Authentication</li>
                            </ul>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Schedule Trigger</CardTitle>
                          <CardDescription>Trigger workflow on a schedule</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">
                            The Schedule Trigger node allows you to start a workflow at specified intervals or at
                            specific times.
                          </p>
                          <div className="bg-muted p-3 rounded-md text-sm">
                            <div className="font-medium">Configuration Options:</div>
                            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                              <li>Frequency (hourly, daily, weekly, monthly)</li>
                              <li>Time</li>
                              <li>Custom CRON expression</li>
                            </ul>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Database Change Trigger</CardTitle>
                          <CardDescription>Trigger on database record changes</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">
                            The Database Change Trigger node starts a workflow when records in a database are created,
                            updated, or deleted.
                          </p>
                          <div className="bg-muted p-3 rounded-md text-sm">
                            <div className="font-medium">Configuration Options:</div>
                            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                              <li>Database</li>
                              <li>Operation (insert, update, delete)</li>
                              <li>Condition</li>
                            </ul>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Manual Trigger</CardTitle>
                          <CardDescription>Trigger workflow manually</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">
                            The Manual Trigger node allows you to start a workflow by clicking a button or through the
                            API.
                          </p>
                          <div className="bg-muted p-3 rounded-md text-sm">
                            <div className="font-medium">Configuration Options:</div>
                            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                              <li>Input parameters</li>
                              <li>Description</li>
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="action" className="mt-6 space-y-6">
                    <h2 className="text-2xl font-bold">Action Nodes</h2>
                    <p>
                      Action nodes perform specific tasks in your workflow, such as sending emails, making API calls, or
                      updating databases.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">HTTP Request</CardTitle>
                          <CardDescription>Make HTTP requests to external APIs</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">
                            The HTTP Request node allows you to make HTTP requests to external APIs and services.
                          </p>
                          <div className="bg-muted p-3 rounded-md text-sm">
                            <div className="font-medium">Configuration Options:</div>
                            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                              <li>URL</li>
                              <li>Method (GET, POST, PUT, DELETE)</li>
                              <li>Headers</li>
                              <li>Request Body</li>
                            </ul>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Database</CardTitle>
                          <CardDescription>Query and manipulate database records</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">
                            The Database node allows you to query and manipulate records in a database.
                          </p>
                          <div className="bg-muted p-3 rounded-md text-sm">
                            <div className="font-medium">Configuration Options:</div>
                            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                              <li>Database</li>
                              <li>Operation (query, insert, update, delete)</li>
                              <li>Query/Data</li>
                            </ul>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Send Email</CardTitle>
                          <CardDescription>Send emails</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">
                            The Send Email node allows you to send emails as part of your workflow.
                          </p>
                          <div className="bg-muted p-3 rounded-md text-sm">
                            <div className="font-medium">Configuration Options:</div>
                            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                              <li>To, CC, BCC</li>
                              <li>Subject</li>
                              <li>Body (HTML or plain text)</li>
                              <li>Attachments</li>
                            </ul>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">File Operations</CardTitle>
                          <CardDescription>Read, write, and manipulate files</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">
                            The File Operations node allows you to read, write, and manipulate files.
                          </p>
                          <div className="bg-muted p-3 rounded-md text-sm">
                            <div className="font-medium">Configuration Options:</div>
                            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                              <li>Operation (read, write, append, delete, copy, move)</li>
                              <li>File Path</li>
                              <li>Content</li>
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="logic" className="mt-6 space-y-6">
                    <h2 className="text-2xl font-bold">Logic Nodes</h2>
                    <p>Logic nodes control the flow of your workflow based on conditions and data.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">IF Condition</CardTitle>
                          <CardDescription>Conditional branching</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">
                            The IF Condition node allows you to create conditional branches in your workflow based on a
                            condition.
                          </p>
                          <div className="bg-muted p-3 rounded-md text-sm">
                            <div className="font-medium">Configuration Options:</div>
                            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                              <li>Condition expression</li>
                            </ul>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Switch</CardTitle>
                          <CardDescription>Multiple path branching</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">
                            The Switch node allows you to create multiple branches in your workflow based on a value.
                          </p>
                          <div className="bg-muted p-3 rounded-md text-sm">
                            <div className="font-medium">Configuration Options:</div>
                            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                              <li>Value expression</li>
                              <li>Cases</li>
                              <li>Default case</li>
                            </ul>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Loop</CardTitle>
                          <CardDescription>Iterate over items</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">
                            The Loop node allows you to iterate over a list of items and process each item.
                          </p>
                          <div className="bg-muted p-3 rounded-md text-sm">
                            <div className="font-medium">Configuration Options:</div>
                            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                              <li>Items expression</li>
                              <li>Item name</li>
                            </ul>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Merge</CardTitle>
                          <CardDescription>Merge multiple branches</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">
                            The Merge node allows you to merge multiple branches of your workflow.
                          </p>
                          <div className="bg-muted p-3 rounded-md text-sm">
                            <div className="font-medium">Configuration Options:</div>
                            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                              <li>Merge mode (all, any)</li>
                              <li>Timeout</li>
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="code" className="mt-6 space-y-6">
                    <h2 className="text-2xl font-bold">Code Nodes</h2>
                    <p>
                      Code nodes allow you to write custom code to process data and implement complex logic in your
                      workflows.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">JavaScript</CardTitle>
                          <CardDescription>Run JavaScript code</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">
                            The JavaScript node allows you to write and execute JavaScript code in your workflow.
                          </p>
                          <div className="bg-muted p-3 rounded-md text-sm">
                            <div className="font-medium">Configuration Options:</div>
                            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                              <li>Code</li>
                              <li>Input parameters</li>
                              <li>Sandbox mode</li>
                            </ul>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Python</CardTitle>
                          <CardDescription>Run Python code</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">
                            The Python node allows you to write and execute Python code in your workflow.
                          </p>
                          <div className="bg-muted p-3 rounded-md text-sm">
                            <div className="font-medium">Configuration Options:</div>
                            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                              <li>Code</li>
                              <li>Input parameters</li>
                              <li>Sandbox mode</li>
                            </ul>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Transform Data</CardTitle>
                          <CardDescription>Transform data structure</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">
                            The Transform Data node allows you to transform data structures using JavaScript
                            expressions.
                          </p>
                          <div className="bg-muted p-3 rounded-md text-sm">
                            <div className="font-medium">Configuration Options:</div>
                            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                              <li>Transformation code</li>
                              <li>Input data</li>
                            </ul>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">JSON Path</CardTitle>
                          <CardDescription>Extract data using JSON Path</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">
                            The JSON Path node allows you to extract data from JSON objects using JSON Path expressions.
                          </p>
                          <div className="bg-muted p-3 rounded-md text-sm">
                            <div className="font-medium">Configuration Options:</div>
                            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                              <li>JSON Path expression</li>
                              <li>Input data</li>
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <h3 className="text-xl font-bold mt-8">JavaScript Example</h3>
                    <div className="relative">
                      <div className="absolute right-2 top-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCopyCode("js-example")}
                          className="h-8 w-8"
                        >
                          {copiedCode === "js-example" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                      <CodeEditor value={javascriptNodeExample} language="javascript" readOnly={true} height="300px" />
                    </div>
                  </TabsContent>

                  <TabsContent value="ai" className="mt-6 space-y-6">
                    <h2 className="text-2xl font-bold">AI Nodes</h2>
                    <p>AI nodes allow you to leverage artificial intelligence capabilities in your workflows.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">AI Agent</CardTitle>
                          <CardDescription>Use AI agents to process data</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">
                            The AI Agent node allows you to use AI models to process data and generate responses.
                          </p>
                          <div className="bg-muted p-3 rounded-md text-sm">
                            <div className="font-medium">Configuration Options:</div>
                            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                              <li>AI Model (GPT-4, Claude, etc.)</li>
                              <li>System Prompt</li>
                              <li>User Prompt Template</li>
                              <li>Temperature</li>
                              <li>Max Tokens</li>
                            </ul>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Text Classification</CardTitle>
                          <CardDescription>Classify text into categories</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">
                            The Text Classification node allows you to classify text into predefined categories.
                          </p>
                          <div className="bg-muted p-3 rounded-md text-sm">
                            <div className="font-medium">Configuration Options:</div>
                            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                              <li>Model</li>
                              <li>Categories</li>
                              <li>Input Text</li>
                            </ul>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Sentiment Analysis</CardTitle>
                          <CardDescription>Analyze sentiment in text</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">
                            The Sentiment Analysis node allows you to analyze the sentiment of text.
                          </p>
                          <div className="bg-muted p-3 rounded-md text-sm">
                            <div className="font-medium">Configuration Options:</div>
                            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                              <li>Input Text</li>
                              <li>Output Format</li>
                            </ul>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Data Extraction</CardTitle>
                          <CardDescription>Extract structured data from text</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">
                            The Data Extraction node allows you to extract structured data from unstructured text.
                          </p>
                          <div className="bg-muted p-3 rounded-md text-sm">
                            <div className="font-medium">Configuration Options:</div>
                            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                              <li>Input Text</li>
                              <li>Schema</li>
                              <li>Model</li>
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <h3 className="text-xl font-bold mt-8">AI Node Configuration Example</h3>
                    <div className="relative">
                      <div className="absolute right-2 top-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCopyCode("ai-example")}
                          className="h-8 w-8"
                        >
                          {copiedCode === "ai-example" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                      <CodeEditor value={aiNodeExample} language="javascript" readOnly={true} height="300px" />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}

            {activeTab === "api" && (
              <div className="space-y-6">
                <h1 className="text-3xl font-bold">API Reference</h1>
                <p className="text-lg text-muted-foreground">
                  Learn how to interact with the Flow API to programmatically manage and trigger workflows.
                </p>

                <h2 className="text-2xl font-bold mt-8">Authentication</h2>
                <p className="mb-4">All API requests must include an API key in the Authorization header.</p>

                <div className="bg-muted p-4 rounded-lg">
                  <code className="text-sm">Authorization: Bearer YOUR_API_KEY</code>
                </div>

                <h2 className="text-2xl font-bold mt-8">Endpoints</h2>

                <div className="space-y-6">
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-muted p-4 border-b flex items-center justify-between">
                      <div className="flex items-center">
                        <Badge className="mr-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100">
                          POST
                        </Badge>
                        <h3 className="font-medium">/api/workflows/{"{id}"}/trigger</h3>
                      </div>
                      <Badge variant="outline">Trigger Workflow</Badge>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-muted-foreground mb-4">Triggers a workflow with the specified ID.</p>

                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium">Request Body</h4>
                          <div className="bg-muted p-3 rounded-md mt-2">
                            <pre className="text-sm">
                              {`{
  "data": {
    // Any data to pass to the workflow
  }
}`}
                            </pre>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium">Response</h4>
                          <div className="bg-muted p-3 rounded-md mt-2">
                            <pre className="text-sm">
                              {`{
  "success": true,
  "execution_id": "exec_123456",
  "status": "completed",
  "result": {
    // Workflow execution result
  }
}`}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-muted p-4 border-b flex items-center justify-between">
                      <div className="flex items-center">
                        <Badge className="mr-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100">
                          GET
                        </Badge>
                        <h3 className="font-medium">/api/workflows</h3>
                      </div>
                      <Badge variant="outline">List Workflows</Badge>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-muted-foreground mb-4">Returns a list of all workflows.</p>

                      <div>
                        <h4 className="text-sm font-medium">Response</h4>
                        <div className="bg-muted p-3 rounded-md mt-2">
                          <pre className="text-sm">
                            {`{
  "workflows": [
    {
      "id": "wf_123456",
      "name": "Customer Onboarding",
      "description": "Process new customer applications",
      "status": "active",
      "created_at": "2023-04-01T12:00:00Z",
      "updated_at": "2023-06-15T14:30:00Z"
    },
    // More workflows...
  ]
}`}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-muted p-4 border-b flex items-center justify-between">
                      <div className="flex items-center">
                        <Badge className="mr-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100">
                          GET
                        </Badge>
                        <h3 className="font-medium">/api/workflows/{"{id}"}/executions</h3>
                      </div>
                      <Badge variant="outline">List Executions</Badge>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-muted-foreground mb-4">
                        Returns a list of executions for a specific workflow.
                      </p>

                      <div>
                        <h4 className="text-sm font-medium">Response</h4>
                        <div className="bg-muted p-3 rounded-md mt-2">
                          <pre className="text-sm">
                            {`{
  "executions": [
    {
      "id": "exec_123456",
      "workflow_id": "wf_123456",
      "status": "completed",
      "started_at": "2023-06-15T14:30:00Z",
      "completed_at": "2023-06-15T14:30:05Z",
      "duration_ms": 5000,
      "result": {
        // Execution result
      }
    },
    // More executions...
  ]
}`}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-bold mt-8">Webhook Example</h2>
                <div className="relative">
                  <div className="absolute right-2 top-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopyCode("webhook-example")}
                      className="h-8 w-8"
                    >
                      {copiedCode === "webhook-example" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <CodeEditor value={webhookExample} language="bash" readOnly={true} height="200px" />
                </div>

                <h2 className="text-2xl font-bold mt-8">SDKs and Libraries</h2>
                <p className="mb-4">
                  We provide SDKs and libraries for various programming languages to make it easier to interact with the
                  Flow API.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">JavaScript SDK</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        The JavaScript SDK provides a convenient way to interact with the Flow API from JavaScript
                        applications.
                      </p>
                      <Button variant="outline" className="w-full" asChild>
                        <a href="#" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Documentation
                        </a>
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Python SDK</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        The Python SDK provides a convenient way to interact with the Flow API from Python applications.
                      </p>
                      <Button variant="outline" className="w-full" asChild>
                        <a href="#" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Documentation
                        </a>
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Java SDK</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        The Java SDK provides a convenient way to interact with the Flow API from Java applications.
                      </p>
                      <Button variant="outline" className="w-full" asChild>
                        <a href="#" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Documentation
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === "examples" && (
              <div className="space-y-6">
                <h1 className="text-3xl font-bold">Example Workflows</h1>
                <p className="text-lg text-muted-foreground">
                  Explore example workflows to learn how to use Flow for common use cases.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Customer Onboarding</CardTitle>
                      <CardDescription>Process new customer applications and send welcome emails</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        This workflow demonstrates how to automate the customer onboarding process, including validating
                        customer data, creating accounts, and sending welcome emails.
                      </p>
                      <Button variant="outline" className="w-full">
                        View Example
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Transaction Monitoring</CardTitle>
                      <CardDescription>Monitor transactions for suspicious activity</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        This workflow demonstrates how to monitor transactions for suspicious activity using AI and
                        rule-based approaches, and how to trigger alerts when suspicious activity is detected.
                      </p>
                      <Button variant="outline" className="w-full">
                        View Example
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Account Reconciliation</CardTitle>
                      <CardDescription>Daily account reconciliation process</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        This workflow demonstrates how to automate the daily account reconciliation process, including
                        fetching account data, comparing balances, and generating reports.
                      </p>
                      <Button variant="outline" className="w-full">
                        View Example
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>AI-Powered Customer Support</CardTitle>
                      <CardDescription>Process customer inquiries with AI</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        This workflow demonstrates how to use AI to process customer inquiries, classify them by type,
                        and generate appropriate responses or route them to human agents.
                      </p>
                      <Button variant="outline" className="w-full">
                        View Example
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <h2 className="text-2xl font-bold mt-8">Community Examples</h2>
                <p className="mb-4">Explore workflows created by the Flow community.</p>

                <div className="border rounded-lg p-6 text-center">
                  <h3 className="text-lg font-medium mb-2">Coming Soon</h3>
                  <p className="text-muted-foreground">
                    We're building a community platform where users can share their workflows and learn from each other.
                    Stay tuned for updates!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
