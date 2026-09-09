import { useState, useRef, useEffect } from 'react';
import { Send, Bot, Sparkles } from 'lucide-react';
import { getAIResponse } from '../data/mockData';
import { renderMarkdown } from '../utils/markdown';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  text: string;
  ts: Date;
}

const SUGGESTIONS = [
  'Qual è il gettito totale per provincia?',
  'Simula una riduzione del bollo per redditi sotto 15.000€',
  'Mostrami la mappa di vulnerabilità fiscale',
  'Prevedi il gettito per i prossimi 3 anni',
  'Chi sono i contribuenti morosi più recuperabili?',
  'Proponi 3 scenari con perdita massima gettito 2%',
  'Come cambia il bollo con un modello contribuente-centrico?',
  'Analisi dei veicoli più inquinanti e impatto fiscale',
];

let msgId = 0;

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: ++msgId,
      role: 'assistant',
      text: getAIResponse('').risposta,
      ts: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  function sendMessage(text: string) {
    if (!text.trim()) return;
    const userMsg: Message = { id: ++msgId, role: 'user', text, ts: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    // Simulate AI delay
    setTimeout(() => {
      const { risposta } = getAIResponse(text);
      const aiMsg: Message = { id: ++msgId, role: 'assistant', text: risposta, ts: new Date() };
      setMessages(prev => [...prev, aiMsg]);
      setTyping(false);
    }, 900 + Math.random() * 600);
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 0 }}>
      {/* Header */}
      <div style={{ padding: '0 0 16px 0', borderBottom: '1px solid var(--border)', marginBottom: 0 }}>
        <div className="hero-banner" style={{ margin: 0, padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, background: 'rgba(255,255,255,.1)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h1 style={{ fontSize: 17, fontWeight: 700, color: '#fff' }}>Agente Fiscale AI</h1>
                <span className="badge badge-green pulse-glow" style={{ fontSize: 10 }}>● Online</span>
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,.55)', marginTop: 2 }}>
                Modello: Gemini Pro · Dati aggiornati al 01/09/2025 · Regione Veneto
              </div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              <Sparkles size={16} style={{ color: 'rgba(255,255,255,.4)' }} />
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,.4)' }}>AI-powered analysis</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages" style={{ flex: 1, padding: '20px 24px' }}>
        {messages.map(msg => (
          <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: 4 }}>
            {msg.role === 'assistant' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                <div className="chat-avatar assistant">🤖</div>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  {msg.ts.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            )}
            <div className={`chat-bubble ${msg.role}`}>
              {msg.role === 'assistant'
                ? <div className="md-content">{renderMarkdown(msg.text)}</div>
                : msg.text
              }
            </div>
            {msg.role === 'user' && (
              <span style={{ fontSize: 11, color: 'var(--text-muted)', paddingRight: 4 }}>
                {msg.ts.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>
        ))}

        {typing && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div className="chat-avatar assistant">🤖</div>
            </div>
            <div className="chat-bubble assistant" style={{ padding: '12px 16px' }}>
              <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      <div className="chat-suggestions">
        <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>Suggeriti:</span>
        {SUGGESTIONS.slice(0, 4).map(s => (
          <button key={s} className="chat-suggestion" onClick={() => sendMessage(s)}>{s}</button>
        ))}
      </div>

      {/* Input */}
      <div className="chat-input-wrap">
        <textarea
          ref={inputRef}
          className="chat-input"
          placeholder="Fai una domanda sui dati fiscali… (Invio per inviare)"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          rows={1}
        />
        <button className="chat-send" onClick={() => sendMessage(input)} disabled={!input.trim()}>
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
