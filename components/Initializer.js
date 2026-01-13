'use client';
import { useState, useEffect } from 'react';

export default function Initializer() {
    const [loaded, setLoaded] = useState(false);
    const [showInstall, setShowInstall] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState(null);

    useEffect(() => {
        // Garante que a splash dure pelo menos 3 segundos
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
                <button id="install-btn" onClick={handleInstall} style={{ display: 'block' }}>
                    📲 Instalar App
                </button>
            )}

            {/* Splash Screen */}
            <div className="splash-container">
                <img src="/logo-dina.jpg" className="splash-logo" alt="Grupo Dina Simão" />
            </div>

            {/* Cacto Flutuante (Aparece após o carregamento) */}
            <img src="/logo-dina.jpg" className="float-logo" alt="Logo Flutuante" />
        </div>
    );
}
