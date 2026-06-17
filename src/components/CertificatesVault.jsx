import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Award, Calendar, ExternalLink } from 'lucide-react';

const certs = [
  {
    id: 'google-cyber',
    scrambledTitle: 'G00GL3 CYB3R53CUR1TY PR0F35510N4L',
    realTitle: 'Google Cybersecurity Professional Certificate',
    issuer: 'Google',
    date: 'Dec 2024',
    verifyLink: '#',
    details: 'Comprehensive security analytics including packet capture inspection, Linux administration, Python network automation, SIEM queries creation, and threat profiling.'
  },
  {
    id: 'ethical-hacking',
    scrambledTitle: '3TH1C4L H4CK1NG 5P3C14L15T TR41N1NG',
    realTitle: 'Ethical Hacking Specialist Training',
    issuer: 'EC-Council Partner Training',
    date: 'May 2025',
    verifyLink: '#',
    details: 'Offensive cyber tactics covering active reconnaissance (Nmap, Nessus), vulnerability analysis, wireless exploits, privilege escalation vectors, and firewall evasion.'
  }
];

const CertCard = ({ cert }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [displayText, setDisplayText] = useState(cert.scrambledTitle);
  const [isDecrypted, setIsDecrypted] = useState(false);

  // Scramble text animation on hover
  useEffect(() => {
    if (!isHovered) {
      setDisplayText(cert.scrambledTitle);
      setIsDecrypted(false);
      return;
    }

    let iterations = 0;
    const chars = 'ABCDEF0123456789X$/%#@!^&*()_+';
    const interval = setInterval(() => {
      setDisplayText(prev => {
        return cert.realTitle
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iterations) return cert.realTitle[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('');
      });

      iterations += 2;
      if (iterations >= cert.realTitle.length) {
        clearInterval(interval);
        setDisplayText(cert.realTitle);
        setIsDecrypted(true);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [isHovered, cert.realTitle, cert.scrambledTitle]);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative p-6 rounded-xl border transition-all duration-500 overflow-hidden min-h-[200px] flex flex-col justify-between cursor-pointer ${
        isDecrypted 
          ? 'glassmorphism-blue border-google-blue/40 shadow-lg shadow-google-blue/10' 
          : 'bg-cyber-bg-darker/60 border-cyber-bg-gray/50 hover:border-cyber-bg-gray'
      }`}
    >
      {/* Holographic scanning diagonal gradient */}
      {isDecrypted && (
        <div 
          className="absolute inset-0 pointer-events-none opacity-20 bg-gradient-to-tr from-transparent via-white to-transparent" 
          style={{
            backgroundSize: '200% 200%',
            animation: 'pulse-slow 4s ease-in-out infinite'
          }}
        />
      )}

      {/* Lock/Unlock status overlay */}
      <div className="flex justify-between items-start mb-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${
          isDecrypted ? 'bg-google-blue/15 border-google-blue/30 text-google-blue' : 'bg-cyber-bg-gray/30 border-cyber-bg-gray text-cyber-text-muted'
        }`}>
          {isDecrypted ? <Unlock size={14} className="animate-pulse" /> : <Lock size={14} />}
        </div>
        <span className={`font-mono text-[9px] font-bold px-2 py-0.5 rounded border ${
          isDecrypted 
            ? 'bg-google-green/10 border-google-green/30 text-google-green' 
            : 'bg-google-yellow/10 border-google-yellow/30 text-google-yellow'
        }`}>
          {isDecrypted ? 'SECURE DECRYPTED' : 'ENCRYPTED VAULT'}
        </span>
      </div>

      {/* Scrambling Title */}
      <div className="mb-4">
        <h4 className="font-mono text-sm sm:text-base font-bold text-cyber-text-white leading-snug tracking-wide">
          {displayText}
        </h4>
        <span className="font-mono text-[10px] text-cyber-text-muted mt-1 block">
          ISSUER: {cert.issuer}
        </span>
      </div>

      {/* Details block revealed on decrypt */}
      {isDecrypted ? (
        <div className="flex-1 flex flex-col justify-between mt-2 pt-3 border-t border-cyber-bg-gray font-sans">
          <p className="text-[11px] text-cyber-text-light leading-relaxed mb-4">
            {cert.details}
          </p>
          <div className="flex items-center justify-between font-mono text-[9px] text-cyber-text-muted mt-auto">
            <span className="flex items-center gap-1">
              <Calendar size={10} className="text-google-blue" />
              DATE: {cert.date}
            </span>
            <span className="flex items-center gap-1 hover:text-cyber-text-white cursor-pointer transition-colors">
              VERIFY VAULT
              <ExternalLink size={10} />
            </span>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center border-t border-cyber-bg-gray/40 pt-4">
          <span className="font-mono text-[10px] text-cyber-text-muted tracking-widest uppercase animate-pulse">
            [HOVER TO INITIATE DECRYPTION]
          </span>
        </div>
      )}
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
