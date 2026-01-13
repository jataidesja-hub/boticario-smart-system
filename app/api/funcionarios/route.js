import { fetchFromSheet } from '@/lib/googleSheets';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const data = await fetchFromSheet({ action: 'getFuncionarios' });
        // Se a API retornar erro ou null, devolve array vazio
        if (!data || data.error) return NextResponse.json([]);
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json([]);
    }
}

export async function POST(req) {
    try {
        const body = await req.json();
        // Ação para adicionar
        const data = await fetchFromSheet({
            action: 'adicionarFuncionario',
            nome: body.nome
        });
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao adicionar' }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const body = await req.json();
        // Ação para remover (desativar)
        const data = await fetchFromSheet({
            action: 'removerFuncionario',
            nome: body.nome
        });
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao remover' }, { status: 500 });
    }
}
