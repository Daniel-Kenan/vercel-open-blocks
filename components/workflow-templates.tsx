"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bot, FileText, Globe, Search, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Node, Edge } from "reactflow"
import { MarkerType } from "reactflow"

export type WorkflowTemplate = {
  id: string
  name: string
  description: string
  category: string
  tags: string[]
  icon: React.ReactNode
  nodes: Node[]
  edges: Edge[]
}

// Define workflow templates
const workflowTemplates: WorkflowTemplate[] = [
  {
    id: "ai-chat-assistant",
    name: "AI Chat Assistant",
    description: "A workflow that processes incoming chat messages with an AI agent and responds accordingly.",
    category: "ai",
    tags: ["AI", "Chat", "Customer Support"],
    icon: <Bot className="h-5 w-5" />,
    nodes: [
      {
        id: "1",
        type: "trigger",
        data: {
          label: "When chat message received",
          type: "chat",
          config: {},
        },
        position: { x: 100, y: 200 },
      },
      {
        id: "2",
        type: "ai",
        data: {
          label: "AI Agent",
          subtitle: "Tools Agent",
          type: "ai-agent",
          tools: ["Chat Model", "Memory", "Tools"],
          config: {
            model: "gpt-4",
            systemPrompt: "You are a helpful assistant.",
          },
        },
        position: { x: 400, y: 200 },
      },
      {
        id: "3",
        type: "logic",
        data: {
          label: "If",
          type: "if",
          config: {
            condition: '{{$node["AI Agent"].json["success"] === true}}',
          },
        },
        position: { x: 700, y: 200 },
      },
      {
        id: "4",
        type: "message",
        data: {
          label: "Success",
          type: "message",
          config: {
            message: '{{$node["AI Agent"].json["response"]}}',
          },
        },
        position: { x: 1000, y: 100 },
      },
      {
        id: "5",
        type: "message",
        data: {
          label: "Failure",
          type: "message",
          config: {
            message: "Sorry, I couldn't process your request.",
          },
        },
        position: { x: 1000, y: 300 },
      },
    ],
    edges: [
      {
        id: "e1-2",
        source: "1",
        target: "2",
        className: "green",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e2-3",
        source: "2",
        target: "3",
        className: "ai",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e3-4",
        source: "3",
        target: "4",
        sourceHandle: "true",
        className: "condition-true",
        label: "true",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e3-5",
        source: "3",
        target: "5",
        sourceHandle: "false",
        className: "condition-false",
        label: "false",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
    ],
  },
  {
    id: "data-processing",
    name: "Data Processing Pipeline",
    description: "Extract data from Google Sheets, process it, and store in a database.",
    category: "data",
    tags: ["Data", "Google Sheets", "Database"],
    icon: <FileText className="h-5 w-5" />,
    nodes: [
      {
        id: "1",
        type: "trigger",
        data: {
          label: "Schedule",
          type: "schedule",
          config: {
            frequency: "daily",
            time: "08:00",
          },
        },
        position: { x: 100, y: 200 },
      },
      {
        id: "2",
        type: "action",
        data: {
          label: "Google Sheets",
          type: "googlesheets",
          config: {
            operation: "read",
            spreadsheetId: "",
            range: "Sheet1!A1:D100",
          },
        },
        position: { x: 350, y: 200 },
      },
      {
        id: "3",
        type: "code",
        data: {
          label: "Process Data",
          type: "javascript",
          config: {
            code: "// Process the data\nreturn { processedData: $input.data.map(row => ({ name: row[0], value: parseInt(row[1]) })) }",
          },
        },
        position: { x: 600, y: 200 },
      },
      {
        id: "4",
        type: "action",
        data: {
          label: "Database",
          type: "database",
          config: {
            operation: "insert",
            table: "processed_data",
          },
        },
        position: { x: 850, y: 200 },
      },
    ],
    edges: [
      {
        id: "e1-2",
        source: "1",
        target: "2",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e2-3",
        source: "2",
        target: "3",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e3-4",
        source: "3",
        target: "4",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
    ],
  },
  {
    id: "customer-onboarding",
    name: "Customer Onboarding",
    description: "Process new customer applications and send welcome emails.",
    category: "automation",
    tags: ["Email", "Customer", "Onboarding"],
    icon: <Globe className="h-5 w-5" />,
    nodes: [
      {
        id: "1",
        type: "trigger",
        data: {
          label: "Webhook",
          type: "webhook",
          config: {
            path: "/new-customer",
            method: "POST",
          },
        },
        position: { x: 100, y: 200 },
      },
      {
        id: "2",
        type: "logic",
        data: {
          label: "Validate Data",
          type: "if",
          config: {
            condition: '{{$node["Webhook"].json["email"] && $node["Webhook"].json["name"]}}',
          },
        },
        position: { x: 350, y: 200 },
      },
      {
        id: "3",
        type: "action",
        data: {
          label: "Create Account",
          type: "database",
          config: {
            operation: "insert",
            table: "customers",
          },
        },
        position: { x: 600, y: 100 },
      },
      {
        id: "4",
        type: "action",
        data: {
          label: "Send Welcome Email",
          type: "email",
          config: {
            to: '{{$node["Webhook"].json["email"]}}',
            subject: "Welcome to Our Service!",
            body: '{{$node["Webhook"].json["name"]}}, thank you for signing up!',
          },
        },
        position: { x: 850, y: 100 },
      },
      {
        id: "5",
        type: "action",
        data: {
          label: "Send Error Response",
          type: "http",
          config: {
            status: 400,
            body: '{"error": "Invalid data"}',
          },
        },
        position: { x: 600, y: 300 },
      },
    ],
    edges: [
      {
        id: "e1-2",
        source: "1",
        target: "2",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e2-3",
        source: "2",
        target: "3",
        sourceHandle: "true",
        className: "condition-true",
        label: "valid",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e3-4",
        source: "3",
        target: "4",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e2-5",
        source: "2",
        target: "5",
        sourceHandle: "false",
        className: "condition-false",
        label: "invalid",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
    ],
  },
  {
    id: "search-and-respond",
    name: "Search and Respond",
    description: "Search for information and respond to user queries using AI.",
    category: "ai",
    tags: ["AI", "Search", "Information Retrieval"],
    icon: <Search className="h-5 w-5" />,
    nodes: [
      {
        id: "1",
        type: "trigger",
        data: {
          label: "Chat Message",
          type: "chat",
          config: {},
        },
        position: { x: 100, y: 200 },
      },
      {
        id: "2",
        type: "ai",
        data: {
          label: "Classify Query",
          type: "ai-agent",
          config: {
            model: "gpt-3.5-turbo",
            systemPrompt: "Classify if this query requires search or can be answered directly.",
          },
        },
        position: { x: 350, y: 200 },
      },
      {
        id: "3",
        type: "logic",
        data: {
          label: "Needs Search?",
          type: "if",
          config: {
            condition: '{{$node["Classify Query"].json["needsSearch"] === true}}',
          },
        },
        position: { x: 600, y: 200 },
      },
      {
        id: "4",
        type: "action",
        data: {
          label: "Search",
          type: "http",
          config: {
            url: "https://api.search.com",
            method: "GET",
          },
        },
        position: { x: 850, y: 100 },
      },
      {
        id: "5",
        type: "ai",
        data: {
          label: "Generate Response",
          type: "ai-agent",
          config: {
            model: "gpt-4",
            systemPrompt: "Generate a response based on the search results.",
          },
        },
        position: { x: 1100, y: 100 },
      },
      {
        id: "6",
        type: "ai",
        data: {
          label: "Direct Response",
          type: "ai-agent",
          config: {
            model: "gpt-4",
            systemPrompt: "Answer the user's question directly.",
          },
        },
        position: { x: 850, y: 300 },
      },
      {
        id: "7",
        type: "message",
        data: {
          label: "Send Response",
          type: "message",
          config: {
            channel: "reply",
          },
        },
        position: { x: 1100, y: 200 },
      },
    ],
    edges: [
      {
        id: "e1-2",
        source: "1",
        target: "2",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e2-3",
        source: "2",
        target: "3",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e3-4",
        source: "3",
        target: "4",
        sourceHandle: "true",
        className: "condition-true",
        label: "yes",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e4-5",
        source: "4",
        target: "5",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e5-7",
        source: "5",
        target: "7",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e3-6",
        source: "3",
        target: "6",
        sourceHandle: "false",
        className: "condition-false",
        label: "no",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e6-7",
        source: "6",
        target: "7",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
    ],
  },
  {
    id: "transaction-monitoring",
    name: "Transaction Monitoring",
    description: "Monitor transactions for suspicious activity and alert if needed.",
    category: "monitoring",
    tags: ["Transactions", "Monitoring", "Alerts"],
    icon: <Zap className="h-5 w-5" />,
    nodes: [
      {
        id: "1",
        type: "trigger",
        data: {
          label: "New Transaction",
          type: "webhook",
          config: {
            path: "/transaction",
            method: "POST",
          },
        },
        position: { x: 100, y: 200 },
      },
      {
        id: "2",
        type: "code",
        data: {
          label: "Risk Analysis",
          type: "javascript",
          config: {
            code: "// Calculate risk score\nconst amount = $input.amount;\nconst country = $input.country;\nlet riskScore = 0;\n\nif (amount > 10000) riskScore += 50;\nif (country === 'high-risk') riskScore += 50;\n\nreturn { riskScore };",
          },
        },
        position: { x: 350, y: 200 },
      },
      {
        id: "3",
        type: "logic",
        data: {
          label: "High Risk?",
          type: "if",
          config: {
            condition: '{{$node["Risk Analysis"].json["riskScore"] > 70}}',
          },
        },
        position: { x: 600, y: 200 },
      },
      {
        id: "4",
        type: "action",
        data: {
          label: "Flag Transaction",
          type: "database",
          config: {
            operation: "update",
            table: "transactions",
          },
        },
        position: { x: 850, y: 100 },
      },
      {
        id: "5",
        type: "action",
        data: {
          label: "Send Alert",
          type: "email",
          config: {
            to: "security@example.com",
            subject: "High Risk Transaction Detected",
          },
        },
        position: { x: 1100, y: 100 },
      },
      {
        id: "6",
        type: "action",
        data: {
          label: "Log Transaction",
          type: "database",
          config: {
            operation: "insert",
            table: "transaction_logs",
          },
        },
        position: { x: 850, y: 300 },
      },
    ],
    edges: [
      {
        id: "e1-2",
        source: "1",
        target: "2",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e2-3",
        source: "2",
        target: "3",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e3-4",
        source: "3",
        target: "4",
        sourceHandle: "true",
        className: "condition-true",
        label: "high risk",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e4-5",
        source: "4",
        target: "5",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e3-6",
        source: "3",
        target: "6",
        sourceHandle: "false",
        className: "condition-false",
        label: "normal",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
    ],
  },
]

interface WorkflowTemplatesProps {
  onSelectTemplate: (template: WorkflowTemplate) => void
}

export default function WorkflowTemplates({ onSelectTemplate }: WorkflowTemplatesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedTemplate, setSelectedTemplate] = useState<WorkflowTemplate | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const filteredTemplates =
    selectedCategory === "all"
      ? workflowTemplates
      : workflowTemplates.filter((template) => template.category === selectedCategory)

  const handleSelectTemplate = (template: WorkflowTemplate) => {
    setSelectedTemplate(template)
    setDialogOpen(true)
  }

  const handleConfirmTemplate = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate)
      setDialogOpen(false)
    }
  }

  const categories = [
    { id: "all", name: "All Templates" },
    { id: "ai", name: "AI" },
    { id: "data", name: "Data" },
    { id: "automation", name: "Automation" },
    { id: "monitoring", name: "Monitoring" },
  ]

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Workflow Templates</h3>

      <Tabs defaultValue="all" value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="mb-4">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTemplates.map((template) => (
            <Card
              key={template.id}
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => handleSelectTemplate(template)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-primary/10 text-primary">{template.icon}</div>
                    <CardTitle className="text-base">{template.name}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <CardDescription>{template.description}</CardDescription>
              </CardContent>
              <CardFooter className="pt-0 flex flex-wrap gap-1">
                {template.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </CardFooter>
            </Card>
          ))}
        </div>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Load Template</DialogTitle>
            <DialogDescription>
              Are you sure you want to load the "{selectedTemplate?.name}" template? This will replace your current
              workflow.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmTemplate}>Load Template</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
