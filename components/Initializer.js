'use client';
import { useState, useEffect } from 'react';

export default function Initializer() {
    const [loaded, setLoaded] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showInstall, setShowInstall] = useState(false);

    useEffect(() => {
        // 4 segundos para apreciar o efeito gravitacional
        const timer = setTimeout(() => setLoaded(true), 4000);

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
            {showInstall && (
                <button
                    onClick={handleInstall}
                    style={{
                        position: 'fixed', top: '20px', right: '20px', zIndex: 2000,
                        padding: '12px 24px', background: 'var(--primary)', color: '#fff',
                        border: 'none', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer',
                        boxShadow: '0 5px 20px rgba(0,0,0,0.3)'
                    }}
                >
                    📲 Instalar App
                </button>
            )}

            {/* --- SPLASH SCREEN GRAVITACIONAL --- */}
            <div className="splash-container">
                <div className="gravity-core">
                    {/* Ondas Gravitacionais */}
                    <div className="ripple"></div>
                    <div className="ripple"></div>
                    <div className="ripple"></div>

                    {/* Logo Central (Cacto) */}
                    <img src="/logo-circle-dina.jpg" className="splash-logo-circle" alt="Grupo Dina Simão" />
                </div>
            </div>

            {/* Cacto que fica no canto depois */}
            <img src="/logo-circle-dina.jpg" className="float-logo" alt="Logo" />
        </div>
    );
}
