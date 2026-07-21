import React from 'react';

export default function BottomPanel() {
  const nodeClasses = [
    { label: 'HUMAN COMMAND', color: 'bg-[#00f0ff]' },
    { label: 'SOUL AI AGENTS', color: 'bg-[#f1f238]' },
    { label: 'LLM - RAG', color: 'bg-[#b052ff]' },
    { label: 'AI MODELS', color: 'bg-[#3b82f6]' },
    { label: 'ARC OS SYSTEMS', color: 'bg-[#d1d5db]' },
    { label: 'DATA - SATCOM - GATEWAY', color: 'bg-[#00ff00]' },
    { label: 'HARDWARE', color: 'bg-[#ff9900]' },
    { label: 'GOVERNANCE', color: 'bg-[#ff003c]' },
    { label: 'EXTERNAL ENDPOINTS', color: 'bg-[#ff00ff]' }
  ];

  const auditLogs = [
    { time: '16:45:01', label: 'AUDIT', labelColor: 'bg-[#374151] text-gray-300', text: 'AUDIT LEDGER • decision chain sealed • tamper-evident' },
    { time: '16:44:59', label: 'CMD', labelColor: 'bg-[#00f0ff]/20 text-[#00f0ff]', text: 'SENTINEL cued INTERCEPTOR - positive human gate required' },
    { time: '16:44:57', label: 'GOV', labelColor: 'bg-[#ff003c]/20 text-[#ff003c]', text: 'AUTHORISATION GATE - awaiting CDR. VOSS - ROE-07' },
    { time: '16:44:55', label: 'AI', labelColor: 'bg-[#f1f238]/20 text-[#f1f238]', text: 'SOUL - DECISION staged INTERCEPT - effector SE-204' },
    { time: '16:44:53', label: 'AI', labelColor: 'bg-[#f1f238]/20 text-[#f1f238]', text: 'RAG ANALYSIS - correlated 3 historical tracks' },
    { time: '16:44:51', label: 'SENSOR', labelColor: 'bg-[#ff9900]/20 text-[#ff9900]', text: 'RADAR MESH - 2 low contacts inbound - NW bearing' }
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 flex gap-8 z-10 pointer-events-none items-end">
      {/* Left: Node Classes Legend */}
      <div className="bg-[#1a1d24]/90 border border-border-main rounded-lg p-4 flex flex-col gap-3 pointer-events-auto w-[340px] backdrop-blur-sm">
        <div className="text-[10px] text-text-muted font-bold tracking-widest">NODE CLASSES</div>
        <div className="grid grid-cols-2 gap-y-3 gap-x-2">
          {nodeClasses.map((nc, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-sm ${nc.color}`}></div>
              <div className="text-[9px] text-text-muted uppercase tracking-wider">{nc.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Center/Right: Audit Logs */}
      <div className="flex-1 flex flex-col gap-3 pointer-events-auto pb-1 bg-[#13161d]/80 backdrop-blur-sm p-4 rounded-lg border border-border-main">
        {/* Header Row */}
        <div className="flex justify-between items-center w-full border-b border-border-main pb-2">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">AUDIT - EVENT LOG</span>
            <div className="flex items-center gap-1.5 text-[10px] text-text-muted tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-green shadow-[0_0_8px_var(--color-accent-green)]"></span>
              STREAMING
            </div>
          </div>
          <div className="text-[9px] text-text-muted tracking-widest uppercase text-right">
            39 NODES - 67 LINKS - TAMPER-EVIDENT
          </div>
        </div>

        {/* Log Lines */}
        <div className="flex flex-col gap-1.5 font-mono text-[10px]">
          {auditLogs.map((log, idx) => (
            <div key={idx} className="flex items-center gap-4 text-text-muted">
              <span className="w-[50px] opacity-70">{log.time}</span>
              <span className={`px-2 py-[1px] rounded text-center text-[8px] font-bold w-[45px] ${log.labelColor}`}>
                {log.label}
              </span>
              <span className={idx === 0 ? "text-text-main" : "opacity-80"}>
                {log.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
