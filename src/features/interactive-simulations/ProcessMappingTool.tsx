/**
 * Process Mapping Tool - Interactive Process Mapping
 * 
 * Features:
 * - Drag-and-drop process node creation
 * - Flowchart symbols (start, end, process, decision, etc.)
 * - Value-added analysis (VA/NVA/BVA)
 * - Cycle time tracking
 * - Export to various formats
 */

import React, { useState, useCallback, useRef } from 'react';
import type { ProcessNode, ProcessEdge, ProcessMap, ProcessNodeType } from './types';
import styles from './InteractiveSimulations.module.css';

interface ProcessMappingToolProps {
  onExport?: (processMap: ProcessMap) => void;
  onSave?: (processMap: ProcessMap) => void;
}

const NODE_TYPES: { type: ProcessNodeType; label: string; icon: string; description: string }[] = [
  { type: 'start', label: 'Start', icon: '⏵', description: 'Process start point' },
  { type: 'end', label: 'End', icon: '⏹', description: 'Process end point' },
  { type: 'process', label: 'Process', icon: '▭', description: 'Process step' },
  { type: 'decision', label: 'Decision', icon: '◇', description: 'Decision point' },
  { type: 'delay', label: 'Delay', icon: '◯', description: 'Wait/delay' },
  { type: 'document', label: 'Document', icon: '📄', description: 'Document' },
  { type: 'data', label: 'Data', icon: '▱', description: 'Data input/output' },
  { type: 'subprocess', label: 'Subprocess', icon: '▭▭', description: 'Subprocess' },
];

const VALUE_ADDED_LABELS: Record<string, string> = {
  va: 'Value Added',
  nva: 'Non-Value Added',
  bva: 'Business Value Added',
};

export const ProcessMappingTool: React.FC<ProcessMappingToolProps> = ({ 
  onExport, 
  onSave 
}) => {
  const [processName, setProcessName] = useState('New Process Map');
  const [nodes, setNodes] = useState<ProcessNode[]>([]);
  const [edges, setEdges] = useState<ProcessEdge[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggedType, setDraggedType] = useState<ProcessNodeType | null>(null);

  // Add new node
  const addNode = useCallback((type: ProcessNodeType, x: number, y: number) => {
    const newNode: ProcessNode = {
      id: `node-${Date.now()}`,
      type,
      label: type === 'start' ? 'Start' : type === 'end' ? 'End' : 'New Step',
      x,
      y,
      valueAdded: 'va',
    };
    
    setNodes([...nodes, newNode]);
    setSelectedNode(newNode.id);
  }, [nodes]);

  // Update node
  const updateNode = useCallback((id: string, updates: Partial<ProcessNode>) => {
    setNodes(nodes.map(n => n.id === id ? { ...n, ...updates } : n));
  }, [nodes]);

  // Delete node
  const deleteNode = useCallback((id: string) => {
    setNodes(nodes.filter(n => n.id !== id));
    setEdges(edges.filter(e => e.source !== id && e.target !== id));
    if (selectedNode === id) setSelectedNode(null);
  }, [nodes, edges, selectedNode]);

  // Add edge
  const addEdge = useCallback((source: string, target: string) => {
    // Prevent duplicate edges
    if (edges.some(e => e.source === source && e.target === target)) return;
    // Prevent self-loops
    if (source === target) return;
    
    const newEdge: ProcessEdge = {
      id: `edge-${Date.now()}`,
      source,
      target,
    };
    
    setEdges([...edges, newEdge]);
  }, [edges]);

  // Update edge
  const updateEdge = useCallback((id: string, updates: Partial<ProcessEdge>) => {
    setEdges(edges.map(e => e.id === id ? { ...e, ...updates } : e));
  }, [edges]);

  // Delete edge
  const deleteEdge = useCallback((id: string) => {
    setEdges(edges.filter(e => e.id !== id));
    if (selectedEdge === id) setSelectedEdge(null);
  }, [edges, selectedEdge]);

  // Handle canvas click
  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === canvasRef.current && draggedType) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      addNode(draggedType, x, y);
      setDraggedType(null);
    } else if (e.target === canvasRef.current) {
      setSelectedNode(null);
      setSelectedEdge(null);
    }
  }, [draggedType, addNode]);

  // Handle node click for connection
  const handleNodeClick = useCallback((nodeId: string) => {
    if (isConnecting) {
      if (connectingFrom && connectingFrom !== nodeId) {
        addEdge(connectingFrom, nodeId);
        setIsConnecting(false);
        setConnectingFrom(null);
      }
    } else {
      setSelectedNode(nodeId);
      setSelectedEdge(null);
    }
  }, [isConnecting, connectingFrom, addEdge]);

  // Start connection mode
  const startConnection = useCallback(() => {
    if (selectedNode) {
      setIsConnecting(true);
      setConnectingFrom(selectedNode);
    }
  }, [selectedNode]);

  // Calculate process metrics
  const metrics = React.useMemo(() => {
    const totalSteps = nodes.filter(n => n.type === 'process').length;
    const totalTime = nodes.reduce((sum, n) => sum + (n.cycleTime || 0), 0);
    const vaTime = nodes
      .filter(n => n.valueAdded === 'va')
      .reduce((sum, n) => sum + (n.cycleTime || 0), 0);
    const nvaTime = nodes
      .filter(n => n.valueAdded === 'nva')
      .reduce((sum, n) => sum + (n.cycleTime || 0), 0);
    
    return {
      totalSteps,
      totalTime,
      vaTime,
      nvaTime,
      vaPercentage: totalTime > 0 ? (vaTime / totalTime) * 100 : 0,
      nvaPercentage: totalTime > 0 ? (nvaTime / totalTime) * 100 : 0,
    };
  }, [nodes]);

  // Export process map
  const handleExport = useCallback(() => {
    const processMap: ProcessMap = {
      id: `map-${Date.now()}`,
      name: processName,
      nodes,
      edges,
      metadata: {
        created: Date.now(),
        modified: Date.now(),
        author: 'User',
        version: '1.0',
      },
    };
    onExport?.(processMap);
  }, [processName, nodes, edges, onExport]);

  // Save process map
  const handleSave = useCallback(() => {
    const processMap: ProcessMap = {
      id: `map-${Date.now()}`,
      name: processName,
      nodes,
      edges,
      metadata: {
        created: Date.now(),
        modified: Date.now(),
        author: 'User',
        version: '1.0',
      },
    };
    onSave?.(processMap);
  }, [processName, nodes, edges, onSave]);

  // Get node style based on type
  const getNodeStyle = (node: ProcessNode): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      left: node.x - 50,
      top: node.y - 25,
      width: 100,
      height: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: 'bold',
      zIndex: 10,
    };

    switch (node.type) {
      case 'start':
      case 'end':
        return { ...baseStyle, borderRadius: '25px', backgroundColor: '#4CAF50', color: 'white' };
      case 'decision':
        return { 
          ...baseStyle, 
          transform: 'rotate(45deg)', 
          backgroundColor: '#FF9800',
          width: 60,
          height: 60,
          left: node.x - 30,
          top: node.y - 30,
        };
      case 'delay':
        return { ...baseStyle, borderRadius: '50%', backgroundColor: '#9E9E9E', color: 'white' };
      case 'document':
        return { ...baseStyle, borderRadius: '0 0 10px 10px', backgroundColor: '#2196F3', color: 'white' };
      case 'data':
        return { ...baseStyle, clipPath: 'polygon(20% 0%, 100% 0%, 80% 100%, 0% 100%)', backgroundColor: '#9C27B0', color: 'white' };
      case 'subprocess':
        return { ...baseStyle, border: '2px dashed #333', backgroundColor: '#E0E0E0' };
      default:
        return { ...baseStyle, backgroundColor: '#E3F2FD', border: '2px solid #2196F3' };
    }
  };

  const selectedNodeData = nodes.find(n => n.id === selectedNode);

  return (
    <div className={styles.simulationContainer}>
      <h2 className={styles.title}>Process Mapping Tool</h2>
      
      <div className={styles.processHeader}>
        <input
          type="text"
          value={processName}
          onChange={(e) => setProcessName(e.target.value)}
          className={styles.titleInput}
          placeholder="Process name..."
        />
      </div>

      <div className={styles.mappingLayout}>
        <div className={styles.toolbox}>
          <h3>Elements</h3>
          {NODE_TYPES.map(nodeType => (
            <button
              key={nodeType.type}
              className={`${styles.toolboxItem} ${draggedType === nodeType.type ? styles.active : ''}`}
              onClick={() => setDraggedType(nodeType.type)}
              title={nodeType.description}
            >
              <span className={styles.toolboxIcon}>{nodeType.icon}</span>
              <span>{nodeType.label}</span>
            </button>
          ))}
          
          <div className={styles.toolboxActions}>
            <button 
              onClick={startConnection}
              className={styles.button}
              disabled={!selectedNode}
            >
              {isConnecting ? 'Click target node...' : 'Connect Nodes'}
            </button>
          </div>
        </div>

        <div className={styles.canvasContainer}>
          <div
            ref={canvasRef}
            className={`${styles.processCanvas} ${draggedType ? styles.addMode : ''} ${isConnecting ? styles.connectMode : ''}`}
            onClick={handleCanvasClick}
          >
            {/* Grid background */}
            <div className={styles.gridBackground} />
            
            {/* Edges */}
            <svg className={styles.edgesLayer}>
              {edges.map(edge => {
                const source = nodes.find(n => n.id === edge.source);
                const target = nodes.find(n => n.id === edge.target);
                if (!source || !target) return null;
                
                return (
                  <g key={edge.id}>
                    <line
                      x1={source.x}
                      y1={source.y}
                      x2={target.x}
                      y2={target.y}
                      className={`${styles.edge} ${selectedEdge === edge.id ? styles.selected : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEdge(edge.id);
                        setSelectedNode(null);
                      }}
                      markerEnd="url(#arrowhead)"
                    />
                    {edge.label && (
                      <text
                        x={(source.x + target.x) / 2}
                        y={(source.y + target.y) / 2 - 5}
                        className={styles.edgeLabel}
                      >
                        {edge.label}
                      </text>
                    )}
                  </g>
                );
              })}
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3.5, 0 7" fill="#666" />
                </marker>
              </defs>
            </svg>

            {/* Nodes */}
            {nodes.map(node => (
              <div
                key={node.id}
                style={getNodeStyle(node)}
                className={`${styles.processNode} ${selectedNode === node.id ? styles.selected : ''} ${node.valueAdded}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleNodeClick(node.id);
                }}
              >
                <span style={{ transform: node.type === 'decision' ? 'rotate(-45deg)' : undefined }}>
                  {node.label}
                </span>
                {node.cycleTime !== undefined && (
                  <span className={styles.cycleTimeBadge}>{node.cycleTime}min</span>
                )}
              </div>
            ))}

            {/* Connection hint */}
            {isConnecting && connectingFrom && (
              <div className={styles.connectionHint}>
                Click on another node to connect
              </div>
            )}
          </div>
        </div>

        <div className={styles.propertiesPanel}>
          {selectedNodeData ? (
            <>
              <h3>Node Properties</h3>
              
              <div className={styles.formGroup}>
                <label>Label</label>
                <input
                  type="text"
                  value={selectedNodeData.label}
                  onChange={(e) => updateNode(selectedNodeData.id, { label: e.target.value })}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Type</label>
                <select
                  value={selectedNodeData.type}
                  onChange={(e) => updateNode(selectedNodeData.id, { type: e.target.value as ProcessNodeType })}
                  className={styles.select}
                >
                  {NODE_TYPES.map(t => (
                    <option key={t.type} value={t.type}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Value Added</label>
                <select
                  value={selectedNodeData.valueAdded}
                  onChange={(e) => updateNode(selectedNodeData.id, { 
                    valueAdded: e.target.value as 'va' | 'nva' | 'bva' 
                  })}
                  className={styles.select}
                >
                  <option value="va">{VALUE_ADDED_LABELS.va}</option>
                  <option value="nva">{VALUE_ADDED_LABELS.nva}</option>
                  <option value="bva">{VALUE_ADDED_LABELS.bva}</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Cycle Time (minutes)</label>
                <input
                  type="number"
                  value={selectedNodeData.cycleTime || ''}
                  onChange={(e) => updateNode(selectedNodeData.id, { 
                    cycleTime: parseFloat(e.target.value) || undefined 
                  })}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Owner</label>
                <input
                  type="text"
                  value={selectedNodeData.owner || ''}
                  onChange={(e) => updateNode(selectedNodeData.id, { owner: e.target.value })}
                  className={styles.input}
                  placeholder="Process owner..."
                />
              </div>

              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea
                  value={selectedNodeData.description || ''}
                  onChange={(e) => updateNode(selectedNodeData.id, { description: e.target.value })}
                  className={styles.textarea}
                  rows={3}
                />
              </div>

              <button 
                onClick={() => deleteNode(selectedNodeData.id)}
                className={styles.buttonDanger}
              >
                Delete Node
              </button>
            </>
          ) : selectedEdge ? (
            <>
              <h3>Connection Properties</h3>
              
              <div className={styles.formGroup}>
                <label>Label</label>
                <input
                  type="text"
                  value={edges.find(e => e.id === selectedEdge)?.label || ''}
                  onChange={(e) => updateEdge(selectedEdge, { label: e.target.value })}
                  className={styles.input}
                  placeholder="e.g., Yes, No"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Probability (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={edges.find(e => e.id === selectedEdge)?.probability || ''}
                  onChange={(e) => updateEdge(selectedEdge, { 
                    probability: parseFloat(e.target.value) 
                  })}
                  className={styles.input}
                />
              </div>

              <button 
                onClick={() => deleteEdge(selectedEdge)}
                className={styles.buttonDanger}
              >
                Delete Connection
              </button>
            </>
          ) : (
            <>
              <h3>Process Metrics</h3>
              
              <div className={styles.metricsPanel}>
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>Total Steps</span>
                  <span className={styles.metricValue}>{metrics.totalSteps}</span>
                </div>
                
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>Total Time</span>
                  <span className={styles.metricValue}>{metrics.totalTime} min</span>
                </div>
                
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>VA Time</span>
                  <span className={styles.metricValue}>{metrics.vaTime} min</span>
                </div>
                
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>NVA Time</span>
                  <span className={styles.metricValue}>{metrics.nvaTime} min</span>
                </div>
                
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>VA %</span>
                  <span className={`${styles.metricValue} ${metrics.vaPercentage < 30 ? styles.warning : ''}`}>
                    {metrics.vaPercentage.toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className={styles.legend}>
                <h4>Value Added Legend</h4>
                <div className={styles.legendItem}>
                  <span className={`${styles.legendColor} ${styles.va}`} />
                  <span>Value Added</span>
                </div>
                <div className={styles.legendItem}>
                  <span className={`${styles.legendColor} ${styles.nva}`} />
                  <span>Non-Value Added</span>
                </div>
                <div className={styles.legendItem}>
                  <span className={`${styles.legendColor} ${styles.bva}`} />
                  <span>Business Value Added</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className={styles.actions}>
        <button onClick={handleSave} className={styles.button} disabled={nodes.length === 0}>
          Save Map
        </button>
        <button onClick={handleExport} className={styles.buttonSecondary} disabled={nodes.length === 0}>
          Export
        </button>
        <button 
          onClick={() => { setNodes([]); setEdges([]); }} 
          className={styles.buttonDanger}
        >
          Clear All
        </button>
      </div>
    </div>
  );
};
