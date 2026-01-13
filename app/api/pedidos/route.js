import { fetchFromSheet } from '@/lib/googleSheets';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const data = await fetchFromSheet('getPedidos');
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const data = await fetchFromSheet('registrarPedido', body);
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(request) {
    try {
        const body = await request.json();
        const data = await fetchFromSheet('atualizarEtapa', body);
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
