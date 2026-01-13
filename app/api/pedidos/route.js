import { getGoogleSheet, SHEET_ID } from '@/lib/googleSheets';
import { NextResponse } from 'next/server';

// GET: Retorna a lista de pedidos
export async function GET() {
    try {
        const sheets = await getGoogleSheet();
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: 'Pedidos!A2:H',
        });

        const rows = response.data.values || [];
        const pedidos = rows.map((row, index) => ({
            id: row[0] || index + 1,
            dataRegistro: row[1],
            dataPedido: row[2],
            numeroPedido: row[3],
            vendedora: row[4],
            etapa: row[5],
            funcionario: row[6],
            ultimaAtualizacao: row[7],
            rowIndex: index + 2 // Linha real na planilha
        }));

        // Ordenação lógica (similar ao que você tinha no GS)
        const priority = {
            'Aguardando separação': 1,
            'Separação': 2,
            'Faturamento': 3,
            'Concluído': 4
        };

        pedidos.sort((a, b) => {
            const priA = priority[a.etapa] || 99;
            const priB = priority[b.etapa] || 99;
            if (priA !== priB) return priA - priB;
            return new Date(a.dataPedido) - new Date(b.dataPedido);
        });

        return NextResponse.json(pedidos);
    } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
        return NextResponse.json({ error: 'Erro ao conectar com a planilha' }, { status: 500 });
    }
}

// POST: Registra um novo pedido
export async function POST(request) {
    try {
        const { vendedora, numeroPedido, dataPedido } = await request.json();
        const sheets = await getGoogleSheet();

        const now = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
        const dataFormatted = dataPedido || new Date().toISOString().split('T')[0];

        // Busca a última linha para gerar ID
        const checkResponse = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: 'Pedidos!A:A',
        });
        const nextId = (checkResponse.data.values?.length || 1);

        const newRow = [
            nextId,
            now,
            dataFormatted,
            numeroPedido,
            vendedora,
            'Aguardando separação',
            '',
            now
        ];

        await sheets.spreadsheets.values.append({
            spreadsheetId: SHEET_ID,
            range: 'Pedidos!A2',
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [newRow],
            },
        });

        return NextResponse.json({ message: 'Pedido registrado com sucesso!' });
    } catch (error) {
        console.error('Erro ao registrar pedido:', error);
        return NextResponse.json({ error: 'Erro ao registrar pedido' }, { status: 500 });
    }
}

// PATCH: Atualiza a etapa (precisaremos de outra estrutura ou usar busca)
// Para simplificar, faremos uma busca pela linha baseada no Nº do Pedido
export async function PATCH(request) {
    try {
        const { numeroPedido, etapa, funcionario } = await request.json();
        const sheets = await getGoogleSheet();
        const now = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

        // Localiza o pedido (busca na coluna D)
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: 'Pedidos!D:D',
        });

        const rows = response.data.values || [];
        let rowIndex = -1;
        // Busca de baixo para cima (mais recente)
        for (let i = rows.length - 1; i >= 0; i--) {
            if (rows[i][0] == numeroPedido) {
                rowIndex = i + 1;
                break;
            }
        }

        if (rowIndex === -1) {
            return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 });
        }

        // Atualiza colunas F (6), G (7) e H (8)
        await sheets.spreadsheets.values.update({
            spreadsheetId: SHEET_ID,
            range: `Pedidos!F${rowIndex}:H${rowIndex}`,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [[etapa, funcionario, now]],
            },
        });

        return NextResponse.json({ message: 'Status atualizado!' });
    } catch (error) {
        console.error('Erro ao atualizar status:', error);
        return NextResponse.json({ error: 'Erro ao atualizar' }, { status: 500 });
    }
}
