# 🚀 Guia de Configuração - Sistema Boticário

Parabéns! Seu sistema foi migrado para uma arquitetura moderna. Siga estes passos para colocar o site no ar e conectar com sua planilha:

## 1. Google Cloud Console (Onde fica a "chave")
1. Acesse o [Google Cloud Console](https://console.cloud.google.com/).
2. Crie um novo projeto (ex: `Boticario-System`).
3. Vá em **APIs e Serviços > Biblioteca** e ative a **Google Sheets API**.
4. Vá em **APIs e Serviços > Credenciais**.
5. Clique em **Criar Credenciais > Conta de Serviço**.
6. Dê um nome e finalize. 
7. Clique no email da conta criada, vá na aba **Chaves > Adicionar Chave > Criar nova chave (JSON)**.
8. **IMPORTANTE:** Guarde esse arquivo JSON. O email (`client_email`) e a chave (`private_key`) que estão dentro dele serão usados no Vercel.

## 2. Na sua Planilha
1. Abra sua planilha do Boticário.
2. Clique em **Compartilhar**.
3. Adicione o email da conta de serviço (o mesmo do passo anterior) como **Editor**.

## 3. No Vercel (Onde o site fica morando)
1. Crie uma conta no [Vercel](https://vercel.com/) usando seu GitHub.
2. Importe o repositório que você vai criar no GitHub.
3. Na aba **Environment Variables**, adicione estas 3:
   - `GOOGLE_SHEET_ID`: O ID da sua planilha (está na URL: `docs.google.com/spreadsheets/d/ID_AQUI/edit`).
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`: O email da conta de serviço.
   - `GOOGLE_PRIVATE_KEY`: A chave privada (copie tudo do JSON, desde o `-----BEGIN...` até o `...END PRIVATE KEY-----`).

## 4. No GitHub
1. Crie um repositório vazio.
2. Suba os arquivos desta pasta para lá.
3. **Pronto!** O Vercel vai detectar a subida e colocar o site no ar automaticamente.

---
*Dessa forma, sempre que você quiser mudar algo no código, basta subir para o GitHub e o site se atualizará sozinho, sem nunca mudar o link do cliente!*
