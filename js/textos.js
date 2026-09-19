/* =====================================================================
   JARDIM DA ESTER, ARQUIVO DE TEXTOS
   ---------------------------------------------------------------------
   Este é o único arquivo que você precisa editar para escrever.
   Tudo o que aparece escrito na página está aqui dentro.

   COMO EDITAR, EM 4 REGRAS SIMPLES:
   1. Escreva sempre entre as aspas "assim".
   2. Não apague as vírgulas do fim das linhas.
   3. Se precisar usar aspas dentro do texto, use aspas simples 'assim'.
   4. Para pular uma linha dentro de um texto, escreva \n no lugar.

   Depois de salvar este arquivo, é só abrir a página de novo para ver.
   ===================================================================== */

window.TEXTOS = {

/* #####################################################################
   #                                                                   #
   #   PARTE 1, ESSENCIAL PARA O DIA DA ENTREGA                        #
   #   A página não deve ser publicada sem estes campos preenchidos.   #
   #                                                                   #
   ##################################################################### */

  /* ---------------------------------------------------------------
     1. DATA DO PRESENTE
     Dia em que você entrega o presente. Toda a contagem das 366
     flores parte desta data, nunca do dia em que ela abriu a página.
     Formato: DD/MM/AAAA
     --------------------------------------------------------------- */
  dataDoPresente: "20/09/2026",

  /* ---------------------------------------------------------------
     2. SENHA DO COFRE
     A data do primeiro "eu te amo", em DD/MM/AAAA.
     Ela pode digitar com ou sem as barras, os dois jeitos funcionam.
     --------------------------------------------------------------- */
  senha: "ESCREVA AQUI A DATA DO PRIMEIRO EU TE AMO, EXEMPLO 20/09/2025",

  /* A dica que aparece embaixo do cadeado. */
  dicaSenha: "ESCREVA AQUI A DICA, por exemplo: o dia em que eu te disse pela primeira vez",

  /* Mensagem carinhosa quando ela erra a senha. */
  senhaErrada: "não foi essa, meu amor, tenta de novo",

  /* ---------------------------------------------------------------
     3. AS 12 MEMÓRIAS
     Uma para cada mês, na ordem das suas 12 fotos (01 a 12).
     "mes" é o título que aparece, "frase" é a lembrança curta.
     A foto vem da pasta memorias, pelo número.
     --------------------------------------------------------------- */
  memorias: [
    { mes: "ESCREVA O MÊS DA FOTO 01", frase: "ESCREVA AQUI A FRASE CURTA DESSA MEMÓRIA" },
    { mes: "ESCREVA O MÊS DA FOTO 02", frase: "ESCREVA AQUI A FRASE CURTA DESSA MEMÓRIA" },
    { mes: "ESCREVA O MÊS DA FOTO 03", frase: "ESCREVA AQUI A FRASE CURTA DESSA MEMÓRIA" },
    { mes: "ESCREVA O MÊS DA FOTO 04", frase: "ESCREVA AQUI A FRASE CURTA DESSA MEMÓRIA" },
    { mes: "ESCREVA O MÊS DA FOTO 05", frase: "ESCREVA AQUI A FRASE CURTA DESSA MEMÓRIA" },
    { mes: "ESCREVA O MÊS DA FOTO 06", frase: "ESCREVA AQUI A FRASE CURTA DESSA MEMÓRIA" },
    { mes: "ESCREVA O MÊS DA FOTO 07", frase: "ESCREVA AQUI A FRASE CURTA DESSA MEMÓRIA" },
    { mes: "ESCREVA O MÊS DA FOTO 08", frase: "ESCREVA AQUI A FRASE CURTA DESSA MEMÓRIA" },
    { mes: "ESCREVA O MÊS DA FOTO 09", frase: "ESCREVA AQUI A FRASE CURTA DESSA MEMÓRIA" },
    { mes: "ESCREVA O MÊS DA FOTO 10", frase: "ESCREVA AQUI A FRASE CURTA DESSA MEMÓRIA" },
    { mes: "ESCREVA O MÊS DA FOTO 11", frase: "ESCREVA AQUI A FRASE CURTA DESSA MEMÓRIA" },
    { mes: "ESCREVA O MÊS DA FOTO 12", frase: "ESCREVA AQUI A FRASE CURTA DESSA MEMÓRIA" }
  ],

  /* Linha discreta que explica a moldura das 12 estrelas (Josué 4). */
  legendaMemorias: "doze estrelas, como as doze pedras que Josué mandou tirar do Jordão, para que um dia a gente conte essa história",

  /* ---------------------------------------------------------------
     4. A CARTA PRINCIPAL
     É a carta que se escreve sozinha, letra por letra, depois que ela
     abrir as 12 memórias. Use \n para pular linha.
     A bênção de Números 6:24-26 entra sozinha no fim, não precisa
     escrever de novo.
     --------------------------------------------------------------- */
  cartaPrincipal: "ESCREVA AQUI A CARTA PRINCIPAL.\n\nPode usar vários parágrafos, é só separar com uma linha em branco usando \\n\\n como neste exemplo.\n\nCom amor,\nFelipe",

  /* ---------------------------------------------------------------
     5. O BUQUÊ DO PRESENTE (FLOR 01)
     Os nomes das flores que formam o ramalhete, de 1 até no máximo 5.
     Se deixar só uma, o título vira "a flor do presente" sozinho.
     Apague as linhas que não for usar (e a vírgula da linha de cima).
     --------------------------------------------------------------- */
  buque: {
    flores: [
      "NOME DA FLOR 1 DO RAMALHETE",
      "NOME DA FLOR 2 DO RAMALHETE",
      "NOME DA FLOR 3 DO RAMALHETE",
      "NOME DA FLOR 4 DO RAMALHETE",
      "NOME DA FLOR 5 DO RAMALHETE"
    ],
    /* O cartãozinho preso à fita do buquê, uma ou duas frases. */
    cartao: "ESCREVA AQUI O CARTÃOZINHO DO BUQUÊ, uma ou duas frases de entrega das flores"
  },

/* #####################################################################
   #                                                                   #
   #   PARTE 2, VOCÊ VAI ESCREVENDO AOS POUCOS                         #
   #   Pode ficar vazia no lançamento. Nada vazio aparece para ela.    #
   #                                                                   #
   ##################################################################### */

  /* ---------------------------------------------------------------
     6. AS FLORES E OS MOTIVOS, de 1 até 366
     O número do motivo é sempre o mesmo número da flor.

     Cada flor se escreve assim:

        12: {
          nome: "nome popular da flor",
          img: "flor-12-nome-do-arquivo",
          motivo: "o motivo pelo qual eu te amo"
        },

     O campo "img" é o nome do arquivo da imagem dentro da pasta
     flores, SEM a extensão. Se você deixar vazio, a página desenha
     uma flor sozinha, bonita, no lugar.

     Campos extras, todos opcionais:
        versiculo: "chave"        (uma das chaves da lista de versículos)
        versiculoDepois: "chave"  (versículo que só aparece ao reabrir a flor)
        nota: "uma linha de explicação discreta"
        video: "video-04-rosa"    (nome do arquivo na pasta videos)
        virtude: "amor"           (só para as nove do fruto do Espírito)

     UMA FLOR SÓ APARECE PARA ELA QUANDO O MOTIVO ESTIVER ESCRITO.
     Enquanto o motivo estiver vazio, a página mostra com carinho
     que novas flores estão a caminho, e a contagem continua certa.

     Para acrescentar a flor 21, é só copiar um bloco, trocar o número
     e escrever. Não precisa mexer em mais nada.
     --------------------------------------------------------------- */
  flores: {

    1: {
      nome: "o buquê do presente",
      img: "flor-01-ramalhete",
      video: "video-01-ramalhete",
      motivo: "ESCREVA AQUI O MOTIVO 1, ele aparece junto com o buquê no primeiro dia"
    },

    2: {
      nome: "amendoeira",
      img: "flor-02-amendoeira",
      video: "video-03-vara-florescendo",
      versiculo: "numeros17_8",
      versiculoDepois: "jeremias1_11",
      nota: "em hebraico, amendoeira é shaqed e vigiar é shoqed, quase a mesma palavra, e a amendoeira é a árvore que floresce primeiro, como quem fica acordado vigiando",
      motivo: ""
    },

    3: {
      nome: "rosa vermelha",
      img: "flor-03-rosa",
      video: "video-04-rosa",
      virtude: "amor",
      motivo: ""
    },

    4: {
      nome: "anêmona",
      img: "flor-04-anemona",
      versiculo: "mateus6_28",
      nota: "a flor do campo que Jesus mandou olhar provavelmente era a anêmona, que cobre os campos da Galileia de vermelho na primavera",
      motivo: ""
    },

    5: {
      nome: "peônia",
      img: "flor-05-peonia",
      video: "video-05-peonia",
      virtude: "bondade",
      motivo: ""
    },

    6: {
      nome: "romãzeira",
      img: "flor-06-romazeira",
      versiculo: "cantares6_11",
      motivo: ""
    },

    7: {
      nome: "lírio-branco",
      img: "flor-07-lirio-branco",
      virtude: "paz",
      versiculo: "oseias14_5",
      motivo: ""
    },

    8: {
      nome: "açafrão",
      img: "flor-08-acafrao",
      versiculo: "cantares2_1",
      nota: "a Bíblia coloca estas palavras na boca da amada, e hoje são suas",
      motivo: ""
    },

    /* Flor 09: escreva o nome e o nome do arquivo que está na pasta flores. */
    9: {
      nome: "",
      img: "",
      motivo: ""
    },

    10: {
      nome: "nardo",
      img: "flor-10-nardo",
      versiculo: "joao12_3",
      motivo: ""
    },

    11: {
      nome: "girassol",
      img: "flor-11-girassol",
      virtude: "gozo",
      motivo: ""
    },

    /* Flor 12: escreva o nome e o nome do arquivo que está na pasta flores. */
    12: {
      nome: "",
      img: "",
      motivo: ""
    },

    13: {
      nome: "orquídea-borboleta",
      img: "flor-13-orquidea-borboleta",
      virtude: "temperança",
      motivo: ""
    },

    14: {
      nome: "lótus",
      img: "flor-14-lotus",
      video: "video-06-lotus",
      motivo: ""
    },

    15: {
      nome: "ipê-amarelo",
      img: "flor-15-ipe-amarelo",
      virtude: "longanimidade",
      motivo: ""
    },

    16: {
      nome: "hortênsia",
      img: "flor-16-hortensia",
      virtude: "benignidade",
      motivo: ""
    },

    /* Flor 17: escreva o nome e o nome do arquivo que está na pasta flores. */
    17: {
      nome: "",
      img: "",
      motivo: ""
    },

    18: {
      nome: "lavanda",
      img: "flor-18-lavanda",
      virtude: "mansidão",
      motivo: ""
    },

    19: {
      nome: "flor de maracujá",
      img: "flor-19-maracuja",
      virtude: "fé",
      motivo: ""
    },

    /* Flor 20: escreva o nome e o nome do arquivo que está na pasta flores. */
    20: {
      nome: "",
      img: "",
      motivo: ""
    }

    /* Daqui em diante, é só acrescentar. Exemplo da flor 21:

    ,21: {
      nome: "margarida",
      img: "flor-21-margarida",
      motivo: "escreva o motivo 21 aqui"
    }

    Não esqueça da vírgula antes do número, como no exemplo acima. */

  },

  /* ---------------------------------------------------------------
     7. AS CARTAS "ABRA QUANDO"
     Enquanto o texto estiver vazio, o envelope aparece na caixinha
     com o título, um cadeado prateado e a frase de que a carta ainda
     está sendo escrita.
     Quando você escrever o texto, ela passa a abrir normalmente, e a
     página avisa com delicadeza que chegou carta nova.

     Para criar uma carta de tema novo, copie um bloco inteiro, troque
     o "id" por um nome sem espaços e escreva o título e o texto.
     --------------------------------------------------------------- */
  cartas: [
    {
      id: "saudade",
      titulo: "Abra quando estiver com saudade",
      versiculos: ["filipenses1_3", "filipenses1_8"],
      texto: ""
    },
    {
      id: "triste",
      titulo: "Abra quando estiver triste",
      versiculos: ["salmos34_18"],
      texto: ""
    },
    {
      id: "ansiosa",
      titulo: "Abra quando estiver ansiosa",
      versiculos: ["filipenses4_6"],
      texto: ""
    },
    {
      id: "duvida",
      titulo: "Abra quando duvidar do meu amor",
      versiculos: ["cantares8_7"],
      texto: ""
    },
    {
      id: "briga",
      titulo: "Abra quando a gente brigar",
      versiculos: ["cantares2_15"],
      texto: ""
    },
    {
      id: "orar",
      titulo: "Abra quando quiser orar comigo",
      versiculos: ["tiago5_16", "romanos8_26"],
      audio: "oracao",
      texto: ""
    }
  ],

  /* ---------------------------------------------------------------
     8. A CARTA DO PRÓXIMO ANIVERSÁRIO
     Fica lacrada com o cadeado dourado até o dia 20/09/2027.
     --------------------------------------------------------------- */
  cartaProximoAniversario: {
    titulo: "Abra no nosso próximo aniversário",
    texto: ""
  },

/* #####################################################################
   #                                                                   #
   #   VERSÍCULOS, todos na Almeida Revista e Corrigida (ARC)          #
   #   Confira no arquivo conferencia-versiculos.md e, se precisar     #
   #   corrigir alguma palavra, corrija aqui mesmo.                    #
   #                                                                   #
   ##################################################################### */

  versiculos: {

    cantares8_6: {
      ref: "Cantares 8:6",
      texto: "Põe-me como selo sobre o teu coração, como selo sobre o teu braço"
    },
    salmos147_3: {
      ref: "Salmos 147:3-4",
      texto: "Sara os quebrantados de coração e liga-lhes as feridas. Conta o número das estrelas, chama-as a todas pelos seus nomes."
    },
    josue4_6: {
      ref: "Josué 4:6-7",
      texto: "Para que isto seja por sinal entre vós; e, quando vossos filhos no futuro perguntarem, dizendo: Que vos significam estas pedras? Então, lhes direis que as águas do Jordão se separaram diante da arca do concerto do SENHOR; e estas pedras serão, para sempre, por memorial aos filhos de Israel."
    },
    salmos126_2: {
      ref: "Salmos 126:2-3",
      texto: "Então, a nossa boca se encheu de riso, e a nossa língua, de cânticos; então, se dizia entre as nações: Grandes coisas fez o SENHOR a estes. Grandes coisas fez o SENHOR por nós, pelas quais estamos alegres."
    },
    numeros6_24: {
      ref: "Números 6:24-26",
      texto: "O SENHOR te abençoe e te guarde; o SENHOR faça resplandecer o seu rosto sobre ti e tenha misericórdia de ti; o SENHOR sobre ti levante o seu rosto e te dê a paz."
    },
    cantares6_10: {
      ref: "Cantares 6:10",
      texto: "Quem é esta que aparece como a alva do dia, formosa como a lua, brilhante como o sol"
    },
    genesis2_8: {
      ref: "Gênesis 2:8",
      texto: "E plantou o SENHOR Deus um jardim no Éden, da banda do Oriente, e pôs ali o homem que tinha formado."
    },
    genesis2_15: {
      ref: "Gênesis 2:15",
      texto: "E tomou o SENHOR Deus o homem e o pôs no jardim do Éden para o lavrar e o guardar."
    },
    corintios3_6: {
      ref: "1 Coríntios 3:6",
      texto: "Eu plantei; Apolo regou; mas Deus deu o crescimento."
    },
    lamentacoes3_22: {
      ref: "Lamentações 3:22-23",
      texto: "As misericórdias do SENHOR são a causa de não sermos consumidos, porque as suas misericórdias não têm fim; novas são cada manhã; grande é a tua fidelidade."
    },
    numeros17_8: {
      ref: "Números 17:8",
      texto: "Eis que a vara de Arão, pela casa de Levi, florescia; porque produzira flores e brotara renovos e dera amêndoas."
    },
    jeremias1_11: {
      ref: "Jeremias 1:11-12",
      texto: "E veio a mim a palavra do SENHOR, dizendo: Que vês tu, Jeremias? E eu disse: Vejo uma vara de amendoeira. E disse-me o SENHOR: Viste bem; porque eu velo sobre a minha palavra para a cumprir."
    },
    mateus6_28: {
      ref: "Mateus 6:28",
      texto: "E, quanto ao vestuário, por que andais solícitos? Olhai para os lírios do campo, como eles crescem; não trabalham nem fiam."
    },
    cantares6_11: {
      ref: "Cantares 6:11",
      texto: "Desci ao jardim das nogueiras, para ver os novos frutos do vale, a ver se floresciam as vides e brotavam as romeiras."
    },
    cantares2_1: {
      ref: "Cantares 2:1",
      texto: "Eu sou a rosa de Sarom, o lírio dos vales."
    },
    joao12_3: {
      ref: "João 12:3",
      texto: "Então, Maria, tomando um arrátel de unguento de nardo puro, de muito preço, ungiu os pés de Jesus e enxugou-lhe os pés com os seus cabelos; e encheu-se a casa do cheiro do unguento."
    },
    oseias14_5: {
      ref: "Oseias 14:5",
      texto: "Eu serei para Israel como o orvalho; ele florescerá como o lírio e lançará as suas raízes como o Líbano."
    },
    galatas5_22: {
      ref: "Gálatas 5:22-23",
      texto: "Mas o fruto do Espírito é: amor, gozo, paz, longanimidade, benignidade, bondade, fé, mansidão, temperança. Contra estas coisas não há lei."
    },
    salmos65_11: {
      ref: "Salmos 65:11",
      texto: "Coroas o ano da tua bondade, e as tuas veredas destilam gordura."
    },
    filipenses1_3: {
      ref: "Filipenses 1:3",
      texto: "Dou graças ao meu Deus todas as vezes que me lembro de vós."
    },
    filipenses1_8: {
      ref: "Filipenses 1:8",
      texto: "Porque Deus me é testemunha das saudades que de todos vós tenho, em entranhável afeição de Jesus Cristo."
    },
    salmos34_18: {
      ref: "Salmos 34:18",
      texto: "Perto está o SENHOR dos que têm o coração quebrantado, e salva os contritos de espírito."
    },
    filipenses4_6: {
      ref: "Filipenses 4:6-7",
      texto: "Não estejais inquietos por coisa alguma; antes, as vossas petições sejam em tudo conhecidas diante de Deus, pela oração e súplicas, com ação de graças. E a paz de Deus, que excede todo o entendimento, guardará os vossos corações e os vossos sentimentos em Cristo Jesus."
    },
    cantares8_7: {
      ref: "Cantares 8:7",
      texto: "As muitas águas não poderiam apagar este amor, nem os rios afogá-lo; ainda que alguém desse toda a fazenda de sua casa por este amor, certamente a desprezariam."
    },
    cantares2_15: {
      ref: "Cantares 2:15",
      texto: "Apanhai-nos as raposas, as raposinhas, que fazem mal às vinhas, porque as nossas vinhas têm uvas tenras."
    },
    tiago5_16: {
      ref: "Tiago 5:16",
      texto: "Confessai as vossas culpas uns aos outros e orai uns pelos outros, para que sareis. A oração feita por um justo pode muito em seus efeitos."
    },
    romanos8_26: {
      ref: "Romanos 8:26",
      texto: "E da mesma maneira também o Espírito ajuda as nossas fraquezas; porque não sabemos o que havemos de pedir como convém, mas o mesmo Espírito intercede por nós com gemidos inexprimíveis."
    }

  },

/* #####################################################################
   #   TEXTINHOS DA PÁGINA                                             #
   #   Já estão prontos. Só mexa se quiser trocar alguma palavra.      #
   ##################################################################### */

  interface: {
    tituloJardim: "o jardim da Ester",
    fraseCanteiroVazio: "cada flor aqui é um motivo pelo qual eu te amo, e a partir de hoje nasce um novo a cada dia, até o nosso próximo aniversário",
    convitePlantar: "toque na terra",
    floresACaminho: "novas flores estão a caminho",
    tituloBuqueVarias: "o buquê do presente",
    tituloBuqueUma: "a flor do presente",
    tituloFruto: "o fruto do Espírito",
    fraseFruto: "um só fruto, nove sabores do mesmo amor",
    tituloCartas: "a caixinha de cartas",
    cartaSendoEscrita: "esta carta ainda está sendo escrita",
    cartaNova: "chegou uma carta nova para você",
    faltamDias: "faltam",
    diasPalavra: "dias",
    hojePalavra: "é hoje",
    caminhoJardim: "o jardim",
    caminhoCeu: "o céu das memórias",
    caminhoCartas: "as cartas",
    esperandoPlantar: "esperando para ser plantada",
    esperandoPlantarVarias: "esperando para serem plantadas",
    botaoOracao: "ouvir a minha voz orando por você",
    boasVindas: "bem-vinda de volta, meu amor"
  }

};
