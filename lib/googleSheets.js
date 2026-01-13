export async function fetchFromSheet(action, data = {}) {
  const url = process.env.APPS_SCRIPT_URL;
  if (!url) throw new Error('APPS_SCRIPT_URL não configurada no Vercel');

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({ action, ...data }),
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) throw new Error('Erro na comunicação com a planilha');
  return response.json();
}
