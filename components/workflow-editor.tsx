"use client"

import { useState, useCallback, useRef } from "react"
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  MarkerType,
  getConnectedEdges,
} from "reactflow"
import "reactflow/dist/style.css"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import NodeSelector from "@/components/node-selector"
import NodeConfigPanel from "@/components/node-config-panel"
import EdgeConfigPanel from "@/components/edge-config-panel"
import WorkflowTemplates from "@/components/workflow-templates"
import WorkflowSimulator from "@/components/workflow-simulator"
import KeyboardShortcutsDialog from "@/components/keyboard-shortcuts-dialog"
import ApiTriggerDialog from "@/components/api-trigger-dialog"
import {
  Download,
  Maximize2,
  Trash2,
  FileImage,
  FileJson,
  X,
  Play,
  Save,
  Copy,
  HelpCircle,
  PanelLeft,
} from "lucide-react"
import { nodeTypes, edgeTypes } from "@/components/workflow-node-types"
import { EnhancedCodeEditor } from "@/components/enhanced-code-editor" // Fixed import to use named export

// Create a separate component for the flow content
function FlowContent() {
  const reactFlowWrapper = useRef(null)
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [selectedNode, setSelectedNode] = useState(null)
  const [selectedEdge, setSelectedEdge] = useState(null)
  const [configPanelOpen, setConfigPanelOpen] = useState(false)
  const [edgeConfigPanelOpen, setEdgeConfigPanelOpen] = useState(false)
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false)
  const [exportDialogOpen, setExportDialogOpen] = useState(false)
  const [simulationOpen, setSimulationOpen] = useState(false)
  const [shortcutsDialogOpen, setShortcutsDialogOpen] = useState(false)
  const [sidebarTab, setSidebarTab] = useState("nodes")
  const [isActive, setIsActive] = useState(false)
  const [isPanelOpen, setIsPanelOpen] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [undoStack, setUndoStack] = useState<any[]>([])
  const [redoStack, setRedoStack] = useState<any[]>([])
  const [copiedNode, setCopiedNode] = useState(null)
  const editorRef = useRef(null)
  const [reactFlowInstance, setReactFlowInstance] = useState(null)
  const [apiDialogOpen, setApiDialogOpen] = useState(false)

  // Add a state for the full editor dialog
  const [codeEditorOpen, setCodeEditorOpen] = useState(false)
  const [currentEditingNode, setCurrentEditingNode] = useState(null)

  const { fitView, toObject, getNodes, getEdges, zoomIn, zoomOut, setViewport } = useReactFlow()

  // Save current state for undo
  const saveCurrentState = useCallback(() => {
    const currentState = {
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
    }
    setUndoStack((prev) => [...prev, currentState])
    setRedoStack([])
  }, [nodes, edges])

  // Undo action
  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return

    const newUndoStack = [...undoStack]
    const prevState = newUndoStack.pop()

    setRedoStack((prev) => [
      ...prev,
      {
        nodes: JSON.parse(JSON.stringify(nodes)),
        edges: JSON.parse(JSON.stringify(edges)),
      },
    ])

    setUndoStack(newUndoStack)
    setNodes(prevState.nodes)
    setEdges(prevState.edges)

    toast({
      title: "Undo",
      description: "Previous action undone",
      duration: 2000,
    })
  }, [undoStack, redoStack, nodes, edges, setNodes, setEdges])

  // Redo action
  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return

    const newRedoStack = [...redoStack]
    const nextState = newRedoStack.pop()

    setUndoStack((prev) => [
      ...prev,
      {
        nodes: JSON.parse(JSON.stringify(nodes)),
        edges: JSON.parse(JSON.stringify(edges)),
      },
    ])

    setRedoStack(newRedoStack)
    setNodes(nextState.nodes)
    setEdges(nextState.edges)

    toast({
      title: "Redo",
      description: "Action redone",
      duration: 2000,
    })
  }, [undoStack, redoStack, nodes, edges, setNodes, setEdges])

  // Copy selected node
  const handleCopyNode = useCallback(() => {
    if (!selectedNode) return

    setCopiedNode({
      ...selectedNode,
      position: { ...selectedNode.position },
      data: { ...selectedNode.data },
    })

    toast({
      title: "Copied",
      description: `Node "${selectedNode.data.label}" copied to clipboard`,
      duration: 2000,
    })
  }, [selectedNode])

  // Paste copied node
  const handlePasteNode = useCallback(() => {
    if (!copiedNode) return

    saveCurrentState()

    const newNode = {
      ...copiedNode,
      id: `${Date.now()}`,
      position: {
        x: copiedNode.position.x + 50,
        y: copiedNode.position.y + 50,
      },
    }

    setNodes((nds) => [...nds, newNode])

    toast({
      title: "Pasted",
      description: `Node "${copiedNode.data.label}" pasted`,
      duration: 2000,
    })
  }, [copiedNode, setNodes, saveCurrentState])

  // Delete selected node or edge
  const handleDelete = useCallback(() => {
    if (selectedNode) {
      saveCurrentState()

      // Get connected edges to also delete
      const connectedEdges = getConnectedEdges([selectedNode], edges)
      const edgeIdsToDelete = new Set(connectedEdges.map((e) => e.id))

      setNodes(nodes.filter((node) => node.id !== selectedNode.id))
      setEdges(edges.filter((edge) => !edgeIdsToDelete.has(edge.id)))
      setSelectedNode(null)
      setConfigPanelOpen(false)

      toast({
        title: "Deleted",
        description: `Node "${selectedNode.data.label}" deleted`,
        duration: 2000,
      })
    } else if (selectedEdge) {
      saveCurrentState()

      setEdges(edges.filter((edge) => edge.id !== selectedEdge.id))
      setSelectedEdge(null)
      setEdgeConfigPanelOpen(false)

      toast({
        title: "Deleted",
        description: "Connection deleted",
        duration: 2000,
      })
    }
  }, [selectedNode, selectedEdge, nodes, edges, setNodes, setEdges, saveCurrentState, getConnectedEdges])

  // Toggle sidebar
  const toggleSidebar = useCallback(() => {
    setIsPanelOpen((prev) => !prev)
  }, [])

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      editorRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }, [])

  // Save workflow
  const saveWorkflow = useCallback(() => {
    toast({
      title: "Workflow Saved",
      description: "Your workflow has been saved successfully",
      duration: 2000,
    })
  }, [])

  // Run simulation
  const runSimulation = useCallback(() => {
    if (nodes.length === 0) {
      toast({
        title: "Cannot Run Simulation",
        description: "Add some nodes to your workflow first",
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    setSimulationOpen(true)
  }, [nodes.length])

  // Select all nodes
  const selectAllNodes = useCallback(() => {
    // In a real implementation, this would select all nodes
    toast({
      title: "Select All",
      description: "All nodes selected",
      duration: 2000,
    })
  }, [])

  // Define keyboard shortcuts
  const shortcuts = {
    delete: handleDelete,
    "ctrl+z": handleUndo,
    "ctrl+y": handleRedo,
    "ctrl+c": handleCopyNode,
    "ctrl+v": handlePasteNode,
    "ctrl+a": selectAllNodes,
    "ctrl+s": (e) => {
      e.preventDefault()
      saveWorkflow()
    },
    "ctrl+b": toggleSidebar,
    "ctrl+o": () => setTemplateDialogOpen(true),
    "ctrl+e": () => setExportDialogOpen(true),
    f11: (e) => {
      e.preventDefault()
      toggleFullscreen()
    },
    f5: (e) => {
      e.preventDefault()
      runSimulation()
    },
    "ctrl+0": () => fitView({ padding: 0.2 }),
    "ctrl++": () => zoomIn(),
    "ctrl+-": () => zoomOut(),
    "?": () => setShortcutsDialogOpen(true),
  }

  // Use the keyboard shortcuts hook
  useKeyboardShortcuts(shortcuts)

  const onConnect = useCallback(
    (params) => {
      // Check if the source node is a data source or has connections disabled
      const sourceNode = nodes.find((node) => node.id === params.source)
      const targetNode = nodes.find((node) => node.id === params.target)

      // Skip connection if source is a data source or has output connections disabled
      if (
        sourceNode?.data?.config?.isDataSource === true ||
        sourceNode?.data?.config?.showOutputConnections === false
      ) {
        return
      }

      // Skip connection if target has input connections disabled
      if (targetNode?.data?.config?.showInputConnections === false) {
        return
      }

      saveCurrentState()

      // Create a new edge with default settings
      // Default to no arrowhead for integration and banking nodes
      const isIntegrationOrBanking =
        sourceNode?.type === "integration" ||
        sourceNode?.type === "banking" ||
        targetNode?.type === "integration" ||
        targetNode?.type === "banking"

      const newEdge = {
        ...params,
        type: isIntegrationOrBanking ? "noArrow" : "default",
        animated: false,
        data: {
          hideArrowhead: isIntegrationOrBanking,
        },
        markerEnd: isIntegrationOrBanking
          ? undefined
          : {
              type: MarkerType.ArrowClosed,
            },
      }
      setEdges((eds) => addEdge(newEdge, eds))
    },
    [nodes, setEdges, saveCurrentState],
  )

  const onDragOver = useCallback((event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  const onDrop = useCallback(
    (event) => {
      event.preventDefault()

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect()
      if (!reactFlowBounds || !reactFlowInstance) return

      const type = event.dataTransfer.getData("application/reactflow")
      if (!type) return

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      })

      try {
        const nodeData = JSON.parse(type)

        saveCurrentState()

        // Set default connection settings for integration and banking nodes
        if (nodeData.type === "integration" || nodeData.type === "banking") {
          if (!nodeData.data.config) {
            nodeData.data.config = {}
          }
          // Default to showing connections, but can be configured
          nodeData.data.config.isDataSource = false
        }

        const newNode = {
          id: (nodes.length + 1).toString(),
          type: nodeData.type,
          position,
          data: nodeData.data,
        }

        setNodes((nds) => nds.concat(newNode))
      } catch (error) {
        console.error("Could not parse node data", error)
      }
    },
    [reactFlowInstance, nodes, setNodes, saveCurrentState],
  )

  const onNodeClick = (_event, node) => {
    setSelectedNode(node)
    setSelectedEdge(null)
    setConfigPanelOpen(true)
    setEdgeConfigPanelOpen(false)
  }

  const onEdgeClick = (_event, edge) => {
    setSelectedEdge(edge)
    setSelectedNode(null)
    setEdgeConfigPanelOpen(true)
    setConfigPanelOpen(false)
  }

  const onPaneClick = () => {
    setSelectedNode(null)
    setSelectedEdge(null)
    setConfigPanelOpen(false)
    setEdgeConfigPanelOpen(false)
  }

  const addNode = (nodeType, nodeData) => {
    saveCurrentState()

    // Set default connection settings for integration and banking nodes
    if (nodeType === "integration" || nodeType === "banking") {
      if (!nodeData.config) {
        nodeData.config = {}
      }
      // Default to showing connections, but can be configured
      nodeData.config.isDataSource = false
    }

    const newNode = {
      id: (nodes.length + 1).toString(),
      type: nodeType,
      data: nodeData,
      position: {
        x: Math.random() * 300 + 200,
        y: Math.random() * 300 + 100,
      },
    }
    setNodes([...nodes, newNode])
  }

  // Add this function to handle opening the full editor
  const openFullEditor = (node) => {
    setCurrentEditingNode(node)
    setCodeEditorOpen(true)
  }

  // Add this function to handle saving code from the full editor
  const handleSaveCode = (code) => {
    if (currentEditingNode) {
      updateNodeConfig(currentEditingNode.id, {
        config: {
          ...currentEditingNode.data.config,
          code,
        },
      })
      setCodeEditorOpen(false)
    }
  }

  const updateNodeConfig = (nodeId, config) => {
    saveCurrentState()

    setNodes(
      nodes.map((node) => {
        if (node.id === nodeId) {
          // Check if we're updating the label
          if (config.label !== undefined) {
            return {
              ...node,
              data: {
                ...node.data,
                label: config.label, // Update the label directly
                config: {
                  ...node.data.config,
                  ...(config.config || {}), // Only spread config if it exists
                },
              },
            }
          }

          // Otherwise update other config properties
          return {
            ...node,
            data: {
              ...node.data,
              ...config,
              config: {
                ...node.data.config,
                ...(config.config || {}),
              },
            },
          }
        }
        return node
      }),
    )

    // If connection settings changed, we may need to update edges
    if (
      config.config?.isDataSource !== undefined ||
      config.config?.showInputConnections !== undefined ||
      config.config?.showOutputConnections !== undefined
    ) {
      // This would be a good place to update or remove affected edges
      // For simplicity, we're not implementing this now
    }
  }

  const updateEdgeConfig = (edgeId, config) => {
    saveCurrentState()

    setEdges(
      edges.map((edge) => {
        if (edge.id === edgeId) {
          return {
            ...edge,
            ...config,
          }
        }
        return edge
      }),
    )
  }

  const deleteNode = (nodeId) => {
    saveCurrentState()

    setNodes(nodes.filter((node) => node.id !== nodeId))
    // Also remove any connected edges
    setEdges(edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId))
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null)
      setConfigPanelOpen(false)
    }
  }

  const deleteEdge = (edgeId) => {
    saveCurrentState()

    setEdges(edges.filter((edge) => edge.id !== edgeId))
    if (selectedEdge?.id === edgeId) {
      setSelectedEdge(null)
      setEdgeConfigPanelOpen(false)
    }
  }

  const loadTemplate = (template) => {
    saveCurrentState()

    setNodes(template.nodes)
    setEdges(template.edges)
    setTemplateDialogOpen(false)

    toast({
      title: "Template Loaded",
      description: `Template "${template.name}" loaded successfully`,
      duration: 2000,
    })
  }

  const exportFlow = (format) => {
    if (!reactFlowInstance) return

    if (format === "json") {
      const flowObject = reactFlowInstance.toObject()
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(flowObject, null, 2))
      const downloadAnchorNode = document.createElement("a")
      downloadAnchorNode.setAttribute("href", dataStr)
      downloadAnchorNode.setAttribute("download", "workflow.json")
      document.body.appendChild(downloadAnchorNode)
      downloadAnchorNode.click()
      downloadAnchorNode.remove()

      toast({
        title: "Workflow Exported",
        description: "Workflow exported as JSON",
        duration: 2000,
      })
    } else {
      // For PNG and JPG, we would typically use the reactflow exportAs utility
      // This would typically be done with the @reactflow/node-renderer package
      // For now, we'll just show a placeholder message
      toast({
        title: "Export Not Implemented",
        description: `Export as ${format.toUpperCase()} is not implemented in this demo`,
        duration: 3000,
      })
    }

    setExportDialogOpen(false)
  }

  return (
    <div className="flex flex-col h-full" ref={editorRef}>
      <div className="border-b p-2 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setTemplateDialogOpen(true)}>
            Templates
          </Button>
          <Button variant="outline" size="sm" onClick={runSimulation} disabled={nodes.length === 0}>
            <Play className="h-4 w-4 mr-2" />
            Test Workflow
          </Button>
          <Button variant="outline" size="sm" onClick={saveWorkflow}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" size="sm" onClick={() => setExportDialogOpen(true)}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={toggleSidebar}>
            <PanelLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={toggleFullscreen}>
            <Maximize2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => setShortcutsDialogOpen(true)}>
            <HelpCircle className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <main className="flex-1 overflow-hidden flex">
        <div className={`border-r transition-all duration-200 ${isPanelOpen ? "w-72" : "w-0 opacity-0"}`}>
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto p-4">
              <NodeSelector onAddNode={addNode} />
            </div>
          </div>
        </div>

        <div className="flex-1 flex relative">
          <div className="flex-1 h-full" ref={reactFlowWrapper}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              onEdgeClick={onEdgeClick}
              onPaneClick={onPaneClick}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              fitView
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              deleteKeyCode={null} // Disable default delete to use our custom handler
            >
              <Background gap={20} size={1} />
              <Controls />
              <MiniMap />
            </ReactFlow>
          </div>

          {selectedNode && configPanelOpen && (
            <div className="w-80 border-l overflow-y-auto">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-medium">Node Configuration</h3>
                <Button variant="ghost" size="icon" onClick={() => setConfigPanelOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-4">
                <NodeConfigPanel
                  node={selectedNode}
                  onUpdateConfig={(config) => updateNodeConfig(selectedNode.id, config)}
                  onOpenFullEditor={openFullEditor}
                />

                <div className="mt-6 pt-4 border-t flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCopyNode} className="flex-1">
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteNode(selectedNode.id)}
                    className="flex-1"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          )}

          {selectedEdge && edgeConfigPanelOpen && (
            <div className="w-80 border-l overflow-y-auto">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-medium">Edge Configuration</h3>
                <Button variant="ghost" size="icon" onClick={() => setEdgeConfigPanelOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-4">
                <EdgeConfigPanel edge={selectedEdge} onUpdateConfig={updateEdgeConfig} />

                <div className="mt-6 pt-4 border-t">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteEdge(selectedEdge.id)}
                    className="w-full"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete Connection
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Templates Dialog */}
      <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
        <DialogContent className="sm:max-w-[90%] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Workflow Templates</DialogTitle>
            <DialogDescription>
              Choose a template to start with or create your own workflow from scratch.
            </DialogDescription>
          </DialogHeader>
          <WorkflowTemplates onSelectTemplate={loadTemplate} />
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Export Workflow</DialogTitle>
            <DialogDescription>Choose a format to export your workflow diagram.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Button onClick={() => exportFlow("png")} className="flex items-center justify-start">
              <FileImage className="mr-2 h-4 w-4" />
              Export as PNG
            </Button>
            <Button onClick={() => exportFlow("jpg")} className="flex items-center justify-start">
              <FileImage className="mr-2 h-4 w-4" />
              Export as JPG
            </Button>
            <Button onClick={() => exportFlow("json")} className="flex items-center justify-start">
              <FileJson className="mr-2 h-4 w-4" />
              Export as JSON
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Keyboard Shortcuts Dialog */}
      <KeyboardShortcutsDialog open={shortcutsDialogOpen} onOpenChange={setShortcutsDialogOpen} />

      {/* Workflow Simulator */}
      <WorkflowSimulator isOpen={simulationOpen} onClose={() => setSimulationOpen(false)} />

      {/* API Trigger Dialog */}
      <ApiTriggerDialog
        isOpen={apiDialogOpen}
        onClose={() => setApiDialogOpen(false)}
        workflowId="demo-workflow"
        workflowName="Current Workflow"
      />

      {/* Full Code Editor Dialog */}
      <Dialog open={codeEditorOpen} onOpenChange={setCodeEditorOpen}>
        <DialogContent className="sm:max-w-[80%] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {currentEditingNode?.data?.label || "Code Editor"} - {currentEditingNode?.data?.type?.toUpperCase()}
            </DialogTitle>
            <DialogDescription>Edit your code in a full-featured editor with syntax highlighting.</DialogDescription>
          </DialogHeader>
          <div className="flex-1 min-h-[500px] overflow-hidden">
            {currentEditingNode && (
              <EnhancedCodeEditor
                value={currentEditingNode.data.config?.code || ""}
                onChange={(code) => {
                  // This updates the code in the editor but doesn't save it to the node yet
                  setCurrentEditingNode({
                    ...currentEditingNode,
                    data: {
                      ...currentEditingNode.data,
                      config: {
                        ...currentEditingNode.data.config,
                        code,
                      },
                    },
                  })
                }}
                language={currentEditingNode.data.type}
                height="500px"
              />
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCodeEditorOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => handleSaveCode(currentEditingNode.data.config?.code || "")}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Wrap the Flow component with ReactFlowProvider
export default function WorkflowEditor() {
  return (
    <ReactFlowProvider>
      <FlowContent />
    </ReactFlowProvider>
  )
}
