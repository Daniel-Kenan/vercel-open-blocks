"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Globe,
  Database,
  Mail,
  FileText,
  MessageSquare,
  Clock,
  Filter,
  Code,
  Bot,
  Sparkles,
  Merge,
  FileInput,
  FileOutput,
  Zap,
  Calendar,
  CreditCard,
  FileSpreadsheet,
  Phone,
  ImageIcon,
  BarChart,
  FileJson,
  Timer,
  FormInput,
  Pause,
  Layers,
  SplitSquareVertical,
  Workflow,
  FileCheck,
  Webhook,
  Share2,
  Repeat,
  AlertCircle,
  Gauge,
  Fingerprint,
  ShieldCheck,
  Scroll,
  Coins,
  Building,
  Users,
  Briefcase,
  Terminal,
} from "lucide-react"

type NodeCategory = {
  id: string
  name: string
  icon: React.ReactNode
  nodes: {
    id: string
    name: string
    type: string
    description: string
  }[]
}

const nodeCategories: NodeCategory[] = [
  {
    id: "triggers",
    name: "Triggers",
    icon: <Clock className="h-4 w-4" />,
    nodes: [
      {
        id: "webhook",
        name: "Webhook",
        type: "trigger",
        description: "Trigger workflow via HTTP request",
      },
      {
        id: "schedule",
        name: "Schedule",
        type: "trigger",
        description: "Trigger workflow on a schedule",
      },
      {
        id: "click",
        name: "When clicking 'run workflow'",
        type: "trigger",
        description: "Trigger workflow manually",
      },
      {
        id: "chat",
        name: "When chat message received",
        type: "trigger",
        description: "Trigger on incoming chat message",
      },
      {
        id: "email",
        name: "Email Received",
        type: "trigger",
        description: "Trigger when an email is received",
      },
      {
        id: "form",
        name: "Form Submission",
        type: "trigger",
        description: "Trigger on form submission",
      },
      {
        id: "database-change",
        name: "Database Change",
        type: "trigger",
        description: "Trigger on database record changes",
      },
      {
        id: "interval",
        name: "Timer Interval",
        type: "trigger",
        description: "Trigger at regular intervals",
      },
    ],
  },
  {
    id: "apps",
    name: "Apps",
    icon: <Globe className="h-4 w-4" />,
    nodes: [
      {
        id: "http",
        name: "HTTP Request",
        type: "action",
        description: "Make HTTP requests",
      },
      {
        id: "email-send",
        name: "Send Email",
        type: "action",
        description: "Send emails",
      },
      {
        id: "database",
        name: "Database",
        type: "action",
        description: "Query databases",
      },
      {
        id: "googlesheets",
        name: "Google Sheets",
        type: "action",
        description: "Read/write Google Sheets data",
      },
      {
        id: "file-operations",
        name: "File Operations",
        type: "action",
        description: "Read/write files",
      },
      {
        id: "sms",
        name: "SMS Message",
        type: "action",
        description: "Send SMS messages",
      },
      {
        id: "pdf",
        name: "PDF Generator",
        type: "action",
        description: "Generate PDF documents",
      },
      {
        id: "calendar",
        name: "Calendar",
        type: "action",
        description: "Manage calendar events",
      },
    ],
  },
  {
    id: "flow",
    name: "Flow",
    icon: <Filter className="h-4 w-4" />,
    nodes: [
      {
        id: "if",
        name: "IF Condition",
        type: "logic",
        description: "Conditional branching",
      },
      {
        id: "switch",
        name: "Switch",
        type: "logic",
        description: "Multiple path branching",
      },
      {
        id: "loop",
        name: "Loop Over Items",
        type: "logic",
        description: "Iterate over items",
      },
      {
        id: "merge",
        name: "Merge",
        type: "logic",
        description: "Merge multiple branches",
      },
      {
        id: "delay",
        name: "Delay",
        type: "logic",
        description: "Add a time delay",
      },
      {
        id: "filter-array",
        name: "Filter Array",
        type: "logic",
        description: "Filter array items",
      },
      {
        id: "split",
        name: "Split Paths",
        type: "logic",
        description: "Split workflow into parallel paths",
      },
      {
        id: "join",
        name: "Join Paths",
        type: "logic",
        description: "Join parallel paths",
      },
    ],
  },
  {
    id: "code",
    name: "Code",
    icon: <Code className="h-4 w-4" />,
    nodes: [
      {
        id: "javascript",
        name: "JavaScript",
        type: "code",
        description: "Run JavaScript code",
      },
      {
        id: "python",
        name: "Python",
        type: "code",
        description: "Run Python code",
      },
      {
        id: "c",
        name: "C",
        type: "code",
        description: "Run C code",
      },
      {
        id: "bash",
        name: "Bash",
        type: "code",
        description: "Run Bash scripts",
      },
      {
        id: "powershell",
        name: "PowerShell",
        type: "code",
        description: "Run PowerShell scripts",
      },
      {
        id: "transform",
        name: "Transform Data",
        type: "code",
        description: "Transform data structure",
      },
      {
        id: "json-path",
        name: "JSON Path",
        type: "code",
        description: "Extract data using JSON Path",
      },
    ],
  },
  {
    id: "ai",
    name: "AI",
    icon: <Bot className="h-4 w-4" />,
    nodes: [
      {
        id: "ai-agent",
        name: "AI Agent",
        type: "ai",
        description: "Use AI agents to process data",
      },
      {
        id: "ai-transform",
        name: "AI Transform",
        type: "ai",
        description: "Transform data using AI",
      },
      {
        id: "input",
        name: "Input",
        type: "ai",
        description: "Define input data for AI processing",
      },
      {
        id: "output-data",
        name: "Output Data",
        type: "ai",
        description: "Format and output AI processed data",
      },
      {
        id: "message",
        name: "Send Message",
        type: "message",
        description: "Send a message response",
      },
      {
        id: "text-classification",
        name: "Text Classification",
        type: "ai",
        description: "Classify text into categories",
      },
      {
        id: "sentiment-analysis",
        name: "Sentiment Analysis",
        type: "ai",
        description: "Analyze sentiment in text",
      },
      {
        id: "image-recognition",
        name: "Image Recognition",
        type: "ai",
        description: "Identify objects in images",
      },
      {
        id: "data-extraction",
        name: "Data Extraction",
        type: "ai",
        description: "Extract structured data from text",
      },
    ],
  },
  {
    id: "integrations",
    name: "Integrations",
    icon: <Share2 className="h-4 w-4" />,
    nodes: [
      {
        id: "salesforce",
        name: "Salesforce",
        type: "integration",
        description: "Interact with Salesforce CRM",
      },
      {
        id: "stripe",
        name: "Stripe",
        type: "integration",
        description: "Process payments with Stripe",
      },
      {
        id: "google-analytics",
        name: "Google Analytics",
        type: "integration",
        description: "Track analytics data",
      },
      {
        id: "slack",
        name: "Slack",
        type: "integration",
        description: "Send messages to Slack",
      },
      {
        id: "zendesk",
        name: "Zendesk",
        type: "integration",
        description: "Manage support tickets",
      },
      {
        id: "hubspot",
        name: "HubSpot",
        type: "integration",
        description: "Manage marketing and CRM",
      },
    ],
  },
  {
    id: "banking",
    name: "Banking",
    icon: <Coins className="h-4 w-4" />,
    nodes: [
      {
        id: "transaction-processing",
        name: "Transaction Processing",
        type: "banking",
        description: "Process financial transactions",
      },
      {
        id: "account-verification",
        name: "Account Verification",
        type: "banking",
        description: "Verify account details",
      },
      {
        id: "fraud-detection",
        name: "Fraud Detection",
        type: "banking",
        description: "Detect suspicious activities",
      },
      {
        id: "kyc",
        name: "KYC Process",
        type: "banking",
        description: "Know Your Customer verification",
      },
      {
        id: "loan-approval",
        name: "Loan Approval",
        type: "banking",
        description: "Automate loan approval process",
      },
    ],
  },
]

const nodeIcons: Record<string, React.ReactNode> = {
  webhook: <Webhook className="h-4 w-4" />,
  schedule: <Clock className="h-4 w-4" />,
  click: <Zap className="h-4 w-4" />,
  chat: <MessageSquare className="h-4 w-4" />,
  email: <Mail className="h-4 w-4" />,
  form: <FormInput className="h-4 w-4" />,
  "database-change": <Database className="h-4 w-4" />,
  interval: <Timer className="h-4 w-4" />,
  http: <Globe className="h-4 w-4" />,
  "email-send": <Mail className="h-4 w-4" />,
  database: <Database className="h-4 w-4" />,
  googlesheets: <FileSpreadsheet className="h-4 w-4" />,
  "file-operations": <FileText className="h-4 w-4" />,
  sms: <Phone className="h-4 w-4" />,
  pdf: <FileCheck className="h-4 w-4" />,
  calendar: <Calendar className="h-4 w-4" />,
  if: <Filter className="h-4 w-4" />,
  switch: <SplitSquareVertical className="h-4 w-4" />,
  loop: <Repeat className="h-4 w-4" />,
  merge: <Merge className="h-4 w-4" />,
  delay: <Pause className="h-4 w-4" />,
  "filter-array": <Layers className="h-4 w-4" />,
  split: <SplitSquareVertical className="h-4 w-4" />,
  join: <Workflow className="h-4 w-4" />,
  javascript: <Code className="h-4 w-4" />,
  python: <Code className="h-4 w-4" />,
  c: <Code className="h-4 w-4" />,
  bash: <Terminal className="h-4 w-4" />,
  powershell: <Terminal className="h-4 w-4" />,
  transform: <FileJson className="h-4 w-4" />,
  "json-path": <FileJson className="h-4 w-4" />,
  "ai-agent": <Bot className="h-4 w-4" />,
  "ai-transform": <Sparkles className="h-4 w-4" />,
  input: <FileInput className="h-4 w-4" />,
  "output-data": <FileOutput className="h-4 w-4" />,
  message: <MessageSquare className="h-4 w-4" />,
  "text-classification": <Layers className="h-4 w-4" />,
  "sentiment-analysis": <Gauge className="h-4 w-4" />,
  "image-recognition": <ImageIcon className="h-4 w-4" />,
  "data-extraction": <FileJson className="h-4 w-4" />,
  salesforce: <Building className="h-4 w-4" />,
  stripe: <CreditCard className="h-4 w-4" />,
  "google-analytics": <BarChart className="h-4 w-4" />,
  slack: <MessageSquare className="h-4 w-4" />,
  zendesk: <Users className="h-4 w-4" />,
  hubspot: <Briefcase className="h-4 w-4" />,
  "transaction-processing": <CreditCard className="h-4 w-4" />,
  "account-verification": <ShieldCheck className="h-4 w-4" />,
  "fraud-detection": <AlertCircle className="h-4 w-4" />,
  kyc: <Fingerprint className="h-4 w-4" />,
  "loan-approval": <Scroll className="h-4 w-4" />,
}

interface NodeSelectorProps {
  onAddNode: (type: string, data: any) => void
}

export default function NodeSelector({ onAddNode }: NodeSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const handleAddNode = (node: any) => {
    onAddNode(node.type, {
      label: node.name,
      type: node.id,
      config: {},
    })
  }

  const handleDragStart = (event: React.DragEvent, node: any) => {
    // Set the drag data
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify({
        type: node.type,
        data: {
          label: node.name,
          type: node.id,
          config: {},
        },
      }),
    )

    event.dataTransfer.effectAllowed = "move"
  }

  const filteredCategories = nodeCategories
    .map((category) => ({
      ...category,
      nodes: category.nodes.filter(
        (node) =>
          node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          node.description.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    }))
    .filter((category) => category.nodes.length > 0)

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Add Node</h3>
      <Input
        placeholder="Search nodes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />

      {searchTerm ? (
        <div className="space-y-2">
          {filteredCategories.map((category) => (
            <div key={category.id} className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                {category.icon} {category.name}
              </h4>
              <div className="space-y-1">
                {category.nodes.map((node) => (
                  <div
                    key={node.id}
                    className="w-full text-left px-2 py-1 rounded-md hover:bg-accent flex items-center gap-2 text-sm cursor-grab active:cursor-grabbing"
                    onClick={() => handleAddNode(node)}
                    draggable
                    onDragStart={(e) => handleDragStart(e, node)}
                  >
                    <div
                      className={`h-6 w-6 rounded-full ${
                        node.type === "ai" || node.type === "message"
                          ? "bg-cyan-500"
                          : node.type === "trigger"
                            ? "bg-[#007A33]"
                            : node.type === "action"
                              ? "bg-blue-500"
                              : node.type === "logic"
                                ? "bg-purple-500"
                                : node.type === "integration"
                                  ? "bg-orange-500"
                                  : node.type === "banking"
                                    ? "bg-emerald-500"
                                    : "bg-amber-500"
                      } text-white flex items-center justify-center`}
                    >
                      {nodeIcons[node.id]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span>{node.name}</span>
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded-sm ${
                            node.type === "ai" || node.type === "message"
                              ? "bg-cyan-500/10 text-cyan-500"
                              : node.type === "trigger"
                                ? "bg-[#007A33]/10 text-[#007A33]"
                                : node.type === "action"
                                  ? "bg-blue-500/10 text-blue-500"
                                  : node.type === "logic"
                                    ? "bg-purple-500/10 text-purple-500"
                                    : node.type === "integration"
                                      ? "bg-orange-500/10 text-orange-500"
                                      : node.type === "banking"
                                        ? "bg-emerald-500/10 text-emerald-500"
                                        : "bg-amber-500/10 text-amber-500"
                          }`}
                        >
                          {category.name}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">{node.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Tabs defaultValue="triggers" className="w-full">
          <div className="mb-4 overflow-x-auto pb-2">
            <TabsList className="inline-flex w-auto">
              {nodeCategories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 whitespace-nowrap"
                >
                  {category.icon}
                  <span>{category.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          {nodeCategories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="space-y-1 mt-2">
              <div className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                {category.icon}
                <span>{category.name} Components</span>
              </div>
              {category.nodes.map((node) => (
                <div
                  key={node.id}
                  className="w-full text-left px-2 py-1 rounded-md hover:bg-accent flex items-center gap-2 text-sm cursor-grab active:cursor-grabbing transition-colors"
                  onClick={() => handleAddNode(node)}
                  draggable
                  onDragStart={(e) => handleDragStart(e, node)}
                >
                  <div
                    className={`h-6 w-6 rounded-full ${
                      node.type === "ai" || node.type === "message"
                        ? "bg-cyan-500"
                        : node.type === "trigger"
                          ? "bg-[#007A33]"
                          : node.type === "action"
                            ? "bg-blue-500"
                            : node.type === "logic"
                              ? "bg-purple-500"
                              : node.type === "integration"
                                ? "bg-orange-500"
                                : node.type === "banking"
                                  ? "bg-emerald-500"
                                  : "bg-amber-500"
                    } text-white flex items-center justify-center`}
                  >
                    {nodeIcons[node.id]}
                  </div>
                  <div>
                    <div>{node.name}</div>
                    <div className="text-xs text-muted-foreground">{node.description}</div>
                  </div>
                </div>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  )
}
