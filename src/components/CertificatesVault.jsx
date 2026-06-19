import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Award, Calendar, ExternalLink } from 'lucide-react';

const certs = [
  {
    id: 'google-cyber',
    scrambledTitle: 'G00GL3 CYB3R53CUR1TY PR0F35510N4L',
    realTitle: 'Google Cybersecurity Professional Certificate',
    issuer: 'Google',
    date: 'Jun 2026',
    verifyLink: '#',
    details: 'Comprehensive security analytics including packet capture inspection, Linux administration, Python network automation, SIEM queries creation, and threat profiling.'
  },
  {
    id: 'ethical-hacking',
    scrambledTitle: 'N5DC 5K1LL 1ND14 C3RT1F1C4T3',
    realTitle: 'NSDC Skill India Certificate',
    issuer: 'NSDC (National Skill Development Corporation)',
    date: 'Dec 2024',
    verifyLink: '#',
    details: 'Offensive cyber tactics covering active reconnaissance (Nmap, Nessus), vulnerability analysis, wireless exploits, privilege escalation vectors, and firewall evasion.'
  }
];

// Deterministic helper to scramble text for the encrypted state
const scramble = (text) => {
  const chars = '0123456789ABCDEF!@#$';
  return text
    .split('')
    .map((char, i) => {
      if (char === ' ' || char === ',' || char === '.' || char === '(' || char === ')') return char;
      const index = (char.charCodeAt(0) + i) % chars.length;
      return chars[index];
    })
    .join('');
};

const CertCard = ({ cert }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [displayTitle, setDisplayTitle] = useState(cert.scrambledTitle);
  const [displayDetails, setDisplayDetails] = useState(scramble(cert.details));
  const [displayDate, setDisplayDate] = useState(scramble(cert.date));
  const [isDecrypted, setIsDecrypted] = useState(false);

  // Sync state if cert changes
  useEffect(() => {
    if (!isHovered) {
      setDisplayTitle(cert.scrambledTitle);
      setDisplayDetails(scramble(cert.details));
      setDisplayDate(scramble(cert.date));
      setIsDecrypted(false);
    }
  }, [cert, isHovered]);

  // Scramble text animation on hover
  useEffect(() => {
    if (!isHovered) return;

    let progress = 0;
    const interval = setInterval(() => {
      progress += 4;
      
      // Update Title
      setDisplayTitle(() => {
        const revealCount = Math.floor((cert.realTitle.length * progress) / 100);
        return cert.realTitle
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < revealCount) return cert.realTitle[index];
            const chars = 'ABCDEF0123456789';
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('');
      });

      // Update Details
      setDisplayDetails(() => {
        const revealCount = Math.floor((cert.details.length * progress) / 100);
        return cert.details
          .split('')
          .map((char, index) => {
            if (char === ' ' || char === ',' || char === '.' || char === '(' || char === ')') return char;
            if (index < revealCount) return cert.details[index];
            const chars = '0123456789!@#$';
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('');
      });

      // Update Date
      setDisplayDate(() => {
        const revealCount = Math.floor((cert.date.length * progress) / 100);
        return cert.date
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < revealCount) return cert.date[index];
            const chars = '0123456789';
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('');
      });

      if (progress >= 100) {
        clearInterval(interval);
        setDisplayTitle(cert.realTitle);
        setDisplayDetails(cert.details);
        setDisplayDate(cert.date);
        setIsDecrypted(true);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [isHovered, cert]);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative p-6 rounded-xl border transition-all duration-500 overflow-hidden min-h-[120px] flex flex-col justify-between cursor-pointer bg-cyber-bg-darker border-cyber-bg-gray/80 ${isDecrypted
          ? 'glassmorphism-blue border-google-blue/50'
          : 'hover:border-google-yellow/45'
        }`}
    >
      {/* Holographic scanning diagonal gradient */}
      {isDecrypted && (
        <div
          className="absolute inset-0 pointer-events-none opacity-20 bg-gradient-to-tr from-transparent via-white to-transparent"
          style={{
            backgroundSize: '200% 200%',
            animation: 'glow-pulse 4s ease-in-out infinite'
          }}
        />
      )}

      {/* Lock/Unlock status overlay */}
      <div className="flex justify-between items-start mb-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${isDecrypted ? 'bg-google-blue/15 border-google-blue/30 text-google-blue' : 'bg-cyber-bg-gray/30 border-cyber-bg-gray/80 text-cyber-text-muted-bright'
          }`}>
          {isDecrypted ? <Unlock size={14} className="animate-pulse" /> : <Lock size={14} />}
        </div>
        <span className={`font-mono text-[9px] font-bold px-2 py-0.5 rounded border ${isDecrypted
            ? 'bg-google-green/10 border-google-green/30 text-google-green'
            : 'bg-google-yellow/10 border-google-yellow/30 text-google-yellow'
          }`}>
          {isDecrypted ? 'SECURE DECRYPTED' : 'ENCRYPTED VAULT'}
        </span>
      </div>

      {/* Scrambling Title */}
      <div className="mb-4">
        <h4 className="font-mono text-sm sm:text-base font-bold text-cyber-text-white leading-snug tracking-wide">
          {displayTitle}
        </h4>
        <span className="font-mono text-[10px] text-cyber-text-muted-bright mt-1 block">
          ISSUER: {cert.issuer}
        </span>
      </div>

      {/* Details block always present in layout but expands grid height on hover */}
      <div 
        className={`grid transition-all duration-500 ${
          isHovered ? 'grid-rows-[1fr] opacity-100 mt-2 pt-3 border-t border-cyber-bg-gray/50' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
        }`}
        style={{ display: 'grid' }}
      >
        <div className="overflow-hidden flex flex-col justify-between font-sans">
          <p className="text-[11px] text-cyber-text-light leading-relaxed mb-4">
            {displayDetails}
          </p>
          <div className="flex items-center justify-between font-mono text-[9px] text-cyber-text-muted-bright mt-auto pt-2 border-t border-cyber-bg-gray/20">
            <span className="flex items-center gap-1">
              <Calendar size={10} className="text-google-blue" />
              DATE: {displayDate}
            </span>
            {isDecrypted ? (
              <a 
                href={cert.verifyLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-1 text-google-blue hover:text-white cursor-pointer transition-colors"
              >
                VERIFY VAULT
                <ExternalLink size={10} />
              </a>
            ) : (
              <span className="flex items-center gap-1 text-google-yellow/80 font-bold tracking-wider animate-pulse">
                [DECRYPTING VAULT]
                <Lock size={8} />
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const CertificatesVault = () => {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certs.map((cert) => (
          <CertCard key={cert.id} cert={cert} />
        ))}
      </div>
    </div>
  );
};

export default CertificatesVault;
