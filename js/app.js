/* =====================================================================
   JARDIM DA ESTER
   Toda a lógica da página. Os textos ficam em js/textos.js.
   ===================================================================== */

(function(){
"use strict";

var T = window.TEXTOS;
var IF = T.interface;
var $ = function(id){ return document.getElementById(id); };

/* =====================================================================
   MODO DE TESTE
   ===================================================================== */
var parametros = new URLSearchParams(location.search);
var TESTE = parametros.get("teste") === "1";
var CHAVE = TESTE ? "jardim-ester-teste-v1" : "jardim-ester-v1";

/* data que a página considera "hoje" (no teste, pode ser simulada) */
var dataSimulada = null;

/* =====================================================================
   DATAS
   ===================================================================== */
var MESES = ["janeiro","fevereiro","março","abril","maio","junho",
             "julho","agosto","setembro","outubro","novembro","dezembro"];

/* transforma "20/09/2026" em data de verdade */
function lerData(txt){
  if (!txt) return null;
  var so = String(txt).replace(/[^0-9]/g, "");
  if (so.length !== 8) return null;
  var d = +so.slice(0,2), m = +so.slice(2,4), a = +so.slice(4,8);
  var dt = new Date(a, m - 1, d, 12, 0, 0);
  if (dt.getDate() !== d || dt.getMonth() !== m - 1) return null;
  return dt;
}
function meiaNoite(dt){ return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), 12, 0, 0); }
function hoje(){ return meiaNoite(dataSimulada || new Date()); }
function somarDias(dt, n){ var x = new Date(dt); x.setDate(x.getDate() + n); return x; }
function somarMeses(dt, n){ var x = new Date(dt); x.setMonth(x.getMonth() + n); return x; }
function diferencaEmDias(a, b){ return Math.round((meiaNoite(a) - meiaNoite(b)) / 86400000); }

var DATA_PRESENTE = lerData(T.dataDoPresente) || new Date(2026, 8, 20, 12, 0, 0);
var TOTAL_FLORES = 366;
var DATA_FINAL = somarDias(DATA_PRESENTE, TOTAL_FLORES - 1);   /* 20/09/2027 */

/* qual é o dia do jardim hoje (1 = dia do presente) */
function diaDoJardim(){
  var d = diferencaEmDias(hoje(), DATA_PRESENTE) + 1;
  if (d < 1) d = 1;
  if (d > TOTAL_FLORES) d = TOTAL_FLORES;
  return d;
}
/* data em que cada flor nasce */
function dataDaFlor(n){ return somarDias(DATA_PRESENTE, n - 1); }
/* já chegou o grande dia? */
function ehOGrandeDia(){ return diferencaEmDias(hoje(), DATA_FINAL) >= 0; }
function diasAteOFinal(){ return Math.max(0, diferencaEmDias(DATA_FINAL, hoje())); }

/* =====================================================================
   OS TEXTOS, LIDOS COM CUIDADO
   ===================================================================== */
function limpo(txt){ return (txt == null ? "" : String(txt)).trim(); }
/* um campo só conta como escrito se não estiver vazio */
function escrito(txt){ return limpo(txt).length > 0; }
/* no modo de teste, campos vazios ganham um texto de exemplo.
   O botão do painel desliga isso, para eu ver a página como ela vai ver. */
var EXEMPLOS = TESTE;
function exemplo(txt, alternativa){
  if (escrito(txt)) return limpo(txt);
  return EXEMPLOS ? alternativa : "";
}
function versiculo(chave){
  var v = T.versiculos[chave];
  return v ? v : { ref: "", texto: "" };
}

/* uma flor está pronta quando o motivo está escrito */
function florPronta(n){
  var f = T.flores[n];
  if (!f) return false;
  if (escrito(f.motivo)) return true;
  return EXEMPLOS && n <= diaDoJardim();   /* no teste, tudo aparece */
}
function dadosDaFlor(n){
  var f = T.flores[n] || {};
  return {
    n: n,
    nome: escrito(f.nome) ? limpo(f.nome) : (EXEMPLOS ? "flor de exemplo " + n : ""),
    img: limpo(f.img),
    video: limpo(f.video),
    versiculo: limpo(f.versiculo),
    versiculoDepois: limpo(f.versiculoDepois),
    nota: limpo(f.nota),
    virtude: limpo(f.virtude),
    motivo: exemplo(f.motivo, "motivo de exemplo número " + n + ", só aparece no modo de teste")
  };
}
/* todas as flores prontas até um certo dia */
function floresProntasAte(dia){
  var lista = [];
  for (var n = 1; n <= dia; n++){ if (florPronta(n)) lista.push(n); }
  return lista;
}
/* o maior número de flor que já tem tudo pronto */
function ultimaFlorPronta(){
  var maior = 0;
  Object.keys(T.flores).forEach(function(k){ var n = +k; if (florPronta(n) && n > maior) maior = n; });
  return maior;
}

/* =====================================================================
   O QUE FICA GUARDADO NO NAVEGADOR DELA
   ===================================================================== */
var estadoPadrao = {
  desbloqueado: false,
  memoriasAbertas: [],
  jornadaCompleta: false,
  jardimIniciado: false,
  floresPlantadas: [],
  cartasAbertas: [],
  cartasVistas: [],
  grandeDiaVisto: false
};
var estado = carregar();

function carregar(){
  try{
    var bruto = localStorage.getItem(CHAVE);
    if (!bruto) return JSON.parse(JSON.stringify(estadoPadrao));
    var e = JSON.parse(bruto);
    Object.keys(estadoPadrao).forEach(function(k){
      if (e[k] === undefined) e[k] = JSON.parse(JSON.stringify(estadoPadrao[k]));
    });
    return e;
  }catch(err){
    return JSON.parse(JSON.stringify(estadoPadrao));
  }
}
function salvar(){
  try{ localStorage.setItem(CHAVE, JSON.stringify(estado)); }catch(err){}
}
function zerar(){
  try{ localStorage.removeItem(CHAVE); }catch(err){}
  estado = JSON.parse(JSON.stringify(estadoPadrao));
}
function plantada(n){ return estado.floresPlantadas.indexOf(n) !== -1; }

/* Se o progresso sumir, o jardim se reconstrói sozinho:
   tudo o que era dela até ontem aparece já plantado, e só as do dia esperam. */
function reconstruirSePreciso(){
  if (estado.jardimIniciado) return;
  var dia = diaDoJardim();
  floresProntasAte(dia - 1).forEach(function(n){
    if (!plantada(n)) estado.floresPlantadas.push(n);
  });
  estado.jardimIniciado = true;
  salvar();
}
/* as flores que estão esperando para ela plantar */
function floresEsperando(){
  return floresProntasAte(diaDoJardim()).filter(function(n){ return !plantada(n); });
}

/* =====================================================================
   FERRAMENTAS DE TELA
   ===================================================================== */
var telaAtual = null;
function mostrarTela(id, aposAparecer){
  var nova = $(id);
  if (telaAtual && telaAtual !== nova){
    var velha = telaAtual;
    velha.classList.remove("ativa");
    setTimeout(function(){ if (velha !== telaAtual) velha.style.display = "none"; }, 1200);
  }
  telaAtual = nova;
  nova.style.display = "flex";
  nova.scrollTop = 0;
  requestAnimationFrame(function(){
    requestAnimationFrame(function(){
      nova.classList.add("ativa");
      if (aposAparecer) aposAparecer();
    });
  });
  atualizarBotaoVoltar(id);
}

/* mostra um versículo sozinho na tela, por alguns segundos */
function telaDeVersiculo(chave, segundos, depois){
  var v = versiculo(chave);
  $("texto-versiculo").innerHTML = escapar(v.texto) + '<span class="ref">' + escapar(v.ref) + '</span>';
  mostrarTela("tela-versiculo");
  var seguiu = false;
  function seguir(){
    if (seguiu) return;
    seguiu = true;
    $("tela-versiculo").removeEventListener("click", seguir);
    if (depois) depois();
  }
  $("tela-versiculo").addEventListener("click", seguir);
  setTimeout(seguir, (segundos || 6) * 1000);
}

function escapar(txt){
  return String(txt == null ? "" : txt)
    .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

/* escreve um texto letra por letra */
function escreverSozinho(elemento, texto, velocidade, aoTerminar){
  elemento.textContent = "";
  var cursor = document.createElement("span");
  cursor.className = "cursor-escrita";
  elemento.appendChild(cursor);
  var i = 0, parado = false;
  var vel = velocidade || 32;

  function passo(){
    if (parado) return;
    if (i >= texto.length){
      cursor.remove();
      if (aoTerminar) aoTerminar();
      return;
    }
    var pedaco = texto.slice(i, i + 1);
    cursor.insertAdjacentText("beforebegin", pedaco);
    i++;
    var pausa = /[.!?]/.test(pedaco) ? vel * 11 : (/[,;:\n]/.test(pedaco) ? vel * 5 : vel);
    setTimeout(passo, pausa);
  }
  setTimeout(passo, 500);

  /* tocar na tela termina de escrever na hora */
  function adiantarTexto(){
    if (parado) return;
    parado = true;
    elemento.textContent = texto;
    if (aoTerminar) aoTerminar();
  }
  return adiantarTexto;
}

/* avisos curtinhos que aparecem embaixo */
var tempoAviso = null;
function avisar(texto, segundos){
  var a = $("aviso");
  a.textContent = texto;
  a.classList.add("aparece");
  clearTimeout(tempoAviso);
  tempoAviso = setTimeout(function(){ a.classList.remove("aparece"); }, (segundos || 3.5) * 1000);
}

/* =====================================================================
   A JANELA QUE ABRE POR CIMA (motivo da flor, memória, carta)
   ===================================================================== */
function abrirJanela(html, aoFechar){
  var j = $("janela");
  $("janela-conteudo").innerHTML = html;
  j.classList.add("ativa");
  $("botao-fechar").style.display = "grid";
  janelaAoFechar = aoFechar || null;
  return $("janela-conteudo");
}
var janelaAoFechar = null;
function fecharJanela(){
  var j = $("janela");
  if (!j.classList.contains("ativa")) return;
  j.classList.remove("ativa");
  $("botao-fechar").style.display = "none";
  $("janela-conteudo").innerHTML = "";
  var f = janelaAoFechar; janelaAoFechar = null;
  if (f) f();
}
$("botao-fechar").addEventListener("click", fecharJanela);
$("janela").addEventListener("click", function(e){ if (e.target === this) fecharJanela(); });

/* =====================================================================
   BOTÃO VOLTAR
   ===================================================================== */
function atualizarBotaoVoltar(id){
  var b = $("botao-voltar");
  var mostra = estado.jornadaCompleta && (id === "tela-jardim" || id === "tela-cartas" || id === "tela-ceu" || id === "tela-carta");
  b.classList.toggle("aparece", !!mostra);
}
$("botao-voltar").addEventListener("click", function(){ telaInicial(); });

/* =====================================================================
   MÚSICA
   ===================================================================== */
var musicaUrl = null, musicaTocando = false;
function prepararMusica(){
  MIDIA.audio("musica").then(function(url){
    if (!url) return;
    musicaUrl = url;
    $("audio-musica").src = url;
    $("audio-musica").volume = 0.42;
  });
}
function tocarMusica(){
  if (!musicaUrl || musicaTocando) return;
  var a = $("audio-musica");
  a.play().then(function(){
    musicaTocando = true;
    $("botao-musica").classList.add("aparece");
    $("botao-musica").innerHTML = MIDIA.notaMusical(true);
  }).catch(function(){ /* o celular pode pedir um toque antes, tudo bem */ });
}
$("botao-musica").addEventListener("click", function(){
  var a = $("audio-musica");
  if (a.paused){ a.play(); musicaTocando = true; }
  else { a.pause(); musicaTocando = false; }
  this.innerHTML = MIDIA.notaMusical(musicaTocando);
});

/* =====================================================================
   1. O COFRE
   ===================================================================== */
function telaCofre(){
  var caixa = $("cadeado");
  MIDIA.cenario("cenario-01-cadeado").then(function(url){
    caixa.innerHTML = url ? '<img src="' + url + '" alt="">' : MIDIA.cadeadoDesenhado();
  });
  $("dica-senha").textContent = exemplo(T.dicaSenha, "dica de exemplo, a senha no teste é qualquer data");
  $("erro-senha").textContent = "";
  mostrarTela("tela-cofre");

  /* já adianta o que a próxima tela vai usar */
  MIDIA.cenario("cenario-02-ceu-noite").then(MIDIA.adiantar);
}

function conferirSenha(){
  var digitado = $("campo-senha").value.replace(/[^0-9]/g, "");
  var certo = String(T.senha || "").replace(/[^0-9]/g, "");
  var acertou = (TESTE && digitado.length === 8) || (certo.length === 8 && digitado === certo);

  if (!acertou){
    var caixa = $("cadeado");
    caixa.classList.remove("errou");
    void caixa.offsetWidth;
    caixa.classList.add("errou");
    $("erro-senha").textContent = limpo(T.senhaErrada) || "tenta de novo, meu amor";
    $("erro-senha").classList.add("aparece");
    if (navigator.vibrate) navigator.vibrate(60);
    return;
  }

  $("erro-senha").classList.remove("aparece");
  $("campo-senha").blur();
  $("cadeado").classList.add("abrindo");
  estado.desbloqueado = true;
  salvar();

  setTimeout(function(){
    telaDeVersiculo("cantares8_6", 7, telaCeu);
  }, 2000);
}
$("botao-abrir").addEventListener("click", conferirSenha);
$("campo-senha").addEventListener("keydown", function(e){ if (e.key === "Enter") conferirSenha(); });
/* vai colocando as barras sozinho enquanto ela digita */
$("campo-senha").addEventListener("input", function(){
  var so = this.value.replace(/[^0-9]/g, "").slice(0, 8);
  var fmt = so;
  if (so.length > 4) fmt = so.slice(0,2) + "/" + so.slice(2,4) + "/" + so.slice(4);
  else if (so.length > 2) fmt = so.slice(0,2) + "/" + so.slice(2);
  this.value = fmt;
});

/* =====================================================================
   2. O CÉU DAS 12 MEMÓRIAS
   ===================================================================== */
var posicoesEstrelas = [
  [20, 31], [50, 26], [80, 33], [32, 40], [68, 42], [14, 50],
  [86, 52], [42, 58], [60, 63], [24, 70], [76, 72], [50, 79]
];

function telaCeu(modoRevisita){
  MIDIA.cenario("cenario-02-ceu-noite").then(function(url){
    $("fundo-ceu").style.backgroundImage = url ? 'url("' + url + '")' : "none";
  });

  var v = versiculo("salmos147_3");
  $("versiculo-ceu").innerHTML = escapar(v.texto) + '<span class="ref">' + escapar(v.ref) + '</span>';
  $("legenda-ceu").textContent = exemplo(T.legendaMemorias, "legenda de exemplo das doze pedras");

  desenharEstrelinhas();
  desenharEstrelasMemoria(modoRevisita);
  mostrarTela("tela-ceu");
  tocarMusica();

  /* adianta as fotos das memórias */
  for (var i = 1; i <= 3; i++) MIDIA.memoria(i).then(MIDIA.adiantar);
}

/* estrelinhas pequenas do fundo, feitas por código */
function desenharEstrelinhas(){
  var caixa = $("estrelinhas");
  if (caixa.childElementCount) return;
  var html = "";
  for (var i = 0; i < 90; i++){
    var x = Math.random() * 100, y = Math.random() * 100;
    var t = (Math.random() * 1.6 + 1).toFixed(1);
    var atraso = (Math.random() * 4).toFixed(1);
    var dur = (Math.random() * 3 + 2.5).toFixed(1);
    html += '<span class="estrelinha" style="left:' + x.toFixed(1) + '%;top:' + y.toFixed(1) +
            '%;width:' + t + 'px;height:' + t + 'px;animation-delay:' + atraso + 's;animation-duration:' + dur + 's"></span>';
  }
  caixa.innerHTML = html;
}

function desenharEstrelasMemoria(modoRevisita){
  var campo = $("campo-estrelas");
  campo.innerHTML = "";
  $("linhas-coracao").classList.remove("desenhando");
  $("caminho-coracao").setAttribute("d", "");

  T.memorias.forEach(function(mem, indice){
    var n = indice + 1;
    var pos = posicoesEstrelas[indice] || [50, 50];
    var b = document.createElement("button");
    b.className = "estrela-memoria" + (estado.memoriasAbertas.indexOf(n) !== -1 ? " aberta" : "");
    b.style.left = pos[0] + "%";
    b.style.top = pos[1] + "%";
    b.innerHTML = MIDIA.estrelaDesenhada();
    b.setAttribute("aria-label", "memória " + n);
    b.addEventListener("click", function(){ abrirMemoria(n, modoRevisita); });
    campo.appendChild(b);
  });

  /* se ela já abriu todas, o coração já fica desenhado */
  if (estado.memoriasAbertas.length >= T.memorias.length) setTimeout(function(){ formarCoracao(true); }, 400);
}

function abrirMemoria(n, modoRevisita){
  var mem = T.memorias[n - 1] || {};
  var mes = exemplo(mem.mes, "mês de exemplo " + n);
  var frase = exemplo(mem.frase, "frase de exemplo da memória " + n);

  var alvo = abrirJanela(
    '<div class="moldura-memoria">' +
      '<img id="foto-memoria" alt="">' +
      '<div class="legenda">' +
        '<div class="mes">' + escapar(mes) + '</div>' +
        '<div class="frase">' + escapar(frase) + '</div>' +
      '</div>' +
    '</div>'
  );
  MIDIA.memoria(n).then(function(url){
    var img = alvo.querySelector("#foto-memoria");
    if (!img) return;
    if (url) img.src = url;
    else img.replaceWith(Object.assign(document.createElement("div"), {
      className: "sem-foto",
      style: "aspect-ratio:1/1;display:grid;place-items:center;background:#EDE2D2;color:#6A5A4B;font-family:var(--serifa);font-size:20px",
      textContent: mes
    }));
  });
  MIDIA.memoria(n + 1).then(MIDIA.adiantar);

  if (estado.memoriasAbertas.indexOf(n) === -1){
    estado.memoriasAbertas.push(n);
    salvar();
    var botao = $("campo-estrelas").children[n - 1];
    if (botao) botao.classList.add("aberta");

    if (!modoRevisita && estado.memoriasAbertas.length >= T.memorias.length){
      janelaAoFechar = function(){ setTimeout(function(){ formarCoracao(false); }, 700); };
    }
  }
}

/* as doze estrelas se ligam por linhas de luz formando um coração */
function formarCoracao(instantaneo){
  var campo = $("campo-estrelas");
  var largura = campo.clientWidth, altura = campo.clientHeight;
  if (!largura || !altura) return;

  /* desenho do coração em pontos */
  function pontoCoracao(t){
    var x = 16 * Math.pow(Math.sin(t), 3);
    var y = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
    var escala = Math.min(largura, altura * 0.62) * 0.026;
    return [ largura/2 + x * escala, altura * 0.54 - y * escala ];
  }

  /* mede o contorno do coração para espalhar as estrelas por igual */
  var amostras = [], acumulado = [0], anterior = pontoCoracao(-Math.PI/2);
  for (var s = 0; s <= 400; s++){
    var ts = -Math.PI/2 + (s / 400) * Math.PI * 2;
    var ps = pontoCoracao(ts);
    amostras.push(ps);
    if (s > 0){
      var dx = ps[0] - anterior[0], dy = ps[1] - anterior[1];
      acumulado.push(acumulado[acumulado.length - 1] + Math.sqrt(dx*dx + dy*dy));
    }
    anterior = ps;
  }
  var comprimento = acumulado[acumulado.length - 1];
  function pontoNaDistancia(alvo){
    for (var j = 1; j < acumulado.length; j++){
      if (acumulado[j] >= alvo) return amostras[j];
    }
    return amostras[amostras.length - 1];
  }

  /* leva cada estrela para o seu lugar no coração */
  var total = campo.children.length;
  for (var i = 0; i < total; i++){
    var p = pontoNaDistancia((i / total) * comprimento);
    var estrela = campo.children[i];
    estrela.style.transition = instantaneo ? "none" : "left 2.6s cubic-bezier(.4,0,.2,1), top 2.6s cubic-bezier(.4,0,.2,1)";
    estrela.style.left = (p[0] / largura * 100).toFixed(2) + "%";
    estrela.style.top = (p[1] / altura * 100).toFixed(2) + "%";
    estrela.classList.add("aberta");
  }

  /* a linha de luz que liga tudo */
  var d = "";
  for (var k = 0; k <= 160; k++){
    var tt = -Math.PI/2 + (k / 160) * Math.PI * 2;
    var pp = pontoCoracao(tt);
    d += (k === 0 ? "M" : "L") + (pp[0] / largura * 100).toFixed(2) + " " + (pp[1] / altura * 100).toFixed(2) + " ";
  }
  var caminho = $("caminho-coracao");
  caminho.setAttribute("d", d + "Z");
  caminho.setAttribute("vector-effect", "non-scaling-stroke");

  var svg = $("linhas-coracao");
  if (instantaneo){
    caminho.style.strokeDashoffset = "0";
  } else {
    setTimeout(function(){ svg.classList.add("desenhando"); }, 1800);
    setTimeout(function(){ telaDeVersiculo("salmos126_2", 8, telaCartaPrincipal); }, 7200);
  }
}

/* =====================================================================
   A CARTA PRINCIPAL
   ===================================================================== */
function telaCartaPrincipal(revisita){
  var texto = exemplo(T.cartaPrincipal, "carta de exemplo, só aparece no modo de teste.\n\nEla se escreve sozinha, letra por letra.");
  var bencao = versiculo("numeros6_24");

  MIDIA.cenario("cenario-07-papel-carta").then(function(url){
    $("papel-carta").style.backgroundImage = url ? 'url("' + url + '")' : "none";
  });

  $("texto-carta").textContent = "";
  $("bencao-carta").innerHTML = "";
  $("botao-seguir-carta").style.display = "none";
  mostrarTela("tela-carta");
  tocarMusica();

  function terminou(){
    $("bencao-carta").innerHTML = escapar(bencao.texto) +
      '<span class="ref" style="display:block;margin-top:10px;font-size:.62em;letter-spacing:.18em;text-transform:uppercase;opacity:.6">' +
      escapar(bencao.ref) + '</span>';
    $("bencao-carta").classList.add("surgindo");
    var b = $("botao-seguir-carta");
    b.textContent = revisita ? "voltar" : "seguir";
    b.style.display = "block";
    b.classList.add("surgindo");
  }

  var adiantar = escreverSozinho($("texto-carta"), texto, 30, terminou);
  $("papel-carta").onclick = adiantar;

  $("botao-seguir-carta").onclick = function(){
    $("papel-carta").onclick = null;
    if (revisita) telaInicial();
    else telaAmanhecer();
  };

  if (!revisita){
    MIDIA.video("video-02-amanhecer");
    MIDIA.cenario("cenario-03-ceu-amanhecer").then(MIDIA.adiantar);
    MIDIA.cenario("cenario-04-jardim").then(MIDIA.adiantar);
  }
}

/* =====================================================================
   3. O AMANHECER
   ===================================================================== */
function telaAmanhecer(){
  var tela = $("tela-amanhecer");
  var v = versiculo("cantares6_10");
  $("versiculo-amanhecer").innerHTML = "";
  mostrarTela("tela-amanhecer");

  MIDIA.video("video-02-amanhecer").then(function(url){
    var video = $("video-amanhecer");
    if (url){
      video.src = url;
      video.style.display = "block";
      video.play().catch(function(){});
    } else {
      /* sem vídeo, o céu clareia sozinho, por código */
      MIDIA.cenario("cenario-03-ceu-amanhecer").then(function(fundo){
        if (fundo){
          video.style.display = "none";
          tela.style.backgroundImage = 'url("' + fundo + '")';
          tela.style.backgroundSize = "cover";
          tela.style.backgroundPosition = "center";
        }
      });
      setTimeout(function(){ tela.classList.add("clareando"); }, 200);
    }
  });

  setTimeout(function(){
    $("versiculo-amanhecer").innerHTML = escapar(v.texto) + '<span class="ref">' + escapar(v.ref) + '</span>';
    $("versiculo-amanhecer").classList.add("surgindo");
  }, 3600);

  setTimeout(entradaDoJardim, 11000);
}

/* Gênesis 2:8 e 2:15 sobre o cenário do jardim */
function entradaDoJardim(){
  var g8 = versiculo("genesis2_8"), g15 = versiculo("genesis2_15");
  var tela = $("tela-amanhecer");
  MIDIA.cenario("cenario-04-jardim").then(function(url){
    if (url){
      tela.style.backgroundImage = 'url("' + url + '")';
      tela.style.backgroundSize = "cover";
      tela.style.backgroundPosition = "center";
      $("video-amanhecer").style.display = "none";
    }
  });
  var alvo = $("versiculo-amanhecer");
  alvo.classList.remove("surgindo");
  alvo.innerHTML = "";
  setTimeout(function(){
    alvo.innerHTML = escapar(g8.texto) + '<span class="ref">' + escapar(g8.ref) + '</span>' +
      '<span style="display:block;height:18px"></span>' +
      escapar(g15.texto) + '<span class="ref">' + escapar(g15.ref) + '</span>';
    alvo.classList.add("surgindo");
  }, 600);
  setTimeout(function(){ telaJardim(true); }, 10000);
}

/* =====================================================================
   4. O JARDIM
   ===================================================================== */
var canteiroVisivel = 0;

/* limites dos 12 canteiros, um por mês do presente */
function canteiros(){
  var lista = [];
  for (var k = 0; k < 12; k++){
    var inicio = somarMeses(DATA_PRESENTE, k);
    var fim = (k === 11) ? DATA_FINAL : somarDias(somarMeses(DATA_PRESENTE, k + 1), -1);
    lista.push({
      indice: k,
      nome: MESES[inicio.getMonth()],
      ano: inicio.getFullYear(),
      primeiraFlor: diferencaEmDias(inicio, DATA_PRESENTE) + 1,
      ultimaFlor: Math.min(TOTAL_FLORES, diferencaEmDias(fim, DATA_PRESENTE) + 1)
    });
  }
  return lista;
}
var CANTEIROS = canteiros();

/* as nove flores do fruto do Espírito, na ordem de Gálatas 5:22 */
var FRUTO = [3, 11, 7, 15, 16, 5, 19, 18, 13];

function telaJardim(primeiraVez){
  reconstruirSePreciso();
  MIDIA.cenario("cenario-04-jardim").then(function(url){
    $("fundo-jardim").style.backgroundImage = url ? 'url("' + url + '")' : "none";
  });
  var lam = versiculo("lamentacoes3_22");
  $("versiculo-jardim").innerHTML = escapar(lam.texto) +
    '<span class="ref">' + escapar(lam.ref) + '</span>';

  montarBuque();
  montarCanteiros();
  mostrarTela("tela-jardim");
  tocarMusica();

  if (primeiraVez && !plantada(1)){
    /* primeira visita: o convite para tocar na terra */
    setTimeout(conviteDeTerra, 1200);
  } else {
    avisarFloresEsperando();
  }
}

function avisarFloresEsperando(){
  var esperando = floresEsperando();
  if (esperando.length === 1) avisar("uma flor " + IF.esperandoPlantar, 4);
  else if (esperando.length > 1) avisar(esperando.length + " flores " + IF.esperandoPlantarVarias, 4);
  else if (diaDoJardim() > ultimaFlorPronta()) avisar(IF.floresACaminho, 4);
}

/* o canteiro começa vazio e ela toca na terra */
function conviteDeTerra(){
  var alvo = abrirJanela(
    '<div class="ficha-flor">' +
      '<p class="sussurro" style="max-width:32ch;font-size:16px;line-height:1.7">' + escapar(IF.fraseCanteiroVazio) + '</p>' +
      '<button class="botao" id="tocar-terra" style="margin-top:26px">' + escapar(IF.convitePlantar) + '</button>' +
    '</div>'
  );
  $("botao-fechar").style.display = "none";
  alvo.querySelector("#tocar-terra").addEventListener("click", function(){
    nascerBroto(function(){ plantar(1, true); });
  });
}

/* o broto com 1 Coríntios 3:6 */
function nascerBroto(depois){
  var c = versiculo("corintios3_6");
  var alvo = abrirJanela(
    '<div class="ficha-flor">' +
      '<div class="palco" id="palco-broto"></div>' +
      '<p class="versiculo discreto">' + escapar(c.texto) + '<span class="ref">' + escapar(c.ref) + '</span></p>' +
    '</div>'
  );
  $("botao-fechar").style.display = "none";
  MIDIA.cenario("cenario-08-broto").then(function(url){
    var palco = alvo.querySelector("#palco-broto");
    if (!palco) return;
    palco.innerHTML = url ? '<img src="' + url + '" alt="">' : MIDIA.brotoDesenhado();
  });
  setTimeout(depois, 5200);
}

/* ---------------------------------------------------------------------
   O BUQUÊ DO PRESENTE, em destaque na entrada do jardim
   --------------------------------------------------------------------- */
function nomesDoBuque(){
  var lista = (T.buque && T.buque.flores) || [];
  return lista.map(limpo).filter(function(nome){
    return nome.length > 0 && !/^NOME DA FLOR/i.test(nome);
  }).slice(0, 5);
}
function montarBuque(){
  var area = $("area-buque");
  if (!plantada(1)){ area.innerHTML = ""; return; }

  var nomes = nomesDoBuque();
  var titulo = (nomes.length === 1) ? IF.tituloBuqueUma : IF.tituloBuqueVarias;

  area.innerHTML =
    '<div class="buque-destaque" id="buque-destaque">' +
      '<div class="titulo">' + escapar(titulo) + '</div>' +
      (nomes.length ? '<div class="nomes">' + escapar(nomes.join(", ")) + '</div>' : "") +
      '<div class="miniatura" id="miniatura-buque"></div>' +
    '</div>';

  var f = dadosDaFlor(1);
  MIDIA.flor(f.img).then(function(url){
    var m = $("miniatura-buque");
    if (!m) return;
    m.innerHTML = url ? '<img src="' + url + '" alt="">' : MIDIA.florDesenhada(1, false);
  });
  $("buque-destaque").addEventListener("click", function(){ fichaDaFlor(1, false); });
}

/* ---------------------------------------------------------------------
   OS CANTEIROS
   --------------------------------------------------------------------- */
function montarCanteiros(){
  var caixa = $("rolagem-canteiros");
  caixa.innerHTML = "";
  var dia = diaDoJardim();

  CANTEIROS.forEach(function(c){
    /* só mostra os canteiros que já começaram */
    if (c.primeiraFlor > dia) return;

    var div = document.createElement("div");
    div.className = "canteiro";
    div.dataset.indice = c.indice;

    var doCanteiro = [];
    for (var n = c.primeiraFlor; n <= c.ultimaFlor && n <= dia; n++){
      if (florPronta(n)) doCanteiro.push(n);
    }
    var plantadasAqui = doCanteiro.filter(plantada).length;
    var mesTerminou = dia > c.ultimaFlor;
    var completo = mesTerminou && doCanteiro.length > 0 && plantadasAqui === doCanteiro.length;

    div.innerHTML =
      '<div class="nome-canteiro">' + escapar(c.nome) + '</div>' +
      '<div class="contador">' + plantadasAqui + " de " + doCanteiro.length + '</div>' +
      (completo ? '<div class="plaquinha">' + escapar(c.nome + " " + c.ano) + '</div>' : "") +
      '<div class="grade-flores"></div>';

    var grade = div.querySelector(".grade-flores");
    doCanteiro.forEach(function(n){ grade.appendChild(vasoDaFlor(n)); });

    /* aviso de que faltam flores para eu acrescentar */
    if (dia >= c.primeiraFlor && dia <= c.ultimaFlor && dia > ultimaFlorPronta()){
      var p = document.createElement("p");
      p.className = "sussurro";
      p.style.marginTop = "10px";
      p.textContent = IF.floresACaminho;
      div.appendChild(p);
    }
    caixa.appendChild(div);
  });

  /* o canteiro especial do fruto do Espírito */
  var doFruto = FRUTO.filter(function(n){ return florPronta(n) && n <= dia; });
  if (doFruto.length){
    var especial = document.createElement("div");
    especial.className = "canteiro";
    especial.innerHTML =
      '<div class="nome-canteiro">' + escapar(IF.tituloFruto) + '</div>' +
      '<div class="contador">' + doFruto.filter(plantada).length + " de 9" + '</div>' +
      '<div class="canteiro-fruto"><div class="arco-folhas">' + MIDIA.arcoFolhas() + '</div>' +
      '<div class="grade-flores"></div></div>';
    var gradeF = especial.querySelector(".grade-flores");
    doFruto.forEach(function(n){ gradeF.appendChild(vasoDaFlor(n, true)); });

    if (FRUTO.every(plantada)){
      var g = versiculo("galatas5_22");
      var fim = document.createElement("div");
      fim.style.marginTop = "14px";
      fim.innerHTML = '<p class="versiculo discreto" style="color:var(--tinta-suave)">' + escapar(g.texto) +
        '<span class="ref">' + escapar(g.ref) + '</span></p>' +
        '<p class="sussurro" style="margin-top:10px;color:var(--verde-escuro)">' + escapar(IF.fraseFruto) + '</p>';
      especial.appendChild(fim);
    }
    caixa.appendChild(especial);
  }

  /* abre no canteiro do mês de hoje */
  var atual = CANTEIROS.filter(function(c){ return c.primeiraFlor <= dia; }).length - 1;
  requestAnimationFrame(function(){
    caixa.scrollLeft = caixa.clientWidth * Math.max(0, atual);
  });
}

/* cada quadradinho do canteiro */
function vasoDaFlor(n, doFruto){
  var f = dadosDaFlor(n);
  var b = document.createElement("button");
  b.className = "vaso " + (plantada(n) ? "plantada" : "esperando");
  b.dataset.flor = n;
  b.setAttribute("aria-label", f.nome || ("flor " + n));

  if (plantada(n)){
    b.innerHTML = '<div class="balanco" style="width:100%;height:100%"></div>' +
                  '<span class="rotulo">' + escapar(doFruto ? f.virtude || f.nome : f.nome) + '</span>';
    var dentro = b.querySelector(".balanco");
    MIDIA.flor(f.img).then(function(url){
      dentro.innerHTML = url ? '<img src="' + url + '" alt="" loading="lazy">' : MIDIA.florDesenhada(n, false);
    });
    b.addEventListener("click", function(){ fichaDaFlor(n, false); });
  } else {
    /* ainda não plantada: aparece o botãozinho, esperando o toque dela */
    b.innerHTML = '<div class="balanco" style="width:100%;height:100%"></div>';
    var alvo = b.querySelector(".balanco");
    MIDIA.botao(f.img).then(function(url){
      if (url){ alvo.innerHTML = '<img src="' + url + '" alt="" loading="lazy">'; }
      else { alvo.innerHTML = MIDIA.brotoDesenhado(); }
    });
    b.addEventListener("click", function(){ plantar(n, false); });
  }
  return b;
}

/* ---------------------------------------------------------------------
   PLANTAR UMA FLOR
   --------------------------------------------------------------------- */
function plantar(n, ehAPrimeira){
  var f = dadosDaFlor(n);
  if (!plantada(n)){
    estado.floresPlantadas.push(n);
    salvar();
  }

  var alvo = abrirJanela('<div class="ficha-flor"><div class="palco" id="palco-nascimento"></div></div>');
  $("botao-fechar").style.display = "none";
  var palco = alvo.querySelector("#palco-nascimento");

  MIDIA.video(f.video).then(function(url){
    if (url){
      palco.innerHTML = '<video src="' + url + '" playsinline muted autoplay></video>';
      var v = palco.querySelector("video");
      v.onended = function(){ depoisDoNascimento(n, ehAPrimeira); };
      setTimeout(function(){ depoisDoNascimento(n, ehAPrimeira); }, 12000);
    } else {
      /* sem vídeo, a flor nasce por código: caule, pétalas e brisa */
      palco.innerHTML = MIDIA.florDesenhada(n, true);
      setTimeout(function(){
        MIDIA.flor(f.img).then(function(imgUrl){
          if (imgUrl && palco) palco.innerHTML = '<img src="' + imgUrl + '" alt="" class="surgindo">';
          depoisDoNascimento(n, ehAPrimeira);
        });
      }, 3400);
    }
  });

  /* o versículo do nascimento, quando a flor tem um */
  if (f.versiculo){
    var v = versiculo(f.versiculo);
    var p = document.createElement("p");
    p.className = "versiculo discreto surgindo";
    p.style.marginTop = "16px";
    p.innerHTML = escapar(v.texto) + '<span class="ref">' + escapar(v.ref) + '</span>';
    alvo.querySelector(".ficha-flor").appendChild(p);
  }
}

var jaMostrouVideoNascimento = {};
function depoisDoNascimento(n, ehAPrimeira){
  if (jaMostrouVideoNascimento[n]) return;
  jaMostrouVideoNascimento[n] = true;
  setTimeout(function(){
    fichaDaFlor(n, true, ehAPrimeira);
  }, 600);
}

/* ---------------------------------------------------------------------
   A FICHA DA FLOR (nome, motivo, versículo)
   --------------------------------------------------------------------- */
function fichaDaFlor(n, acabouDeNascer, ehAPrimeira){
  var f = dadosDaFlor(n);
  var chaveVersiculo = (!acabouDeNascer && f.versiculoDepois) ? f.versiculoDepois : f.versiculo;
  var v = chaveVersiculo ? versiculo(chaveVersiculo) : null;

  var cartaoDoBuque = "";
  if (n === 1){
    var nomes = nomesDoBuque();
    var cartao = exemplo(T.buque && T.buque.cartao, "cartãozinho de exemplo do buquê");
    cartaoDoBuque =
      (nomes.length ? '<p class="sussurro" style="margin-top:10px">' + escapar(nomes.join(", ")) + '</p>' : "") +
      (cartao ? '<div class="cartaozinho">' + escapar(cartao) + '</div>' : "");
  }

  var html =
    '<div class="ficha-flor">' +
      '<div class="palco" id="palco-ficha"></div>' +
      '<div class="nome-flor">' + escapar(n === 1 ? (nomesDoBuque().length === 1 ? IF.tituloBuqueUma : IF.tituloBuqueVarias) : f.nome) + '</div>' +
      (f.virtude ? '<div class="virtude">' + escapar(f.virtude) + '</div>' : "") +
      cartaoDoBuque +
      (f.motivo ? '<p class="motivo">' + escapar(f.motivo) + '</p>' : "") +
      (f.nota ? '<p class="nota">' + escapar(f.nota) + '</p>' : "") +
      (v ? '<p class="versiculo discreto">' + escapar(v.texto) + '<span class="ref">' + escapar(v.ref) + '</span></p>' : "") +
      (ehAPrimeira ? '<button class="botao" id="entrar-no-jardim" style="margin-top:24px">entrar no jardim</button>' : "") +
    '</div>';

  var alvo = abrirJanela(html, function(){
    montarBuque();
    montarCanteiros();
    if (ehOGrandeDia() && plantada(TOTAL_FLORES) && !estado.grandeDiaVisto) grandeDia();
  });
  $("botao-fechar").style.display = ehAPrimeira ? "none" : "grid";

  var palco = alvo.querySelector("#palco-ficha");
  MIDIA.flor(f.img).then(function(url){
    if (!palco) return;
    palco.innerHTML = url ? '<img src="' + url + '" alt="">' : MIDIA.florDesenhada(n, false);
  });

  if (ehAPrimeira){
    alvo.querySelector("#entrar-no-jardim").addEventListener("click", function(){
      estado.jornadaCompleta = true;
      estado.jardimIniciado = true;
      salvar();
      fecharJanela();
      telaJardim(false);
    });
  }
}

/* =====================================================================
   O GRANDE DIA, 20/09/2027
   ===================================================================== */
function grandeDia(){
  estado.grandeDiaVisto = true;
  salvar();

  var jardim = $("tela-jardim");
  jardim.classList.add("noite");          /* a noite cai devagar sobre o jardim */

  setTimeout(function(){
    telaCeu(true);
    setTimeout(function(){ formarCoracao(true); }, 900);
    setTimeout(function(){
      telaDeVersiculo("salmos65_11", 9, function(){
        abrirCartaLacrada();
      });
    }, 5000);
  }, 9000);
}

/* =====================================================================
   TELA INICIAL DAS VISITAS SEGUINTES
   ===================================================================== */
function telaInicial(){
  reconstruirSePreciso();
  fecharJanela();
  $("titulo-inicio").textContent = IF.tituloJardim;
  $("saudacao-inicio").textContent = IF.boasVindas;

  var esperando = floresEsperando().length;
  var novas = cartasNovas();

  var caminhos = [
    { id: "jardim", titulo: IF.caminhoJardim,
      detalhe: esperando ? (esperando + " " + (esperando === 1 ? IF.esperandoPlantar : IF.esperandoPlantarVarias)) :
               (estado.floresPlantadas.length + " flores plantadas"),
      selo: esperando > 0 ? String(esperando) : null },
    { id: "ceu", titulo: IF.caminhoCeu, detalhe: "as memórias e a carta" },
    { id: "cartas", titulo: IF.caminhoCartas, detalhe: textoDaContagemFinal(), selo: novas.length ? "nova" : null }
  ];

  $("caminhos").innerHTML = caminhos.map(function(c){
    return '<button class="caminho" data-ir="' + c.id + '">' + escapar(c.titulo) +
      '<span class="detalhe">' + escapar(c.detalhe) + '</span>' +
      (c.selo ? '<span class="selo-novo">' + escapar(c.selo) + '</span>' : "") +
    '</button>';
  }).join("");

  Array.prototype.forEach.call($("caminhos").children, function(b){
    b.addEventListener("click", function(){
      var ir = b.dataset.ir;
      if (ir === "jardim") telaJardim(false);
      else if (ir === "ceu") telaCeuRevisita();
      else telaCartas();
    });
  });

  if (novas.length) avisar(IF.cartaNova, 5);
  mostrarTela("tela-inicio");
  tocarMusica();
}

function textoDaContagemFinal(){
  if (ehOGrandeDia()) return IF.hojePalavra;
  var d = diasAteOFinal();
  return IF.faltamDias + " " + d + " " + IF.diasPalavra;
}

/* rever o céu: as memórias e a carta */
function telaCeuRevisita(){
  telaCeu(true);
  avisar("toque numa estrela, ou role para reler a carta", 4);
  setTimeout(function(){
    var b = document.createElement("button");
    b.className = "botao";
    b.textContent = "reler a carta";
    b.style.cssText = "position:absolute;left:50%;transform:translateX(-50%);bottom:calc(max(18px, env(safe-area-inset-bottom)) + 52px);z-index:3";
    b.addEventListener("click", function(){ telaCartaPrincipal(true); });
    var antigo = $("tela-ceu").querySelector(".botao");
    if (antigo) antigo.remove();
    $("tela-ceu").appendChild(b);
  }, 300);
}

/* =====================================================================
   A CAIXINHA DE CARTAS
   ===================================================================== */
function cartaEscrita(c){ return escrito(c.texto) || EXEMPLOS; }
function cartasNovas(){
  return T.cartas.filter(function(c){
    return cartaEscrita(c) && estado.cartasVistas.indexOf(c.id) === -1 && estado.cartasAbertas.indexOf(c.id) === -1;
  });
}

function telaCartas(){
  $("titulo-cartas").textContent = IF.tituloCartas;
  var lista = $("lista-envelopes");
  lista.innerHTML = "";

  T.cartas.forEach(function(c){
    lista.appendChild(envelope({
      id: c.id,
      titulo: c.titulo,
      aberta: cartaEscrita(c),
      classe: cartaEscrita(c) ? "" : "lacrada-prata",
      estado: cartaEscrita(c) ? "" : IF.cartaSendoEscrita,
      nova: cartasNovas().some(function(x){ return x.id === c.id; }),
      aoTocar: function(){ abrirCarta(c); }
    }));
  });

  /* o envelope lacrado do próximo aniversário, com o cadeado dourado */
  var especial = T.cartaProximoAniversario || {};
  var liberado = ehOGrandeDia() && (escrito(especial.texto) || EXEMPLOS);
  lista.appendChild(envelope({
    id: "proximo-aniversario",
    titulo: limpo(especial.titulo) || "Abra no nosso próximo aniversário",
    aberta: liberado,
    classe: "lacrada-ouro",
    estado: liberado ? "" : textoDaContagemFinal(),
    nova: false,
    aoTocar: function(){
      if (liberado) abrirCartaLacrada();
      else avisar(textoDaContagemFinal(), 3);
    }
  }));

  mostrarTela("tela-cartas");
  MIDIA.cenario("cenario-06-envelope-aberto").then(MIDIA.adiantar);
  MIDIA.cenario("cenario-07-papel-carta").then(MIDIA.adiantar);
}

function envelope(dados){
  var b = document.createElement("button");
  b.className = "envelope " + dados.classe + (dados.nova ? " nova" : "");
  b.innerHTML =
    '<div class="titulo-envelope">' + escapar(dados.titulo) + '</div>' +
    (dados.estado ? '<span class="estado">' + escapar(dados.estado) + '</span>' : "") +
    (!dados.aberta || dados.classe === "lacrada-ouro" ? '<span class="cadeadinho">' + MIDIA.cadeadinho() + '</span>' : "");

  MIDIA.cenario("cenario-05-envelope-fechado").then(function(url){
    if (url) b.style.backgroundImage = 'url("' + url + '")';
  });

  b.addEventListener("click", function(){
    if (!dados.aberta){
      void b.offsetWidth;
      b.style.animation = "tremer .5s ease";
      setTimeout(function(){ b.style.animation = ""; }, 600);
      avisar(dados.estado || IF.cartaSendoEscrita, 3);
      return;
    }
    b.classList.add("abrindo");
    setTimeout(function(){ b.classList.remove("abrindo"); dados.aoTocar(); }, 800);
  });
  return b;
}

function abrirCarta(c){
  if (estado.cartasAbertas.indexOf(c.id) === -1){ estado.cartasAbertas.push(c.id); }
  if (estado.cartasVistas.indexOf(c.id) === -1){ estado.cartasVistas.push(c.id); }
  salvar();

  var texto = exemplo(c.texto, "carta de exemplo do tema " + c.titulo + ", só aparece no modo de teste");
  var versiculosHtml = (c.versiculos || []).map(function(k){
    var v = versiculo(k);
    return '<p class="versiculo discreto" style="color:var(--tinta-suave);margin-top:16px">' +
      escapar(v.texto) + '<span class="ref">' + escapar(v.ref) + '</span></p>';
  }).join("");

  var alvo = abrirJanela(
    '<div class="papel" id="papel-desta-carta">' +
      '<h3 style="text-align:center;color:var(--verde-escuro);margin-bottom:18px">' + escapar(c.titulo) + '</h3>' +
      '<p class="texto-carta" id="corpo-carta"></p>' +
      versiculosHtml +
      (c.audio ? '<div style="text-align:center"><button class="botao-audio" id="botao-oracao">' +
        escapar(IF.botaoOracao) + '</button></div>' : "") +
    '</div>',
    telaCartas
  );

  MIDIA.cenario("cenario-07-papel-carta").then(function(url){
    var p = alvo.querySelector("#papel-desta-carta");
    if (p && url) p.style.backgroundImage = 'url("' + url + '")';
  });

  var adiantar = escreverSozinho(alvo.querySelector("#corpo-carta"), texto, 26);
  alvo.querySelector("#papel-desta-carta").addEventListener("click", function(e){
    if (e.target.id !== "botao-oracao") adiantar();
  });

  if (c.audio){
    var botao = alvo.querySelector("#botao-oracao");
    MIDIA.audio(c.audio).then(function(url){
      if (!url){ botao.style.display = "none"; return; }
      var a = $("audio-oracao");
      a.src = url;
      botao.addEventListener("click", function(){
        if (a.paused){ a.play(); botao.textContent = "pausar"; }
        else { a.pause(); botao.textContent = IF.botaoOracao; }
      });
    });
  }
}

/* a carta do próximo aniversário */
function abrirCartaLacrada(){
  var especial = T.cartaProximoAniversario || {};
  var texto = exemplo(especial.texto, "carta de exemplo do próximo aniversário, só aparece no modo de teste");
  if (estado.cartasAbertas.indexOf("proximo-aniversario") === -1){
    estado.cartasAbertas.push("proximo-aniversario");
    salvar();
  }

  var alvo = abrirJanela(
    '<div class="papel" id="papel-lacrada">' +
      '<h3 style="text-align:center;color:var(--verde-escuro);margin-bottom:18px">' +
        escapar(limpo(especial.titulo) || "Abra no nosso próximo aniversário") + '</h3>' +
      '<p class="texto-carta" id="corpo-lacrada"></p>' +
    '</div>',
    function(){ telaInicial(); }
  );
  MIDIA.cenario("cenario-07-papel-carta").then(function(url){
    var p = alvo.querySelector("#papel-lacrada");
    if (p && url) p.style.backgroundImage = 'url("' + url + '")';
  });
  var adiantar = escreverSozinho(alvo.querySelector("#corpo-lacrada"), texto, 30);
  alvo.querySelector("#papel-lacrada").addEventListener("click", adiantar);
}

/* =====================================================================
   CONFERÊNCIA DA PARTE 1 DO ARQUIVO DE TEXTOS
   ===================================================================== */
function conferirParte1(){
  var faltando = [];
  function temPlaceholder(txt){ return /ESCREVA|NOME DA FLOR|EXEMPLO/i.test(String(txt || "")); }

  if (!lerData(T.dataDoPresente)) faltando.push("data do presente");
  if (!lerData(T.senha)) faltando.push("senha (a data do primeiro eu te amo)");
  if (!escrito(T.dicaSenha) || temPlaceholder(T.dicaSenha)) faltando.push("dica da senha");
  T.memorias.forEach(function(m, i){
    if (!escrito(m.mes) || temPlaceholder(m.mes)) faltando.push("mês da memória " + (i+1));
    if (!escrito(m.frase) || temPlaceholder(m.frase)) faltando.push("frase da memória " + (i+1));
  });
  if (!escrito(T.cartaPrincipal) || temPlaceholder(T.cartaPrincipal)) faltando.push("carta principal");
  if (nomesDoBuque().length === 0) faltando.push("nomes das flores do buquê");
  if (!escrito(T.buque && T.buque.cartao) || temPlaceholder(T.buque && T.buque.cartao)) faltando.push("cartãozinho do buquê");
  var f1 = T.flores[1] || {};
  if (!escrito(f1.motivo) || temPlaceholder(f1.motivo)) faltando.push("motivo 1");
  return faltando;
}

/* =====================================================================
   PAINEL DE TESTE
   ===================================================================== */
function montarPainelDeTeste(){
  var p = $("painel-teste");
  p.classList.add("aparece");
  document.body.classList.add("com-painel");
  p.innerHTML =
    '<div class="linha sempre">' +
      '<button id="t-encolher">esconder o painel</button>' +
      '<span id="t-resumo" class="etiqueta"></span>' +
    '</div>' +
    '<div class="linha">' +
      '<span class="etiqueta">dia</span>' +
      '<input type="date" id="t-data">' +
      '<button id="t-menos">&minus;1 dia</button>' +
      '<button id="t-mais">+1 dia</button>' +
      '<button id="t-mes">+1 mês</button>' +
      '<button id="t-hoje">hoje de verdade</button>' +
      '<button id="t-final">20/09/2027</button>' +
    '</div>' +
    '<div class="linha">' +
      '<span class="etiqueta">telas</span>' +
      '<button data-tela="cofre">cofre</button>' +
      '<button data-tela="ceu">céu</button>' +
      '<button data-tela="carta">carta</button>' +
      '<button data-tela="amanhecer">amanhecer</button>' +
      '<button data-tela="jardim">jardim</button>' +
      '<button data-tela="inicio">início</button>' +
      '<button data-tela="cartas">cartas</button>' +
    '</div>' +
    '<div class="linha">' +
      '<span class="etiqueta">jardim</span>' +
      '<button id="t-plantar">plantar as que esperam</button>' +
      '<button id="t-tudo">plantar tudo até hoje</button>' +
      '<button id="t-zerar">zerar o progresso</button>' +
      '<button id="t-exemplos">textos de exemplo: ligados</button>' +
    '</div>';

  $("t-exemplos").onclick = function(){
    EXEMPLOS = !EXEMPLOS;
    this.textContent = "textos de exemplo: " + (EXEMPLOS ? "ligados" : "desligados");
    telaJardim(false);
  };

  $("t-encolher").onclick = function(){
    var encolhido = p.classList.toggle("encolhido");
    document.body.classList.toggle("painel-encolhido", encolhido);
    this.textContent = encolhido ? "mostrar o painel" : "esconder o painel";
  };

  function atualizarResumo(){
    var falta = conferirParte1();
    $("t-resumo").textContent =
      "dia " + diaDoJardim() + " de 366, " + estado.floresPlantadas.length + " plantadas, " +
      floresEsperando().length + " esperando" +
      (falta.length ? "  |  PARTE 1 faltando: " + falta.length + " campo(s)" : "  |  PARTE 1 completa");
    if (falta.length) console.warn("Campos da PARTE 1 ainda não preenchidos:", falta);
  }

  var dataInput = $("t-data");
  dataInput.value = hoje().toISOString().slice(0, 10);

  function aplicarData(dt){
    dataSimulada = dt;
    dataInput.value = dt.toISOString().slice(0, 10);
    atualizarResumo();
    telaJardim(false);
  }
  dataInput.addEventListener("change", function(){
    var partes = this.value.split("-");
    aplicarData(new Date(+partes[0], +partes[1] - 1, +partes[2], 12, 0, 0));
  });
  $("t-mais").onclick  = function(){ aplicarData(somarDias(hoje(), 1)); };
  $("t-menos").onclick = function(){ aplicarData(somarDias(hoje(), -1)); };
  $("t-mes").onclick   = function(){ aplicarData(somarMeses(hoje(), 1)); };
  $("t-hoje").onclick  = function(){ dataSimulada = null; aplicarData(new Date()); };
  $("t-final").onclick = function(){ aplicarData(new Date(2027, 8, 20, 12, 0, 0)); };

  Array.prototype.forEach.call(p.querySelectorAll("[data-tela]"), function(b){
    b.onclick = function(){
      fecharJanela();
      var t = b.dataset.tela;
      if (t === "cofre") telaCofre();
      else if (t === "ceu") telaCeu(true);
      else if (t === "carta") telaCartaPrincipal(true);
      else if (t === "amanhecer") telaAmanhecer();
      else if (t === "jardim") telaJardim(false);
      else if (t === "inicio") telaInicial();
      else if (t === "cartas") telaCartas();
    };
  });

  $("t-plantar").onclick = function(){
    floresEsperando().forEach(function(n){ if (!plantada(n)) estado.floresPlantadas.push(n); });
    salvar(); atualizarResumo(); telaJardim(false);
  };
  $("t-tudo").onclick = function(){
    floresProntasAte(diaDoJardim()).forEach(function(n){ if (!plantada(n)) estado.floresPlantadas.push(n); });
    estado.jornadaCompleta = true; estado.jardimIniciado = true; estado.desbloqueado = true;
    salvar(); atualizarResumo(); telaJardim(false);
  };
  $("t-zerar").onclick = function(){
    zerar(); jaMostrouVideoNascimento = {}; atualizarResumo(); telaCofre();
  };

  atualizarResumo();
  setInterval(atualizarResumo, 2000);
}

/* =====================================================================
   COMEÇO DE TUDO
   ===================================================================== */
function iniciar(){
  $("botao-musica").innerHTML = MIDIA.notaMusical(false);
  prepararMusica();

  if (TESTE) montarPainelDeTeste();

  /* marca como vistas as cartas que ela já conhece, para o aviso de carta
     nova só aparecer quando eu escrever uma de verdade */
  if (estado.jornadaCompleta){
    reconstruirSePreciso();
    telaInicial();
  } else if (estado.desbloqueado){
    telaCeu(false);
  } else {
    telaCofre();
  }

  /* qualquer toque libera o som no celular */
  document.addEventListener("click", function liberarSom(){
    if (musicaUrl && $("audio-musica").paused && estado.desbloqueado) tocarMusica();
    document.removeEventListener("click", liberarSom);
  });

  if (TESTE){
    var falta = conferirParte1();
    if (falta.length) console.warn("PARTE 1 ainda incompleta:", falta);
    else console.log("PARTE 1 completa, pode publicar.");
  }
}

/* quando ela vê as cartas, guardamos quais já existiam */
window.addEventListener("beforeunload", function(){
  T.cartas.forEach(function(c){
    if (cartaEscrita(c) && estado.cartasVistas.indexOf(c.id) === -1 && estado.cartasAbertas.indexOf(c.id) !== -1){
      estado.cartasVistas.push(c.id);
    }
  });
  salvar();
});

iniciar();

})();
