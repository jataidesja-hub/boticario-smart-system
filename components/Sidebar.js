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
            <div className="logo-area" style={{ textAlign: 'center' }}>
                <img src="/boticario-verde.png" alt="O Boticário" style={{ filter: 'none', width: '100%', borderRadius: '10px' }} />
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

            <div style={{ marginTop: 'auto', fontSize: '0.7rem', opacity: 0.6 }}>
                GRUPO DINA SIMÃO<br />
                Gestão de Logística v2.0
            </div>
        </aside>
    );
}
