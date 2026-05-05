import { Github, Linkedin } from 'lucide-react'

export default function Footer() {
  return (
    <footer
      className="fixed bottom-0 w-full z-50 flex items-center justify-between backdrop-blur-md backdrop-saturate-150"
      style={{
        height: '44px',
        background: 'rgba(0,0,0,0.18)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 -8px 32px rgba(0,0,0,0.35)',
      }}
    >
      <span
        className="pl-6 tracking-widest text-white/40"
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px' }}
      >
        DEVELOPED BY ARITTRO CHOWDHURY
      </span>

      <div className="flex items-center gap-4" style={{ paddingRight: '24px' }}>
        <a
          href="https://github.com/arittroc/-Atmospheric-Altitude-Ascent"
          aria-label="GitHub Repository"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/40 hover:text-white/80 transition-opacity"
        >
          <Github size={15} />
        </a>
        <a
          href="https://www.linkedin.com/in/arittro-c-34a637147/"
          aria-label="LinkedIn Profile"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/40 hover:text-white/80 transition-opacity"
        >
          <Linkedin size={15} />
        </a>
      </div>
    </footer>
  )
}
