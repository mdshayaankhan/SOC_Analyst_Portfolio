import React, { useState } from 'react';
import { ExternalLink, Terminal, Folder, ShieldCheck, Cpu, Code } from 'lucide-react';

const projects = [
  {
    id: 'soc-wazuh',
    title: 'SOC Wazuh Home Lab',
    category: 'Security Operations & SIEM',
    color: '#EA4335', // Google Red
    glowClass: 'glassmorphism-red',
    shortDesc: 'End-to-end telemetry pipeline integrating Wazuh SIEM, Ubuntu audit logs, and Windows Sysmon agents.',
    detailedDesc: 'Deployed a dedicated Wazuh manager orchestrating agents across Linux and Windows clients. Configured advanced OSSEC rules to alert on privilege escalation, unauthorized sudo edits, and anomalous Sysmon process spawns (Event ID 1). Built interactive active-response scripts for automated client firewall containment.',
    tags: ['Wazuh SIEM', 'Sysmon', 'Ubuntu Server', 'Threat Hunting', 'Active Response'],
    anchor: 'soc-lab'
  },
  {
    id: 'vuln-scan',
    title: 'Futuristic Vulnerability Scanner',
    category: 'Security Tools & Automation',
    color: '#4285F4', // Google Blue
    glowClass: 'glassmorphism-blue',
    shortDesc: 'Automated port scanner with service banner grabbing and real-time CVE database matching.',
    detailedDesc: 'Designed a lightweight Python engine running fast asynchronous SYN stealth socket checks. Extracted service banners from exposed target vectors, mapped configurations to known Common Vulnerabilities and Exposures (CVE) database lists, and generated interactive, high-fidelity security risk reports.',
    tags: ['Python', 'FastAPI', 'SYN Scan', 'CVE Database', 'NSE Scripts'],
    anchor: 'scanner'
  },
  {
    id: 'threat-agg',
    title: 'IOC Threat Intel Aggregator',
    category: 'Threat Intelligence',
    color: '#FBBC05', // Google Yellow
    glowClass: 'glassmorphism-yellow',
    shortDesc: 'Asynchronous crawler pulling Indicators of Compromise feeds and converting them into SIEM rule lists.',
    detailedDesc: 'Built a modular scheduler that fetches public threat indicators (malicious IPs, rogue hashes, domains) from alienvault, otx, and abuseIPDB feeds. Automatically normalizes datasets, updates local Wazuh IP address blacklist files, and triggers high-severity rules when hosts communicate with blacklisted IPs.',
    tags: ['Python', 'IOC Feeds', 'Threat Intel API', 'Cron Automation', 'SQLite'],
    anchor: null
  },
  {
    id: 'ad-defense',
    title: 'Active Directory Hardening Lab',
    category: 'Enterprise Defense',
    color: '#34A853', // Google Green
    glowClass: 'glassmorphism-green',
    shortDesc: 'Hardened corporate domain domain controllers featuring strict auditing, AppLocker, and GPO policies.',
    detailedDesc: 'Structured an isolated Windows Server sandbox to deploy AD DS. Set up centralized logging to forward Event ID 4625 (failed logins), Event ID 4720 (user creation), and Event ID 7045 (service creation) to the SIEM. Enabled GPOs for PowerShell script block logging and configured AppLocker to restrict user executables.',
    tags: ['Active Directory', 'Windows Server', 'Group Policies', 'AppLocker', 'Event Logging'],
    anchor: null
  }
];

const ProjectsVault = () => {
  const [selectedProj, setSelectedProj] = useState(projects[0]);

  const handleNavigate = (anchor) => {
    if (!anchor) return;
    const el = document.getElementById(anchor);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="glassmorphism p-6 rounded-xl border border-cyber-bg-gray flex flex-col gap-6 w-full max-w-4xl mx-auto shadow-2xl text-left font-mono relative">
      <div className="absolute top-0 right-0 w-40 h-40 bg-google-blue/5 rounded-full blur-3xl pointer-events-none" />
      
      {/* Upper Grid - Project folders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {projects.map((proj) => {
          const isSelected = selectedProj.id === proj.id;
          return (
            <div
              key={proj.id}
              onClick={() => setSelectedProj(proj)}
              className={`p-5 rounded-lg border transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-0.5 ${
                isSelected 
                  ? `${proj.glowClass} border-opacity-70 scale-[1.01]` 
                  : 'bg-cyber-bg-darkest/45 border-cyber-bg-gray/50 hover:border-cyber-bg-gray'
              }`}
            >
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded border bg-cyber-bg-gray/30 text-cyber-text-muted-bright" style={{ borderColor: isSelected ? proj.color : 'var(--glass-border)' }}>
                    {proj.category}
                  </span>
                  <Folder size={14} style={{ color: proj.color }} />
                </div>
                
                <h4 className="text-cyber-text-white font-bold text-sm tracking-wide mt-1.5">
                  {proj.title}
                </h4>
                
                <p className="text-[11px] text-cyber-text-light leading-relaxed font-sans mt-2">
                  {proj.shortDesc}
                </p>
              </div>

              {/* Tag previews */}
              <div className="flex flex-wrap gap-1 mt-4">
                {proj.tags.slice(0, 3).map(t => (
                  <span key={t} className="text-[8px] bg-cyber-bg-darker/60 text-cyber-text-light px-1.5 py-0.5 rounded border border-cyber-bg-gray/50">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Project Deep Dossier - lower panel */}
      {selectedProj && (
        <div className="bg-cyber-bg-darker/60 rounded-lg border border-cyber-bg-gray p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-cyber-bg-gray pb-2.5">
            <div className="flex items-center gap-2">
              <Terminal size={14} style={{ color: selectedProj.color }} className="animate-pulse" />
              <span className="text-[10px] text-cyber-text-white font-bold uppercase tracking-wider">
                DOSSIER: {selectedProj.title}
              </span>
            </div>
            
            {selectedProj.anchor && (
              <button
                onClick={() => handleNavigate(selectedProj.anchor)}
                className="text-[9px] text-google-blue hover:text-cyber-text-white flex items-center gap-1 hover:underline cursor-pointer transition-all border border-google-blue/30 px-2 py-0.5 rounded bg-google-blue/10"
              >
                <span>LAUNCH NODE</span>
                <ExternalLink size={10} />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="md:col-span-2">
              <span className="text-cyber-text-muted text-[8px] block uppercase font-bold">OPERATIONAL OVERVIEW:</span>
              <p className="text-cyber-text-light text-xs font-sans font-light leading-relaxed mt-1">
                {selectedProj.detailedDesc}
              </p>
            </div>

            <div className="bg-cyber-bg-darkest/50 p-4 rounded border border-cyber-bg-gray/60 flex flex-col gap-3">
              <div>
                <span className="text-cyber-text-muted text-[8px] block uppercase font-bold mb-1">TECH STACK INTEGRATION</span>
                <div className="flex flex-wrap gap-1">
                  {selectedProj.tags.map(t => (
                    <span key={t} className="text-[9px] bg-cyber-bg-gray/30 text-cyber-text-light px-1.5 py-0.5 rounded border border-cyber-bg-gray/40">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Dossier footer */}
          <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-cyber-bg-gray/40 text-[9px] text-cyber-text-muted">
            <ShieldCheck size={11} className="text-google-green" />
            <span>PROJECT SECURELY COMPILED & AUDITED</span>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProjectsVault;
