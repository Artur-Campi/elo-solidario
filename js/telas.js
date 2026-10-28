/* Telas do Elo Solidário. Cada função devolve o HTML da tela e qual aba da navegação fica marcada. */
window.Telas = (function () {
  var E = Estado, I = Icone;

  function esc(t) {
    return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function km(d) { return d === 0 ? 'seu item' : 'a ' + String(d).replace('.', ',') + ' km'; }

  function foto(it, tam) {
    var cat = E.categoria(it.cat);
    var mostrar = it.img && !E.get().prefs.economia;
    return '<div class="foto"' + (tam ? ' style="' + tam + '"' : '') + '>' +
      (mostrar ? '<img src="' + esc(it.img) + '" alt="Foto: ' + esc(it.titulo) + '" loading="lazy">'
               : I(cat.icone, 40) + '<small>' + (it.img ? 'Foto oculta (economia de dados)' : 'Sem foto') + '</small>') +
      '</div>';
  }

  function topo(titulo, opts) {
    opts = opts || {};
    return '<header class="topo">' +
      (opts.voltar ? '<a class="icone-btn" href="' + opts.voltar + '" aria-label="Voltar">' + I('voltar') + '</a>' : '<span style="width:12px"></span>') +
      '<div class="topo-titulo"><h1 tabindex="-1">' + titulo + '</h1>' + (opts.sub ? '<span>' + opts.sub + '</span>' : '') + '</div>' +
      (opts.direita || '') + '</header>';
  }

  function estrelasTexto(p) {
    return '<span style="color:var(--estrela)">' + I('estrela', 15) + '</span> ' + String(p.nota.toFixed(1)).replace('.', ',');
  }

  function cartaoPessoa(id, papelTexto) {
    var p = E.pessoa(id);
    return '<div class="pessoa"><span class="avatar' + (p.voluntario ? ' azul' : '') + '" aria-hidden="true">' + p.inicial + '</span>' +
      '<div class="pessoa-info"><span class="pessoa-nome">' + esc(p.nome) +
      ' <span style="color:var(--verde)">' + I('escudo', 18, 'Celular verificado') + '</span></span>' +
      '<span class="pessoa-sub">' + (papelTexto ? papelTexto + ' · ' : '') + estrelasTexto(p) + ' · ' +
      (p.voluntario ? p.voluntario : (p.doacoes + (p.doacoes === 1 ? ' doação' : ' doações'))) + '</span>' +
      '<span class="pessoa-sub">' + esc(p.bairro) + ' · no Elo desde ' + p.desde + '</span></div></div>';
  }

  var STATUS_RES = {
    solicitada: ['Aguardando resposta', 'et-ambar'],
    confirmada: ['Reservado', 'et-ambar'],
    concluida: ['Entregue', 'et-verde'],
    cancelada: ['Cancelada', 'et-neutro'],
    recusada: ['Recusada', 'et-neutro']
  };
  function etiquetaRes(r) {
    var st = STATUS_RES[r.status];
    if (r.status === 'solicitada' && r.papel === 'doador') st = ['Pedido novo', 'et-vermelho'];
    return '<span class="etiqueta ' + st[1] + '">' + st[0] + '</span>';
  }

  /* ---------------------------------------------------------------- Início */
  function inicio() {
    return { nav: null, html:
      '<div class="capa"><div class="capa-marca">' +
      '<svg width="46" height="31" viewBox="0 0 48 32" fill="none" stroke="currentColor" stroke-width="3.5" aria-hidden="true"><rect x="3" y="6" width="26" height="20" rx="10"/><rect x="19" y="6" width="26" height="20" rx="10"/></svg>' +
      '<h1 tabindex="-1" style="font:inherit">Elo Solidário</h1></div>' +
      '<p>Doe e receba itens básicos perto de você, sem expor seus dados.</p></div>' +
      '<div class="intro">' +
      '<div class="intro-passo"><span class="intro-num">' + I('loja') + '</span><div><strong>Uma loja onde nada tem preço</strong><span>Na vitrine estão roupas, alimentos, móveis e outros itens doados por pessoas do seu bairro.</span></div></div>' +
      '<div class="intro-passo"><span class="intro-num">' + I('coracao') + '</span><div><strong>Anote do que você precisa</strong><span>Sua lista é privada. Avisamos você quando aparecer algo que combina.</span></div></div>' +
      '<div class="intro-passo"><span class="intro-num">' + I('cadeado') + '</span><div><strong>Combine sem expor ninguém</strong><span>A conversa é pelo app, sem trocar telefone. A entrega é confirmada com um código.</span></div></div>' +
      '<div style="margin-top:auto;display:flex;flex-direction:column;gap:8px">' +
      '<a class="btn btn-primario btn-largo" href="#/cadastro">Criar minha conta</a>' +
      '<button type="button" class="btn btn-contorno btn-largo" data-acao="visitante">Só quero olhar a vitrine</button>' +
      '</div></div>' };
  }

  /* ---------------------------------------------------------------- Cadastro (RF01) */
  function cadastro(ctx) {
    var r = ctx.rascunho || {};
    var papel = r.papel || 'ambos';
    function op(id, t, d) {
      return '<button type="button" class="opcao-grande" role="radio" aria-checked="' + (papel === id) + '" data-acao="escolher" data-valor="' + id + '">' +
        '<span class="bolinha"></span><span><strong>' + t + '</strong><small>' + d + '</small></span></button>';
    }
    var erro = ctx.erros || {};
    function campo(id, rot, tipo, ph, extra, ajuda) {
      return '<div class="campo"><label for="' + id + '">' + rot + '</label>' +
        '<input class="entrada" id="' + id + '" name="' + id + '" type="' + tipo + '" placeholder="' + ph + '" value="' + esc(r[id] || '') + '"' +
        (erro[id] ? ' aria-invalid="true" aria-describedby="' + id + '-erro"' : '') + ' ' + (extra || '') + '>' +
        (erro[id] ? '<span class="erro" id="' + id + '-erro">' + erro[id] + '</span>' : '') +
        (ajuda ? '<span class="ajuda">' + ajuda + '</span>' : '') + '</div>';
    }
    return { nav: null, html:
      topo('Criar sua conta', { voltar: '#/inicio', sub: 'Leva menos de 1 minuto' }) +
      '<form class="conteudo" data-form="cadastro" novalidate>' +
      campo('nome', 'Primeiro nome', 'text', 'Ex.: Rosângela', 'autocomplete="given-name"') +
      campo('celular', 'Celular', 'tel', '(11) 90000-0000', 'inputmode="numeric" autocomplete="tel" data-mascara="tel"', 'Enviamos um código por SMS. Ninguém vê seu número.') +
      '<div class="campo"><label for="bairro">Seu bairro</label><div class="linha-entrada">' +
      '<input class="entrada" id="bairro" name="bairro" type="text" placeholder="Ex.: Brasilândia" value="' + esc(r.bairro || '') + '"' + (erro.bairro ? ' aria-invalid="true" aria-describedby="bairro-erro"' : '') + '>' +
      '<button type="button" class="icone-btn borda" data-acao="localizacao" aria-label="Usar minha localização">' + I('pin') + '</button></div>' +
      (erro.bairro ? '<span class="erro" id="bairro-erro">' + erro.bairro + '</span>' : '') +
      '<span class="ajuda">Só o bairro aparece para os outros. Nunca a rua ou o número.</span></div>' +
      '<fieldset><legend class="legenda">Como você quer usar?</legend><div role="radiogroup" data-grupo="papel" data-valor="' + papel + '" style="display:flex;flex-direction:column;gap:8px">' +
      op('receber', 'Preciso receber', 'Busco itens para minha família') +
      op('doar', 'Quero doar', 'Tenho itens que não uso mais') +
      op('ambos', 'Os dois', 'Doar e receber') +
      '</div><span class="ajuda" style="display:block;margin-top:8px">Dá para mudar depois no seu perfil.</span></fieldset>' +
      '<div class="aviso aviso-verde">' + I('escudo') + '<span>Não pedimos documento nem comprovante de renda.</span></div>' +
      '<button type="submit" class="btn btn-primario btn-largo">Receber código por SMS</button>' +
      '<a class="link-btn forte centro" href="#/vitrine" data-acao="visitante">Agora não, só quero olhar</a>' +
      '</form>' };
  }

  function codigo(ctx) {
    var r = ctx.rascunho || {};
    var cel = (r.celular || '').replace(/\D/g, '');
    return { nav: null, html:
      topo('Digite o código', { voltar: '#/cadastro', sub: 'Enviado para o celular final ' + esc(cel.slice(-4)) }) +
      '<form class="conteudo" data-form="codigo" novalidate>' +
      '<p style="font-size:1.0625rem;line-height:1.4;color:var(--tinta-2)">Enviamos 4 números por SMS. Digite abaixo para entrar.</p>' +
      '<div class="campo"><label for="sms">Código</label>' +
      '<input class="entrada codigo-entrada" id="sms" name="sms" type="text" inputmode="numeric" maxlength="4" autocomplete="one-time-code" placeholder="0000"' +
      (ctx.erro ? ' aria-invalid="true" aria-describedby="sms-erro"' : '') + '>' +
      (ctx.erro ? '<span class="erro" id="sms-erro">' + ctx.erro + '</span>' : '') + '</div>' +
      '<button type="submit" class="btn btn-primario btn-largo">Entrar no Elo</button>' +
      '<button type="button" class="link-btn forte centro" data-acao="reenviar-sms">Não recebi, enviar de novo</button>' +
      '</form>' };
  }

  /* ---------------------------------------------------------------- Vitrine (RF04, RF05) */
  function itensFiltrados(f) {
    var s = E.get();
    var q = (f.q || '').trim().toLowerCase();
    return s.itens.filter(function (it) {
      if (it.dono === 'eu' || it.status !== 'disponivel') return false;
      if (!E.dentroDoRaio(it)) return false;
      if (f.cat && f.cat !== 'todos' && it.cat !== f.cat) return false;
      if (f.combina && !E.combina(it)) return false;
      if (q) {
        var alvo = (it.titulo + ' ' + it.desc + ' ' + E.categoria(it.cat).nome + ' ' + it.tamanho).toLowerCase();
        if (alvo.normalize) { alvo = alvo.normalize('NFD').replace(/[̀-ͯ]/g, ''); q = q.normalize('NFD').replace(/[̀-ͯ]/g, ''); }
        if (alvo.indexOf(q) < 0) return false;
      }
      return true;
    }).sort(function (a, b) { return (E.combina(b) - E.combina(a)) || (a.dist - b.dist); });
  }

  function cardItem(it) {
    var selos = '';
    if (E.combina(it)) selos += '<span class="etiqueta et-vermelho">' + I('coracaoCheio', 14) + 'Combina com sua lista</span>';
    if (it.grande) selos += '<span class="etiqueta et-azul flutuante">' + I('caminhao', 14) + 'Item grande</span>';
    return '<a class="card-item" href="#/item/' + it.id + '">' +
      '<div style="position:relative">' + foto(it, 'height:150px') + (selos ? '<div class="selos">' + selos + '</div>' : '') + '</div>' +
      '<div class="card-corpo"><strong>' + esc(it.titulo) + '</strong>' +
      '<span class="desc">' + esc(it.estado) + (it.tamanho ? ' · ' + esc(it.tamanho) : '') + '</span>' +
      '<div class="meta"><span>' + I('pin', 16) + km(it.dist) + '</span><span>' + I('relogio', 16) + esc(it.horarios.join(' ou ')) + '</span></div>' +
      '</div></a>';
  }

  function listaVitrine(f) {
    var lista = itensFiltrados(f);
    if (!lista.length) {
      var s = E.get();
      return '<div class="vazio">' + I('busca', 40) + '<strong>Nada encontrado por aqui</strong>' +
        '<span>Tente outra palavra, outro corredor ou aumente a distância (hoje: até ' + (s.usuario ? s.usuario.raio : 5) + ' km).</span>' +
        '<button type="button" class="btn btn-contorno btn-pequeno" data-acao="limpar-filtros">Limpar filtros</button></div>';
    }
    return lista.map(cardItem).join('');
  }

  function vitrine(ctx) {
    var s = E.get(), f = ctx.filtros, u = s.usuario;
    var nComb = s.itens.filter(function (it) { return E.combina(it) && E.dentroDoRaio(it); }).length;
    var chips = [{ id: 'todos', curto: 'Todos' }].concat(Dados.CATEGORIAS).map(function (c) {
      return '<button type="button" class="chip" aria-pressed="' + ((f.cat || 'todos') === c.id) + '" data-acao="corredor" data-valor="' + c.id + '">' + c.curto + '</button>';
    }).join('');
    var doar = '<a class="atalho ' + (u && u.papel === 'receber' ? 'vazado' : 'cheio') + '" href="#/doar">' + I('camera', 30) + '<span><strong>Quero doar</strong><small>Foto e pronto</small></span></a>';
    var pedir = '<a class="atalho ' + (u && u.papel === 'receber' ? 'cheio' : 'vazado') + '" href="#/lista">' +
      '<span style="color:' + (u && u.papel === 'receber' ? '#fff' : 'var(--vermelho)') + '">' + I('coracao', 30) + '</span><span><strong>Do que preciso</strong><small>Pedido privado</small></span></a>';
    var n = E.naoLidas();
    return { nav: 'vitrine', html:
      '<header class="topo-vitrine"><div class="saudacao"><div>' +
      '<h1 tabindex="-1">Olá' + (u ? ', ' + esc(u.nome) : '') + '</h1>' +
      '<button type="button" class="saudacao-local" data-acao="abrir-raio">' + I('pin', 18) + '<span>' + (u ? esc(u.bairro) + ' · ' : '') + 'até ' + (u ? u.raio : 5) + ' km</span></button></div>' +
      '<a class="icone-btn borda" href="#/notificacoes" aria-label="Notificações' + (n ? ', ' + n + ' novas' : '') + '">' + I('sino') + (n ? '<span class="selo-num">' + n + '</span>' : '') + '</a></div>' +
      '<form class="busca" role="search" data-form="busca">' + I('busca', 22) +
      '<label for="busca" class="sr">Buscar itens</label>' +
      '<input id="busca" type="search" placeholder="Buscar: roupa, geladeira, cama..." value="' + esc(f.q || '') + '" data-entrada="busca" autocomplete="off">' +
      (f.q ? '<button type="button" class="icone-btn" data-acao="limpar-busca" aria-label="Limpar busca">' + I('fechar', 20) + '</button>' : '') +
      '</form></header>' +
      '<main class="conteudo">' +
      (nComb && !f.combina ? '<a class="alerta-combina" href="#/vitrine" data-acao="so-combina"><span class="bola">' + I('coracao', 22) + '</span><span><strong>' +
        (nComb === 1 ? '1 item perto de você combina' : nComb + ' itens perto de você combinam') + ' com o que você pediu</strong><span>Ver agora</span></span></a>' : '') +
      '<div class="atalhos">' + (u && u.papel === 'receber' ? pedir + doar : doar + pedir) + '</div>' +
      '<section class="secao" aria-label="Corredores"><h2 class="secao-titulo">Corredores</h2><div class="chips rolagem">' + chips + '</div></section>' +
      '<section class="secao" aria-labelledby="perto"><div class="filtros-linha"><h2 class="secao-titulo" id="perto">Perto de você</h2>' +
      '<button type="button" class="chip" style="min-height:44px;font-size:.9rem" aria-pressed="' + !!f.combina + '" data-acao="alternar-combina">' + I('coracao', 16) + 'Só o que combina</button></div>' +
      '<div class="lista-itens" id="lista-itens" aria-live="polite">' + listaVitrine(f) + '</div></section>' +
      '</main>' };
  }

  /* ---------------------------------------------------------------- Detalhe do item */
  function item(ctx) {
    var it = E.item(ctx.id);
    if (!it || it.status === 'removido') return naoEncontrado();
    var s = E.get(), cat = E.categoria(it.cat);
    var meu = it.dono === 'eu';
    var resAtiva = E.reservaAtivaDoItem(it.id);
    var minhaRes = s.reservas.find(function (r) { return r.item === it.id && r.papel === 'recebedor' && (r.status === 'confirmada' || r.status === 'solicitada'); });
    var horarios = it.horarios.map(function (h) {
      return '<button type="button" class="horario" role="radio" aria-checked="' + (ctx.horario === h) + '" data-acao="escolher-horario" data-valor="' + esc(h) + '">' +
        I('relogio', 22) + '<span>' + esc(h) + '</span><span class="marca">' + I('check', 22) + '</span></button>';
    }).join('');
    var rodape;
    if (meu) rodape = '<div class="aviso aviso-neutro">' + I('info') + '<span>Este item é seu. Acompanhe pela sua sacola.</span></div><a class="btn btn-contorno btn-largo" href="#/sacola?aba=doando">Ver minhas doações</a>';
    else if (minhaRes) rodape = '<a class="btn btn-primario btn-largo" href="#/reserva/' + minhaRes.id + '">' + I('chat') + 'Você reservou. Abrir conversa</a>';
    else if (resAtiva || it.status !== 'disponivel') rodape = '<button class="btn btn-largo" disabled>Já reservado por outra pessoa</button>';
    else rodape = '<button type="button" class="btn btn-primario btn-largo" data-acao="reservar" data-id="' + it.id + '"' + (ctx.horario ? '' : ' aria-disabled="true"') + ' id="btn-reservar">' +
      I('sacola') + '<span>' + (ctx.horario ? 'Tenho interesse: reservar' : 'Escolha um horário acima') + '</span></button>';
    return { nav: 'vitrine', html:
      '<main class="conteudo sem-padding">' +
      '<div class="item-foto" style="position:relative">' + foto(it, 'height:260px') +
      '<a class="icone-btn flutuante flutua-esq" href="#/vitrine" aria-label="Voltar para a vitrine">' + I('voltar') + '</a>' +
      (meu ? '' : '<button type="button" class="icone-btn flutuante flutua-dir" data-acao="denunciar" data-alvo="anúncio" aria-label="Denunciar este anúncio">' + I('bandeira', 20) + '</button>') +
      '<div class="flutua-baixo">' + (E.combina(it) ? '<span class="etiqueta et-vermelho">' + I('coracaoCheio', 14) + 'Combina com sua lista</span>' : '') + '</div></div>' +
      '<div class="item-corpo">' +
      '<div style="display:flex;flex-direction:column;gap:10px"><h1 class="item-titulo" tabindex="-1">' + esc(it.titulo) + '</h1>' +
      '<div class="chips" style="gap:6px"><span class="etiqueta et-verde">' + esc(it.estado === 'Novo' ? 'Novo' : it.estado + ' estado') + '</span>' +
      (it.tamanho ? '<span class="etiqueta et-contorno">Tamanho: ' + esc(it.tamanho) + '</span>' : '') +
      '<span class="etiqueta et-contorno">' + cat.nome + '</span></div>' +
      (it.desc ? '<p style="font-size:1.0625rem;line-height:1.45;color:var(--tinta-2)">' + esc(it.desc) + '</p>' : '') +
      '<div class="meta" style="font-size:1rem"><span>' + I('pin', 18) + (meu ? 'Retirada no seu bairro' : km(it.dist) + ' de você · local aproximado') + '</span><span>' + I('relogio', 18) + 'Publicado ' + esc(it.quando) + '</span></div></div>' +
      (it.grande ? '<div class="aviso aviso-azul">' + I('caminhao') + '<span><strong>Item grande.</strong> Depois de reservar, você pode pedir ajuda a um voluntário com carro.</span></div>' : '') +
      (meu ? '' : '<fieldset><legend class="legenda">Quando você pode buscar?</legend><div role="radiogroup" style="display:flex;flex-direction:column;gap:8px">' + horarios + '</div></fieldset>' +
        '<div class="cartao">' + cartaoPessoa(it.dono, 'Doador(a)') +
        '<div class="aviso aviso-neutro" style="padding:10px 12px">' + I('cadeado', 20) + '<span style="font-size:.95rem">O ponto de encontro é combinado pelo chat. Ninguém vê seu telefone.</span></div></div>' +
        '<button type="button" class="link-btn" data-acao="denunciar" data-alvo="anúncio">' + I('bandeira', 18) + 'Denunciar este anúncio</button>') +
      '</div></main>' +
      '<div class="rodape-acao">' + rodape + '</div>' };
  }

  /* ---------------------------------------------------------------- Reserva e chat (RF06) */
  function reserva(ctx) {
    var r = E.reserva(ctx.id);
    if (!r) return naoEncontrado();
    var it = E.item(r.item), outro = E.pessoa(r.outro), ativa = r.status === 'solicitada' || r.status === 'confirmada';
    var msgs = r.msgs.map(function (m) {
      if (m.de === 'sistema') return '<div class="msg-sistema">' + I('info', 16) + '<span>' + esc(m.txt) + '</span></div>';
      if (m.de === 'eu') return '<div class="msg minha">' + esc(m.txt) + '</div>';
      var autor = m.de === 'outro' ? outro.nome : E.pessoa(m.de).nome;
      return '<div class="msg outra"><span class="autor">' + esc(autor) + '</span>' + esc(m.txt) + '</div>';
    }).join('');
    var extra = '';
    if (r.papel === 'doador' && r.status === 'solicitada') {
      extra = '<div class="pedido-reserva"><strong style="font-size:1.0625rem">' + esc(outro.nome) + ' quer buscar: ' + esc(r.horario) + '</strong>' +
        cartaoPessoa(r.outro, 'Recebedor(a)') +
        '<div class="grade-2"><button type="button" class="btn btn-contorno" data-acao="recusar" data-id="' + r.id + '">Recusar</button>' +
        '<button type="button" class="btn btn-primario" data-acao="aceitar" data-id="' + r.id + '">Aceitar</button></div></div>';
    } else if (r.papel === 'doador' && r.status === 'confirmada') {
      extra = '<div class="cartao-codigo"><strong>Na hora da entrega</strong><span style="color:var(--tinta-2)">Peça a ' + esc(outro.nome) + ' o código de 4 números e confirme aqui.</span>' +
        '<a class="btn btn-primario btn-largo" href="#/entrega/' + r.id + '">' + I('check') + 'Confirmar entrega com o código</a></div>';
    } else if (r.papel === 'recebedor' && r.status === 'confirmada') {
      extra = '<div class="cartao-codigo"><span style="color:var(--cinza)">Seu código de entrega</span><span class="numero" aria-label="' + r.codigo.split('').join(' ') + '">' + r.codigo + '</span>' +
        '<span style="color:var(--tinta-2)">Mostre este número para ' + esc(outro.nome) + ' quando pegar o item.</span>' +
        '<button type="button" class="btn btn-primario btn-largo" data-acao="cheguei" data-id="' + r.id + '">Estou com o item. Mostrar código</button></div>' +
        (r.transporte ? '' : '<a class="btn btn-contorno btn-largo" style="color:var(--azul)" href="#/transporte/' + r.id + '">' + I('caminhao') + 'Preciso de ajuda com o transporte</a>');
    } else if (r.status === 'concluida') {
      extra = '<a class="btn btn-contorno btn-largo" href="#/concluida/' + r.id + '">' + I('check') + 'Ver comprovante de entrega</a>';
    }
    var digitando = ctx.digitando ? '<div class="digitando">' + esc(ctx.digitando) + ' está digitando...</div>' : '';
    var rapidas = r.papel === 'recebedor' ? ['Combinado!', 'Estou a caminho', 'Posso ir outro dia?', 'Qual o ponto de referência?'] : ['Combinado!', 'Te espero lá', 'Pode ser outro horário?'];
    return { nav: 'sacola', html:
      '<header class="topo"><a class="icone-btn" href="#/sacola?aba=' + (r.papel === 'doador' ? 'doando' : 'recebendo') + '" aria-label="Voltar">' + I('voltar') + '</a>' +
      '<span class="avatar" aria-hidden="true">' + outro.inicial + '</span>' +
      '<div class="topo-titulo"><h1 tabindex="-1" style="font-size:1.15rem">' + esc(outro.nome) + '</h1><span>' + (r.papel === 'doador' ? 'Recebedor(a)' : 'Doador(a)') + ' · ' + String(outro.nota.toFixed(1)).replace('.', ',') + ' estrelas</span></div>' +
      '<button type="button" class="icone-btn borda" data-acao="denunciar" data-alvo="conversa" aria-label="Denunciar conversa">' + I('bandeira', 20) + '</button></header>' +
      '<a class="resumo-reserva" href="#/item/' + it.id + '">' + foto(it) + '<div style="flex:1;min-width:0"><strong>' + esc(it.titulo) + '</strong><span>' + esc(r.horario) + (it.dono === 'eu' ? '' : ' · ' + km(it.dist)) + '</span></div>' + etiquetaRes(r) + '</a>' +
      (r.status === 'confirmada' ? '<button type="button" class="link-btn" style="align-self:flex-end;margin-right:14px;flex-shrink:0" data-acao="cancelar-reserva" data-id="' + r.id + '">Cancelar reserva</button>' : '') +
      '<div class="mensagens" id="mensagens" aria-live="polite">' + msgs + digitando + extra + '</div>' +
      (ativa ? '<div class="compositor"><div class="rapidas">' + rapidas.map(function (t) { return '<button type="button" class="rapida" data-acao="msg-rapida" data-id="' + r.id + '" data-valor="' + esc(t) + '">' + esc(t) + '</button>'; }).join('') + '</div>' +
        '<form data-form="mensagem" data-id="' + r.id + '"><label for="msg" class="sr">Mensagem</label><input class="entrada" id="msg" name="msg" placeholder="Escreva uma mensagem" autocomplete="off" value="' + esc(ctx.rascunhoMsg || '') + '">' +
        '<button type="submit" class="enviar" aria-label="Enviar">' + I('enviar', 22) + '</button></form></div>'
        : '<div class="rodape-acao"><span style="text-align:center;color:var(--cinza)">Esta conversa foi encerrada.</span></div>') };
  }

  /* ---------------------------------------------------------------- Confirmar entrega (doador) */
  function entrega(ctx) {
    var r = E.reserva(ctx.id);
    if (!r) return naoEncontrado();
    var it = E.item(r.item), outro = E.pessoa(r.outro), cod = ctx.codigo || '';
    var caixas = [0, 1, 2, 3].map(function (i) {
      var d = cod.charAt(i);
      return '<span class="caixa-codigo' + (d ? ' cheia' : (i === cod.length ? ' atual' : '')) + '">' + d + '</span>';
    }).join('');
    var teclas = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'apagar', '0', 'ok'].map(function (k) {
      if (k === 'apagar') return '<button type="button" class="tecla" data-acao="tecla" data-valor="apagar" aria-label="Apagar">' + I('apagar', 28) + '</button>';
      if (k === 'ok') return '<button type="button" class="tecla ok" data-acao="tecla" data-valor="ok"' + (cod.length === 4 ? '' : ' disabled') + '>Confirmar</button>';
      return '<button type="button" class="tecla" data-acao="tecla" data-valor="' + k + '">' + k + '</button>';
    }).join('');
    return { nav: 'sacola', html:
      topo('Confirmar entrega', { voltar: '#/reserva/' + r.id, sub: 'Comprovante de entrega' }) +
      '<main class="conteudo">' +
      '<div class="resumo-reserva" style="margin:0">' + foto(it) + '<div><strong>' + esc(it.titulo) + '</strong><span>Para ' + esc(outro.nome) + ' · ' + esc(r.horario) + '</span></div></div>' +
      '<p style="font-size:1.125rem;line-height:1.4;text-align:center">Peça o código de 4 números para ' + esc(outro.nome) + ' e digite aqui.</p>' +
      '<div class="caixas-codigo' + (ctx.erro ? ' erro' : '') + '" role="group" aria-label="Código digitado: ' + (cod.split('').join(' ') || 'vazio') + '">' + caixas + '</div>' +
      (ctx.erro ? '<p role="alert" style="text-align:center;font-weight:700;color:#A0101F">Código não confere. Confira com ' + esc(outro.nome) + '.</p>'
                : '<p style="text-align:center;font-size:.9rem;color:var(--cinza)">Dica para o teste: o código de ' + esc(outro.nome) + ' é ' + r.codigo + '.</p>') +
      '<div class="teclado" style="margin-top:auto">' + teclas + '</div></main>' };
  }

  /* ---------------------------------------------------------------- Doação concluída (RF07, RF08) */
  function concluida(ctx) {
    var r = E.reserva(ctx.id);
    if (!r) return naoEncontrado();
    var it = E.item(r.item), outro = E.pessoa(r.outro), doador = r.papel === 'doador';
    var nota = ctx.nota != null ? ctx.nota : r.avaliacao;
    var palavras = ['Toque nas estrelas para avaliar', 'Ruim', 'Regular', 'Boa', 'Muito boa', 'Excelente'];
    var estrelas = [1, 2, 3, 4, 5].map(function (n) {
      return '<button type="button" class="estrela" aria-pressed="' + (nota >= n) + '" aria-label="' + n + (n === 1 ? ' estrela' : ' estrelas') + '" data-acao="estrela" data-valor="' + n + '">' + I('estrela', 38) + '</button>';
    }).join('');
    var agradecimento = '';
    if (doador) {
      agradecimento = r.agradecimento
        ? '<div class="aviso aviso-vermelho" style="flex-direction:column;gap:6px"><strong style="color:var(--vermelho-escuro);display:flex;gap:6px;align-items:center">' + I('coracaoCheio', 18) + 'Mensagem de agradecimento</strong><span style="font-size:1.0625rem">"' + esc(r.agradecimento) + '"</span><small style="color:var(--cinza)">' + esc(outro.nome) + '</small></div>'
        : '<div class="digitando" style="align-self:center">' + esc(outro.nome) + ' está escrevendo um agradecimento...</div>';
    } else if (r.agradecimento) {
      agradecimento = '<div class="aviso aviso-verde">' + I('check') + '<span>Seu agradecimento foi enviado para ' + esc(outro.nome) + '.</span></div>';
    } else {
      agradecimento = '<form class="campo" data-form="agradecer" data-id="' + r.id + '"><label for="obrigado">Quer mandar um agradecimento? (opcional)</label>' +
        '<textarea class="entrada" id="obrigado" name="obrigado" placeholder="Ex.: A roupa serviu certinho. Muito obrigada!"></textarea>' +
        '<button type="submit" class="btn btn-contorno-vermelho btn-largo">' + I('coracao') + 'Enviar agradecimento</button></form>';
    }
    return { nav: 'sacola', html:
      topo('Comprovante de entrega', { voltar: '#/sacola?aba=' + (doador ? 'doando' : 'recebendo') }) +
      '<main class="conteudo">' +
      '<div class="sucesso"><span class="sucesso-bola">' + I('check', 46) + '</span><h2>' + (doador ? 'Doação concluída' : 'Item recebido') + '</h2>' +
      '<p>' + (doador ? esc(it.titulo) + ' chegou até ' + esc(outro.nome) + '. Fica registrado no seu histórico.' : 'Você recebeu ' + esc(it.titulo).toLowerCase() + ' de ' + esc(outro.nome) + '.') + '</p></div>' +
      '<div class="cartao" style="gap:6px"><div class="meta"><span>' + I('check', 16) + 'Código confirmado: ' + r.codigo + '</span><span>' + I('relogio', 16) + esc(r.horario) + '</span></div></div>' +
      agradecimento +
      '<fieldset style="display:flex;flex-direction:column;align-items:center;gap:6px"><legend class="legenda" style="text-align:center;width:100%">Como foi com ' + esc(outro.nome) + '?</legend>' +
      '<div class="estrelas">' + estrelas + '</div><span style="color:var(--cinza)">' + palavras[nota] + (r.avaliacao ? ' · avaliação salva' : '') + '</span></fieldset>' +
      '<a class="btn btn-primario btn-largo" href="#/sacola?aba=' + (doador ? 'doando' : 'recebendo') + '">Ver meu histórico</a>' +
      '<button type="button" class="link-btn centro" data-acao="denunciar" data-alvo="entrega">' + I('bandeira', 18) + 'Algo deu errado? Denunciar</button>' +
      '</main>' };
  }

  /* ---------------------------------------------------------------- Quero doar (RF02) */
  function doar(ctx) {
    var d = ctx.rascunho || {};
    var erro = ctx.erros || {};
    var cats = Dados.CATEGORIAS.map(function (c) {
      return '<button type="button" class="opcao" role="radio" aria-checked="' + (d.cat === c.id) + '" data-acao="escolher" data-valor="' + c.id + '">' + c.nome + '</button>';
    }).join('');
    var estados = ['Novo', 'Bom', 'Usado'].map(function (e) {
      return '<button type="button" class="opcao" role="radio" aria-checked="' + (d.estado === e) + '" data-acao="escolher" data-valor="' + e + '">' + e + '</button>';
    }).join('');
    var hs = d.horarios || [];
    var horarios = Dados.HORARIOS.map(function (h) {
      return '<button type="button" class="chip" aria-pressed="' + (hs.indexOf(h) >= 0) + '" data-acao="alternar" data-valor="' + h + '">' + h + '</button>';
    }).join('');
    var u = E.get().usuario;
    var fotoBloco = d.img
      ? '<div class="foto" style="height:180px;border-radius:18px"><img src="' + esc(d.img) + '" alt="Foto escolhida"></div>' +
        '<div class="grade-2"><button type="button" class="btn btn-contorno btn-pequeno" data-acao="escolher-foto">' + I('camera', 20) + 'Trocar foto</button>' +
        '<button type="button" class="btn btn-contorno btn-pequeno" data-acao="tirar-foto">' + I('lixo', 20) + 'Tirar foto</button></div>'
      : '<button type="button" data-acao="escolher-foto" class="foto" style="width:100%;height:160px;border-radius:18px;border:2px dashed ' + (erro.img ? '#A0101F' : 'var(--vermelho)') + ';background:var(--branco);color:var(--vermelho);cursor:pointer"' + (erro.img ? ' aria-invalid="true" aria-describedby="img-erro"' : '') + '>' +
        I('camera', 40) + '<strong style="font-size:1.125rem">Tirar ou escolher foto</strong><small style="color:var(--cinza)">Uma foto ajuda quem precisa a reconhecer o item</small></button>' +
        (erro.img ? '<span class="erro" id="img-erro" style="color:#A0101F;font-weight:700">' + erro.img + '</span>' : '') +
        '<button type="button" class="link-btn" data-acao="foto-exemplo">Sem foto agora? Usar uma ilustração (só no protótipo)</button>';
    return { nav: 'doar', html:
      topo('Quero doar', { voltar: '#/vitrine', sub: 'Leva menos de 1 minuto', direita: '<a class="topo-acao" href="#/vitrine">Cancelar</a>' }) +
      '<form class="conteudo" data-form="doar" novalidate>' +
      '<input type="file" id="arquivo" accept="image/*" capture="environment" class="sr" data-entrada="foto" aria-label="Foto do item" tabindex="-1">' +
      '<div style="display:flex;flex-direction:column;gap:8px">' + fotoBloco + '</div>' +
      '<div class="campo"><label for="titulo">O que você está doando?</label>' +
      '<input class="entrada" id="titulo" name="titulo" placeholder="Ex.: Carrinho de bebê reclinável" value="' + esc(d.titulo || '') + '"' + (erro.titulo ? ' aria-invalid="true" aria-describedby="titulo-erro"' : '') + '>' +
      (erro.titulo ? '<span class="erro" id="titulo-erro">' + erro.titulo + '</span>' : '') + '</div>' +
      '<fieldset><legend class="legenda">Corredor (categoria)</legend><div class="grade-2" role="radiogroup" data-grupo="cat" data-valor="' + (d.cat || '') + '">' + cats + '</div>' +
      (erro.cat ? '<span class="erro" style="display:block;margin-top:6px;color:#A0101F;font-weight:700">' + erro.cat + '</span>' : '') + '</fieldset>' +
      '<fieldset><legend class="legenda">Estado de conservação</legend><div class="grade-3" role="radiogroup" data-grupo="estado" data-valor="' + (d.estado || '') + '">' + estados + '</div>' +
      (erro.estado ? '<span class="erro" style="display:block;margin-top:6px;color:#A0101F;font-weight:700">' + erro.estado + '</span>' : '') + '</fieldset>' +
      '<div class="campo"><label for="tamanho">Tamanho <span style="font-weight:400;color:var(--cinza)">(se tiver)</span></label><input class="entrada" id="tamanho" name="tamanho" placeholder="Ex.: 6 anos, 38, casal" value="' + esc(d.tamanho || '') + '"></div>' +
      '<div class="campo"><label for="desc">Algum detalhe? <span style="font-weight:400;color:var(--cinza)">(opcional)</span></label><textarea class="entrada" id="desc" name="desc" placeholder="Ex.: rodinhas em ordem, sem manchas">' + esc(d.desc || '') + '</textarea></div>' +
      '<div class="cartao" style="flex-direction:row;align-items:center;gap:12px"><span style="color:var(--vermelho)">' + I('pin') + '</span>' +
      '<div style="flex:1"><strong>Retirada perto de: ' + esc(u ? u.bairro : 'seu bairro') + '</strong><div style="font-size:.875rem;color:var(--cinza)">Rua e número não aparecem.</div></div>' +
      '<a class="link-btn forte" href="#/perfil">Mudar</a></div>' +
      '<fieldset><legend class="legenda">Quando você pode entregar?</legend><div class="chips" data-grupo="horarios">' + horarios + '</div>' +
      (erro.horarios ? '<span class="erro" style="display:block;margin-top:6px;color:#A0101F;font-weight:700">' + erro.horarios + '</span>' : '') + '</fieldset>' +
      '<button type="button" class="config" role="switch" aria-checked="' + !!d.grande + '" data-acao="alternar-grande" style="border:1.5px solid var(--azul-borda);border-radius:14px;background:var(--azul-claro);color:var(--azul)">' +
      I('caminhao', 26) + '<span class="config-texto"><strong>Item grande, precisa de transporte</strong><small style="color:#33557F">Voluntários com carro poderão ajudar</small></span><span class="interruptor"></span></button>' +
      '<button type="submit" class="btn btn-primario btn-largo">Publicar na vitrine</button>' +
      '</form>' };
  }

  /* ---------------------------------------------------------------- Minha lista (RF03) */
  function lista(ctx) {
    var s = E.get();
    var catSel = ctx.catPedido || 'roupas';
    var pedidos = s.pedidos.map(function (p) {
      var c = E.categoria(p.cat);
      var n = s.itens.filter(function (it) { return it.cat === p.cat && E.combina(it) && E.dentroDoRaio(it); }).length;
      return '<div class="cartao" style="flex-direction:row;align-items:center;gap:12px;padding:12px 8px 12px 16px">' +
        '<span style="color:var(--vermelho)">' + I(c.icone, 26) + '</span>' +
        '<div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:2px"><strong>' + c.nome + '</strong><span style="color:var(--cinza);font-size:.95rem">' + esc(p.detalhe || 'Sem detalhe') + '</span>' +
        (n ? '<a href="#/vitrine" data-acao="ver-categoria" data-valor="' + p.cat + '" style="font-weight:700;font-size:.9rem;display:inline-flex;gap:4px;align-items:center;min-height:32px">' + I('coracaoCheio', 14) + (n === 1 ? '1 item combina' : n + ' itens combinam') + '</a>'
           : '<span style="font-size:.875rem;color:var(--cinza)">Ainda nada por perto. Avisamos você.</span>') + '</div>' +
        '<button type="button" class="icone-btn" data-acao="remover-pedido" data-id="' + p.id + '" aria-label="Remover ' + c.nome + ' da lista">' + I('lixo', 22) + '</button></div>';
    }).join('');
    var cats = Dados.CATEGORIAS.map(function (c) {
      return '<button type="button" class="opcao" role="radio" aria-checked="' + (catSel === c.id) + '" data-acao="escolher" data-valor="' + c.id + '">' + c.nome + '</button>';
    }).join('');
    return { nav: 'lista', html:
      topo('Minha lista', { voltar: '#/vitrine', sub: 'Do que você precisa' }) +
      '<main class="conteudo">' +
      '<div class="aviso aviso-escuro">' + I('cadeado') + '<span><strong>Ninguém vê sua lista.</strong> Ela não aparece na vitrine. Só avisamos você quando aparecer algo que combina.</span></div>' +
      '<section class="secao" aria-labelledby="ativos"><h2 class="secao-titulo" id="ativos">' + (s.pedidos.length ? (s.pedidos.length === 1 ? '1 pedido ativo' : s.pedidos.length + ' pedidos ativos') : 'Nenhum pedido ainda') + '</h2>' + pedidos + '</section>' +
      '<form class="cartao" style="gap:14px" data-form="pedido" novalidate><h2 class="secao-titulo">Adicionar um pedido</h2>' +
      '<fieldset><legend class="legenda">Categoria</legend><div class="grade-2" role="radiogroup" data-grupo="catPedido" data-valor="' + catSel + '">' + cats + '</div></fieldset>' +
      '<div class="campo"><label for="detalhe">Tamanho ou detalhe <span style="font-weight:400;color:var(--cinza)">(opcional)</span></label>' +
      '<input class="entrada" id="detalhe" name="detalhe" placeholder="Ex.: tamanhos 6 e 12 anos" style="background:var(--creme)"></div>' +
      '<button type="submit" class="btn btn-primario btn-largo">' + I('somar') + 'Adicionar à lista</button></form>' +
      '</main>' };
  }

  /* ---------------------------------------------------------------- Sacola e histórico (RF08) */
  function sacola(ctx) {
    var s = E.get(), aba = ctx.aba === 'doando' ? 'doando' : 'recebendo';
    var ordem = { solicitada: 0, confirmada: 1, concluida: 2, cancelada: 3, recusada: 3 };
    var corpo = '';
    if (aba === 'recebendo') {
      var rs = s.reservas.filter(function (r) { return r.papel === 'recebedor'; }).sort(function (a, b) { return ordem[a.status] - ordem[b.status]; });
      corpo = rs.length ? rs.map(function (r) {
        var it = E.item(r.item), o = E.pessoa(r.outro);
        var acoes = '';
        if (r.status === 'confirmada') acoes = '<a class="btn btn-contorno-vermelho btn-pequeno" href="#/reserva/' + r.id + '">' + I('chat', 20) + 'Abrir conversa</a>';
        else if (r.status === 'concluida') acoes = '<a class="btn btn-contorno btn-pequeno" href="#/concluida/' + r.id + '">Ver comprovante</a>';
        else if (it.status === 'disponivel') acoes = '<a class="btn btn-contorno btn-pequeno" href="#/item/' + it.id + '">Ver na vitrine</a>';
        var transp = r.transporte === 'aceito' ? '<span class="etiqueta et-azul">' + I('caminhao', 14) + 'Com voluntário</span>' : (r.transporte === 'buscando' ? '<span class="etiqueta et-azul">Buscando voluntário</span>' : '');
        return '<div class="cartao"><div class="linha-hist">' + foto(it) + '<div class="linha-hist-info"><strong>' + esc(it.titulo) + '</strong><span>De ' + esc(o.nome) + ' · ' + esc(r.horario) + '</span>' +
          '<div class="chips" style="gap:6px">' + etiquetaRes(r) + transp + '</div></div></div>' + (acoes ? '<div class="acoes-linha">' + acoes + '</div>' : '') + '</div>';
      }).join('') : '<div class="vazio">' + I('sacola', 40) + '<strong>Sua sacola está vazia</strong><span>Quando você reservar um item, ele aparece aqui.</span><a class="btn btn-primario btn-pequeno" href="#/vitrine">Ir para a vitrine</a></div>';
    } else {
      var meus = s.itens.filter(function (it) { return it.dono === 'eu' && it.status !== 'removido'; });
      var entregues = meus.filter(function (it) { return it.status === 'entregue'; }).length;
      corpo = (entregues ? '<div class="aviso aviso-verde">' + I('coracao') + '<span><strong>' + (entregues === 1 ? '1 doação concluída.' : entregues + ' doações concluídas.') + '</strong> Você sabe onde cada uma chegou.</span></div>' : '') +
        (meus.length ? meus.slice().reverse().map(function (it) {
          var r = s.reservas.filter(function (x) { return x.item === it.id && x.papel === 'doador'; }).sort(function (a, b) { return ordem[a.status] - ordem[b.status]; })[0];
          var et, acoes = '', sub = 'Publicado ' + it.quando;
          if (r && r.status === 'solicitada') { et = etiquetaRes(r); sub = E.pessoa(r.outro).nome + ' quer buscar · ' + r.horario; acoes = '<a class="btn btn-primario btn-pequeno" href="#/reserva/' + r.id + '">Ver pedido de reserva</a>'; }
          else if (r && r.status === 'confirmada') { et = etiquetaRes(r); sub = 'Para ' + E.pessoa(r.outro).nome + ' · ' + r.horario; acoes = '<a class="btn btn-contorno-vermelho btn-pequeno" href="#/reserva/' + r.id + '">' + I('chat', 20) + 'Abrir conversa</a>'; }
          else if (it.status === 'entregue' && r) { et = '<span class="etiqueta et-verde">Entregue</span>'; sub = 'Para ' + E.pessoa(r.outro).nome + ' · código confirmado'; acoes = '<a class="btn btn-contorno btn-pequeno" href="#/concluida/' + r.id + '">Ver comprovante</a>'; }
          else { et = '<span class="etiqueta et-neutro">Na vitrine</span>'; acoes = '<a class="btn btn-contorno btn-pequeno" href="#/item/' + it.id + '">Ver anúncio</a><button type="button" class="btn btn-contorno btn-pequeno" data-acao="remover-item" data-id="' + it.id + '">' + I('lixo', 20) + 'Tirar da vitrine</button>'; }
          var obrigado = r && r.agradecimento && it.status === 'entregue' ? '<div class="aviso aviso-vermelho" style="padding:10px 12px;font-size:.95rem">"' + esc(r.agradecimento) + '"</div>' : '';
          return '<div class="cartao"><div class="linha-hist">' + foto(it) + '<div class="linha-hist-info"><strong>' + esc(it.titulo) + '</strong><span>' + esc(sub) + '</span><div class="chips" style="gap:6px">' + et + '</div></div></div>' + obrigado + '<div class="acoes-linha">' + acoes + '</div></div>';
        }).join('') : '<div class="vazio">' + I('camera', 40) + '<strong>Você ainda não doou nada</strong><a class="btn btn-primario btn-pequeno" href="#/doar">Doar um item</a></div>');
    }
    var pend = s.reservas.filter(function (r) { return r.papel === 'doador' && r.status === 'solicitada'; }).length;
    return { nav: 'sacola', html:
      topo('Sacola e histórico', { voltar: '#/vitrine' }) +
      '<div class="abas" role="tablist">' +
      '<button type="button" class="aba" role="tab" aria-selected="' + (aba === 'recebendo') + '" data-acao="aba" data-valor="recebendo">Recebendo</button>' +
      '<button type="button" class="aba" role="tab" aria-selected="' + (aba === 'doando') + '" data-acao="aba" data-valor="doando">Doando' + (pend ? ' (' + pend + ' novo)' : '') + '</button></div>' +
      '<main class="conteudo" role="tabpanel">' + corpo + '</main>' };
  }

  /* ---------------------------------------------------------------- Transporte (RF09) */
  function transporte(ctx) {
    var r = E.reserva(ctx.id);
    if (!r) return naoEncontrado();
    var it = E.item(r.item);
    var dia = ctx.dia || 'Sábado';
    var corpo;
    if (!r.transporte) {
      corpo = '<fieldset><legend class="legenda">Melhor dia para a entrega</legend><div class="grade-3" role="radiogroup" data-grupo="dia" data-valor="' + dia + '">' +
        ['Sábado', 'Domingo', 'Qualquer dia'].map(function (d) { return '<button type="button" class="opcao" role="radio" aria-checked="' + (dia === d) + '" data-acao="escolher" data-valor="' + d + '">' + d + '</button>'; }).join('') +
        '</div></fieldset><button type="button" class="btn btn-azul btn-largo" data-acao="pedir-transporte" data-id="' + r.id + '">Pedir ajuda a voluntários</button>';
    } else if (r.transporte === 'buscando') {
      corpo = '<div class="cartao" role="status" style="align-items:center;text-align:center;padding:24px 16px"><strong>Procurando voluntários perto...</strong><span style="color:var(--cinza)">Avisamos você assim que alguém aceitar.</span></div>';
    } else {
      corpo = '<div class="cartao" role="status" style="border:2px solid var(--verde)"><strong style="color:var(--verde-texto);display:flex;gap:8px;align-items:center">' + I('check', 22) + 'Um voluntário aceitou</strong>' +
        cartaoPessoa('marcos') + '<p style="color:var(--tinta-2);line-height:1.4">Marcos entrou na conversa. A entrega é confirmada com o mesmo código.</p>' +
        '<a class="btn btn-primario btn-largo" href="#/reserva/' + r.id + '">' + I('chat') + 'Abrir conversa</a>' +
        '<button type="button" class="link-btn centro" data-acao="cancelar-transporte" data-id="' + r.id + '">Cancelar pedido de transporte</button></div>';
    }
    return { nav: 'sacola', html:
      topo('Ajuda com transporte', { voltar: '#/reserva/' + r.id }) +
      '<main class="conteudo">' +
      '<div class="resumo-reserva" style="margin:0">' + foto(it) + '<div><strong>' + esc(it.titulo) + '</strong><span>' + km(it.dist) + (it.grande ? ' · não cabe em ônibus' : '') + '</span></div></div>' +
      '<div class="aviso aviso-azul" style="flex-direction:column;align-items:center;text-align:center;padding:22px 16px">' + I('caminhao', 48) +
      '<span style="font-size:1.0625rem">Voluntários com carro, num raio de 5 km, recebem seu pedido e podem aceitar levar o item até você.</span></div>' +
      corpo + '</main>' };
  }

  /* ---------------------------------------------------------------- Notificações (RF05) */
  function notificacoes() {
    var s = E.get();
    var lista = s.notifs.length ? s.notifs.map(function (n) {
      return '<a class="notif' + (n.lida ? '' : ' nova') + '" href="' + n.link + '" data-acao="abrir-notif" data-id="' + n.id + '"><span class="bola">' + I(n.icone, 20) + '</span>' +
        '<span class="notif-texto"><span>' + (n.lida ? '' : '<span class="sr">Nova: </span>') + esc(n.txt) + '</span><small>' + esc(n.quando) + '</small></span></a>';
    }).join('') : '<div class="vazio">' + I('sino', 40) + '<strong>Nenhuma notificação</strong></div>';
    return { nav: 'vitrine', html:
      topo('Notificações', { voltar: '#/vitrine', direita: E.naoLidas() ? '<button type="button" class="topo-acao" data-acao="ler-todas">Marcar como lidas</button>' : '' }) +
      '<main class="conteudo sem-padding">' + lista + '</main>' };
  }

  /* ---------------------------------------------------------------- Perfil */
  function perfil() {
    var s = E.get(), u = s.usuario;
    if (!u) {
      return { nav: 'perfil', html: topo('Perfil', { voltar: '#/vitrine' }) +
        '<main class="conteudo"><div class="vazio">' + I('usuario', 44) + '<strong>Você está só olhando</strong><span>Crie sua conta para doar, reservar e montar sua lista.</span>' +
        '<a class="btn btn-primario" href="#/cadastro">Criar minha conta</a></div>' + blocoPrefs(s) + '</main>' };
    }
    var doadas = s.itens.filter(function (i) { return i.dono === 'eu' && i.status === 'entregue'; }).length;
    var recebidas = s.reservas.filter(function (r) { return r.papel === 'recebedor' && r.status === 'concluida'; }).length;
    var papeis = [['receber', 'Receber'], ['doar', 'Doar'], ['ambos', 'Os dois']].map(function (p) {
      return '<button type="button" class="opcao" role="radio" aria-checked="' + (u.papel === p[0]) + '" data-acao="papel" data-valor="' + p[0] + '">' + p[1] + '</button>';
    }).join('');
    return { nav: 'perfil', html:
      topo('Perfil', { voltar: '#/vitrine' }) +
      '<main class="conteudo">' +
      '<div class="pessoa"><span class="avatar vermelho" style="width:60px;height:60px;border-radius:30px;font-size:1.5rem" aria-hidden="true">' + esc(u.nome.charAt(0).toUpperCase()) + '</span>' +
      '<div class="pessoa-info"><span class="pessoa-nome" style="font-size:1.3rem">' + esc(u.nome) + ' <span style="color:var(--verde)">' + I('escudo', 20, 'Celular verificado') + '</span></span>' +
      '<span class="pessoa-sub">' + I('pin', 16) + esc(u.bairro) + ' · no Elo desde ' + esc(u.desde) + '</span></div>' +
      '<button type="button" class="icone-btn borda" data-acao="editar-perfil" aria-label="Editar meus dados">' + I('lapis', 20) + '</button></div>' +
      '<div class="estatisticas"><div class="estatistica"><strong>' + doadas + '</strong><span>doações feitas</span></div><div class="estatistica"><strong>' + recebidas + '</strong><span>itens recebidos</span></div><div class="estatistica"><strong>' + s.pedidos.length + '</strong><span>pedidos na lista</span></div></div>' +
      '<section class="secao"><h2 class="secao-titulo">Distância máxima <small id="raio-rotulo">até ' + u.raio + ' km</small></h2>' +
      '<label for="raio" class="sr">Distância máxima em quilômetros</label><input type="range" class="faixa" id="raio" min="1" max="10" step="1" value="' + u.raio + '" data-entrada="raio" aria-valuetext="' + u.raio + ' quilômetros">' +
      '<div class="meta" style="justify-content:space-between"><span>1 km</span><span>10 km</span></div></section>' +
      '<section class="secao"><h2 class="secao-titulo">Como quero usar</h2><div class="grade-3" role="radiogroup">' + papeis + '</div></section>' +
      blocoPrefs(s) +
      '<section class="secao"><h2 class="secao-titulo">Ajuda</h2><div class="lista-config">' +
      '<button type="button" class="config" data-acao="como-funciona">' + I('ajuda') + '<span class="config-texto"><strong>Como o Elo funciona</strong><small>Vitrine, lista, reserva e comprovante</small></span>' + I('avancar', 20) + '</button>' +
      '<button type="button" class="config" data-acao="privacidade">' + I('cadeado') + '<span class="config-texto"><strong>Privacidade e segurança</strong><small>O que os outros veem sobre você</small></span>' + I('avancar', 20) + '</button>' +
      '<button type="button" class="config" data-acao="denunciar" data-alvo="problema">' + I('bandeira') + '<span class="config-texto"><strong>Relatar um problema</strong><small>Respondemos em até 48 horas</small></span>' + I('avancar', 20) + '</button>' +
      '</div></section>' +
      '<div class="lista-config"><button type="button" class="config" data-acao="sair">' + I('sair') + '<span class="config-texto"><strong>Sair da conta</strong></span></button></div>' +
      '</main>' };
  }

  function blocoPrefs(s) {
    return '<section class="secao"><h2 class="secao-titulo">Acessibilidade e internet</h2><div class="lista-config">' +
      '<button type="button" class="config" role="switch" aria-checked="' + s.prefs.economia + '" data-acao="pref" data-valor="economia">' + I('folha') +
      '<span class="config-texto"><strong>Economizar internet</strong><small>Não carrega fotos. Bom para plano pré-pago.</small></span><span class="interruptor"></span></button>' +
      '<button type="button" class="config" role="switch" aria-checked="' + s.prefs.fonteGrande + '" data-acao="pref" data-valor="fonteGrande">' + I('letra') +
      '<span class="config-texto"><strong>Texto maior</strong><small>Aumenta letras e botões</small></span><span class="interruptor"></span></button>' +
      '</div></section>';
  }

  function naoEncontrado() {
    return { nav: 'vitrine', html: topo('Não encontrado', { voltar: '#/vitrine' }) +
      '<main class="conteudo"><div class="vazio">' + I('info', 40) + '<strong>Esta página não existe mais</strong><span>O item pode ter saído da vitrine.</span><a class="btn btn-primario" href="#/vitrine">Voltar para a vitrine</a></div></main>' };
  }

  return {
    esc: esc, inicio: inicio, cadastro: cadastro, codigo: codigo, vitrine: vitrine, listaVitrine: listaVitrine,
    item: item, reserva: reserva, entrega: entrega, concluida: concluida, doar: doar, lista: lista,
    sacola: sacola, transporte: transporte, notificacoes: notificacoes, perfil: perfil, naoEncontrado: naoEncontrado
  };
})();
