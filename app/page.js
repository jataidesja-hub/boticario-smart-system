'use client';
import { useState } from 'react';

export default function Recepcao() {
  const [formData, setFormData] = useState({ vendedora: '', numeroPedido: '', dataPedido: '' });
  const [status, setStatus] = useState({ loading: false, message: '', type: '' });

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
      } else {
        throw new Error('Falha no registro');
      }
    } catch (error) {
      setStatus({ loading: false, message: 'Erro ao registrar pedido. Tente novamente.', type: 'error' });
    }
  };

  return (
    <div className="animate-fade">
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Olá, Recepção 👋</h1>
        <p style={{ color: 'var(--text-dim)' }}>Registre novos pedidos para a separação no galpão.</p>
      </header>

      <div className="glass-card" style={{ maxWidth: '600px' }}>
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
    </div>
  );
}
