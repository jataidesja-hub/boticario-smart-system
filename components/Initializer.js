'use client';
import { useState, useEffect } from 'react';

export default function Initializer() {
    const [loaded, setLoaded] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showInstall, setShowInstall] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setLoaded(true), 3000);

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
                        padding: '12px 24px', background: '#e3e1d5', color: '#333',
                        border: 'none', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer',
                        boxShadow: '0 5px 20px rgba(0,0,0,0.2)'
                    }}
                >
                    📲 Instalar
                </button>
            )}

            {/* Splash Screen Limpa - Só o Cacto */}
            <div className="splash-container">
                <img src="/logo-dina.jpg" className="splash-cactus" alt="Grupo Dina Simão" />
            </div>

            {/* Cacto que fica no canto depois */}
            <img src="/logo-dina.jpg" className="float-logo" alt="Logo" />
        </div>
    );
}
