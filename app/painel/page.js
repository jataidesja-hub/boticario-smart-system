'use client';
import { useState, useEffect } from 'react';

export default function Painel() {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPedido, setSelectedPedido] = useState(null); // Para o modal de detalhes

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
            case 'Aguardando assinatura': return 'tag-waiting'; // Reusing waiting style or create new
            case 'Concluído': return 'tag-done';
            default: return '';
        }
    };

    return (
        <div className="animate-fade">
            <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Painel VD+ 📺</h1>
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
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '3rem' }}>Carregando dados...</td></tr>
                            ) : pedidos.length === 0 ? (
                                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '3rem' }}>Nenhum pedido em andamento.</td></tr>
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
                                        <td>
                                            {p.etapa === 'Concluído' ? (
                                                <button
                                                    onClick={() => setSelectedPedido(p)}
                                                    style={{
                                                        background: 'transparent',
                                                        border: '1px solid rgba(255,255,255,0.2)',
                                                        borderRadius: '50%',
                                                        width: '32px',
                                                        height: '32px',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '1.2rem',
                                                        transition: '0.2s'
                                                    }}
                                                    title="Ver Detalhes e Assinatura"
                                                    className="hover-bright"
                                                >
                                                    👁️
                                                </button>
                                            ) : (
                                                <span style={{ color: 'var(--glass-border)', fontSize: '1.2rem' }}>•</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de Detalhes do Pedido Concluído */}
            {selectedPedido && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.85)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }} onClick={() => setSelectedPedido(null)}>
                    <div
                        className="glass-card"
                        style={{ maxWidth: '500px', width: '90%', background: '#0a0507', border: '1px solid var(--primary)' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                            Detalhes do Pedido
                        </h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div>
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Número do Pedido</label>
                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{selectedPedido.numeroPedido}</div>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Data do Pedido</label>
                                <div>{selectedPedido.dataPedido || '-'}</div>
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Nome da Revendedora</label>
                                <div style={{ fontSize: '1.1rem' }}>{selectedPedido.vendedora}</div>
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Data da Assinatura (Conclusão)</label>
                                {/* Usando dataRegistro como proxy se dataConclusao não existir, ou adicionar lógica */}
                                <div>{selectedPedido.dataConclusao || selectedPedido.dataRegistro}</div>
                            </div>
                        </div>

                        {selectedPedido.assinatura ? (
                            <div style={{ background: '#fff', padding: '10px', borderRadius: '8px' }}>
                                <img
                                    src={selectedPedido.assinatura}
                                    alt="Assinatura"
                                    style={{ width: '100%', height: 'auto', display: 'block' }}
                                />
                            </div>
                        ) : (
                            <div style={{ padding: '2rem', textAlign: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', color: 'var(--text-dim)' }}>
                                Sem assinatura digital disponível
                            </div>
                        )}

                        <button
                            className="btn-primary"
                            style={{ marginTop: '1.5rem' }}
                            onClick={() => setSelectedPedido(null)}
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
