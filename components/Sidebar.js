'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Sidebar() {
    const pathname = usePathname();
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showIosInstructions, setShowIosInstructions] = useState(false);

    useEffect(() => {
        // Escuta o evento de instalação do Chrome/Android
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        });
    }, []);

    const handleInstallClick = () => {
        // Se tiver o evento do Chrome/Android salvo
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    setDeferredPrompt(null);
                }
            });
        } else {
            // Se não tiver (provavelmente é iPhone ou Desktop já instalado)
            // Mostra instruções ou alerta
            const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent);
            if (isIos) {
                setShowIosInstructions(true);
            } else {
                alert("Para instalar, clique nos 3 pontinhos do navegador e selecione 'Adicionar à Tela Inicial' ou procure o ícone de instalar na barra de endereço.");
            }
        }
    };

    const menuItems = [
        { name: 'Recepção', path: '/', icon: '📝' },
        { name: 'Painel VD+', path: '/painel', icon: '📺' },
        { name: 'Operação', path: '/operacao', icon: '📦' },
    ];

    return (
        <aside className="sidebar">
            <div className="logo-area">
                <img src="/logo-boticario-pink.jpg" alt="O Boticário" className="sidebar-logo" />
            </div>

            <nav className="nav-links">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        href={item.path}
                        className={`nav-item ${pathname === item.path ? 'active' : ''}`}
                    >
                        <span>{item.icon}</span>
                        {item.name}
                    </Link>
                ))}

                {/* BOTÃO DE INSTALAR MANUAL */}
                <button
                    onClick={handleInstallClick}
                    className="nav-item"
                    style={{ background: 'rgba(255,255,255,0.05)', marginTop: '20px', border: '1px solid rgba(255,255,255,0.1)', width: '100%', cursor: 'pointer', textAlign: 'left' }}
                >
                    <span>📲</span>
                    Instalar App
                </button>
            </nav>

            {/* Instruções iOS (Modal simples) */}
            {showIosInstructions && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.8)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }} onClick={() => setShowIosInstructions(false)}>
                    <div className="glass-card" style={{ padding: '20px', maxWidth: '300px', textAlign: 'center' }}>
                        <h3>Instalar no iPhone 🍏</h3>
                        <p style={{ margin: '10px 0', color: '#ccc' }}>
                            1. Toque em <strong>Compartilhar</strong> <span style={{ fontSize: '1.5rem' }}>⎋</span><br />
                            2. Escolha <strong>Adicionar à Tela de Início</strong>
                        </p>
                        <button className="btn-primary" style={{ padding: '8px' }}>Entendi</button>
                    </div>
                </div>
            )}

            <div className="sidebar-footer">
                <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'white', letterSpacing: '0.5px' }}>J.A SOFTWARE & SOLUTION</div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>Versão v2.5</div>
            </div>
        </aside>
    );
}
