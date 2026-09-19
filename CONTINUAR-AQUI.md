# Continuar daqui (nota de passagem para o Claude do computador do Felipe)

Este projeto foi construído numa sessão do Claude Code na nuvem, que não tinha
acesso aos arquivos de mídia do Felipe. Esta nota existe para você continuar
sem ele precisar explicar tudo de novo. Leia também o `LEIA-ME.md`.

## O presente

Página interativa para celular, presente de aniversário do primeiro "eu te amo"
do Felipe para a Ester. **Data de entrega: 20/09/2026.**

Regras de escrita que o Felipe pediu e que valem para tudo:
- Nenhum travessão em texto que apareça na página. Use vírgula ou parênteses.
- A data comemorada é sempre "o aniversário do nosso primeiro eu te amo" ou
  "nosso aniversário". Nunca usar a palavra namoro, nunca dizer quantos anos.
- Comentários de código em português.
- Ele não programa. Não peça permissão para rodar comandos ou criar arquivos,
  faça direto. Explique em português simples, sem mostrar código.

## Onde está a pasta dele

`C:\Users\Forti\OneDrive\Área de Trabalho\Pasta do Claudinho\Jardim Ester`

O caminho tem espaços e acentos, trate isso nos comandos. Está no OneDrive:
se um arquivo estiver bloqueado pela sincronização, espere e tente de novo.
A subpasta `testes` é só teste de estilo, ignore.

## O que já está pronto e testado

Tudo o que é código está pronto e foi testado no navegador de ponta a ponta:

- **Cofre**: senha pela data do primeiro "eu te amo", aceita com ou sem barras,
  cadeado treme no erro, abre com animação no acerto, depois Cantares 8:6.
- **Céu das 12 memórias**: estrelinhas por código, Salmo 147:3-4, 12 estrelas
  tocáveis que ficam douradas, e quando as 12 abrem elas se movem para o
  contorno de um coração (distribuídas por comprimento de arco) e uma linha de
  luz desenha o coração. Depois Salmo 126:2-3.
- **Carta principal**: escreve-se letra por letra sobre o papel, termina com a
  bênção de Números 6:24-26. Tocar adianta a escrita.
- **Amanhecer**: usa `video-02-amanhecer` se existir, senão faz a transição por
  código. Cantares 6:10 (cortado em "brilhante como o sol"), depois Gênesis 2:8
  e 2:15 sobre o cenário do jardim.
- **Jardim**: canteiro vazio, convite para tocar na terra, broto com
  1 Coríntios 3:6, nasce a flor 01 (o buquê), aparece o cartãozinho preso à
  fita, os nomes das flores e o motivo 1. Lamentações 3:22-23 fixo no topo.
- **366 flores**: contagem sempre pela data fixa do presente, nunca pelo dia em
  que ela abre. Dias perdidos acumulam. Se o progresso sumir, o jardim se
  reconstrói (tudo até ontem plantado, só as do dia esperando). Um canteiro por
  mês (12), mais o canteiro especial do fruto do Espírito com arco de folhas.
  Cada canteiro só carrega as imagens quando ela chega perto dele.
- **Caixinha de cartas**: envelopes "Abra quando", cadeado prateado e a frase
  "esta carta ainda está sendo escrita" enquanto o texto estiver vazio, aviso de
  carta nova na tela inicial. Envelope do próximo aniversário com cadeado
  dourado e contagem "faltam X dias".
- **Grande dia (20/09/2027)**: ao plantar a flor 366, a noite cai sobre o
  jardim, o céu volta com o coração, Salmo 65:11, e a carta lacrada se abre
  escrevendo-se letra por letra.
- **Modo de teste**: `?teste=1`. Painel com simulação de qualquer data, pulo
  para qualquer tela, plantar/zerar, e um botão que liga e desliga os textos de
  exemplo. Guarda o progresso numa chave separada da dela.

Arquivos: `index.html`, `css/estilo.css`, `js/textos.js` (todos os textos),
`js/app.js` (lógica), `js/midia.js` (acha as imagens e desenha as alternativas).

## O QUE FALTA FAZER (é o seu trabalho)

### 1. Trazer a mídia da pasta dele
Copie para dentro do repositório, mantendo os nomes das pastas:
`flores/`, `cenarios/`, `videos/`, `memorias/`, `audio/`.
Cada uma tem um `COLOQUE-AQUI.txt` dizendo o que vai nela. Apague esses
arquivos de aviso depois.

### 2. Conferir nome por nome
Para cada flor em `js/textos.js`, o campo `img` é o nome do arquivo na pasta
`flores`, **sem extensão**. Confira se bate com os arquivos reais e corrija o
campo `img` (não renomeie os arquivos dele). As flores 09, 12, 17 e 20 estão
com nome vazio porque ele não disse quais são: preencha com o que achar na
pasta e confirme com ele.

`js/midia.js` procura sozinho entre webp, avif, jpg, jpeg, png para imagens,
mp4/webm/mov para vídeo e mp3/m4a/ogg/wav para áudio. Os botões de plantar são
procurados trocando o prefixo `flor-` por `botao-`.

### 3. Otimizar
Converter as imagens para webp e reduzir os vídeos para no máximo 720p, o menor
tamanho possível sem perda visível. Isso ainda não foi feito.

### 4. Áudio
O Felipe decidiu **não usar** o áudio da oração: o conteúdo vai escrito na carta
principal. O campo `audio: "oracao"` na carta "Abra quando quiser orar comigo"
pode ficar, porque o botão some sozinho se o arquivo não existir. A música de
fundo é opcional e também some sozinha se não houver arquivo.

### 5. Textos da PARTE 1
Ele ainda precisa preencher, em `js/textos.js`: senha, dica, as 12 memórias
(mês e frase), a carta principal, os nomes das flores do buquê, o cartãozinho e
o motivo 1. O painel de teste mostra quantos campos faltam. Existe também a
função `conferirParte1()` em `js/app.js`.

### 6. Versículos
O arquivo `conferencia-versiculos.md` tem as 27 referências em ARC para ele
conferir na Bíblia antes de publicar. Esse arquivo **não vai para o site**.

### 7. Publicar
Só depois que ele disser que conferiu os versículos e testou no computador, e
só com a PARTE 1 completa. Criar um repositório **público** chamado `jardim`
contendo **só os arquivos do site** (`index.html`, `css/`, `js/`, as pastas de
mídia e o `.nojekyll`). Não enviar: `conferencia-versiculos.md`, `LEIA-ME.md`,
este arquivo, os `COLOQUE-AQUI.txt`, a pasta `testes` nem originais em alta
resolução. Ativar o GitHub Pages e entregar o link.

Daí em diante, sempre que ele pedir para acrescentar flores, motivos ou cartas:
alterar `js/textos.js`, publicar de novo e avisar quando o link estiver no ar.

## Onde está o código

Repositório: https://github.com/FORTI777/Jardim-Ester
Branch de trabalho: `claude/nice-mendel-y3zkng` (é a branch padrão do repositório)
Existe também a branch `midia`, criada só para tentativas de envio pelo site.
