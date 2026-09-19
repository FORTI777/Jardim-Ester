# Jardim da Ester

Presente interativo para celular, para o aniversário do nosso primeiro eu te amo.

---

## 1. Onde ficam as coisas

```
index.html                  a página (não precisa mexer)
css/estilo.css              o visual (não precisa mexer)
js/textos.js                >>> É AQUI QUE VOCÊ ESCREVE <<<
js/app.js                   o funcionamento (não precisa mexer)
js/midia.js                 acha as imagens e desenha alternativas
flores/                     flor-01-ramalhete, flor-02-..., botao-01-..., botao-02-...
cenarios/                   cenario-01-cadeado até cenario-09b-vara-florida
videos/                     video-01-ramalhete até video-06-lotus
memorias/                   as 12 fotos, numeradas de 01 a 12
audio/                      musica e oracao
conferencia-versiculos.md   para conferir na Bíblia (não vai para o site)
```

## 2. Como abrir e testar no computador

Clique duas vezes no `index.html`. Ele abre no navegador.

Se as fotos não aparecerem ao abrir assim, abra com um servidor simples:
no Windows, clique com o botão direito na pasta, escolha "Abrir no Terminal"
e escreva `py -m http.server 8000`. Depois abra `http://localhost:8000`
no navegador. Para parar, feche o terminal.

## 3. Modo de teste

Abra `index.html?teste=1` (ou `http://localhost:8000/?teste=1`).
Aparece um painel embaixo com:

- **dia**: escolha qualquer data, ou use os botões `+1 dia`, `+1 mês`,
  `20/09/2027`, `hoje de verdade`. A página inteira passa a se comportar
  como se fosse aquele dia.
- **telas**: pula direto para qualquer tela (cofre, céu, carta, amanhecer,
  jardim, início, cartas).
- **jardim**: `plantar as que esperam`, `plantar tudo até hoje`,
  `zerar o progresso`.
- **textos de exemplo**: ligado, preenche os campos vazios com textos falsos
  para você ver como fica. Desligado, mostra a página exatamente como ela
  vai ver hoje.
- **esconder o painel**: tira o painel da frente para você olhar a tela.

O modo de teste guarda o progresso num lugar separado. Nada do que você
fizer no teste aparece no celular dela.

Para simular dias perdidos: coloque a data em 20/09/2026, plante a flor,
depois pule para 25/09/2026. As flores dos dias que passaram aparecem
esperando, todas juntas.

## 4. Como escrever

Abra `js/textos.js` no Bloco de Notas. O arquivo está dividido em duas
partes bem marcadas:

- **PARTE 1**: precisa estar toda preenchida antes de publicar.
- **PARTE 2**: você vai escrevendo aos poucos, pode ficar vazia.

Quatro regras:
1. Escreva sempre entre as aspas `"assim"`.
2. Não apague as vírgulas do fim das linhas.
3. Aspas dentro do texto: use aspas simples `'assim'`.
4. Para pular linha dentro de um texto, escreva `\n`.

Salve e abra a página de novo.

## 5. Como acrescentar uma flor nova

Na PARTE 2, dentro de `flores`, copie um bloco e troque o número:

```
,21: {
  nome: "margarida",
  img: "flor-21-margarida",
  motivo: "escreva aqui o motivo 21"
}
```

- O número da flor é sempre o número do motivo.
- `img` é o nome do arquivo na pasta `flores`, **sem** a extensão.
- Se deixar `img` vazio, a página desenha uma flor sozinha.
- Uma flor só aparece para ela quando o **motivo** estiver escrito.
- Campos opcionais: `versiculo`, `versiculoDepois`, `nota`, `video`, `virtude`.

## 6. Como acrescentar uma carta nova

Na PARTE 2, dentro de `cartas`, copie um bloco inteiro:

```
,{
  id: "chuva",
  titulo: "Abra quando chover",
  versiculos: ["salmos34_18"],
  texto: "escreva a carta aqui"
}
```

Enquanto `texto` estiver vazio, o envelope aparece fechado com cadeado
prateado e a frase de que a carta ainda está sendo escrita. Quando você
escrever, ela passa a abrir, e a tela inicial avisa que chegou carta nova.

## 7. Contagem das flores

A contagem parte sempre de `dataDoPresente`, nunca do dia em que ela abre.
Dia 20/09/2026 = flor 1. Dia 21/09/2026 = flores 1 e 2. E assim por diante,
até a flor 366 em 20/09/2027.

Se ela passar dias sem abrir, as flores acumuladas ficam esperando.
Se o progresso sumir (celular novo, navegador limpo), o jardim se reconstrói
sozinho: tudo até ontem aparece plantado e só as do dia ficam esperando.

## 8. Antes de publicar

1. Conferir os versículos no `conferencia-versiculos.md`.
2. Abrir com `?teste=1` e olhar o resumo do painel: ele diz se a PARTE 1
   está completa.
3. Testar a jornada inteira no computador.
