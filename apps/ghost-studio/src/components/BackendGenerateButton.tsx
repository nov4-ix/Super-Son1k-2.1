import { useState } from 'react';

export function BackendGenerateButton() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 
    (import.meta as any).env?.VITE_BACKEND_URL ||
    process.env.VITE_BACKEND_URL ||
    'http://localhost:4000';

  async function generate() {
    setLoading(true);
    setError(null);
    setAudioUrl(null);
    try {
      // ✅ CORREGIDO: Usar endpoint público (sin auth requerido)
      const res = await fetch(`${BACKEND_URL}/api/generation-public/create`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
          // Nota: En producción, el backend debería manejar auth diferente
        },
        body: JSON.stringify({ 
          prompt,
          style: 'pop',
          duration: 120,
          quality: 'standard'
        })
      });
      if (!res.ok) {
        const errorText = await res.text().catch(() => 'Unknown error');
        throw new Error(`Create failed: ${res.status} - ${errorText}`);
      }
      const data = await res.json();
      
      // ✅ CORREGIDO: El backend devuelve { success: true, data: { generationId, ... } }
      const generationId = data.data?.generationId || data.generationId;
      if (!generationId) {
        throw new Error('No generationId in response');
      }
      
      const started = Date.now();
      const timeout = 120000;
      while (Date.now() - started < timeout) {
        // ✅ CORREGIDO: Usar endpoint público de status
        const s = await fetch(`${BACKEND_URL}/api/generation-public/${generationId}/status`, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (!s.ok) throw new Error(`Status failed: ${s.status}`);
        const j = await s.json();
        
        // ✅ CORREGIDO: El backend devuelve { success: true, data: { status, audioUrl, ... } }
        const status = j.data?.status || j.status;
        const audioUrl = j.data?.audioUrl || j.audioUrl;
        
        if (status === 'completed' && audioUrl) {
          setAudioUrl(audioUrl);
          return;
        }
        if (status === 'failed') {
          throw new Error(j.data?.error?.message || j.error || 'Generation failed');
        }
        await new Promise((r) => setTimeout(r, 2000));
      }
      throw new Error('Timeout waiting for generation');
    } catch (e: any) {
      setError(e?.message || 'Error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <textarea
        placeholder="Prompt para backend"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={{ width: '100%', height: 80, background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 8 }}
      />
      <button onClick={generate} disabled={loading || !prompt} style={{ marginTop: 8, backgroundColor: '#00FFE7', color: '#0A0C10', padding: '8px 16px', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
        {loading ? 'Generando...' : 'Generar (Backend)'}
      </button>
      {error && <div style={{ color: '#ff6b6b', marginTop: 8 }}>{error}</div>}
      {audioUrl && (
        <div style={{ marginTop: 12 }}>
          <audio controls src={audioUrl} style={{ width: '100%' }} />
        </div>
      )}
    </div>
  );
}
