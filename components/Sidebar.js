'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
    const pathname = usePathname();

    const menuItems = [
        { name: 'Recepção', path: '/', icon: '📝' },
        { name: 'Painel Galpão', path: '/painel', icon: '📺' },
        { name: 'Operação', path: '/operacao', icon: '⚙️' },
    ];

    return (
        <aside className="sidebar">
            <div className="logo-area">
                {/* Filtro mágico: Inverte as cores (Preto vira Branco) e remove o fundo (Screen) */}
                <img
                    src="/logo-new.jpg"
                    alt="O Boticário"
                    style={{
                        width: '100%',
                        filter: 'invert(1)',
                        mixBlendMode: 'screen',
                        opacity: 0.95
                    }}
                />
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
            </nav>

            <div style={{ marginTop: 'auto', textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'rgba(255,255,255,0.8)', letterSpacing: '1px' }}>GRUPO DINA SIMÃO</div>
            </div>
        </aside>
    );
}
