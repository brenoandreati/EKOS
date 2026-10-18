/* =====================================================================
   OIKOS · comportamento da página
   Preenche as seções com os dados de conteudo.js e cuida da navegação,
   do formulário, do contador e do painel de revisão.
   ===================================================================== */
(function () {
  "use strict";

  var O = window.Oikos;
  if (!O) return;
  var C = O.config, el = O.el, icone = O.icone, vazio = O.vazio, ler = O.ler, linkSeguro = O.linkSeguro;
  var $ = function (s, base) { return (base || document).querySelector(s); };
  var $$ = function (s, base) { return Array.prototype.slice.call((base || document).querySelectorAll(s)); };

  document.documentElement.classList.toggle("modo-revisao", O.revisao);

  /* ===================== Dados derivados ===================== */
  var FUSO = "America/Sao_Paulo";

  function lerData(s) {
    if (vazio(s)) return null;
    var d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
  }
  function partes(d) {
    var f = new Intl.DateTimeFormat("pt-BR", { timeZone: FUSO, day: "numeric", month: "long", year: "numeric", weekday: "long" });
    var o = {};
    f.formatToParts(d).forEach(function (p) { o[p.type] = p.value; });
    return o;
  }
  function intervaloDatas(a, b) {
    var pa = partes(a), pb = partes(b);
    if (pa.month === pb.month && pa.year === pb.year) return pa.day + " a " + pb.day + " de " + pa.month + " de " + pa.year;
    if (pa.year === pb.year) return pa.day + " de " + pa.month + " a " + pb.day + " de " + pb.month + " de " + pa.year;
    return pa.day + "/" + pa.month + "/" + pa.year + " a " + pb.day + "/" + pb.month + "/" + pb.year;
  }

  var datas = C.datas || {};
  var inicio = lerData(datas.inicio), fim = lerData(datas.fim);
  var dataOk = !!(datas.confirmada && inicio && fim && fim > inicio);
  var horarios = C.horarios || {};
  var local = C.local || {};
  var inscricao = C.inscricao || {};
  var contato = C.contato || {};
  var edicao = C.edicao || {};

  /* ===================== Aviso no topo ===================== */
  (function aviso() {
    var a = C.aviso || {};
    var box = $("[data-aviso]");
    if (!box || !a.ativo || vazio(a.texto)) return;
    $("[data-aviso-texto]", box).textContent = a.texto;
    var link = linkSeguro(a.link);
    if (link) {
      var l = $("[data-aviso-link]", box);
      l.href = link;
      l.textContent = vazio(a.rotuloLink) ? "Saiba mais" : a.rotuloLink;
      if (/^https?:/i.test(link)) { l.target = "_blank"; l.rel = "noopener noreferrer"; }
      l.hidden = false;
    }
    box.hidden = false;
  })();

  /* ===================== WhatsApp, Instagram e e-mail ===================== */
  var wa = String(contato.whatsapp || "").replace(/\D/g, "");
  var waOk = /^55\d{10,11}$/.test(wa);
  var usuarioIg = vazio(contato.instagram) ? "hebreusonze" : String(contato.instagram).replace(/^@/, "").trim();
  var linkIg = "https://www.instagram.com/" + encodeURIComponent(usuarioIg) + "/";
  var linkDirect = "https://ig.me/m/" + encodeURIComponent(usuarioIg);
  var email = vazio(contato.email) ? "" : String(contato.email).trim();

  function linkWhatsApp(mensagem) {
    return "https://wa.me/" + wa + "?text=" + encodeURIComponent(mensagem || contato.mensagemWhatsapp || "");
  }
  function telefoneLegivel(n) {
    var m = n.match(/^55(\d{2})(\d{4,5})(\d{4})$/);
    return m ? "(" + m[1] + ") " + m[2] + "-" + m[3] : n;
  }
  function abrirFora(a) { a.target = "_blank"; a.rel = "noopener noreferrer"; }

  if (!waOk) {
    O.pendente("WhatsApp oficial do OIKOS",
      "Escolha em conteudo.js (contato.whatsapp) qual número recebe as mensagens do retiro: (27) 98807-5117 ou (27) 99618-4874. Enquanto isso, os botões levam ao Direct do Instagram.",
      "#participar");
  }

  $$("[data-whatsapp]").forEach(function (a) {
    var msg = a.getAttribute("data-mensagem") === "proxima" ? contato.mensagemProximaEdicao : contato.mensagemWhatsapp;
    if (waOk) {
      a.href = linkWhatsApp(msg);
    } else {
      a.href = linkDirect;
      var alt = a.getAttribute("data-rotulo-alternativo");
      var rot = $("[data-whatsapp-rotulo]", a);
      if (alt && rot) rot.textContent = alt;
    }
    abrirFora(a);
  });
  if (waOk) {
    $$("[data-whatsapp-numero]").forEach(function (s) { s.textContent = telefoneLegivel(wa); });
    $$("[data-whatsapp-nota], [data-canal-whatsapp]").forEach(function (n) { n.hidden = false; });
  }

  $$("[data-instagram]").forEach(function (a) { a.href = linkIg; abrirFora(a); });
  $$("[data-instagram-usuario]").forEach(function (s) { s.textContent = "@" + usuarioIg; });
  $$("[data-email]").forEach(function (a) {
    if (!email) { a.closest("li") && (a.closest("li").hidden = true); return; }
    a.href = "mailto:" + email;
    a.textContent = email;
  });

  var copiar = $("[data-copiar-email]");
  if (copiar && email) {
    copiar.addEventListener("click", function () {
      var rotulo = $("[data-copiar-texto]", copiar);
      function feito(texto) {
        rotulo.textContent = texto;
        setTimeout(function () { rotulo.textContent = "Copiar"; }, 2200);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(function () { feito("Copiado"); }, function () { selecionar(); });
      } else {
        selecionar();
      }
      function selecionar() {
        var alvo = $(".canal--email [data-email]");
        var r = document.createRange();
        r.selectNodeContents(alvo);
        var s = window.getSelection();
        s.removeAllRanges();
        s.addRange(r);
        feito("Selecionado");
      }
    });
  }

  /* ===================== Chamada principal por fase ===================== */
  (function fase() {
    var nome = ["antes", "durante", "depois"].indexOf(C.fase) >= 0 ? C.fase : "antes";
    var f = ler("fases." + nome) || {};
    var frase = $("[data-fase-frase]"), sub = $("[data-fase-subtitulo]");
    var botao = $("[data-fase-botao]"), botaoTexto = $("[data-fase-botao-texto]");
    if (!vazio(f.frase)) O.textoComDestaque(frase, f.frase);
    if (!vazio(f.subtitulo)) sub.textContent = f.subtitulo;
    if (!vazio(f.botao)) botaoTexto.textContent = f.botao;
    var acao = f.acao || "whatsapp";
    if (acao === "instagram") {
      botao.href = linkIg; abrirFora(botao);
    } else if (acao === "whatsapp" || acao === "whatsapp-proxima") {
      var msg = acao === "whatsapp-proxima" ? contato.mensagemProximaEdicao : contato.mensagemWhatsapp;
      botao.href = waOk ? linkWhatsApp(msg) : "#participar";
      if (waOk) abrirFora(botao);
    } else if (/^#[\w-]+$/.test(acao)) {
      botao.href = acao;
    }
  })();

  /* ===================== Datas, horários e informações ===================== */
  var marcadorData = null;
  if (!dataOk) {
    var detalheData = "Datas desta edição ainda não confirmadas" +
      (vazio(datas.informadaPelaEquipe) ? "." : " (informado: " + datas.informadaPelaEquipe + ").") +
      (vazio(datas.observacao) ? "" : " " + datas.observacao);
    var tituloData = "Datas a confirmar" + (vazio(datas.informadaPelaEquipe) ? "" : " (informado: " + datas.informadaPelaEquipe + ")");
    marcadorData = function () { return O.pendente(tituloData, detalheData, "#informacoes"); };
  }

  function preencher(campo, texto, pend) {
    $$('[data-campo="' + campo + '"]').forEach(function (n) {
      n.textContent = texto;
      var m = pend && pend();
      if (m) { n.append(" "); n.append(m); }
    });
  }

  preencher("quando", dataOk ? intervaloDatas(inicio, fim) : "A divulgar", marcadorData);

  var horarioPend = horarios.confirmado ? null : function () {
    return O.pendente("Horário a confirmar", "Horários do documento oficial (sexta, 19h30, a domingo, 18h). Confirmar para esta edição.", "#informacoes");
  };
  preencher("inicio", vazio(horarios.inicio) ? "A divulgar" : horarios.inicio, horarioPend);
  preencher("termino", vazio(horarios.termino) ? "A divulgar" : horarios.termino, null);

  (function pessoas() {
    var p = ler("numeros.pessoasEnvolvidas") || {};
    var bloco = $("[data-fato-pessoas]");
    if (!bloco) return;
    if (vazio(p.valor)) { bloco.hidden = true; return; }
    preencher("pessoas", String(p.valor), p.confirmado ? null : function () {
      return O.pendente("Número de pessoas envolvidas", "O documento oficial fala em 220 pessoas (encontristas e servos). Confirmar para esta edição.", "#oikos");
    });
  })();

  $$("[data-ano-edicao]").forEach(function (s) { s.textContent = vazio(edicao.ano) ? "" : String(edicao.ano); });
  $$("[data-numero-edicao]").forEach(function (s) {
    if (vazio(edicao.numero)) { s.hidden = true; return; }
    s.textContent = edicao.numero + " Edição";
  });

  /* Campos do ingresso de informações */
  (function infoCampos() {
    var dl = $("[data-info-campos]");
    if (!dl) return;
    dl.textContent = "";

    function campo(rotulo, valor, opcoes) {
      var o = opcoes || {};
      var dd = el("dd", null);
      if (valor) dd.append(valor);
      if (o.nota) dd.append(el("span", { class: "info-nota", texto: o.nota }));
      if (o.link) dd.append(o.link);
      if (o.pend) { var m = o.pend(); if (m) dd.append(el("span", { class: "info-nota" }, m)); }
      dl.append(el("div", { class: "info-campo" + (o.largo ? " info-campo--largo" : "") }, el("dt", { texto: rotulo }), dd));
    }

    campo("Datas", dataOk ? intervaloDatas(inicio, fim) : "A divulgar", { pend: marcadorData, largo: true });
    campo("Início", vazio(horarios.inicio) ? "A divulgar" : horarios.inicio, {
      nota: horarios.confirmado ? "" : "Horário habitual do retiro",
      pend: horarioPend,
    });
    campo("Encerramento", vazio(horarios.termino) ? "A divulgar" : horarios.termino, {
      nota: horarios.confirmado ? "" : "Horário habitual do retiro",
    });

    if (local.confirmado && !vazio(local.nome)) {
      var mapa = linkSeguro(local.mapa);
      var a = mapa ? el("a", { class: "info-link", href: mapa, target: "_blank", rel: "noopener noreferrer" }, icone("i-pin"), "Ver no mapa") : null;
      var nota = [local.endereco, local.cidade].filter(function (x) { return !vazio(x); }).join(" · ");
      campo("Local", local.nome, { nota: nota, link: a, largo: true });
    } else {
      campo("Local", "A divulgar", { largo: true, pend: function () { return O.pendente("Local do retiro", "Informar nome, endereço e link do mapa do local (conteudo.js → local).", "#informacoes"); } });
    }

    if (!vazio(inscricao.publico)) {
      campo("Público", inscricao.publico, { nota: vazio(inscricao.criterios) ? "" : inscricao.criterios });
    }
    if (vazio(inscricao.criterios)) {
      O.pendente("Critérios de participação", "Informar idade mínima, autorização dos responsáveis e outros critérios, se houver (inscricao.criterios).", "#informacoes");
    }

    var link = linkSeguro(inscricao.link);
    var linkInsc = link && inscricao.status === "abertas"
      ? el("a", { class: "info-link", href: link, target: "_blank", rel: "noopener noreferrer" }, "Fazer inscrição", icone("i-seta"))
      : null;
    var textoInsc = {
      "abertas": "Inscrições abertas",
      "em-breve": "Inscrições em breve",
      "encerradas": "Inscrições encerradas",
    }[inscricao.status] || "Informações com a equipe";
    campo("Inscrição", textoInsc, {
      nota: vazio(inscricao.texto) ? (inscricao.status ? "" : "Fale com a equipe pelo WhatsApp para saber como participar.") : inscricao.texto,
      link: linkInsc,
      pend: vazio(inscricao.status) ? function () { return O.pendente("Informações de inscrição", "Definir como, quando e onde serão as inscrições (inscricao.status, texto e link).", "#informacoes"); } : null,
    });

    if (!vazio(inscricao.valor)) {
      campo("Valor", inscricao.valor);
    } else if (O.revisao) {
      campo("Valor", "", { pend: function () { return O.pendente("Valor da inscrição", "Informar o valor e o que está incluído, se houver (inscricao.valor).", "#informacoes"); } });
    }
  })();

  (function antesDeInscrever() {
    var lista = (inscricao.antesDeInscrever || []).filter(function (x) { return !vazio(x); });
    var bloco = $("[data-antes]");
    if (!bloco) return;
    var ul = $("[data-antes-lista]", bloco);
    if (lista.length) {
      lista.forEach(function (t) { ul.append(el("li", null, icone("i-brilho"), el("span", { texto: t }))); });
      bloco.hidden = false;
    } else {
      var m = O.pendente("O que saber antes de se inscrever", "Listar orientações para quem vai se inscrever (inscricao.antesDeInscrever).", "#informacoes", "pend--bloco");
      if (m) { ul.append(el("li", null, m)); bloco.hidden = false; }
    }
  })();

  /* Contador regressivo: só com data confirmada */
  (function contador() {
    var box = $("[data-contador]");
    if (!box || !dataOk || C.fase !== "antes") return;
    var d = $("[data-contador-dias]", box), h = $("[data-contador-horas]", box), m = $("[data-contador-min]", box);
    function tick() {
      var resta = inicio.getTime() - Date.now();
      if (resta <= 0) { box.hidden = true; return false; }
      d.textContent = Math.floor(resta / 864e5);
      h.textContent = Math.floor(resta / 36e5) % 24;
      m.textContent = Math.floor(resta / 6e4) % 60;
      return true;
    }
    if (tick()) { box.hidden = false; setInterval(tick, 30000); }
  })();

  /* Dados estruturados do evento (só com data e local confirmados) */
  if (dataOk && local.confirmado && !vazio(local.nome)) {
    var ld = {
      "@context": "https://schema.org",
      "@type": "Event",
      name: "OIKOS" + (vazio(edicao.ano) ? "" : " " + edicao.ano) + " · Retiro anual do Hebreus Onze",
      startDate: datas.inicio,
      endDate: datas.fim,
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      location: { "@type": "Place", name: local.nome, address: [local.endereco, local.cidade].filter(Boolean).join(", ") },
      organizer: { "@type": "Organization", name: "Grupo Jovem Hebreus Onze", url: linkIg },
      description: "Retiro anual do Grupo Jovem Hebreus Onze, da Paróquia Nossa Senhora Aparecida, em Cobilândia, Vila Velha/ES.",
    };
    document.head.append(el("script", { type: "application/ld+json", texto: JSON.stringify(ld) }));
  }

  /* ===================== Mídias das seções ===================== */
  function midia(m, rotuloPendente, chave) {
    var src = m && linkSeguro(m.src);
    if (!src) {
      O.pendente(rotuloPendente, "Adicione o arquivo em assets/ e o caminho em conteudo.js (midias." + chave + ").", "");
      return null;
    }
    if (m.tipo === "video") {
      var v = el("video", { src: src, poster: linkSeguro(m.poster) || null, preload: "none", playsinline: true, "aria-label": m.alt || rotuloPendente });
      return v;
    }
    if (vazio(m.alt)) O.pendente("Descrição da imagem: " + rotuloPendente, "Preencha o campo \"alt\" em midias." + chave + ".", "");
    return el("img", { src: src, alt: m.alt || "", loading: "lazy", decoding: "async" });
  }

  $$("[data-midia]").forEach(function (moldura) {
    var chave = moldura.getAttribute("data-midia");
    var rotulo = moldura.getAttribute("data-midia-rotulo") || chave;
    var m = ler("midias." + chave) || {};
    var no = midia(m, rotulo, chave);
    var secao = moldura.closest("section");
    var ancora = secao && secao.id ? "#" + secao.id : "";
    if (O.pendencias.length) {
      var ultima = O.pendencias[O.pendencias.length - 1];
      if (ultima.titulo === rotulo && !ultima.ancora) ultima.ancora = ancora;
    }
    if (!no) {
      if (O.revisao) moldura.append(el("span", { class: "pend pend--midia" }, " " + rotulo));
      return;
    }
    moldura.append(no);
    moldura.classList.add("tem-midia");
    if (no.tagName === "VIDEO") {
      var play = el("button", { type: "button", class: "moldura__play" }, el("span", null, icone("i-play")), el("span", { class: "sr-only", texto: "Reproduzir vídeo" }));
      play.addEventListener("click", function () {
        no.controls = true;
        play.remove();
        var p = no.play();
        if (p && p.catch) p.catch(function () {});
      });
      moldura.append(play);
    }
    var leg = $('[data-midia-legenda="' + chave + '"]');
    if (leg && !vazio(m.legenda)) { leg.textContent = m.legenda; leg.hidden = false; }
  });

  /* Vídeo ou foto de abertura */
  (function heroMidia() {
    var h = C.hero || {};
    var box = $("[data-hero-midia]");
    var hero = $(".hero");
    var pausa = $("[data-hero-pausa]");
    var v = h.video || {};
    var mp4 = linkSeguro(v.mp4), webm = linkSeguro(v.webm), poster = linkSeguro(v.poster);
    var img = h.imagem || {};
    var imgSrc = linkSeguro(img.src);
    if (mp4 || webm) {
      var video = el("video", { muted: true, loop: true, playsinline: true, preload: "metadata", poster: poster || null, "aria-hidden": "true" });
      video.muted = true;
      if (webm) video.append(el("source", { src: webm, type: "video/webm" }));
      if (mp4) video.append(el("source", { src: mp4, type: "video/mp4" }));
      box.append(video);
      hero.classList.add("hero--com-midia");
      var reduz = O.reduzMovimento.matches;
      function estadoPausa(pausado) {
        pausa.setAttribute("aria-pressed", pausado ? "true" : "false");
        pausa.querySelector("use").setAttribute("href", pausado ? "#i-play" : "#i-pausa");
        $("[data-hero-pausa-texto]").textContent = pausado ? "Reproduzir vídeo de fundo" : "Pausar vídeo de fundo";
      }
      if (!reduz) {
        var p = video.play();
        if (p && p.catch) p.catch(function () { estadoPausa(true); });
      }
      estadoPausa(reduz);
      pausa.hidden = false;
      pausa.addEventListener("click", function () {
        if (video.paused) { video.play(); estadoPausa(false); } else { video.pause(); estadoPausa(true); }
      });
    } else if (imgSrc) {
      box.append(el("img", { src: imgSrc, alt: img.alt || "", fetchpriority: "high" }));
      hero.classList.add("hero--com-midia");
    } else {
      O.pendente("Vídeo de abertura (opcional)", "Vídeo real do grupo para o topo do site (hero.video). Sem vídeo, o topo usa a ilustração da casa da identidade do OIKOS.", "#inicio");
    }
  })();

  /* ===================== Galeria ===================== */
  var secaoGaleria = $("#galeria");
  if (secaoGaleria && O.galeria) O.galeria.montar(secaoGaleria);

  /* ===================== Caminhada ===================== */
  (function caminhada() {
    var lista = $("[data-caminhada]");
    var marcos = Array.isArray(C.caminhada) ? C.caminhada : [];
    if (!lista || !marcos.length) return;
    lista.textContent = "";
    marcos.forEach(function (m) {
      if (!m || vazio(m.titulo)) return;
      var confirmado = m.confirmado === true;
      if (!confirmado) {
        O.pendente("Caminhada: " + m.titulo, m.texto || "Informar data e descrição.", "#caminhada");
        if (!O.revisao) return;
      }
      var corpo = el("div", { class: "marco__corpo" },
        el("h3", { class: "marco__titulo", texto: m.titulo }),
        vazio(m.texto) ? null : el("p", { texto: m.texto })
      );
      var foto = m.foto && linkSeguro(m.foto.src);
      if (foto) {
        corpo.append(el("div", { class: "moldura moldura--paisagem tem-midia" }, el("img", { src: foto, alt: m.foto.alt || "", loading: "lazy", decoding: "async" })));
      }
      var dataTxt = vazio(m.data) ? "" : m.data;
      var li = el("li", { class: "marco revela" + (confirmado ? "" : " marco--pendente") },
        el("p", { class: "marco__data" }, dataTxt || (O.revisao ? el("span", { class: "pend" }, " data") : "")),
        corpo
      );
      lista.append(li);
    });
  })();

  /* ===================== Formulário ===================== */
  (function formulario() {
    var bloco = $("[data-form-bloco]");
    var form = $("[data-form]");
    if (!bloco || !form) return;
    var cfg = C.formulario || {};
    var endpoint = linkSeguro(cfg.endpoint);
    endpoint = /^https:\/\//i.test(endpoint) ? endpoint : "";
    var status = $("[data-form-status]", form);
    var enviar = $("[data-form-enviar]", form);

    if (!endpoint) {
      O.pendente("Formulário de dúvidas", "Conecte o formulário a um serviço de recebimento (formulario.endpoint). Veja o README. Sem isso, ele fica oculto no site publicado.", "#contato");
      if (!O.revisao) {
        bloco.hidden = true;
        var grade = bloco.parentElement;
        if (grade) grade.classList.add("contato__grade--sem-form");
        return;
      }
      form.classList.add("form--inativo");
      enviar.disabled = true;
      bloco.insertBefore(el("p", { class: "pend pend--bloco" }, " Formulário desativado até o serviço de envio ser configurado."), form);
      return;
    }

    var regras = {
      "f-nome": function (v) { return v.trim().length >= 2 ? "" : "Escreva seu nome."; },
      "f-contato": function (v) {
        v = v.trim();
        var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
        var telOk = v.replace(/\D/g, "").length >= 10;
        return emailOk || telOk ? "" : "Informe um e-mail válido ou um WhatsApp com DDD.";
      },
      "f-mensagem": function (v) { return v.trim().length >= 10 ? "" : "Escreva sua dúvida (pelo menos 10 caracteres)."; },
      "f-aceite": function (v, campo) { return campo.checked ? "" : "Marque a autorização para podermos responder."; },
    };

    function validar(id) {
      var campo = document.getElementById(id);
      var erro = $('[data-erro-de="' + id + '"]', form);
      var msg = regras[id](campo.value, campo);
      campo.setAttribute("aria-invalid", msg ? "true" : "false");
      if (msg) campo.setAttribute("aria-describedby", id + "-erro"); else campo.removeAttribute("aria-describedby");
      erro.textContent = msg;
      erro.hidden = !msg;
      return !msg;
    }

    Object.keys(regras).forEach(function (id) {
      var campo = document.getElementById(id);
      campo.addEventListener("blur", function () { if (campo.getAttribute("aria-invalid") !== null) validar(id); });
      campo.addEventListener("change", function () { if (campo.getAttribute("aria-invalid") === "true") validar(id); });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var invalidos = Object.keys(regras).filter(function (id) { return !validar(id); });
      if (invalidos.length) {
        document.getElementById(invalidos[0]).focus();
        status.dataset.estado = "erro";
        status.textContent = "Confira os campos destacados.";
        return;
      }
      if (form.elements._gotcha && form.elements._gotcha.value) return; // robô

      var dados = new FormData(form);
      dados.delete("aceite");
      dados.append("_subject", "Dúvida pelo site do OIKOS");
      var extras = cfg.camposExtras || {};
      Object.keys(extras).forEach(function (k) { dados.append(k, extras[k]); });

      enviar.disabled = true;
      enviar.textContent = "Enviando…";
      status.dataset.estado = "";
      status.textContent = "Enviando sua mensagem…";

      fetch(endpoint, { method: "POST", body: dados, headers: { Accept: "application/json" } })
        .then(function (r) {
          return r.json().catch(function () { return {}; }).then(function (corpo) {
            if (!r.ok || corpo.success === false || corpo.success === "false" || corpo.ok === false) throw new Error("falha");
          });
        })
        .then(function () {
          form.reset();
          status.dataset.estado = "sucesso";
          status.textContent = "Mensagem enviada. A equipe vai responder pelo contato que você informou.";
        })
        .catch(function () {
          status.dataset.estado = "erro";
          status.textContent = "Não foi possível enviar agora. Tente de novo em instantes ou fale com a equipe pelo Instagram" + (waOk ? " ou WhatsApp." : ".");
        })
        .then(function () {
          enviar.disabled = false;
          enviar.textContent = "Enviar mensagem";
        });
    });
  })();

  /* ===================== Navegação ===================== */
  var topo = $("[data-topo]");
  var hero = $(".hero");

  function aoRolar() { topo.classList.toggle("is-solido", window.scrollY > 24); }
  window.addEventListener("scroll", aoRolar, { passive: true });
  aoRolar();

  /* Menu do celular */
  (function menu() {
    var botao = $("[data-menu-botao]");
    var painel = $("[data-menu]");
    if (!botao || !painel) return;
    var rotulo = $(".sr-only", botao);
    var aberto = false;

    function focaveis() { return $$("a, button", painel).concat([botao]); }

    function abrir() {
      aberto = true;
      painel.hidden = false;
      requestAnimationFrame(function () { painel.classList.add("is-aberto"); });
      botao.setAttribute("aria-expanded", "true");
      rotulo.textContent = "Fechar menu";
      document.documentElement.classList.add("menu-aberto");
      var primeiro = $("a", painel);
      if (primeiro) primeiro.focus();
    }
    function fechar(devolverFoco) {
      if (!aberto) return;
      aberto = false;
      painel.classList.remove("is-aberto");
      botao.setAttribute("aria-expanded", "false");
      rotulo.textContent = "Abrir menu";
      document.documentElement.classList.remove("menu-aberto");
      var esconder = function () { if (!aberto) painel.hidden = true; };
      if (O.reduzMovimento.matches) esconder(); else setTimeout(esconder, 320);
      if (devolverFoco) botao.focus();
    }

    botao.addEventListener("click", function () { aberto ? fechar(true) : abrir(); });
    painel.addEventListener("click", function (e) { if (e.target.closest("a")) fechar(false); });
    document.addEventListener("keydown", function (e) {
      if (!aberto) return;
      if (e.key === "Escape") { fechar(true); return; }
      if (e.key === "Tab") {
        var itens = focaveis();
        var i = itens.indexOf(document.activeElement);
        if (e.shiftKey && (i <= 0)) { e.preventDefault(); itens[itens.length - 1].focus(); }
        else if (!e.shiftKey && i === itens.length - 1) { e.preventDefault(); itens[0].focus(); }
      }
    });
    window.matchMedia("(min-width: 1100px)").addEventListener("change", function (m) { if (m.matches) fechar(false); });
  })();

  /* Link ativo conforme a seção visível */
  (function linkAtivo() {
    if (!("IntersectionObserver" in window)) return;
    var links = $$('.nav a[href^="#"], .menu-movel__lista a[href^="#"]');
    var ids = links.map(function (a) { return a.getAttribute("href").slice(1); })
      .filter(function (id, i, arr) { return arr.indexOf(id) === i; });
    var secoes = ids.map(function (id) { return document.getElementById(id); }).filter(Boolean);
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (!en.isIntersecting) return;
        var id = en.target.id;
        links.forEach(function (a) {
          if (a.getAttribute("href") === "#" + id) a.setAttribute("aria-current", "true");
          else a.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    secoes.forEach(function (s) { obs.observe(s); });
  })();

  /* Chamada fixa no celular: aparece depois do topo e some perto do contato */
  (function ctaMovel() {
    var cta = $("[data-cta-movel]");
    if (!cta || !("IntersectionObserver" in window)) return;
    cta.hidden = false;
    var heroVisivel = true, fimVisivel = false;
    function atualizar() {
      var mostrar = !heroVisivel && !fimVisivel && !document.documentElement.classList.contains("menu-aberto");
      cta.classList.toggle("is-visivel", mostrar);
    }
    new IntersectionObserver(function (e) { heroVisivel = e[0].isIntersecting; atualizar(); }, { threshold: 0.05 }).observe(hero);
    var finais = ["#participar", "#contato", ".rodape"].map(function (s) { return $(s); }).filter(Boolean);
    var visiveis = new Set();
    var obsFim = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) visiveis.add(en.target); else visiveis.delete(en.target); });
      fimVisivel = visiveis.size > 0;
      atualizar();
    });
    finais.forEach(function (f) { obsFim.observe(f); });
    new MutationObserver(atualizar).observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  })();

  /* Entrada suave dos blocos */
  (function revelar() {
    var itens = $$(".revela");
    if (!("IntersectionObserver" in window) || O.reduzMovimento.matches) {
      itens.forEach(function (i) { i.classList.add("is-visivel"); });
      return;
    }
    var obs = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-visivel"); obs.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    itens.forEach(function (i) { obs.observe(i); });
  })();

  /* Ano no rodapé */
  $$("[data-ano-atual]").forEach(function (s) { s.textContent = String(new Date().getFullYear()); });

  /* ===================== Painel de revisão ===================== */
  (function painelRevisao() {
    if (!O.revisao) return;
    var botao = el("button", { type: "button", class: "revisao-botao", "aria-haspopup": "dialog" });
    var dlg = el("dialog", { class: "revisao-painel", "aria-labelledby": "revisao-titulo" });
    var lista = el("ol", { class: "revisao-lista" });
    var fechar = el("button", { type: "button" }, icone("i-fechar"), el("span", { class: "sr-only", texto: "Fechar" }));
    dlg.append(
      el("div", { class: "revisao-painel__cabeca" },
        el("div", null,
          el("h2", { id: "revisao-titulo", texto: "Conteúdo pendente" }),
          el("p", { texto: "Itens que a organização precisa confirmar antes de publicar. Edite conteudo.js e mude modo para \"publicacao\"." })
        ),
        fechar
      ),
      lista
    );
    document.body.append(botao, dlg);

    function desenhar() {
      botao.textContent = "Revisão · " + O.pendencias.length + " pendência" + (O.pendencias.length === 1 ? "" : "s");
      lista.textContent = "";
      O.pendencias.forEach(function (p) {
        lista.append(el("li", null,
          el("strong", { texto: p.titulo }),
          vazio(p.detalhe) ? null : el("span", { texto: p.detalhe }),
          p.ancora ? el("a", { href: p.ancora, "data-fechar-revisao": "" }, "Ver no site") : null
        ));
      });
    }
    desenhar();
    O.aoMudarPendencias(desenhar);

    botao.addEventListener("click", function () { desenhar(); dlg.showModal(); });
    fechar.addEventListener("click", function () { dlg.close(); });
    dlg.addEventListener("click", function (e) {
      if (e.target === dlg || e.target.closest("[data-fechar-revisao]")) dlg.close();
    });
  })();
})();
