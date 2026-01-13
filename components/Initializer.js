'use client';
import { useState, useEffect } from 'react';

export default function Initializer() {
    const [loaded, setLoaded] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showInstallModal, setShowInstallModal] = useState(false);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        // Animação de entrada
        const timer = setTimeout(() => setLoaded(true), 4000);

        // Detectar evento de instalação (Android/Desktop)
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowInstallModal(true);
        });

        // Detectar se é iPhone/iPad (para mostrar instrução manual)
        const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

        // REGISTRAR SERVICE WORKER (Para PC aceitar instalar)
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch(err => console.log('SW falhou', err));
        }

        if (isIosDevice && !isStandalone) {
            setIsIOS(true);
            setShowInstallModal(true);
        }

        return () => clearTimeout(timer);
    }, []);

    const handleInstall = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setShowInstallModal(false);
            }
            setDeferredPrompt(null);
        }
    };

    return (
        <div className={loaded ? 'app-loaded' : ''}>

            {/* --- MODAL DE INSTALAÇÃO --- */}
            {showInstallModal && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 10000,
                    background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div className="glass-card" style={{
                        width: '90%', maxWidth: '400px', padding: '30px',
                        textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <h2 style={{ marginBottom: '10px', color: '#fff' }}>Instalar Aplicativo 📲</h2>
                        <p style={{ color: 'var(--text-dim)', marginBottom: '20px' }}>
                            Adicione o sistema à sua tela inicial para uma experiência completa e sem barras de navegação.
                        </p>

                        {isIOS ? (
                            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '12px', textAlign: 'left' }}>
                                <p style={{ fontSize: '0.9rem', marginBottom: '5px' }}><strong>Para iPhone:</strong></p>
                                <p>1. Toque no botão <strong>Compartilhar</strong> <span style={{ fontSize: '1.2rem' }}>⎋</span></p>
                                <p>2. Selecione <strong>"Adicionar à Tela de Início"</strong></p>
                                <button
                                    onClick={() => setShowInstallModal(false)}
                                    className="btn-primary"
                                    style={{ marginTop: '15px', background: 'transparent', border: '1px solid white' }}
                                >
                                    Entendi, fechar
                                </button>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                                <button
                                    onClick={handleInstall}
                                    className="btn-primary"
                                    style={{ boxShadow: '0 5px 20px rgba(214, 41, 115, 0.4)' }}
                                >
                                    Confirmar Instalação
                                </button>
                                <button
                                    onClick={() => setShowInstallModal(false)}
                                    style={{
                                        padding: '12px', background: 'transparent', border: 'none',
                                        color: 'rgba(255,255,255,0.5)', cursor: 'pointer', marginTop: '5px'
                                    }}
                                >
                                    Agora não
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* --- SPLASH SCREEN GRAVITACIONAL --- */}
            <div className="splash-container">
                <div className="gravity-core">
                    <div className="ripple"></div>
                    <div className="ripple"></div>
                    <div className="ripple"></div>
                    <img src="/logo-circle-dina.jpg" className="splash-logo-circle" alt="Grupo Dina Simão" />
                </div>
            </div>

            <img src="/logo-circle-dina.jpg" className="float-logo" alt="Logo" />
        </div>
    );
}
