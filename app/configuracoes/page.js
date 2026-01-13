'use client';
import { useState, useEffect } from 'react';

export default function Configuracoes() {
    const [funcionarios, setFuncionarios] = useState([]);
    const [novoNome, setNovoNome] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        carregarFuncionarios();
    }, []);

    const carregarFuncionarios = async () => {
        const res = await fetch('/api/funcionarios');
        const data = await res.json();
        if (Array.isArray(data)) setFuncionarios(data);
    };

    const adicionar = async () => {
        if (!novoNome.trim()) return;
        setLoading(true);
        await fetch('/api/funcionarios', {
            method: 'POST',
            body: JSON.stringify({ nome: novoNome })
        });
        setNovoNome('');
        await carregarFuncionarios();
        setLoading(false);
    };

    const remover = async (nome) => {
        if (!confirm(`Deseja remover ${nome} da equipe?`)) return;
        setLoading(true);
        await fetch('/api/funcionarios', {
            method: 'DELETE',
            body: JSON.stringify({ nome })
        });
        await carregarFuncionarios();
        setLoading(false);
    };

    return (
        <div className="fade-in">
            <h1>Configurações da Equipe ⚙️</h1>
            <p style={{ color: 'var(--text-dim)', marginBottom: '2rem' }}>
                Gerencie quem tem acesso ao painel de operação.
            </p>

            <div className="glass-card" style={{ maxWidth: '600px' }}>
                <h3 style={{ marginBottom: '1rem' }}>Adicionar Novo Funcionário</h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                        type="text"
                        placeholder="Nome do Colaborador"
                        value={novoNome}
                        onChange={(e) => setNovoNome(e.target.value)}
                        style={{ marginTop: 0 }}
                    />
                    <button
                        className="btn-primary"
                        onClick={adicionar}
                        disabled={loading}
                        style={{ width: 'auto', padding: '0 30px' }}
                    >
                        {loading ? '...' : '+ Adicionar'}
                    </button>
                </div>
            </div>

            <div className="glass-card" style={{ maxWidth: '600px', marginTop: '20px' }}>
                <h3 style={{ marginBottom: '1rem' }}>Equipe Atual</h3>
                {funcionarios.length === 0 ? (
                    <p style={{ color: 'var(--text-dim)' }}>Nenhum funcionário encontrado.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {funcionarios.map((func, index) => (
                            <div key={index} style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px'
                            }}>
                                <span style={{ fontWeight: 500 }}>{func}</span>
                                <button
                                    onClick={() => remover(func)}
                                    style={{
                                        background: 'rgba(255, 50, 50, 0.2)', color: '#ff6b6b',
                                        border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer'
                                    }}
                                >
                                    Remover
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
