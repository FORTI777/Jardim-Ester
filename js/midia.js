/* =====================================================================
   MÍDIA
   Encontra as imagens, os vídeos e os áudios dentro das pastas, mesmo
   que a extensão do arquivo seja outra (webp, jpg, png...).
   Se um arquivo não existir, desenha uma alternativa elegante por código.
   ===================================================================== */

window.MIDIA = (function(){

  /* extensões testadas, na ordem (a mais leve primeiro) */
  var EXT_IMG = ["webp", "avif", "jpg", "jpeg", "png", "JPG", "JPEG", "PNG", "WEBP"];
  var EXT_VID = ["mp4", "webm", "MP4", "WEBM", "mov", "MOV"];
  var EXT_AUD = ["mp3", "m4a", "ogg", "wav", "MP3", "M4A"];

  var cache = {};   /* guarda o que já foi encontrado ou não */

  /* tenta carregar uma imagem, testando extensão por extensão */
  function acharImagem(pasta, nome){
    var chave = "img:" + pasta + "/" + nome;
    if (cache[chave]) return cache[chave];

    cache[chave] = new Promise(function(resolve){
      if (!nome){ resolve(null); return; }
      var i = 0;
      function tentar(){
        if (i >= EXT_IMG.length){ resolve(null); return; }
        var url = pasta + "/" + nome + "." + EXT_IMG[i++];
        var im = new Image();
        im.onload = function(){ resolve(url); };
        im.onerror = tentar;
        im.src = url;
      }
      tentar();
    });
    return cache[chave];
  }

  /* tenta achar um vídeo */
  function acharVideo(nome){
    var chave = "vid:" + nome;
    if (cache[chave]) return cache[chave];

    cache[chave] = new Promise(function(resolve){
      if (!nome){ resolve(null); return; }
      var i = 0;
      function tentar(){
        if (i >= EXT_VID.length){ resolve(null); return; }
        var url = "videos/" + nome + "." + EXT_VID[i++];
        var v = document.createElement("video");
        v.preload = "metadata";
        v.muted = true;
        v.onloadedmetadata = function(){ v.src = ""; resolve(url); };
        v.onerror = tentar;
        v.src = url;
      }
      tentar();
    });
    return cache[chave];
  }

  /* tenta achar um áudio */
  function acharAudio(nome){
    var chave = "aud:" + nome;
    if (cache[chave]) return cache[chave];

    cache[chave] = new Promise(function(resolve){
      if (!nome){ resolve(null); return; }
      var i = 0;
      function tentar(){
        if (i >= EXT_AUD.length){ resolve(null); return; }
        var url = "audio/" + nome + "." + EXT_AUD[i++];
        var a = new Audio();
        a.preload = "metadata";
        a.onloadedmetadata = function(){ resolve(url); };
        a.onerror = tentar;
        a.src = url;
      }
      tentar();
    });
    return cache[chave];
  }

  /* cenários: aceita o nome exato ou variações do começo do nome */
  function cenario(nome){ return acharImagem("cenarios", nome); }

  /* memórias: aceita vários jeitos de numerar os arquivos */
  function memoria(numero){
    var dois = (numero < 10 ? "0" : "") + numero;
    var tentativas = ["memoria-" + dois, dois, "foto-" + dois, "memoria" + dois, numero + ""];
    var chave = "mem:" + dois;
    if (cache[chave]) return cache[chave];
    cache[chave] = (function(){
      var p = Promise.resolve(null);
      tentativas.forEach(function(nome){
        p = p.then(function(achado){
          return achado ? achado : acharImagem("memorias", nome);
        });
      });
      return p;
    })();
    return cache[chave];
  }

  /* imagem da flor, pelo campo img do arquivo de textos */
  function flor(nomeArquivo){ return acharImagem("flores", nomeArquivo); }

  /* botãozinho da flor (a semente que ela toca para plantar) */
  function botao(nomeArquivo){
    if (!nomeArquivo) return Promise.resolve(null);
    return acharImagem("flores", nomeArquivo.replace(/^flor-/, "botao-"));
  }

  /* carrega uma imagem antes da hora, para a próxima tela abrir rápido */
  function adiantar(url){
    if (!url) return;
    var im = new Image();
    im.src = url;
  }

  /* ------------------------------------------------------------------
     DESENHOS POR CÓDIGO, usados quando o arquivo não existe
     ------------------------------------------------------------------ */

  /* paleta de flores, escolhida pelo número da flor */
  var PALETA = [
    ["#E7899A", "#F6C6CE", "#C2566C"],
    ["#F2C46B", "#FBE3AC", "#D79B34"],
    ["#B9A4DA", "#DCCFF0", "#8C74B8"],
    ["#F5F0E4", "#FFFFFF", "#D9CDB4"],
    ["#EE9C6F", "#F8CDAE", "#CC7247"],
    ["#9FC8A6", "#CFE5D2", "#6E9B77"],
    ["#E9B7D2", "#F7DCEA", "#C083A7"],
    ["#8FB8DA", "#C7DDEE", "#6892B8"]
  ];

  /* desenha uma flor em SVG, diferente para cada número */
  function florDesenhada(numero, animar){
    var n = numero || 1;
    var cores = PALETA[n % PALETA.length];
    var petalas = 5 + (n % 4);            /* entre 5 e 8 pétalas */
    var giro = 360 / petalas;
    var miolo = ["#F4D98B", "#E8C169", "#F7E3A8"][n % 3];

    var p = "";
    for (var i = 0; i < petalas; i++){
      var atraso = animar ? (1.1 + i * 0.09).toFixed(2) : 0;
      p += '<g transform="rotate(' + (i * giro) + ' 50 44)">' +
             '<ellipse cx="50" cy="26" rx="9.5" ry="17" fill="' + cores[0] + '" ' +
             'style="' + (animar ? 'transform-box:fill-box;transform-origin:50% 100%;animation:abrirPetala .9s ease ' + atraso + 's both;' : '') + '"/>' +
             '<ellipse cx="50" cy="22" rx="4.2" ry="8" fill="' + cores[1] + '" opacity=".55" ' +
             'style="' + (animar ? 'transform-box:fill-box;transform-origin:50% 100%;animation:abrirPetala .9s ease ' + atraso + 's both;' : '') + '"/>' +
           '</g>';
    }

    return '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img">' +
      '<style>' +
        '@keyframes crescerCaule{from{transform:scaleY(0)}to{transform:scaleY(1)}}' +
        '@keyframes abrirPetala{from{transform:scale(.05);opacity:0}to{transform:scale(1);opacity:1}}' +
        '@keyframes abrirFolha{from{transform:scale(.05);opacity:0}to{transform:scale(1);opacity:1}}' +
      '</style>' +
      '<g style="' + (animar ? 'transform-box:fill-box;transform-origin:50% 100%;animation:crescerCaule 1.1s ease both;' : '') + '">' +
        '<path d="M50 96 C48 78 49 62 50 48" stroke="#6E8B6A" stroke-width="2.6" fill="none" stroke-linecap="round"/>' +
      '</g>' +
      '<g style="' + (animar ? 'transform-box:fill-box;transform-origin:0% 100%;animation:abrirFolha .8s ease .75s both;' : '') + '">' +
        '<path d="M50 74 C38 70 32 62 31 54 C40 54 48 62 50 74Z" fill="#7FA078"/>' +
      '</g>' +
      '<g style="' + (animar ? 'transform-box:fill-box;transform-origin:100% 100%;animation:abrirFolha .8s ease .95s both;' : '') + '">' +
        '<path d="M50 82 C62 79 68 71 69 63 C60 63 52 70 50 82Z" fill="#6E8B6A"/>' +
      '</g>' +
      p +
      '<circle cx="50" cy="44" r="7.6" fill="' + miolo + '" ' +
        'style="' + (animar ? 'transform-box:fill-box;transform-origin:50% 50%;animation:abrirPetala .7s ease 1.7s both;' : '') + '"/>' +
      '<circle cx="50" cy="44" r="3.4" fill="' + cores[2] + '" opacity=".45" ' +
        'style="' + (animar ? 'transform-box:fill-box;transform-origin:50% 50%;animation:abrirPetala .7s ease 1.8s both;' : '') + '"/>' +
    '</svg>';
  }

  /* brotinho, usado quando não existe o cenário do broto */
  function brotoDesenhado(){
    return '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">' +
      '<style>@keyframes brotar{from{transform:scaleY(0);opacity:0}to{transform:scaleY(1);opacity:1}}</style>' +
      '<g style="transform-box:fill-box;transform-origin:50% 100%;animation:brotar 1.6s ease both">' +
        '<path d="M50 92 C50 80 50 72 50 64" stroke="#6E8B6A" stroke-width="3" fill="none" stroke-linecap="round"/>' +
        '<path d="M50 72 C40 70 34 63 34 56 C43 56 49 63 50 72Z" fill="#83A87B"/>' +
        '<path d="M50 78 C60 76 66 69 66 62 C57 62 51 69 50 78Z" fill="#6E8B6A"/>' +
      '</g></svg>';
  }

  /* cadeado desenhado, usado se não existir o cenário do cadeado */
  function cadeadoDesenhado(){
    return '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M32 46 V34 a18 18 0 0 1 36 0 V46" fill="none" stroke="#D4AF57" stroke-width="5.5" stroke-linecap="round"/>' +
      '<rect x="22" y="46" width="56" height="42" rx="8" fill="none" stroke="#D4AF57" stroke-width="4.5"/>' +
      '<circle cx="50" cy="63" r="5" fill="#D4AF57"/>' +
      '<path d="M50 67 v9" stroke="#D4AF57" stroke-width="4" stroke-linecap="round"/>' +
    '</svg>';
  }

  /* estrela das memórias */
  function estrelaDesenhada(){
    return '<svg viewBox="0 0 40 40"><path class="brilho" d="M20 2 L23.4 15.2 L36.5 18.6 L23.4 22 L20 35.2 L16.6 22 L3.5 18.6 L16.6 15.2 Z"/></svg>';
  }

  /* cadeadinho pequeno dos envelopes */
  function cadeadinho(){
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">' +
      '<path d="M8 11V8a4 4 0 0 1 8 0v3"/><rect x="5" y="11" width="14" height="10" rx="2.5"/>' +
    '</svg>';
  }

  /* arco de folhas que liga as nove flores do fruto do Espírito */
  function arcoFolhas(){
    return '<svg viewBox="0 0 300 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M8 50 C70 8 230 8 292 50" stroke="#6E8B6A" stroke-width="2" fill="none"/>' +
      '<g fill="#7FA078">' +
        '<ellipse cx="40" cy="36" rx="9" ry="4.5" transform="rotate(-32 40 36)"/>' +
        '<ellipse cx="80" cy="22" rx="9" ry="4.5" transform="rotate(-18 80 22)"/>' +
        '<ellipse cx="125" cy="15" rx="9" ry="4.5" transform="rotate(-7 125 15)"/>' +
        '<ellipse cx="175" cy="15" rx="9" ry="4.5" transform="rotate(7 175 15)"/>' +
        '<ellipse cx="220" cy="22" rx="9" ry="4.5" transform="rotate(18 220 22)"/>' +
        '<ellipse cx="260" cy="36" rx="9" ry="4.5" transform="rotate(32 260 36)"/>' +
      '</g></svg>';
  }

  /* nota musical do botão de música */
  function notaMusical(tocando){
    return '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7">' +
      (tocando
        ? '<path d="M9 18V5l10-2v13"/><circle cx="6.5" cy="18" r="2.8"/><circle cx="16.5" cy="16" r="2.8"/>'
        : '<path d="M9 18V5l10-2v13"/><circle cx="6.5" cy="18" r="2.8"/><circle cx="16.5" cy="16" r="2.8"/><path d="M3 3l18 18"/>') +
    '</svg>';
  }

  return {
    imagem: acharImagem,
    video: acharVideo,
    audio: acharAudio,
    cenario: cenario,
    memoria: memoria,
    flor: flor,
    botao: botao,
    adiantar: adiantar,
    florDesenhada: florDesenhada,
    brotoDesenhado: brotoDesenhado,
    cadeadoDesenhado: cadeadoDesenhado,
    estrelaDesenhada: estrelaDesenhada,
    cadeadinho: cadeadinho,
    arcoFolhas: arcoFolhas,
    notaMusical: notaMusical
  };

})();
