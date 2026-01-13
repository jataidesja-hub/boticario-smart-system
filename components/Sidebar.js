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
                {/* Usando a nova Logo Rosa, sem filtros estranhos, apenas ela pura e bonita */}
                <img
                    src="/logo-boticario-pink.jpg"
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

            <div className="sidebar-footer">
                <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'white', letterSpacing: '0.5px' }}>GRUPO DINA SIMÃO</div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>Logística Inteligente v2.1</div>
            </div>
        </aside>
    );
}
