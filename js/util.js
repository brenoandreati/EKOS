/* =====================================================================
   OIKOS · utilitários compartilhados
   Expõe window.Oikos com: configuração, modo revisão, helpers de DOM,
   validação de links e o registro de conteúdo pendente.
   ===================================================================== */
(function () {
  "use strict";

  var config = window.OIKOS || {};
  var params = new URLSearchParams(window.location.search);
  var revisao = params.has("revisao") || config.modo !== "publicacao";

  /** Valor vazio: null, undefined, "", espaços ou lista vazia. */
  function vazio(v) {
    if (v == null) return true;
    if (typeof v === "string") return v.trim() === "";
    if (Array.isArray(v)) return v.length === 0;
    return false;
  }

  /** Lê um caminho "a.b.c" dentro da configuração. */
  function ler(caminho, base) {
    return String(caminho).split(".").reduce(function (obj, chave) {
      return obj == null ? undefined : obj[chave];
    }, base || config);
  }

  /**
   * Aceita caminhos relativos (assets/...) e links http(s), mailto e tel.
   * Qualquer outro esquema (javascript:, data: etc.) é descartado.
   */
  function linkSeguro(url) {
    if (vazio(url)) return "";
    var u = String(url).trim();
    if (/^[a-z][a-z0-9+.-]*:/i.test(u)) {
      return /^(https?:|mailto:|tel:)/i.test(u) ? u : "";
    }
    if (u.indexOf("//") === 0) return "";
    return u;
  }

  /** Cria um elemento: el("a", { href: "#", class: "x" }, "texto", filho). */
  function el(tag, atributos) {
    var no = document.createElement(tag);
    var attrs = atributos || {};
    Object.keys(attrs).forEach(function (nome) {
      var valor = attrs[nome];
      if (valor == null || valor === false) return;
      if (nome === "texto") no.textContent = valor;
      else if (valor === true) no.setAttribute(nome, "");
      else no.setAttribute(nome, valor);
    });
    for (var i = 2; i < arguments.length; i++) {
      var filho = arguments[i];
      if (filho == null || filho === false) continue;
      no.append(typeof filho === "string" ? document.createTextNode(filho) : filho);
    }
    return no;
  }

  /** Ícone do sprite SVG do index.html. */
  function icone(id, classe) {
    var ns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("class", "icone" + (classe ? " " + classe : ""));
    svg.setAttribute("aria-hidden", "true");
    var use = document.createElementNS(ns, "use");
    use.setAttribute("href", "#" + id);
    svg.append(use);
    return svg;
  }

  /** Texto com *destaque* entre asteriscos, sem interpretar HTML. */
  function textoComDestaque(alvo, texto) {
    alvo.textContent = "";
    String(texto).split("*").forEach(function (parte, i) {
      if (!parte) return;
      alvo.append(i % 2 ? el("em", { texto: parte }) : document.createTextNode(parte));
    });
  }

  /* ---------- Conteúdo pendente ---------- */
  var pendencias = [];
  var ouvintes = [];

  /**
   * Registra um conteúdo que falta confirmar.
   * Retorna um marcador curto com o título (só no modo revisão) ou null;
   * o detalhe aparece no painel de revisão.
   */
  function pendente(titulo, detalhe, ancora, classe) {
    var ja = pendencias.some(function (p) { return p.titulo === titulo; });
    if (!ja) {
      pendencias.push({ titulo: titulo, detalhe: detalhe || "", ancora: ancora || "" });
      ouvintes.forEach(function (fn) { fn(pendencias); });
    }
    if (!revisao) return null;
    return el("span", { class: "pend" + (classe ? " " + classe : "") }, " " + titulo);
  }

  function aoMudarPendencias(fn) { ouvintes.push(fn); }

  var reduzMovimento = window.matchMedia("(prefers-reduced-motion: reduce)");

  window.Oikos = {
    config: config,
    revisao: revisao,
    vazio: vazio,
    ler: ler,
    linkSeguro: linkSeguro,
    el: el,
    icone: icone,
    textoComDestaque: textoComDestaque,
    pendente: pendente,
    pendencias: pendencias,
    aoMudarPendencias: aoMudarPendencias,
    reduzMovimento: reduzMovimento,
  };
})();
