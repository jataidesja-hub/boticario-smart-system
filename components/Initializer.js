'use client';
import { useState, useEffect } from 'react';

export default function Initializer() {
    const [loaded, setLoaded] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showInstall, setShowInstall] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setLoaded(true), 3500); // 3.5s de splash

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowInstall(true);
        });

        return () => clearTimeout(timer);
    }, []);

    const handleInstall = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') setShowInstall(false);
            setDeferredPrompt(null);
        }
    };

    return (
        <div className={loaded ? 'app-loaded' : ''}>
            {/* Botão de Instalar (PWA) */}
            {showInstall && (
                <button
                    onClick={handleInstall}
                    style={{
                        position: 'fixed', top: '20px', right: '20px', zIndex: 2000,
                        padding: '10px 20px', background: 'var(--primary)', color: '#fff',
                        border: 'none', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer',
                        boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
                    }}
                >
                    📲 Instalar App
                </button>
            )}

            {/* --- SPLASH SCREEN --- */}
            <div className="splash-container">
                <div className="splash-content-area">
                    {/* O Cacto (Fundo Bege + Multiply) */}
                    <img src="/logo-dina.jpg" className="splash-cactus" alt="Grupo Dina Simão" />

                    {/* A Logo do Boticário (Preta + Multiply) */}
                    <img src="/logo-new.jpg" className="splash-logo-text" alt="O Boticário" />
                </div>
            </div>

            {/* --- Cacto que fica no canto depois --- */}
            <img src="/logo-dina.jpg" className="float-logo" alt="Logo" />
        </div>
    );
}
