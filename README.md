# Elo Solidário · Protótipo funcional de alta fidelidade

Projeto Parte 3 · Interação Humano-Computador · Universidade Presbiteriana Mackenzie
Profa. Elisângela Botelho Gracias

**Grupo:** Artur Campi (RA 10436740), Lucas Carmo (RA 10439830), Cristian Souza (RA 10436050), Bruna Soncini (RA 10428267), Gabriel Medina (RA 10426931), Fernando Paiva (RA 10416680)

O Elo Solidário é uma plataforma de doação direta de itens básicos (ODS 1). Ela liga quem tem itens sobrando a famílias de baixa renda que moram perto, usando a metáfora de uma **loja solidária**: vitrine, corredores, lista de necessidades, reserva e comprovante de entrega, sem preço e sem dinheiro.

---

## Como abrir

O protótipo é feito em **HTML, CSS e JavaScript puros**. Não precisa instalar nada nem ter servidor, então funciona em qualquer sistema (Windows, macOS, Linux, Android, iOS).

- **Pelo link** (recomendado para os testes): abra o endereço que está no arquivo TXT da entrega, no celular ou no computador.
- **Sem internet**: descompacte o zip e dê dois cliques em `index.html`. Sem internet, só as fontes mudam para as do sistema; todo o resto funciona.

No celular, o app ocupa a tela inteira. No computador, ele aparece dentro de uma moldura de celular, com o roteiro de teste ao lado.

Os dados do teste (conta, doações, reservas) ficam salvos **só no navegador de quem está testando**. O botão "Recomeçar o teste do zero" (no painel do computador) apaga tudo.

## Como testar

A pessoa que testa faz o papel de alguém do bairro. As outras pessoas (Beatriz, Rosângela, Marcos etc.) são fictícias e **respondem sozinhas**, para que uma única pessoa consiga testar os dois lados da doação.

Tarefas sugeridas para o teste de usabilidade:

1. Crie sua conta. O código do SMS aparece em um aviso na tela.
2. Encontre na vitrine uma roupa infantil perto de você e reserve.
3. Combine a retirada pelo chat e conclua a entrega com o código.
4. Publique um item para doação com foto.
5. Aceite o pedido de reserva do seu carrinho de bebê e confirme a entrega (o código aparece como dica na tela).
6. Adicione um pedido na sua lista de necessidades e depois remova.
7. Peça ajuda de um voluntário para buscar a geladeira.

## O que mudou em relação ao protótipo de baixa fidelidade (Parte 2)

| # | Melhoria | Por quê |
|---|---|---|
| 1 | As telas agora formam **um fluxo único com dados compartilhados**. Reservar um item muda o status dele na vitrine, na sacola e no chat. | Na Parte 2 cada tela guardava o próprio estado e não conversava com as outras. |
| 2 | **Os outros usuários são simulados**: o doador responde no chat, a recebedora pede para reservar suas doações e o voluntário aceita o transporte. | Permite que uma pessoa sozinha teste os dois lados da doação. |
| 3 | **Lado do doador completo**: aceitar ou recusar um pedido de reserva e confirmar a entrega digitando o código. | Antes só existia a tela do código. |
| 4 | **Busca funcionando** (ignora acentos), corredores, filtro "Só o que combina" e **distância ajustável de 1 a 10 km**. | RF04. Na Parte 2 a busca e os filtros eram só visuais. |
| 5 | **Correspondência automática real** e central de **notificações** com contador. | RF05. |
| 6 | **Foto de verdade** (câmera ou galeria), reduzida automaticamente para no máximo 900 px. | RF02 e RNF02 (imagens leves). |
| 7 | **Validação de formulários** com a mensagem ao lado do campo e máscara de celular. | Prevenção e recuperação de erros (heurísticas 5 e 9 de Nielsen). |
| 8 | **Confirmação antes de ações que apagam algo** e botão **Desfazer** depois delas (reserva, pedido, publicação, transporte, anúncio). | Controle e liberdade do usuário (heurística 3). |
| 9 | **Denúncia com motivos** no anúncio, na conversa, no comprovante e no perfil, com prazo de resposta de 48 horas. | RF07 e RNF07. Antes era só um link. |
| 10 | Opções **Economizar internet** (não carrega fotos) e **Texto maior**. | RNF02 e RNF05, pensando em plano pré-pago e baixo letramento digital. |
| 11 | **Modo visitante** ("Só quero olhar a vitrine") e tela inicial que explica a loja solidária em 3 passos. | Reduz a barreira de entrada para quem tem receio de se cadastrar. |
| 12 | **Perfil** com estatísticas, troca de papel (doar, receber ou os dois) e explicação de privacidade. | RF01, RF08 e RNF04. |
| 13 | **Acessibilidade revisada**: navegação por teclado, foco controlado entre telas, janelas que prendem o foco, avisos lidos por leitor de tela, áreas de toque de 48 px ou mais. Verificado com axe-core (WCAG 2.1 A e AA) sem violações. | RNF05. |
| 14 | **Funciona em qualquer tela**: celular em tela cheia e computador com moldura e roteiro de teste. | Exigência da Parte 3 (independente de plataforma). |

## Requisitos atendidos

| Requisito | Onde aparece |
|---|---|
| RF01 Cadastro simplificado com verificação | Criar conta → código por SMS (simulado) |
| RF02 Publicação de item | Aba Doar |
| RF03 Pedido de necessidade privado | Aba Minha lista |
| RF04 Busca e filtro por proximidade | Vitrine (busca, corredores, distância) |
| RF05 Correspondência automática e notificação | Selo "Combina com sua lista", alerta na vitrine, sino de notificações |
| RF06 Reserva, chat interno e código de entrega | Item → reservar → conversa → código |
| RF07 Avaliação, reputação e denúncia | Estrelas no comprovante, reputação nos perfis, botão de bandeira |
| RF08 Histórico e prestação de contas | Aba Sacola (Recebendo e Doando), comprovante e agradecimento |
| RF09 Apoio logístico por voluntário | Conversa → Preciso de ajuda com o transporte |
| RNF01 Usabilidade | Linguagem do dia a dia, ícones sempre com texto, publicar em menos de 1 minuto |
| RNF02 Desempenho e dados | Sem bibliotecas externas, ilustrações em SVG, fotos comprimidas, modo econômico |
| RNF03 Compatibilidade | Web responsiva, roda em qualquer navegador moderno |
| RNF04 Privacidade | Só bairro e primeiro nome aparecem; lista privada; chat sem telefone |
| RNF05 Acessibilidade | Contraste AA, toque de 48 px, leitor de tela, texto maior |

## Estrutura dos arquivos

```
elo-solidario/
├── index.html          página única do app
├── css/estilo.css      cores, tipografia e componentes
├── js/icones.js        ícones em SVG
├── js/dados.js         categorias, pessoas fictícias e itens de exemplo
├── js/estado.js        dados salvos no navegador (localStorage) e regras de correspondência
├── js/telas.js         HTML de cada tela
├── js/app.js           navegação, ações, avisos e simulação dos outros usuários
└── assets/             ícone e ilustrações dos itens
```

## Como publicar no GitHub Pages (para gerar o link)

1. Entre em [github.com](https://github.com) (a conta é gratuita).
2. Clique em **New repository**, dê o nome `elo-solidario`, deixe como **Public** e clique em **Create repository**.
3. Na página do repositório, clique em **uploading an existing file** e arraste **o conteúdo** desta pasta (`index.html`, `README.md` e as pastas `css`, `js` e `assets`). Clique em **Commit changes**.
4. Vá em **Settings → Pages**. Em **Source**, escolha **Deploy from a branch**, depois a branch **main** e a pasta **/(root)**. Clique em **Save**.
5. Depois de 1 ou 2 minutos, o link aparece no topo dessa página, no formato `https://SEU-USUARIO.github.io/elo-solidario/`.

## Limitações (é um protótipo)

- Não há servidor nem banco de dados: cada navegador tem seus próprios dados.
- SMS, localização e as outras pessoas são simulados.
- As fotos dos itens de exemplo são ilustrações.
