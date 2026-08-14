import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff } from 'lucide-react';
import { UserProfile } from '../../types';
import { GoogleSheetService } from '../../services/googleSheetService';
import { CSSProperties, ReactNode } from 'react';

type FadeUpProps = {
  children: ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  className?: string;
  style?: CSSProperties;
  as?: 'div' | 'section' | 'span' | 'h1' | 'h2' | 'h3' | 'p' | 'nav' | 'form';
  once?: boolean;
  key?: React.Key;
};

export function FadeUp({
  children, delay = 0, duration = 0.7, y = 24,
  className, style, as = 'div', once = true,
}: FadeUpProps) {
  const Tag = motion[as as any] || motion.div;
  return (
    <Tag
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.2 }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Tag>
  );
}

interface LoginProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [usersCache, setUsersCache] = useState<any[] | null>(null);

  React.useEffect(() => {
    // Prefetch users so login is instant
    GoogleSheetService.fetchUsers().then(setUsersCache).catch(console.error);
  }, []);

  const headingText = "WE BUILD END-TO-END AI AUTOMATION SYSTEMS.";
  const words = headingText.split(' ');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    setErrorMsg('');
    setIsLoading(true);
    
    try {
      const users = usersCache || await GoogleSheetService.fetchUsers();
      
      const validUser = users.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
      );
      
      if (validUser) {
        onLoginSuccess({
          name: validUser.name,
          email: validUser.email,
          role: validUser.role as any,
          department: validUser.department,
          rememberMe: true
        });
      } else {
        setErrorMsg('Invalid ID or Password.');
      }
    } catch (err) {
      setErrorMsg('Error connecting to the database.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://db.onlinewebfonts.com/c/e66905e07608167a84e6ad52f638c3c6?family=Helvetica+Now+Var');
        
        .ai-hero-wrapper {
          font-family: 'Helvetica Now Var', 'Helvetica Neue', Helvetica, Arial, sans-serif;
          background-color: #000;
        }

        .ai-hero-wrapper * {
          font-family: inherit;
        }

        .ai-bg-video {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          object-fit: cover;
          z-index: 0;
          pointer-events: none;
        }

        .ai-section {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          height: 100vh;
          padding: 70px 32px 32px 32px;
        }

        @media (max-width: 900px) {
          .ai-section {
            padding: 90px 18px 32px 18px;
          }
        }

        .ai-content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          max-width: 720px;
          width: 100%;
        }

        .ai-heading {
          display: flex;
          flex-wrap: wrap;
          gap: 0.25em;
          margin: 0;
          font-size: clamp(26px, 3vw, 42px);
          font-weight: 700;
          line-height: 1.08;
          letter-spacing: -0.01em;
          text-transform: uppercase;
          color: #fff;
        }

        .ai-subtext {
          margin-top: 24px;
          font-size: 14px;
          line-height: 1.65;
          color: rgba(255, 255, 255, 0.85);
          max-width: 260px;
        }
        
        .ai-form {
          margin-top: 40px;
          width: 100%;
          max-width: 320px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .ai-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 14px 16px;
          color: #fff;
          font-size: 15px;
          outline: none;
          transition: all 0.2s ease;
          backdrop-filter: blur(10px);
        }

        .ai-input:focus {
          border-color: rgba(255, 255, 255, 0.4);
          background: rgba(255, 255, 255, 0.08);
        }

        .ai-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .ai-btn {
          width: 100%;
          background: #fff;
          color: #000;
          border: none;
          border-radius: 8px;
          padding: 14px 16px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.15s ease, opacity 0.2s ease;
        }

        .ai-btn:hover:not(:disabled) {
          transform: translateY(-1px);
        }
        
        .ai-btn:active:not(:disabled) {
          transform: translateY(1px);
        }

        .ai-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .ai-error {
          color: #ef4444;
          font-size: 13px;
          margin: 0;
        }
      `}</style>

      <div className="ai-hero-wrapper">
        <video 
          className="ai-bg-video" 
          autoPlay 
          muted 
          loop 
          playsInline
        >
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260514_135830_bb6491d1-9b66-4aec-9722-13b4dfe3fb46.mp4" type="video/mp4" />
        </video>

        <section className="ai-section">
          <div className="ai-content">
            <h2 className="ai-heading">
              {words.map((word, i) => (
                <FadeUp
                  key={i}
                  as="span"
                  y={32}
                  delay={0.15 + (i * 0.08)}
                >
                  {word}
                </FadeUp>
              ))}
            </h2>

            <FadeUp as="p" className="ai-subtext" delay={0.9}>
              We provide all-in-one AI automation services in one place.
            </FadeUp>

            <FadeUp delay={1.1} className="ai-form" once={true}>
              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
                {errorMsg && <p className="ai-error">{errorMsg}</p>}
                
                <input 
                  type="text" 
                  className="ai-input" 
                  placeholder="Email or ID" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required 
                />
                
                <div style={{ position: 'relative', width: '100%' }}>
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    className="ai-input" 
                    placeholder="Password" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'rgba(255, 255, 255, 0.4)'
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                
                <button type="submit" className="ai-btn" disabled={isLoading}>
                  {isLoading ? 'Authenticating...' : 'Sign In'}
                </button>
              </form>
            </FadeUp>
          </div>
        </section>
      </div>
    </>
  );
};
