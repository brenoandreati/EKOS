/* =====================================================================
   OIKOS · galeria de fotos, vídeos e Reels + visualização ampliada
   Lê OIKOS.galeria.itens (conteudo.js). Nada aqui precisa ser editado
   para adicionar mídias.
   ===================================================================== */
(function () {
  "use strict";

  var O = window.Oikos;
  if (!O) return;
  var el = O.el, icone = O.icone, vazio = O.vazio, linkSeguro = O.linkSeguro;

  var CATEGORIAS = {
    oracao: "Oração",
    louvor: "Louvor e música",
    pregacao: "Pregações",
    artes: "Artes e interlúdios",
    convivencia: "Convivência",
    bastidores: "Bastidores",
  };
  var FORMATOS = ["vertical", "horizontal", "quadrado", "destaque"];

  /* Modelos exibidos só no modo revisão, enquanto a galeria está vazia */
  var MODELOS = [
    { categoria: "oracao", formato: "destaque", descricao: "Momento de oração ou adoração" },
    { categoria: "louvor", formato: "vertical", descricao: "Louvor com o Ministério de Música" },
    { categoria: "artes", formato: "quadrado", descricao: "Monólogo ou interlúdio" },
    { categoria: "convivencia", formato: "quadrado", descricao: "Dinâmica de grupo" },
    { categoria: "convivencia", formato: "horizontal", descricao: "Encontristas e servos juntos" },
    { categoria: "bastidores", formato: "vertical", descricao: "Reel ou vídeo vertical dos bastidores" },
    { categoria: "bastidores", formato: "quadrado", descricao: "Servos preparando o retiro" },
    { categoria: "oracao", formato: "horizontal", descricao: "Registro de uma edição anterior" },
  ];

  function idDoReel(url) {
    var m = String(url || "").match(/instagram\.com\/(?:reel|reels|p|tv)\/([A-Za-z0-9_-]+)/);
    return m ? m[1] : "";
  }

  /** Normaliza e descarta itens incompletos, avisando no modo revisão. */
  function prepararItens(lista) {
    var validos = [];
    (lista || []).forEach(function (item, i) {
      if (!item || typeof item !== "object") return;
      var tipo = item.tipo === "video" || item.tipo === "reel" ? item.tipo : "foto";
      var src = linkSeguro(item.src);
      var url = linkSeguro(item.url);
      var ok = tipo === "reel" ? !!idDoReel(url) : !!src;
      if (!ok) {
        O.pendente("Item " + (i + 1) + " da galeria incompleto", "Confira o caminho do arquivo (ou o link do Reel) no item " + (i + 1) + " da galeria.", "#galeria");
        return;
      }
      if (vazio(item.alt)) {
        O.pendente("Descrição da mídia " + (i + 1) + " da galeria", "Escreva o campo \"alt\" do item " + (i + 1) + " para leitores de tela.", "#galeria");
      }
      validos.push({
        tipo: tipo,
        src: src,
        url: url,
        reel: tipo === "reel" ? idDoReel(url) : "",
        miniatura: linkSeguro(item.miniatura) || linkSeguro(item.poster) || src,
        poster: linkSeguro(item.poster),
        alt: vazio(item.alt) ? "" : String(item.alt),
        legenda: vazio(item.legenda) ? "" : String(item.legenda),
        categoria: CATEGORIAS[item.categoria] ? item.categoria : "",
        formato: FORMATOS.indexOf(item.formato) >= 0 ? item.formato : "quadrado",
        edicao: vazio(item.edicao) ? "" : String(item.edicao),
      });
    });
    return validos;
  }

  function montar(secao) {
    var cfg = O.config.galeria || {};
    var grade = secao.querySelector("[data-galeria-grade]");
    var filtros = secao.querySelector("[data-galeria-filtros]");
    var vaziaBox = secao.querySelector("[data-galeria-vazia]");
    var itens = prepararItens(cfg.itens);

    if (!itens.length) {
      O.pendente("Fotos e vídeos da galeria", "Adicione as mídias oficiais em assets/galeria/ e liste-as em galeria.itens (conteudo.js).", "#galeria");
      if (O.revisao) {
        MODELOS.forEach(function (m) {
          grade.append(el("div", { class: "peca peca--modelo peca--" + m.formato, "aria-hidden": "true" },
            icone(m.formato === "vertical" ? "i-play" : "i-brilho"),
            el("span", { class: "pend" }, " " + CATEGORIAS[m.categoria] + ": " + m.descricao)
          ));
        });
      } else {
        grade.hidden = true;
        vaziaBox.hidden = false;
      }
      return;
    }

    if (itens.some(function (it) { return !it.edicao; })) {
      O.pendente("Edição das fotos da galeria", "Informar de qual edição do OIKOS ou encontro do grupo são as fotos (campo \"edicao\" de cada item em galeria.itens).", "#galeria");
    }
    O.pendente("Mais fotos e vídeos para a galeria", "A galeria tem 4 fotos. Novas mídias (oração, louvor, artes, convivência, bastidores, vídeos e Reels) entram em galeria.itens.", "#galeria");

    var estado = { categoria: "", edicao: "" };
    var visiveis = itens.slice();

    /* ---------- Filtros ---------- */
    var cats = Object.keys(CATEGORIAS).filter(function (c) {
      return itens.some(function (it) { return it.categoria === c; });
    });
    var edicoes = itens.map(function (it) { return it.edicao; })
      .filter(function (e, i, arr) { return e && arr.indexOf(e) === i; })
      .sort().reverse();

    if (cats.length > 1 || edicoes.length > 1) {
      filtros.hidden = false;
      if (cats.length > 1) {
        [""].concat(cats).forEach(function (c) {
          var b = el("button", { type: "button", class: "filtro", "aria-pressed": c === "" ? "true" : "false", "data-cat": c, texto: c ? CATEGORIAS[c] : "Todos" });
          filtros.append(b);
        });
        filtros.addEventListener("click", function (e) {
          var b = e.target.closest("[data-cat]");
          if (!b) return;
          estado.categoria = b.getAttribute("data-cat");
          filtros.querySelectorAll("[data-cat]").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
          desenhar();
        });
      }
      if (edicoes.length > 1) {
        var sel = el("select", { id: "galeria-edicao" }, el("option", { value: "", texto: "Todas" }));
        edicoes.forEach(function (ed) { sel.append(el("option", { value: ed, texto: ed })); });
        sel.addEventListener("change", function () { estado.edicao = sel.value; desenhar(); });
        filtros.append(el("label", { class: "galeria__edicao", for: "galeria-edicao" }, "Edição", sel));
      }
    }

    /* ---------- Grade ---------- */
    function peca(item, indice) {
      var rotulo = (item.tipo === "foto" ? "Ampliar foto" : item.tipo === "video" ? "Assistir vídeo" : "Assistir Reel") + (item.alt ? ": " + item.alt : "");
      var b = el("button", { type: "button", class: "peca peca--" + item.formato, "aria-label": rotulo, "data-indice": indice });
      if (item.miniatura) {
        b.append(el("img", { src: item.miniatura, alt: "", loading: "lazy", decoding: "async" }));
      } else {
        b.classList.add("peca--modelo");
      }
      if (item.tipo !== "foto") {
        b.append(el("span", { class: "peca__selo", "aria-hidden": "true" }, icone(item.tipo === "reel" ? "i-instagram" : "i-play"), item.tipo === "reel" ? "Reel" : "Vídeo"));
      }
      if (item.categoria || item.legenda) {
        b.append(el("span", { class: "peca__info", "aria-hidden": "true" },
          item.categoria ? el("span", { class: "peca__cat", texto: CATEGORIAS[item.categoria] }) : null,
          item.legenda ? el("span", { texto: item.legenda }) : null
        ));
      }
      return b;
    }

    function desenhar() {
      visiveis = itens.filter(function (it) {
        return (!estado.categoria || it.categoria === estado.categoria) && (!estado.edicao || it.edicao === estado.edicao);
      });
      grade.textContent = "";
      visiveis.forEach(function (it, i) { grade.append(peca(it, i)); });
      if (!visiveis.length) grade.append(el("p", { texto: "Nenhuma mídia nesta combinação de filtros." }));
    }
    desenhar();

    grade.addEventListener("click", function (e) {
      var b = e.target.closest("[data-indice]");
      if (b) caixa.abrir(visiveis, Number(b.getAttribute("data-indice")), b);
    });

    var caixa = criarLightbox(cfg.incorporarReels !== false);
  }

  /* ---------- Visualização ampliada ---------- */
  function criarLightbox(incorporarReels) {
    var dlg = document.querySelector("[data-lightbox]");
    var palco = dlg.querySelector("[data-lightbox-palco]");
    var legenda = dlg.querySelector("[data-lightbox-legenda]");
    var contagem = dlg.querySelector("[data-lightbox-contagem]");
    var btnAnt = dlg.querySelector("[data-lightbox-anterior]");
    var btnProx = dlg.querySelector("[data-lightbox-proximo]");
    var lista = [], atual = 0, origem = null;

    function limpar() {
      palco.querySelectorAll("video").forEach(function (v) { v.pause(); });
      palco.textContent = "";
    }

    function mostrar(i) {
      atual = (i + lista.length) % lista.length;
      var it = lista[atual];
      limpar();
      if (it.tipo === "foto") {
        palco.append(el("img", { src: it.src, alt: it.alt }));
      } else if (it.tipo === "video") {
        var v = el("video", { src: it.src, controls: true, playsinline: true, preload: "metadata", poster: it.poster || null, "aria-label": it.alt || "Vídeo do OIKOS" });
        palco.append(v);
        var p = v.play();
        if (p && p.catch) p.catch(function () { /* o navegador pode exigir outro toque */ });
      } else {
        var link = "https://www.instagram.com/reel/" + it.reel + "/";
        if (incorporarReels) {
          palco.append(el("iframe", { src: "https://www.instagram.com/reel/" + it.reel + "/embed/", title: it.alt || "Reel do Instagram", loading: "lazy", allow: "encrypted-media; picture-in-picture", referrerpolicy: "strict-origin-when-cross-origin" }));
        } else {
          palco.append(el("div", { class: "lightbox__reel" },
            it.poster ? el("img", { src: it.poster, alt: it.alt }) : null,
            el("a", { class: "btn btn--primario", href: link, target: "_blank", rel: "noopener noreferrer" }, icone("i-instagram"), "Assistir no Instagram")
          ));
        }
      }
      legenda.textContent = it.legenda || it.alt || "";
      contagem.textContent = (atual + 1) + " / " + lista.length;
      var varios = lista.length > 1;
      btnAnt.hidden = !varios;
      btnProx.hidden = !varios;
    }

    function abrir(itens, i, gatilho) {
      lista = itens;
      origem = gatilho || null;
      mostrar(i);
      if (typeof dlg.showModal === "function") dlg.showModal();
      else dlg.setAttribute("open", "");
    }

    function fechar() {
      if (dlg.open) {
        if (typeof dlg.close === "function") dlg.close();
        else dlg.removeAttribute("open");
      }
    }

    dlg.addEventListener("close", function () {
      limpar();
      if (origem && document.contains(origem)) origem.focus();
    });
    dlg.querySelector("[data-lightbox-fechar]").addEventListener("click", fechar);
    btnAnt.addEventListener("click", function () { mostrar(atual - 1); });
    btnProx.addEventListener("click", function () { mostrar(atual + 1); });
    dlg.addEventListener("keydown", function (e) {
      if (lista.length < 2) return;
      if (e.key === "ArrowLeft") { e.preventDefault(); mostrar(atual - 1); }
      if (e.key === "ArrowRight") { e.preventDefault(); mostrar(atual + 1); }
    });
    // Clique fora da mídia fecha
    dlg.addEventListener("click", function (e) { if (e.target === dlg || e.target === palco) fechar(); });

    // Deslizar no celular
    var inicioX = null;
    palco.addEventListener("pointerdown", function (e) { inicioX = e.clientX; });
    palco.addEventListener("pointerup", function (e) {
      if (inicioX == null || lista.length < 2) return;
      var dx = e.clientX - inicioX;
      inicioX = null;
      if (Math.abs(dx) > 50) mostrar(atual + (dx < 0 ? 1 : -1));
    });

    return { abrir: abrir, fechar: fechar };
  }

  O.galeria = { montar: montar, CATEGORIAS: CATEGORIAS };
})();
