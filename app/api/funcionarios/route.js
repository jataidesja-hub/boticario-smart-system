import { fetchFromSheet } from '@/lib/googleSheets';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const data = await fetchFromSheet('getFuncionarios');
        if (!data || data.error) return NextResponse.json([]);
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json([]);
    }
}

export async function POST(req) {
    try {
        const body = await req.json();
        const data = await fetchFromSheet('adicionarFuncionario', { nome: body.nome });
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao adicionar' }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const body = await req.json();
        const data = await fetchFromSheet('removerFuncionario', { nome: body.nome });
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao remover' }, { status: 500 });
    }
}
