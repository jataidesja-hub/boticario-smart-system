'use client';
import { useState, useEffect } from 'react';

export default function Painel() {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPedidos = async () => {
        try {
            const res = await fetch('/api/pedidos');
            if (!res.ok) throw new Error('Erro na API');

            const data = await res.json();
            if (Array.isArray(data)) {
                // Ordenação Inteligente:
                // 1. Pedidos NÃO concluídos aparecem primeiro
                // 2. Depois ordenamos por data (mais recentes primeiro)
                const sortedData = data.sort((a, b) => {
                    const isDoneA = a.etapa === 'Concluído';
                    const isDoneB = b.etapa === 'Concluído';

                    if (isDoneA && !isDoneB) return 1; // A vai para o fim
                    if (!isDoneA && isDoneB) return -1; // B vai para o fim

                    // Se ambos forem iguais (ambos concluídos ou ambos ativos), ordena por ID (ou data) decrescente
                    return b.id - a.id;
                });
                setPedidos(sortedData);
            } else {
                setPedidos([]);
            }
        } catch (error) {
            console.error('Erro ao buscar pedidos:', error);
            setPedidos([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPedidos();
        const interval = setInterval(fetchPedidos, 5000);
        return () => clearInterval(interval);
    }, []);

    const getTagClass = (etapa) => {
        switch (etapa) {
            case 'Aguardando separação': return 'tag-waiting';
            case 'Separação': return 'tag-separation';
            case 'Faturamento': return 'tag-billing';
            case 'Concluído': return 'tag-done';
            default: return '';
        }
    };

    return (
        <div className="animate-fade">
            <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Painel de Pedidos 📺</h1>
                    <p style={{ color: 'var(--text-dim)' }}>Monitoramento em tempo real do fluxo do galpão.</p>
                </div>
                <div style={{ textAlign: 'right', fontSize: '0.9rem', color: 'var(--secondary)' }}>
                    Atualização Automática • Ativo
                </div>
            </header>

            <div className="glass-card">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Nº Pedido</th>
                                <th>Vendedora</th>
                                <th>Data Pedido</th>
                                <th>Etapa Atual</th>
                                <th>Responsável</th>
                                <th>Desde</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '3rem' }}>Carregando dados...</td></tr>
                            ) : pedidos.length === 0 ? (
                                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '3rem' }}>Nenhum pedido em andamento.</td></tr>
                            ) : (
                                pedidos.map((p) => (
                                    <tr key={p.id}>
                                        <td style={{ fontWeight: '700' }}>{p.numeroPedido}</td>
                                        <td>{p.vendedora}</td>
                                        <td>{p.dataPedido}</td>
                                        <td>
                                            <span className={`tag ${getTagClass(p.etapa)}`}>
                                                {p.etapa}
                                            </span>
                                        </td>
                                        <td style={{ color: p.funcionario ? '#fff' : 'var(--text-dim)' }}>
                                            {p.funcionario || '-'}
                                        </td>
                                        <td style={{ fontSize: '0.85rem' }}>{p.dataRegistro}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
