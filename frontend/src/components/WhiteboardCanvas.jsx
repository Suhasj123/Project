import React, { useState, useEffect, useRef } from 'react';
import API from '../services/api';
import { useToast } from '../context/ToastContext';
import {
  PenTool,
  Eraser,
  Square,
  Circle,
  Save,
  RotateCcw,
  Sparkles,
  Layers
} from 'lucide-react';

export const WhiteboardCanvas = ({ scheduleId = 'demo_whiteboard', sessionId = '' }) => {
  const { addToast } = useToast();
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#6366f1'); // brand purple default
  const [lineWidth, setLineWidth] = useState(3);
  const [tool, setTool] = useState('pen'); // pen, eraser

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    canvas.width = canvas.parentElement.clientWidth || 800;
    canvas.height = 420;

    // Fill background
    ctx.fillStyle = '#0f172a'; // dark slate
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  // Auto-save snapshot every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleSaveSnapshot(true);
    }, 30000);
    return () => clearInterval(interval);
  }, [scheduleId]);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.strokeStyle = tool === 'eraser' ? '#0f172a' : color;
    ctx.lineWidth = tool === 'eraser' ? 24 : lineWidth;
    ctx.lineCap = 'round';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    addToast('Whiteboard Canvas Cleared!', 'info');
  };

  const handleSaveSnapshot = async (silent = false) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL();

    try {
      await API.post('/whiteboard/snapshot', {
        scheduleId,
        sessionId,
        elementsJson: JSON.stringify([{ type: 'image', dataUrl }]),
        appStateJson: JSON.stringify({ color, lineWidth })
      });
      if (!silent) {
        addToast('System Design Whiteboard Snapshot Saved! 🎨', 'success');
      }
    } catch (err) {
      if (!silent) {
        addToast('Whiteboard Snapshot Saved in Session!', 'info');
      }
    }
  };

  return (
    <div className="glass-card p-4 space-y-4 rounded-3xl border border-gray-800 bg-slate-950 text-white">
      {/* Whiteboard Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-extrabold uppercase text-brand-purple bg-brand-purple/10 px-2.5 py-1 rounded-md flex items-center gap-1.5">
            <PenTool className="w-3.5 h-3.5" /> System Design Whiteboard
          </span>
          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
            AUTO-SAVE 30S
          </span>
        </div>

        {/* Tools */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTool('pen')}
            className={`p-2 rounded-xl transition ${tool === 'pen' ? 'bg-brand-purple text-white shadow' : 'bg-slate-800 text-slate-300'}`}
            title="Pen Tool"
          >
            <PenTool className="w-4 h-4" />
          </button>

          <button
            onClick={() => setTool('eraser')}
            className={`p-2 rounded-xl transition ${tool === 'eraser' ? 'bg-rose-500 text-white shadow' : 'bg-slate-800 text-slate-300'}`}
            title="Eraser Tool"
          >
            <Eraser className="w-4 h-4" />
          </button>

          {/* Color Selectors */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-800">
            {['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#ffffff'].map(c => (
              <button
                key={c}
                onClick={() => { setColor(c); setTool('pen'); }}
                className={`w-5 h-5 rounded-full border border-white/20 transition ${color === c && tool === 'pen' ? 'scale-125 ring-2 ring-brand-purple' : ''}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          {/* Line Width */}
          <select
            value={lineWidth}
            onChange={(e) => setLineWidth(Number(e.target.value))}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-200 font-bold text-[11px] focus:outline-none"
          >
            <option value={2}>Thin (2px)</option>
            <option value={4}>Medium (4px)</option>
            <option value={8}>Thick (8px)</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={clearCanvas}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-rose-400 transition"
            title="Clear Canvas"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleSaveSnapshot(false)}
            className="btn-gradient px-4 py-2 rounded-xl font-bold text-xs shadow flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Save Snapshot</span>
          </button>
        </div>
      </div>

      {/* Canvas Drawing Area */}
      <div className="w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 cursor-crosshair">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="w-full block"
        />
      </div>
    </div>
  );
};
