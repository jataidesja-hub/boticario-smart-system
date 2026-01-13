'use client';
import { useState, useEffect, useRef } from 'react';

export default function Recepcao() {
  const [formData, setFormData] = useState({ vendedora: '', numeroPedido: '', dataPedido: '' });
  const [status, setStatus] = useState({ loading: false, message: '', type: '' });

  // States for signature workflow
  const [pedidosAssinatura, setPedidosAssinatura] = useState([]);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [isSigning, setIsSigning] = useState(false);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Load orders that need signature
  const loadPedidos = async () => {
    try {
      const res = await fetch('/api/pedidos');
      const data = await res.json();
      if (Array.isArray(data)) {
        // Filter orders waiting for signature
        const waiting = data.filter(p => p.etapa === 'Aguardando assinatura');
        setPedidosAssinatura(waiting);
      }
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
    }
  };

  useEffect(() => {
    loadPedidos();
    const interval = setInterval(loadPedidos, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, message: 'Registrando pedido...', type: '' });

    try {
      const res = await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus({ loading: false, message: 'Pedido registrado com sucesso! ✨', type: 'success' });
        setFormData({ vendedora: '', numeroPedido: '', dataPedido: '' });
        loadPedidos(); // Refresh list immediately
      } else {
        throw new Error('Falha no registro');
      }
    } catch (error) {
      setStatus({ loading: false, message: 'Erro ao registrar pedido. Tente novamente.', type: 'error' });
    }
  };

  // Signature Pad Logic
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000'; // Black signature
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.getContext('2d').closePath();
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleOpenSignature = (pedido) => {
    setSelectedPedido(pedido);
    setIsSigning(true);
    // Timeout to ensure canvas is rendered before access
    setTimeout(() => {
      if (canvasRef.current) {
        // Adjust canvas size if needed, or keep fixed
        canvasRef.current.width = canvasRef.current.offsetWidth;
        canvasRef.current.height = 200;
      }
    }, 100);
  };

  const saveSignature = async () => {
    if (!canvasRef.current) return;
    const signatureData = canvasRef.current.toDataURL('image/png');

    // Update status to Concluído and save signature
    try {
      const res = await fetch('/api/pedidos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          numeroPedido: selectedPedido.numeroPedido,
          etapa: 'Concluído',
          assinatura: signatureData
        }),
      });

      if (res.ok) {
        setIsSigning(false);
        setSelectedPedido(null);
        loadPedidos();
        // Show success toast maybe?
      } else {
        alert('Erro ao salvar assinatura.');
      }
    } catch (e) {
      console.error(e);
      alert('Erro ao salvar assinatura.');
    }
  };

  return (
    <div className="animate-fade">
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Olá, Recepção 👋</h1>
        <p style={{ color: 'var(--text-dim)' }}>Registre ou finalize os pedidos.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

        {/* Registration Form */}
        <div className="glass-card">
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>📝 Novo Pedido</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Nome da Vendedora</label>
              <input
                type="text"
                required
                placeholder="Ex: Maria Clara"
                value={formData.vendedora}
                onChange={(e) => setFormData({ ...formData, vendedora: e.target.value })}
              />
            </div>

            <div className="input-group">
              <label>Número do Pedido</label>
              <input
                type="text"
                required
                placeholder="Ex: 123456"
                value={formData.numeroPedido}
                onChange={(e) => setFormData({ ...formData, numeroPedido: e.target.value })}
              />
            </div>

            <div className="input-group">
              <label>Data do Pedido (opcional)</label>
              <input
                type="date"
                value={formData.dataPedido}
                onChange={(e) => setFormData({ ...formData, dataPedido: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={status.loading}
            >
              {status.loading ? 'Processando...' : 'Lançar Pedido'}
            </button>

            {status.message && (
              <div style={{
                marginTop: '1.5rem',
                color: status.type === 'success' ? 'var(--success)' : 'var(--error)',
                fontSize: '0.9rem',
                textAlign: 'center',
                fontWeight: '600'
              }}>
                {status.message}
              </div>
            )}
          </form>
        </div>

        {/* Signature List */}
        <div className="glass-card">
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>✍️ Aguardando Assinatura</h2>
          {pedidosAssinatura.length === 0 ? (
            <p style={{ color: 'var(--text-dim)', textAlign: 'center', padding: '2rem' }}>
              Nenhum pedido aguardando assinatura.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {pedidosAssinatura.map(p => (
                <div key={p.id}
                  onClick={() => handleOpenSignature(p)}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    padding: '1rem',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    border: '1px solid rgba(255,255,255,0.1)',
                    transition: '0.2s'
                  }}
                  className="hover-bright"
                >
                  <div style={{ fontWeight: 'bold' }}>{p.vendedora}</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>Pedido: {p.numeroPedido}</div>
                  <div style={{ marginTop: '0.5rem' }}>
                    <span className="tag" style={{ background: '#eab308', color: '#000' }}>Assinar ➜</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Modal de Assinatura */}
      {isSigning && selectedPedido && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div className="glass-card" style={{ maxWidth: '400px', width: '90%', background: '#1a0b10' }}>
            <h3>Assinatura Digital</h3>
            <p style={{ margin: '10px 0', color: 'var(--text-dim)' }}>
              Confirmo o recebimento do pedido <strong>#{selectedPedido.numeroPedido}</strong>.
            </p>
            <div style={{ background: '#fff', borderRadius: '8px', overflow: 'hidden', touchAction: 'none' }}>
              <canvas
                ref={canvasRef}
                style={{ width: '100%', height: '200px', display: 'block' }}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button
                onClick={() => { setIsSigning(false); setSelectedPedido(null); }}
                style={{ flex: 1, padding: '12px', borderRadius: '8px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', cursor: 'pointer' }}
              >
                Cancelar
              </button>
              <button
                onClick={clearSignature}
                style={{ padding: '12px', borderRadius: '8px', background: 'transparent', border: '1px solid var(--text-dim)', color: 'var(--text-dim)', cursor: 'pointer' }}
              >
                Limpar
              </button>
              <button
                onClick={saveSignature}
                className="btn-primary"
                style={{ flex: 1, margin: 0 }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
