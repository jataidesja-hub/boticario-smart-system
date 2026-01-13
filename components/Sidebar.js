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
            <div className="logo-area" style={{ background: 'transparent' }}>
                <img
                    src="/boticario-verde.png"
                    alt="O Boticário"
                    style={{
                        width: '100%',
                        filter: 'brightness(0) invert(1) hue-rotate(180deg)', /* Garante que fique branco e nítido */
                        mixBlendMode: 'screen', /* Remove o preto se houver */
                        display: 'block'
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

            <div style={{ marginTop: 'auto', fontSize: '0.8rem', color: 'var(--text-dim)', textAlign: 'center' }}>
                <strong>GRUPO DINA SIMÃO</strong><br />
                INTELLIGENCE SYSTEM v2.0
            </div>
        </aside>
    );
}
