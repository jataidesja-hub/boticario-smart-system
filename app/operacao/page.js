'use client';
import { useState, useEffect } from 'react';

export default function Operacao() {
    const [funcionarios, setFuncionarios] = useState([]);
    const [pedidos, setPedidos] = useState([]);
    const [formData, setFormData] = useState({ funcionario: '', numeroPedido: '', etapa: '' });
    const [status, setStatus] = useState({ loading: false, message: '', type: '' });

    useEffect(() => {
        const loadData = async () => {
            const [resFunc, resPed] = await Promise.all([
                fetch('/api/funcionarios'),
                fetch('/api/pedidos')
            ]);
            const dataFunc = await resFunc.json();
            const dataPed = await resPed.json();

            setFuncionarios(dataFunc);
            // Filtra apenas pedidos não concluídos para a lista
            setPedidos(dataPed.filter(p => p.etapa !== 'Concluído'));
        };
        loadData();
        const interval = setInterval(loadData, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, message: 'Atualizando status...', type: '' });

        try {
            const res = await fetch('/api/pedidos', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setStatus({ loading: false, message: 'Status atualizado com sucesso! ✅', type: 'success' });
                setFormData({ ...formData, numeroPedido: '', etapa: '' });
            } else {
                throw new Error('Falha na atualização');
            }
        } catch (error) {
            setStatus({ loading: false, message: 'Erro ao atualizar. Tente novamente.', type: 'error' });
        }
    };

    return (
        <div className="animate-fade">
            <header style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Operação Galpão v2.3 ⚙️</h1>
                <p style={{ color: 'var(--text-dim)' }}>Atualize o andamento dos pedidos em tempo real.</p>
            </header>

            <div className="glass-card" style={{ maxWidth: '800px' }}>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div className="input-group">
                        <label>Seu Nome (Funcionário)</label>
                        <select
                            required
                            value={formData.funcionario}
                            onChange={(e) => setFormData({ ...formData, funcionario: e.target.value })}
                        >
                            <option value="">Selecione...</option>
                            {funcionarios.length === 0 && <option disabled>Carregando ou Nenhum encontrado...</option>}
                            {funcionarios.map(name => <option key={name} value={name}>{name}</option>)}
                        </select>
                    </div>

                    <div className="input-group">
                        <label>Nº do Pedido</label>
                        <select
                            required
                            value={formData.numeroPedido}
                            onChange={(e) => setFormData({ ...formData, numeroPedido: e.target.value })}
                        >
                            <option value="">Selecione o pedido...</option>
                            {pedidos.map(p => (
                                <option key={p.id} value={p.numeroPedido}>
                                    {p.numeroPedido} - {p.vendedora}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="input-group" style={{ gridColumn: 'span 2' }}>
                        <label>Nova Etapa / Status</label>
                        <select
                            required
                            value={formData.etapa}
                            onChange={(e) => setFormData({ ...formData, etapa: e.target.value })}
                        >
                            <option value="">Selecione o novo status...</option>
                            <option value="Aguardando separação">Aguardando separação</option>
                            <option value="Separação">Separação</option>
                            <option value="Faturamento">Faturamento</option>
                            <option value="Aguardando assinatura">Aguardando assinatura</option>
                        </select>
                    </div>

                    <div style={{ gridColumn: 'span 2' }}>
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={status.loading || !formData.numeroPedido}
                        >
                            {status.loading ? 'Atualizando...' : 'Confirmar Mudança de Etapa'}
                        </button>
                    </div>

                    {status.message && (
                        <div style={{
                            gridColumn: 'span 2',
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
