# OIKOS · Hebreus Onze — landing page

Site oficial do **OIKOS**, retiro anual do Grupo Jovem Hebreus Onze (Paróquia Nossa Senhora Aparecida, Cobilândia, Vila Velha/ES).

Site estático (HTML, CSS e JavaScript puros), sem dependências e sem etapa de build. Funciona no GitHub Pages, Netlify, Vercel ou em qualquer hospedagem de arquivos.

## Como atualizar o conteúdo

Quase tudo o que muda de uma edição para outra fica em **um único arquivo: `conteudo.js`**. Ele tem comentários explicando cada campo.

| O que mudar | Onde, em `conteudo.js` |
| --- | --- |
| Datas e contador regressivo | `datas` (preencha `inicio` e `fim` e mude `confirmada` para `true`) |
| Horários | `horarios` (mude `confirmado` para `true`) |
| Local | `local` |
| Inscrição, valor, público e critérios | `inscricao` |
| WhatsApp, Instagram e e-mail | `contato` |
| Aviso no topo do site | `aviso` |
| Chamada principal antes, durante e depois do retiro | `fase` e `fases` |
| Fotos das seções e dos pilares | `midias` |
| Vídeo de abertura | `hero.video` |
| Galeria de fotos, vídeos e Reels | `galeria.itens` |
| Linha do tempo | `caminhada` |

Os textos institucionais (O que é o OIKOS, Hebreus Onze, pilares) ficam no `index.html`, marcados por seção.

### Modo revisão e modo publicação

- `modo: "revisao"` mostra marcadores amarelos **PENDENTE** e um botão no canto da tela com a lista de tudo o que falta confirmar.
- `modo: "publicacao"` esconde os marcadores. Campos não confirmados somem ou aparecem como "A divulgar".
- Com o site no ar, acrescente `?revisao` ao endereço (ex.: `https://site/?revisao`) para ver as pendências sem mudar o arquivo.

### Fotos e vídeos

1. Coloque os arquivos em `assets/galeria/ANO/` (galeria) ou `assets/img/fotos/` (seções).
2. Exporte fotos em JPG ou WebP com até 1920 px no lado maior (de 200 a 400 KB). Para a galeria, uma miniatura de 800 px deixa o site mais leve (`miniatura`).
3. Vídeos: MP4 (H.264), até ~8 MB. Sempre informe uma imagem de capa (`poster`).
4. Escreva uma descrição em `alt` para cada imagem (leitores de tela usam esse texto).
5. Liste o arquivo em `conteudo.js`. Não é preciso mexer no layout: a galeria se reorganiza sozinha.

Depois do retiro: mude `fase` para `"depois"`, adicione as fotos da edição com `edicao: "ANO"` e, na próxima edição, volte `fase` para `"antes"` e atualize datas. Os registros antigos continuam na galeria (com filtro por edição).

## Antes de publicar (pendências)

O painel de revisão lista tudo automaticamente. Os principais pontos:

- [ ] **Datas da III edição.** Foi informado "20, 21 e 22 de dezembro", mas em 2026 esses dias caem de domingo a terça, e o retiro acontece de sexta a domingo (em 2026, seria 18 a 20 de dezembro). Confirmar dia e ano.
- [ ] Horários desta edição (o documento traz sexta, 19h30, a domingo, 18h).
- [ ] **Qual WhatsApp** recebe as mensagens do OIKOS: (27) 98807-5117 ou (27) 99618-4874. Enquanto não houver número, os botões levam ao Direct do Instagram.
- [ ] Local, inscrição, valor, critérios de participação e orientações para quem vai se inscrever.
- [ ] Fotos reais do retiro, do grupo e dos quatro pilares; vídeo de abertura (opcional).
- [ ] Anos da I e da II edição do OIKOS (para a linha do tempo).
- [ ] Confirmar se as 220 pessoas envolvidas (documento oficial) valem para esta edição.
- [ ] Formulário de dúvidas: conectar a um serviço de envio (abaixo) ou deixá-lo oculto.
- [ ] Domínio do site: trocar `og:image` no `index.html` por um endereço completo (`https://...`), para a prévia aparecer no WhatsApp.
- [ ] Mudar `modo` para `"publicacao"`.

## Formulário de dúvidas

O formulário só envia quando um serviço real estiver configurado. Ele nunca finge que enviou.

1. Crie uma conta gratuita em [Formspree](https://formspree.io) com o e-mail do grupo e crie um formulário.
2. Copie o endereço gerado (ex.: `https://formspree.io/f/abcdwxyz`) para `formulario.endpoint` em `conteudo.js`.
3. Envie uma mensagem de teste pelo site e confirme o recebimento.

Alternativas já liberadas: FormSubmit (`https://formsubmit.co/ajax/SEU-EMAIL`) e Web3Forms (`https://api.web3forms.com/submit`, com `camposExtras: { access_key: "..." }`). Para usar outro serviço, acrescente o domínio dele em `connect-src` e `form-action` na linha `Content-Security-Policy` do `index.html`.

## Identidade visual

Elementos usados (de `assets/img/oikos/` e `assets/img/marca/`):

- Bilhete oficial do OIKOS (III edição), "3" com brilho azul, casa no campo, círculo, código de barras e losango-brilho (vetorizado no ícone `i-brilho` do `index.html`).
- Selo HEBREUSONZE e logotipo do Hebreus Onze (vetorizado a partir do documento oficial). Substitua `hebreus-onze*.svg` pelo vetor original quando houver.

### Cores (medidas nos arquivos da identidade)

| Token | HEX | Origem |
| --- | --- | --- |
| `--vermelho` | `#FD2C2A` | bilhete |
| `--papel` | `#FDF3CC` | "3" e círculo |
| `--papel-claro` | `#FEF7DE` | letras do bilhete |
| `--azul` | `#0074AA` | brilho do "3" |
| `--vinho` | `#7F1110` | detalhes do bilhete |
| `--ink` | `#1A1212` | losango-brilho |
| `--barras` | `#1E1E1E` | código de barras |

Regras de contraste: sobre o vermelho, textos pequenos ficam em `--ink`; o creme só aparece em textos grandes ou em negrito (botões a partir de 19 px). Sobre o creme, textos pequenos de destaque usam `--vinho`.

### Fontes

As fontes do kit não podem ser publicadas na web como estão:

- **Avenir, Avenir Next e Avenir Next Condensed** (Linotype/Monotype): as cópias do kit são do sistema macOS; o uso em site exige licença web.
- **Condor** (Font Bureau/Type Network): "For TN use only"; exige licença web.
- **Marvel-Regular.ttf**: fonte do selo HEBREUSONZE, com só 31 caracteres (sem acentos). Serve para a arte, não para textos do site.

Por isso o site usa substitutas gratuitas (licença SIL OFL), hospedadas no próprio site: **Barlow Condensed** no lugar de Avenir Next Condensed/Condor e **Nunito Sans** no lugar de Avenir Next. Se o grupo adquirir licenças web, coloque os arquivos `.woff2` em `assets/fonts/`, declare-os com `@font-face` no topo de `css/estilo.css` e troque `--fonte-titulo` e `--fonte-texto`.

## Estrutura

```
index.html          página única com as 10 seções
privacidade.html    política de privacidade (formulário)
conteudo.js         conteúdo editável
css/estilo.css      sistema visual (tokens, componentes, seções)
js/util.js          utilitários e registro de pendências
js/galeria.js       galeria + visualização ampliada
js/app.js           preenchimento das seções, navegação, formulário, contador
assets/             fontes, marca, elementos do OIKOS, fotos e vídeos
```

## Testar localmente

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

## Publicar no GitHub Pages

Settings → Pages → Branch: escolha a branch principal e a pasta `/ (root)`. O arquivo `.nojekyll` já está incluído.
