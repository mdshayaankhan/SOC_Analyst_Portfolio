import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';

const skills = [
  { name: 'Wazuh', level: 95, category: 'SIEM & Detection', description: 'Orchestrating Wazuh SIEM deployment, editing OSSEC rules, configuring agent managers, and implementing Active Response scripts.' },
  { name: 'Threat Hunting', level: 90, category: 'Engineering', description: 'Tracking telemetry anomalies, checking processes, auditing persistent cronjobs, and matching indicators of compromise.' },
  { name: 'Incident Response', level: 85, category: 'Defense', description: 'Isolating compromised hosts, analyzing log dumps, forensic reporting, and automating response mitigation playbooks.' },
  { name: 'Networking', level: 85, category: 'Core', description: 'Deep comprehension of TCP/IP handshakes, routing protocols, subnets, firewall routing, and load balancers.' },
  { name: 'Linux OS', level: 88, category: 'Core', description: 'Hardening Ubuntu/CentOS servers, managing bash environments, auditing user sessions, and monitoring processes.' },
  { name: 'Python', level: 80, category: 'Automation', description: 'Scripting threat-intel feeds scraper, automating Nmap report parsing, and building custom log converters.' },
  { name: 'Java', level: 70, category: 'Programming', description: 'Object-oriented programming, data structures, and developing secure backend APIs.' },
  { name: 'SQL DB', level: 75, category: 'Core', description: 'Database queries optimization, identifying SQL injection footprints, and scanning databases for anomalies.' },
  { name: 'Wireshark', level: 88, category: 'Analysis', description: 'Analyzing packet capture (PCAP) payloads, identifying rogue network beacons, and extracting file attachments.' },
  { name: 'Nmap', level: 92, category: 'Analysis', description: 'Executing stealth port scans, identifying banner versions, writing NSE script tests, and scanning subnets.' },
  { name: 'Splunk', level: 80, category: 'SIEM & Detection', description: 'Building dashboards, writing Search Processing Language (SPL) queries, and correlating events.' },
  { name: 'Sysmon', level: 90, category: 'SIEM & Detection', description: 'Mapping Process Creation (Event ID 1), Network Connections (Event ID 3), and Registry alterations (Event ID 12).' }
];

const SkillsRadar = () => {
  const [hoveredSkill, setHoveredSkill] = useState(skills[0]);

  // Radar SVG constants
  const size = 300;
  const center = (size + 80) / 2;
  const radius = size * 0.35;
  const angleStep = (Math.PI * 2) / skills.length;

  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];
  
  const getCoordinates = (index, level) => {
    const angle = index * angleStep - Math.PI / 2;
    const x = center + radius * level * Math.cos(angle);
    const y = center + radius * level * Math.sin(angle);
    return { x, y };
  };

  const skillPoints = skills
    .map((skill, index) => {
      const coord = getCoordinates(index, skill.level / 100);
      return `${coord.x},${coord.y}`;
    })
    .join(' ');

  return (
    <div className="glassmorphism p-6 rounded-xl border border-cyber-bg-gray flex flex-col md:flex-row items-center gap-8 w-full max-w-4xl mx-auto shadow-xl">
      
      {/* Radar SVG Left */}
      <div className="relative flex justify-center items-center w-full md:w-1/2">
        <svg width={size + 80} height={size + 80} className="overflow-visible select-none">
          {levels.map((level, lIdx) => {
            const points = skills
              .map((_, sIdx) => {
                const coord = getCoordinates(sIdx, level);
                return `${coord.x},${coord.y}`;
              })
              .join(' ');
            return (
              <polygon
                key={lIdx}
                points={points}
                fill="none"
                stroke="rgba(66, 133, 244, 0.12)"
                strokeWidth="1"
              />
            );
          })}

          {skills.map((_, index) => {
            const outerCoord = getCoordinates(index, 1);
            return (
              <line
                key={index}
                x1={center}
                y1={center}
                x2={outerCoord.x}
                y2={outerCoord.y}
                stroke="rgba(66, 133, 244, 0.15)"
                strokeWidth="1"
              />
            );
          })}

          {/* Proficiency Filled Polygon */}
          <polygon
            points={skillPoints}
            fill="rgba(66, 133, 244, 0.25)"
            stroke="#4285F4"
            strokeWidth="2.5"
            style={{ filter: 'drop-shadow(0px 0px 8px rgba(66, 133, 244, 0.5))' }}
          />

          {/* Interactive Skill Nodes on Polygon */}
          {skills.map((skill, index) => {
            const coord = getCoordinates(index, skill.level / 100);
            const isHovered = hoveredSkill?.name === skill.name;
            return (
              <g
                key={skill.name}
                onMouseEnter={() => setHoveredSkill(skill)}
                className="cursor-pointer"
              >
                <circle
                  cx={coord.x}
                  cy={coord.y}
                  r={isHovered ? 6 : 4}
                  fill={isHovered ? '#FBBC05' : '#34A853'}
                  stroke={isHovered ? 'var(--cyber-text-white)' : 'var(--cyber-bg-darker)'}
                  strokeWidth="1.5"
                  className="transition-all duration-200"
                />
              </g>
            );
          })}

          {/* Skill Labels on Outer Rim */}
          {skills.map((skill, index) => {
            const coord = getCoordinates(index, 1.12);
            const isHovered = hoveredSkill?.name === skill.name;
            const angle = index * angleStep - Math.PI / 2;
            
            let textAnchor = 'middle';
            if (Math.cos(angle) > 0.15) textAnchor = 'start';
            if (Math.cos(angle) < -0.15) textAnchor = 'end';

            return (
              <text
                key={skill.name}
                x={coord.x}
                y={coord.y + 4}
                textAnchor={textAnchor}
                fill={isHovered ? 'var(--cyber-text-white)' : 'var(--cyber-text-muted)'}
                fontSize="10"
                fontWeight={isHovered ? 'bold' : 'normal'}
                className="font-mono transition-colors duration-200 cursor-pointer"
                onMouseEnter={() => setHoveredSkill(skill)}
              >
                {skill.name}
              </text>
            );
          })}
        </svg>

        {/* Central Core Light */}
        <div className="absolute w-2 h-2 rounded-full bg-google-blue glow-text-blue animate-ping" style={{ left: 'calc(50% - 4px)', top: 'calc(50% - 4px)' }} />
      </div>

      {/* Terminal Readout Right */}
      <div className="w-full md:w-1/2 flex flex-col self-stretch bg-cyber-bg-darker/40 border border-cyber-bg-gray rounded-xl p-5 text-left font-mono relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-google-blue/5 rounded-full blur-3xl pointer-events-none" />
        
        {/* Terminal Title */}
        <div className="flex items-center gap-2 border-b border-cyber-bg-gray pb-2.5 mb-4">
          <div className="w-2.5 h-2.5 rounded-full bg-google-red" />
          <div className="w-2.5 h-2.5 rounded-full bg-google-yellow" />
          <div className="w-2.5 h-2.5 rounded-full bg-google-green" />
          <span className="text-[10px] text-cyber-text-muted-bright uppercase tracking-widest font-bold ml-1.5">
            Skill Analytics Terminal
          </span>
        </div>

        {/* Console details */}
        {hoveredSkill ? (
          <div className="flex-1 flex flex-col gap-3">
            <div>
              <span className="text-cyber-text-muted-bright text-[10px]">TOOL / CONCEPT:</span>
              <h4 className="text-cyber-text-white font-bold text-lg tracking-wide uppercase font-sans mt-0.5">
                {hoveredSkill.name}
              </h4>
            </div>

            <div className="grid grid-cols-2 gap-4 border-y border-cyber-bg-gray/40 py-3">
              <div>
                <span className="text-cyber-text-muted-bright text-[9px] block">SECURITY CATEGORY</span>
                <span className="text-google-blue text-xs font-bold font-sans">
                  {hoveredSkill.category}
                </span>
              </div>
              <div>
                <span className="text-cyber-text-muted-bright text-[9px] block">PROFICIENCY LEVEL</span>
                <span className="text-google-green text-xs font-bold">
                  {hoveredSkill.level}% (SECURE)
                </span>
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-1.5 mt-2">
              <span className="text-cyber-text-muted-bright text-[9px]">CAPABILITIES SUMMARY:</span>
              <p className="text-cyber-text-light text-xs leading-relaxed font-sans font-light">
                {hoveredSkill.description}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-cyber-text-muted text-xs">
            Hover over a node or label to inspect capabilities.
          </div>
        )}

        {/* Footer line */}
        <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-cyber-bg-gray/40 text-[9px] text-google-yellow">
          <ShieldCheck size={11} className="text-google-green animate-pulse" />
          <span>VERIFIED HANDS-ON OPERATIONAL CAPABILITIES</span>
        </div>
      </div>
    </div>
  );
};

export default SkillsRadar;
