import { getGoogleSheet, SHEET_ID } from '@/lib/googleSheets';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const sheets = await getGoogleSheet();
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: 'Funcionarios!A2:C',
        });

        const rows = response.data.values || [];
        const funcionarios = rows
            .filter(row => row[2]?.toUpperCase() !== 'NÃO' && row[2]?.toUpperCase() !== 'NAO' && row[0])
            .map(row => row[0]);

        return NextResponse.json(funcionarios);
    } catch (error) {
        console.error('Erro ao buscar funcionários:', error);
        return NextResponse.json({ error: 'Erro ao conectar com a planilha' }, { status: 500 });
    }
}
