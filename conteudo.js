/* =====================================================================
   OIKOS · HEBREUS ONZE — CONTEÚDO DO SITE
   ---------------------------------------------------------------------
   Este é o único arquivo que a equipe precisa editar para atualizar
   datas, local, inscrição, contatos, fotos, vídeos e avisos.

   Regras rápidas:
   • Textos ficam entre aspas: "assim".
   • Campo vazio ("") ou null = informação ainda não confirmada.
     No modo "revisao" ela aparece marcada como PENDENTE.
     No modo "publicacao" ela some do site ou vira "A divulgar".
   • Não apague as vírgulas no fim das linhas.
   • Depois de salvar, recarregue a página para conferir.
   ===================================================================== */

window.OIKOS = {

  /* -------------------------------------------------------------------
     MODO DO SITE
     "revisao"    → mostra os marcadores de conteúdo pendente e o painel
                    de revisão (use enquanto o site está sendo preparado).
     "publicacao" → esconde tudo o que não foi confirmado (use no ar).
     Dica: com o site no ar, acrescente ?revisao ao endereço para ver
     o painel de pendências sem mudar este arquivo.
     ------------------------------------------------------------------- */
  modo: "revisao",

  /* -------------------------------------------------------------------
     FASE DO RETIRO — muda a chamada principal do topo do site
     "antes"   → convite para participar
     "durante" → o retiro está acontecendo (chama para o Instagram)
     "depois"  → agradecimento + interesse na próxima edição
     ------------------------------------------------------------------- */
  fase: "antes",

  edicao: {
    numero: "III",                   // número da edição (arte oficial: "III EDIÇÃO")
    ano: 2026,                       // aparece no ingresso
  },

  /* Lema da edição (fita vermelha do cartaz oficial) */
  lema: "OIKOS: onde Ele habita. E o que estava perdido, volta para casa.",


  /* -------------------------------------------------------------------
     DATAS DA EDIÇÃO
     Preencha "inicio" e "fim" no formato AAAA-MM-DDTHH:MM:SS-03:00 e
     mude "confirmada" para true. Só então a data aparece no site e o
     contador regressivo é ativado.
     ------------------------------------------------------------------- */
  datas: {
    confirmada: true,                // confirmado no cartaz oficial: 20, 21 e 22 de novembro de 2026
    inicio: "2026-11-20T19:30:00-03:00",
    fim: "2026-11-22T18:00:00-03:00",
  },

  /* -------------------------------------------------------------------
     HORÁRIOS — vêm do documento oficial (formato habitual do retiro).
     Mude "confirmado" para true quando a equipe confirmar esta edição.
     ------------------------------------------------------------------- */
  horarios: {
    confirmado: false,
    inicio: "Sexta-feira, 19h30",
    termino: "Domingo, 18h",
  },

  /* -------------------------------------------------------------------
     LOCAL DO RETIRO
     ------------------------------------------------------------------- */
  local: {
    confirmado: true,                // cartaz oficial
    nome: "Escola CEEFMTI Pastor Oliveira de Araújo",
    endereco: "",                    // ex.: "Rua ..., nº ..., Bairro"
    cidade: "Vila Velha/ES",
    mapa: "",                        // link do Google Maps (opcional)
  },

  /* -------------------------------------------------------------------
     INSCRIÇÃO E PARTICIPAÇÃO
     status: ""            → ainda não definido
             "em-breve"    → inscrições serão abertas
             "abertas"     → inscrições abertas (preencha "link" se houver)
             "encerradas"  → inscrições encerradas
     ------------------------------------------------------------------- */
  inscricao: {
    status: "em-breve",
    texto: "Fique atento(a) ao nosso Instagram e não perca nada!",
    link: "",                        // link de formulário/sistema de inscrição, se existir
    valor: "",                       // ex.: "R$ 000,00 (inclui hospedagem e alimentação)"
    publico: "Jovens de 15 a 20 anos",  // cartaz oficial
    criterios: "",                   // ex.: "Menores de 18 anos precisam de autorização dos responsáveis."
    // Lista do que o participante precisa saber antes de se inscrever:
    antesDeInscrever: [
      // "Levar roupa de cama e itens de higiene.",
      // "Menores de 18 anos precisam de autorização assinada.",
    ],
  },

  /* -------------------------------------------------------------------
     NÚMEROS DO RETIRO
     ------------------------------------------------------------------- */
  numeros: {
    // Documento oficial: "220 pessoas envolvidas (encontristas e servos)".
    pessoasEnvolvidas: { valor: 220, confirmado: false },
  },

  /* -------------------------------------------------------------------
     CONTATO
     whatsapp: escreva só números, com 55 + DDD. O documento oficial traz
     dois números. Escolha qual recebe as mensagens do OIKOS:
       "5527988075117"  → (27) 98807-5117
       "5527996184874"  → (27) 99618-4874
     Enquanto estiver vazio, os botões levam ao Direct do Instagram.
     ------------------------------------------------------------------- */
  contato: {
    whatsapp: "",
    mensagemWhatsapp: "Olá! Conheci o OIKOS pelo site do Hebreus Onze e gostaria de receber mais informações sobre o retiro.",
    mensagemProximaEdicao: "Olá! Vi o site do OIKOS e quero ser avisado(a) quando abrirem as informações da próxima edição.",
    instagram: "hebreusonze",
    email: "hebreusonze0@gmail.com",
  },

  /* -------------------------------------------------------------------
     FORMULÁRIO DE DÚVIDAS (opcional)
     O formulário só envia mensagens quando um serviço real estiver
     configurado. Veja o passo a passo no README (Formspree, FormSubmit
     ou Web3Forms). Enquanto "endpoint" estiver vazio, o formulário fica
     oculto no modo publicação.
     ------------------------------------------------------------------- */
  formulario: {
    endpoint: "",                    // ex.: "https://formspree.io/f/abcdwxyz"
    camposExtras: {},                // ex.: { access_key: "..." } (Web3Forms)
  },

  /* -------------------------------------------------------------------
     AVISO IMPORTANTE (faixa no topo do site)
     ------------------------------------------------------------------- */
  aviso: {
    ativo: false,
    texto: "",                       // ex.: "Inscrições abertas até 30/11!"
    link: "",                        // opcional
    rotuloLink: "",                  // ex.: "Saiba mais"
  },

  /* -------------------------------------------------------------------
     TEXTOS DA CHAMADA PRINCIPAL POR FASE
     ------------------------------------------------------------------- */
  fases: {
    antes: {
      frase: "Inscrições abertas *em breve!*",   // o trecho entre asteriscos ganha o destaque verde do cartaz
      subtitulo: "O retiro anual do Hebreus Onze: um fim de semana de pregação, artes, oração e convivência. Fique atento(a) ao nosso Instagram e não perca nada!",
      botao: "Quero viver essa experiência",
      acao: "whatsapp",              // "whatsapp" | "instagram" | "#galeria"
    },
    durante: {
      frase: "O OIKOS está acontecendo agora.",
      subtitulo: "Reze com a gente e acompanhe o retiro pelos registros da equipe de mídias no Instagram.",
      botao: "Acompanhar no Instagram",
      acao: "instagram",
    },
    depois: {
      frase: "Obrigado por viver o OIKOS com a gente.",
      subtitulo: "Os registros desta edição estão na galeria. Quer participar da próxima? Deixe seu contato com a equipe.",
      botao: "Quero saber da próxima edição",
      acao: "whatsapp-proxima",
    },
  },

  /* -------------------------------------------------------------------
     MÍDIAS DAS SEÇÕES
     Coloque os arquivos em assets/ e escreva o caminho aqui.
     tipo: "foto" ou "video". Sempre descreva a imagem em "alt".
     ------------------------------------------------------------------- */
  hero: {
    // Vídeo de abertura: toca sem som, em loop. Use MP4 (H.264), até ~8 MB,
    // 1920 px de largura, 10 a 20 segundos. "poster" é a imagem exibida antes.
    video: { mp4: "", webm: "", poster: "" },
    // Alternativa ao vídeo: uma fotografia horizontal.
    imagem: { src: "", alt: "" },
  },

  midias: {
    oikos:       { tipo: "foto", src: "", alt: "", legenda: "" },  // seção "O que é o OIKOS"
    grupo:       { tipo: "foto", src: "", alt: "", legenda: "" },  // seção "Hebreus Onze"
    pregacao:    { tipo: "foto", src: "", poster: "", alt: "" },   // pilar: Pregações e dimensões
    dinamicas:   { tipo: "foto", src: "", poster: "", alt: "" },   // pilar: Dinâmicas de grupo
    artes:       { tipo: "foto", src: "", poster: "", alt: "" },   // pilar: Artes
    audiovisual: { tipo: "foto", src: "", poster: "", alt: "" },   // pilar: Experiência audiovisual
  },

  /* -------------------------------------------------------------------
     GALERIA
     Para adicionar uma mídia, copie um dos modelos abaixo para dentro de
     "itens", tire as barras // do começo e ajuste os campos.

     categoria: "oracao" | "louvor" | "artes" | "convivencia" | "bastidores"
     formato:   "vertical" | "horizontal" | "quadrado" | "destaque"
     edicao:    ano da edição (ex.: "2025"), para preservar os registros

     Modelos:
     { tipo: "foto",  src: "assets/galeria/2025/oracao-01.jpg", miniatura: "assets/galeria/2025/oracao-01-p.jpg",
       alt: "Jovens em oração diante do Santíssimo", legenda: "Adoração na noite de sábado",
       categoria: "oracao", formato: "vertical", edicao: "2025" },
     { tipo: "video", src: "assets/galeria/2025/louvor.mp4", poster: "assets/galeria/2025/louvor.jpg",
       alt: "Ministério de Música conduzindo o louvor", categoria: "louvor", formato: "horizontal", edicao: "2025" },
     { tipo: "reel",  url: "https://www.instagram.com/reel/CODIGO/", poster: "assets/galeria/2025/reel-capa.jpg",
       alt: "Reel com os bastidores do retiro", categoria: "bastidores", formato: "vertical", edicao: "2025" },
     ------------------------------------------------------------------- */
  galeria: {
    // true: o Reel abre dentro do site ao ser clicado (carrega o Instagram só nesse momento).
    // false: o Reel abre no Instagram, em outra aba.
    incorporarReels: true,
    itens: [
    ],
  },

  /* -------------------------------------------------------------------
     NOSSA CAMINHADA (linha do tempo)
     confirmado: false → aparece só no modo revisão.
     ------------------------------------------------------------------- */
  caminhada: [
    {
      data: "28.05.2023",
      titulo: "Nasce o Hebreus Onze",
      texto: "O encontro START marca o início da caminhada do grupo na Paróquia Nossa Senhora Aparecida, em Cobilândia, Vila Velha/ES.",
      foto: { src: "", alt: "" },
      confirmado: true,
    },
    {
      data: "",
      titulo: "I e II edições do OIKOS",
      texto: "Informar os anos e um resumo das duas primeiras edições do retiro.",
      foto: { src: "", alt: "" },
      confirmado: false,
    },
    {
      data: "20.11.2026",
      titulo: "III edição do OIKOS",
      texto: "De 20 a 22 de novembro de 2026, na Escola CEEFMTI Pastor Oliveira de Araújo, em Vila Velha/ES.",
      foto: { src: "", alt: "" },
      confirmado: true,
    },
    {
      data: "",
      titulo: "Outros marcos da caminhada",
      texto: "Encontros, missões e edições do OIKOS que a equipe quiser registrar.",
      foto: { src: "", alt: "" },
      confirmado: false,
    },
  ],
};
