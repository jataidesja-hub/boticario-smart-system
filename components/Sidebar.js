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
                {/* Usamos a logo nova com filtros CSS para inverter: Preto vira Branco, Branco vira Transparente */}
                <img
                    src="/logo-new.jpg"
                    alt="O Boticário"
                    className="sidebar-logo"
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
                <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'white', letterSpacing: '1px' }}>GRUPO DINA SIMÃO</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '4px' }}>INTELLIGENCE SYSTEM v2.0</div>
            </div>
        </aside>
    );
}
