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

O painel de revisão lista tudo automaticamente. Já confirmado pelo cartaz oficial: III edição, 20, 21 e 22 de novembro de 2026, Escola CEEFMTI Pastor Oliveira de Araújo (Vila Velha/ES), jovens de 15 a 20 anos e inscrições abertas em breve.

Ainda falta:

- [ ] Horários desta edição (o documento oficial traz sexta, 19h30, a domingo, 18h).
- [ ] **Qual WhatsApp** recebe as mensagens do OIKOS: (27) 98807-5117 ou (27) 99618-4874. Enquanto não houver número, os botões levam ao Direct do Instagram.
- [ ] Endereço completo e link do mapa da escola.
- [ ] Valor da inscrição e orientações para quem vai se inscrever; link de inscrição quando abrir.
- [ ] Fotos reais do retiro, do grupo e dos quatro pilares; vídeo de abertura (opcional).
- [ ] Anos da I e da II edição do OIKOS (para a linha do tempo).
- [ ] Confirmar se as 220 pessoas envolvidas (documento oficial) valem para esta edição.
- [ ] Formulário de dúvidas: conectar a um serviço de envio (abaixo) ou deixá-lo oculto.
- [ ] Mudar `modo` para `"publicacao"`.

## Formulário de dúvidas

O formulário só envia quando um serviço real estiver configurado. Ele nunca finge que enviou.

1. Crie uma conta gratuita em [Formspree](https://formspree.io) com o e-mail do grupo e crie um formulário.
2. Copie o endereço gerado (ex.: `https://formspree.io/f/abcdwxyz`) para `formulario.endpoint` em `conteudo.js`.
3. Envie uma mensagem de teste pelo site e confirme o recebimento.

Alternativas já liberadas: FormSubmit (`https://formsubmit.co/ajax/SEU-EMAIL`) e Web3Forms (`https://api.web3forms.com/submit`, com `camposExtras: { access_key: "..." }`). Para usar outro serviço, acrescente o domínio dele em `connect-src` e `form-action` na linha `Content-Security-Policy` do `index.html`.

## Identidade visual

O site segue o cartaz oficial (ID VISUAL): céu azul com a casa no campo, o ingresso vermelho, a fita de filme com o lema "OIKOS: onde Ele habita. E o que estava perdido, volta para casa.", títulos em itálico expandido em creme e destaques em verde.

Elementos usados (de `assets/img/oikos/` e `assets/img/marca/`): ingresso oficial (III edição), ingresso vazio (contagem "Faltam X dias"), "3" com brilho azul, círculo, casa no campo, código de barras, losango-brilho (vetorizado no ícone `i-brilho` do `index.html`), selo HEBREUSONZE e logotipo do Hebreus Onze (vetorizado a partir do documento oficial; substitua `hebreus-onze*.svg` pelo vetor original quando houver).

### Cores (medidas no cartaz e nos arquivos da identidade)

| Token | HEX | Origem |
| --- | --- | --- |
| `--ceu` | `#1591D2` | céu do cartaz |
| `--ceu-claro` / `--ceu-horizonte` | `#66BCE8` / `#D0EFF1` | céu perto do horizonte |
| `--azul` | `#0074AA` | brilho do "3" |
| `--vermelho` | `#FC2C28` | ingresso e fita |
| `--papel` | `#FCF4D4` | letras "FALTAM DIAS", "3" e círculo |
| `--branco` | `#FCFCFC` | textos do cartaz |
| `--verde` | `#00FC00` | destaques ("EM BREVE!", "15 A 20 ANOS!") |
| `--vinho` | `#7F1110` | detalhes do ingresso |

Cores derivadas (para leitura): `--azul-noite` `#0B2A47` (seção Hebreus Onze e rodapé) e `--tinta` `#0A1A2B` (texto sobre creme e vermelho).

Regras de contraste:

- **Sobre o céu (`#1591D2`):** só textos grandes ou em negrito (19 px ou mais), como no cartaz. Textos corridos ficam sobre o `--azul`.
- **Sobre o vermelho:** textos pequenos em `--tinta`.
- **Destaques verdes:** viram marca-texto (fundo verde com letra escura), para continuarem legíveis sobre o azul.

### Fontes

As fontes do kit não podem ser publicadas na web como estão:

- **Condor** (Font Bureau/Type Network), usada nos títulos do cartaz ("FALTAM DIAS"): "For TN use only"; exige licença web.
- **Avenir, Avenir Next e Avenir Next Condensed** (Linotype/Monotype): as cópias do kit são do sistema macOS; o uso em site exige licença web.
- **Marvel-Regular.ttf**: fonte do selo HEBREUSONZE, com só 31 caracteres (sem acentos). Serve para a arte, não para textos.

Por isso o site usa substitutas gratuitas (licença SIL OFL), hospedadas no próprio site: **Anybody** (itálica, 150% de largura) no lugar da Condor Expanded Italic, e **Nunito Sans** no lugar da Avenir Next. Se o grupo adquirir licenças web, coloque os `.woff2` em `assets/fonts/`, declare-os com `@font-face` no topo de `css/estilo.css` e troque `--fonte-titulo` e `--fonte-texto`.

Observação sobre a arte: o ingresso do cartaz traz "OLD VILAGE"; em inglês o correto é "VILLAGE".

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

## Publicação (Cloudflare Pages)

O site está publicado no Cloudflare Pages, no projeto **hebreus-onze-oikos**:

- Endereço: <https://hebreus-onze-oikos.pages.dev>
- Painel: Cloudflare → Workers & Pages → hebreus-onze-oikos

Para publicar uma atualização, envie só os arquivos do site (sem `README.md` e `.git`):

```bash
mkdir -p dist && cp -r index.html privacidade.html conteudo.js css js assets _headers robots.txt sitemap.xml dist/
npx wrangler pages deploy dist --project-name hebreus-onze-oikos --branch main
```

O comando usa o token em `CLOUDFLARE_API_TOKEN` (ou pede login no navegador). Também é possível arrastar a pasta `dist` em Workers & Pages → hebreus-onze-oikos → Create deployment.

O projeto foi criado por envio direto (Direct Upload). Para publicar sozinho a cada alteração no GitHub, é preciso criar no painel um projeto conectado ao repositório (Workers & Pages → Create → Pages → Connect to Git). O Cloudflare não converte um projeto de envio direto em projeto conectado ao Git.

Se o site ganhar um domínio próprio (ex.: `oikos.hebreusonze.com.br`), adicione-o em Custom domains e atualize `og:url`, `og:image` e o link canônico no `index.html`, além de `robots.txt` e `sitemap.xml`.

`_headers` define cabeçalhos de segurança e cache. `robots.txt` e `sitemap.xml` ajudam os buscadores.
