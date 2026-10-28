/* Elo Solidário · controle do app: rotas, ações do usuário, avisos e simulação das outras pessoas. */
(function () {
  var E = Estado, T = Telas, I = Icone, esc = T.esc;
  var tela = document.getElementById('tela');
  var nav = document.getElementById('nav');
  var modal = document.getElementById('modal');
  var toasts = document.getElementById('toasts');

  var visitante = false;
  var pendenteConta = false;
  var rotaAtual = null;
  var ctx = {};                 // estado temporário da tela aberta
  var filtros = { cat: 'todos', q: '', combina: false };
  var rascunhos = { cadastro: {}, doar: { horarios: [] } };
  var smsCodigo = null;
  var modalSim = null, modalFocoAnterior = null;

  var ILUSTRACOES = {
    roupas: 'assets/itens/sacola-6-anos.svg', alimentos: 'assets/itens/cesta-alimentos.svg', moveis: 'assets/itens/colchao.svg',
    eletro: 'assets/itens/geladeira.svg', escolar: 'assets/itens/kit-escolar.svg', bebe: 'assets/itens/carrinho-bebe.svg', higiene: 'assets/itens/cesta-alimentos.svg'
  };
  var MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

  /* ============================================================ Rotas */
  function lerRota() {
    var h = location.hash.replace(/^#\/?/, '') || '';
    var partes = h.split('?');
    var caminho = partes[0].split('/');
    var q = {};
    (partes[1] || '').split('&').forEach(function (kv) { if (kv) { var p = kv.split('='); q[p[0]] = decodeURIComponent(p[1] || ''); } });
    return { nome: caminho[0] || '', id: caminho[1], q: q, chave: h };
  }

  var PUBLICAS = { inicio: 1, cadastro: 1, codigo: 1 };
  var PRECISAM_CONTA = { doar: 1, lista: 1, sacola: 1, reserva: 1, entrega: 1, concluida: 1, transporte: 1 };

  function ir(hash) { if (location.hash === hash) render(false); else location.hash = hash; }

  function render(mudouRota) {
    var s = E.get();
    var r = lerRota();
    if (!s.usuario && !visitante && !PUBLICAS[r.nome]) { location.replace('#/inicio'); return; }
    if (s.usuario && PUBLICAS[r.nome]) { location.replace('#/vitrine'); return; }
    if (!s.usuario && PRECISAM_CONTA[r.nome]) { pendenteConta = true; location.replace('#/vitrine'); return; }
    if (!r.nome) { location.replace(s.usuario ? '#/vitrine' : '#/inicio'); return; }

    if (mudouRota && rotaAtual !== r.chave) {
      var mesmaTela = rotaAtual && rotaAtual.split('?')[0] === r.chave.split('?')[0];
      if (!mesmaTela) ctx = {};
    }
    if (!mudouRota) guardarCampos();
    var focoId = !mudouRota && document.activeElement && document.activeElement.id && tela.contains(document.activeElement) ? document.activeElement.id : null;
    var focoSel = focoId && document.activeElement.selectionStart != null ? [document.activeElement.selectionStart, document.activeElement.selectionEnd] : null;
    var rolagens = mudouRota ? null : Array.prototype.map.call(tela.querySelectorAll('.conteudo'), function (el) { return el.scrollTop; });

    var dados = Object.assign({ id: r.id, aba: r.q.aba, filtros: filtros }, ctx);
    if (r.nome === 'cadastro' || r.nome === 'codigo') dados.rascunho = rascunhos.cadastro;
    if (r.nome === 'doar') dados.rascunho = rascunhos.doar;
    var fn = T[r.nome];
    var v = (typeof fn === 'function' && r.nome !== 'esc' && r.nome !== 'listaVitrine') ? fn(dados) : T.naoEncontrado();

    tela.innerHTML = v.html;
    montarNav(v.nav);
    document.documentElement.classList.toggle('fonte-grande', !!s.prefs.fonteGrande);

    var msgs = document.getElementById('mensagens');
    if (msgs) msgs.scrollTop = msgs.scrollHeight;
    if (rolagens) Array.prototype.forEach.call(tela.querySelectorAll('.conteudo'), function (el, i) { if (rolagens[i] != null) el.scrollTop = rolagens[i]; });

    if (focoId) { var fe = document.getElementById(focoId); if (fe) { fe.focus({ preventScroll: true }); if (focoSel && fe.setSelectionRange) { try { fe.setSelectionRange(focoSel[0], focoSel[1]); } catch (x) {} } } }
    if (mudouRota && rotaAtual !== r.chave) {
      var h1 = tela.querySelector('h1');
      if (h1) { h1.setAttribute('tabindex', '-1'); h1.focus({ preventScroll: true }); }
      document.title = (h1 ? h1.textContent + ' · ' : '') + 'Elo Solidário';
    }
    rotaAtual = r.chave;
  }
  function atualizar() { render(false); }

  function montarNav(ativa) {
    if (!ativa) { nav.hidden = true; nav.innerHTML = ''; return; }
    var pend = E.get().reservas.filter(function (r) { return r.papel === 'doador' && r.status === 'solicitada'; }).length;
    var abas = [['vitrine', 'Vitrine', 'loja'], ['doar', 'Doar', 'mais'], ['lista', 'Minha lista', 'coracao'], ['sacola', 'Sacola', 'sacola'], ['perfil', 'Perfil', 'usuario']];
    nav.innerHTML = abas.map(function (a) {
      var selo = a[0] === 'sacola' && pend ? '<span class="selo-num" aria-hidden="true">' + pend + '</span>' : '';
      var rot = a[0] === 'sacola' && pend ? ' aria-label="Sacola, ' + pend + ' pedido novo"' : '';
      return '<a href="#/' + a[0] + '"' + (ativa === a[0] ? ' aria-current="page"' : '') + rot + '>' + I(a[2], 26) + selo + a[1] + '</a>';
    }).join('');
    nav.hidden = false;
  }

  /* Guarda o que a pessoa já digitou antes de redesenhar a tela. */
  function guardarCampos() {
    var f = tela.querySelector('form[data-form="cadastro"]');
    if (f) ['nome', 'celular', 'bairro'].forEach(function (k) { if (f.elements[k]) rascunhos.cadastro[k] = f.elements[k].value; });
    f = tela.querySelector('form[data-form="doar"]');
    if (f) ['titulo', 'tamanho', 'desc'].forEach(function (k) { if (f.elements[k]) rascunhos.doar[k] = f.elements[k].value; });
    f = tela.querySelector('form[data-form="mensagem"]');
    if (f) ctx.rascunhoMsg = f.elements.msg.value;
  }

  function salvar() {
    if (!E.salvar()) toast('Não foi possível salvar neste navegador. A foto pode ser grande demais.');
  }

  /* ============================================================ Avisos (toasts) e janelas (modal) */
  function toast(msg, opts) {
    opts = opts || {};
    var el = document.createElement('div');
    el.className = 'toast';
    el.setAttribute('role', 'status');
    el.innerHTML = '<span>' + msg + '</span>' + (opts.acao ? '<button type="button">' + opts.acao + '</button>' : '');
    if (opts.acao) el.querySelector('button').addEventListener('click', function () { el.remove(); opts.fn(); });
    toasts.appendChild(el);
    while (toasts.children.length > 2) toasts.firstChild.remove();
    setTimeout(function () { el.remove(); }, opts.tempo || (opts.acao ? 7000 : 4000));
  }

  function abrirModal(html, aoSim) {
    modalFocoAnterior = document.activeElement;
    modalSim = aoSim || null;
    modal.innerHTML = '<div class="folha" role="dialog" aria-modal="true" aria-labelledby="modal-titulo"><span class="folha-pegador" aria-hidden="true"></span>' + html + '</div>';
    modal.hidden = false;
    var foco = modal.querySelector('[autofocus], input, textarea, button');
    if (foco) foco.focus();
  }
  function fecharModal() {
    modal.hidden = true; modal.innerHTML = ''; modalSim = null;
    if (modalFocoAnterior && document.body.contains(modalFocoAnterior)) modalFocoAnterior.focus();
  }
  function confirmar(titulo, texto, sim, nao, fn, perigo) {
    abrirModal('<h2 id="modal-titulo">' + titulo + '</h2><p>' + texto + '</p>' +
      '<div class="grade-2"><button type="button" class="btn btn-contorno" data-acao="fechar-modal">' + nao + '</button>' +
      '<button type="button" class="btn ' + (perigo ? 'btn-escuro' : 'btn-primario') + '" data-acao="modal-sim">' + sim + '</button></div>', fn);
  }
  function pedirConta() {
    abrirModal('<h2 id="modal-titulo">Crie sua conta para continuar</h2><p>Para doar, reservar ou montar sua lista, é preciso uma conta. Só pedimos nome, celular e bairro.</p>' +
      '<a class="btn btn-primario btn-largo" href="#/cadastro" data-acao="ir-cadastro">Criar minha conta</a>' +
      '<button type="button" class="btn btn-contorno btn-largo" data-acao="fechar-modal">Agora não</button>');
  }

  /* ============================================================ Simulação das outras pessoas */
  var RESPOSTAS = {
    recebedor: ['Combinado! Qualquer coisa me chama por aqui.', 'Pode sim. Fica perto da padaria, em frente ao ponto de ônibus.', 'Tudo certo, te espero lá.'],
    doador: ['Muito obrigada! Vou chegar no horário.', 'Combinado. Quando eu chegar te mostro o código.', 'Pode ser, sem problema.']
  };

  function outroResponde(res, texto, ms) {
    var nome = E.pessoa(res.outro).nome;
    setTimeout(function () {
      if (lerRota().id === res.id && lerRota().nome === 'reserva') { ctx.digitando = nome; atualizar(); }
    }, Math.max(300, (ms || 1800) - 1200));
    setTimeout(function () {
      res.msgs.push({ de: 'outro', txt: texto });
      salvar();
      if (lerRota().nome === 'reserva' && lerRota().id === res.id) { ctx.digitando = null; atualizar(); }
      else { E.notificar('chat', nome + ': ' + texto, '#/reserva/' + res.id); salvar(); montarNavSe(); }
    }, ms || 1800);
  }
  function montarNavSe() { var r = lerRota(); if (!PUBLICAS[r.nome]) atualizar(); }

  function concluirReserva(res) {
    var it = E.item(res.item);
    res.status = 'concluida';
    it.status = 'entregue';
    res.msgs.push({ de: 'sistema', txt: 'Entrega confirmada com o código ' + res.codigo + '. Doação concluída.' });
    salvar();
  }

  /* ============================================================ Ações (cliques) */
  var acoes = {
    'visitante': function () { visitante = true; ir('#/vitrine'); return false; },
    'ir-cadastro': function () { fecharModal(); visitante = false; },
    'fechar-modal': function () { fecharModal(); },
    'modal-sim': function () { var f = modalSim; fecharModal(); if (f) f(); },
    'reiniciar': function () {
      confirmar('Recomeçar o teste?', 'Todos os dados deste teste (conta, doações, reservas e lista) serão apagados deste navegador.', 'Apagar e recomeçar', 'Cancelar', function () {
        E.reiniciar(); visitante = false; rascunhos = { cadastro: {}, doar: { horarios: [] } }; filtros = { cat: 'todos', q: '', combina: false };
        ir('#/inicio'); toast('Pronto. O teste recomeçou do zero.');
      }, true);
    },

    /* escolhas genéricas */
    'escolher': function (el) {
      var g = el.closest('[data-grupo]'); if (!g) return;
      Array.prototype.forEach.call(g.querySelectorAll('[role="radio"]'), function (b) { b.setAttribute('aria-checked', b === el ? 'true' : 'false'); });
      g.dataset.valor = el.dataset.valor;
      var nome = g.dataset.grupo;
      if (nome === 'papel') rascunhos.cadastro.papel = el.dataset.valor;
      else if (nome === 'cat' || nome === 'estado') rascunhos.doar[nome] = el.dataset.valor;
      else ctx[nome] = el.dataset.valor;
    },
    'alternar': function (el) {
      var on = el.getAttribute('aria-pressed') !== 'true';
      el.setAttribute('aria-pressed', on);
      var hs = rascunhos.doar.horarios = rascunhos.doar.horarios || [];
      var v = el.dataset.valor, i = hs.indexOf(v);
      if (on && i < 0) hs.push(v); if (!on && i >= 0) hs.splice(i, 1);
    },
    'alternar-grande': function (el) { var on = el.getAttribute('aria-checked') !== 'true'; el.setAttribute('aria-checked', on); rascunhos.doar.grande = on; },

    /* cadastro */
    'localizacao': function () {
      var b = document.getElementById('bairro');
      if (b) { b.value = 'Brasilândia'; rascunhos.cadastro.bairro = b.value; }
      toast('Localização aproximada encontrada: Brasilândia. Só o bairro é usado.');
    },
    'reenviar-sms': function () { smsCodigo = E.codigo(); toast('SMS simulado: seu código do Elo Solidário é ' + smsCodigo + '.', { tempo: 12000 }); },

    /* vitrine */
    'corredor': function (el) { filtros.cat = el.dataset.valor; atualizar(); },
    'so-combina': function () { filtros.combina = true; filtros.cat = 'todos'; atualizar(); return false; },
    'alternar-combina': function () { filtros.combina = !filtros.combina; atualizar(); },
    'limpar-filtros': function () { filtros = { cat: 'todos', q: '', combina: false }; atualizar(); },
    'limpar-busca': function () { filtros.q = ''; atualizar(); var b = document.getElementById('busca'); if (b) b.focus(); },
    'ver-categoria': function (el) { filtros = { cat: el.dataset.valor, q: '', combina: false }; ir('#/vitrine'); return false; },
    'abrir-raio': function () {
      var u = E.get().usuario;
      if (!u) { pedirConta(); return; }
      abrirModal('<h2 id="modal-titulo">Até onde você pode ir?</h2><p>Mostramos itens a até <strong id="raio-modal-rotulo">' + u.raio + ' km</strong> de ' + esc(u.bairro) + '. Distâncias maiores costumam inviabilizar a retirada.</p>' +
        '<label for="raio-modal" class="sr">Distância máxima em quilômetros</label><input type="range" class="faixa" id="raio-modal" min="1" max="10" value="' + u.raio + '" data-entrada="raio">' +
        '<div class="meta" style="justify-content:space-between"><span>1 km</span><span>10 km</span></div>' +
        '<button type="button" class="btn btn-primario btn-largo" data-acao="fechar-modal">Pronto</button>');
    },

    /* item */
    'escolher-horario': function (el) { ctx.horario = el.dataset.valor; atualizar(); var b = document.getElementById('btn-reservar'); if (b) b.focus(); },
    'reservar': function (el) {
      var s = E.get();
      if (!s.usuario) { pedirConta(); return; }
      if (!ctx.horario) { toast('Escolha primeiro quando você pode buscar.'); var h = tela.querySelector('.horario'); if (h) h.focus(); return; }
      var it = E.item(el.dataset.id);
      if (!it || it.status !== 'disponivel') { toast('Esse item acabou de ser reservado por outra pessoa.'); atualizar(); return; }
      var res = { id: E.novoId('r'), item: it.id, papel: 'recebedor', outro: it.dono, horario: ctx.horario, status: 'confirmada', codigo: E.codigo(),
        transporte: null, avaliacao: 0, agradecimento: '', msgs: [{ de: 'sistema', txt: 'Reserva feita para ' + ctx.horario + '. Conversem por aqui, sem trocar telefone.' }] };
      s.reservas.push(res); it.status = 'reservado';
      salvar();
      ir('#/reserva/' + res.id);
      toast('Item reservado. ' + E.pessoa(it.dono).nome + ' foi avisada.');
      outroResponde(res, 'Oi, ' + s.usuario.nome + '! ' + ctx.horario + ' está ótimo para mim.', 2200);
      outroResponde(res, 'O ponto de encontro é na esquina da padaria, em frente ao ponto de ônibus. Te espero lá!', 5200);
    },

    /* reserva e chat */
    'msg-rapida': function (el) { enviarMensagem(E.reserva(el.dataset.id), el.dataset.valor); },
    'cancelar-reserva': function (el) {
      var res = E.reserva(el.dataset.id), it = E.item(res.item);
      confirmar('Cancelar a reserva?', res.papel === 'recebedor' ? 'O item volta para a vitrine e ' + E.pessoa(res.outro).nome + ' é avisada.' : 'O item volta para a vitrine e ' + E.pessoa(res.outro).nome + ' é avisada.', 'Sim, cancelar', 'Não, manter', function () {
        var antes = res.status;
        res.status = 'cancelada'; it.status = 'disponivel';
        res.msgs.push({ de: 'sistema', txt: 'Reserva cancelada.' });
        salvar(); atualizar();
        toast('Reserva cancelada. O item voltou para a vitrine.', { acao: 'Desfazer', fn: function () {
          if (it.status !== 'disponivel') { toast('Não dá mais para desfazer: o item já foi reservado.'); return; }
          res.status = antes; it.status = 'reservado'; res.msgs.pop(); salvar(); atualizar(); toast('Reserva mantida.');
        } });
      }, true);
    },
    'aceitar': function (el) {
      var res = E.reserva(el.dataset.id);
      res.status = 'confirmada';
      res.msgs.push({ de: 'sistema', txt: 'Você aceitou. Retirada combinada para ' + res.horario + '.' });
      salvar(); atualizar();
      toast('Reserva aceita. Agora é só combinar o ponto de encontro.');
      outroResponde(res, 'Que bom! Muito obrigada. Quando eu chegar te mostro o código.', 2000);
    },
    'recusar': function (el) {
      var res = E.reserva(el.dataset.id), it = E.item(res.item);
      confirmar('Recusar o pedido?', 'O item continua na vitrine para outras pessoas. ' + E.pessoa(res.outro).nome + ' é avisada com respeito.', 'Recusar', 'Voltar', function () {
        res.status = 'recusada'; it.status = 'disponivel';
        res.msgs.push({ de: 'sistema', txt: 'Pedido recusado. O item continua na vitrine.' });
        salvar(); atualizar();
        toast('Pedido recusado.', { acao: 'Desfazer', fn: function () { res.status = 'solicitada'; it.status = 'reservado'; res.msgs.pop(); salvar(); atualizar(); } });
      }, true);
    },
    'cheguei': function (el) {
      var res = E.reserva(el.dataset.id), nome = E.pessoa(res.outro).nome;
      abrirModal('<h2 id="modal-titulo">Mostre este código para ' + esc(nome) + '</h2>' +
        '<div class="cartao-codigo" style="border-style:solid"><span class="numero" style="font-size:3rem" aria-label="' + res.codigo.split('').join(' ') + '">' + res.codigo + '</span></div>' +
        '<p role="status" id="espera-codigo">Aguardando ' + esc(nome) + ' digitar o código no celular dela...</p>' +
        '<button type="button" class="btn btn-contorno btn-largo" data-acao="fechar-modal">Fechar</button>');
      setTimeout(function () {
        if (res.status !== 'confirmada') return;
        concluirReserva(res);
        fecharModal();
        ir('#/concluida/' + res.id);
        toast(nome + ' confirmou a entrega.');
      }, 3500);
    },

    /* confirmar entrega (doador) */
    'tecla': function (el) {
      var res = E.reserva(lerRota().id), cod = ctx.codigo || '', k = el.dataset.valor;
      ctx.erro = false;
      if (k === 'apagar') ctx.codigo = cod.slice(0, -1);
      else if (k === 'ok') {
        if (cod.length < 4) return;
        if (cod === res.codigo) {
          concluirReserva(res);
          ir('#/concluida/' + res.id);
          setTimeout(function () {
            res.agradecimento = 'Muito obrigada! Vai ajudar demais aqui em casa. Deus abençoe.';
            salvar();
            if (lerRota().nome === 'concluida') atualizar(); else toast(E.pessoa(res.outro).nome + ' mandou um agradecimento.');
          }, 2500);
          return;
        }
        ctx.erro = true; ctx.codigo = '';
      } else if (cod.length < 4) ctx.codigo = cod + k;
      atualizar();
      var alvo = tela.querySelector('[data-valor="' + k + '"]'); if (alvo) alvo.focus();
    },

    /* concluída */
    'estrela': function (el) {
      var res = E.reserva(lerRota().id);
      res.avaliacao = Number(el.dataset.valor); ctx.nota = res.avaliacao;
      salvar(); atualizar(); toast('Avaliação salva. Obrigado!');
    },

    /* doar */
    'foto-exemplo': function () { rascunhos.doar.ilustracao = true; rascunhos.doar.img = ILUSTRACOES[rascunhos.doar.cat] || 'assets/itens/sacola-6-anos.svg'; atualizar(); },
    'escolher-foto': function () { var a = document.getElementById('arquivo'); if (a) a.click(); },
    'tirar-foto': function () { rascunhos.doar.img = null; rascunhos.doar.ilustracao = false; atualizar(); },

    /* lista */
    'remover-pedido': function (el) {
      var s = E.get(), i = s.pedidos.findIndex(function (p) { return p.id === el.dataset.id; });
      if (i < 0) return;
      var p = s.pedidos.splice(i, 1)[0];
      salvar(); atualizar();
      toast('"' + E.categoria(p.cat).nome + '" saiu da sua lista.', { acao: 'Desfazer', fn: function () { s.pedidos.splice(i, 0, p); salvar(); atualizar(); } });
    },

    /* sacola */
    'aba': function (el) { location.replace('#/sacola?aba=' + el.dataset.valor); },
    'remover-item': function (el) {
      var it = E.item(el.dataset.id);
      confirmar('Tirar da vitrine?', '"' + esc(it.titulo) + '" deixa de aparecer para as outras pessoas.', 'Tirar da vitrine', 'Cancelar', function () {
        it.status = 'removido'; salvar(); atualizar();
        toast('Item tirado da vitrine.', { acao: 'Desfazer', fn: function () { it.status = 'disponivel'; salvar(); atualizar(); } });
      }, true);
    },

    /* transporte */
    'pedir-transporte': function (el) {
      var res = E.reserva(el.dataset.id), dia = ctx.dia || 'Sábado';
      res.transporte = 'buscando';
      res.msgs.push({ de: 'sistema', txt: 'Pedido de transporte enviado a voluntários perto de você (' + dia + ').' });
      salvar(); atualizar();
      setTimeout(function () {
        if (res.transporte !== 'buscando') return;
        res.transporte = 'aceito';
        res.msgs.push({ de: 'sistema', txt: 'Marcos, voluntário com carro, entrou na conversa.' });
        res.msgs.push({ de: 'marcos', txt: 'Oi, pessoal! Posso levar no ' + dia.toLowerCase().replace('qualquer dia', 'sábado') + ' de manhã. Pode ser?' });
        E.notificar('caminhao', 'Marcos aceitou levar ' + E.item(res.item).titulo.toLowerCase() + '.', '#/reserva/' + res.id);
        salvar(); atualizar();
        if (lerRota().nome !== 'transporte') toast('Marcos aceitou fazer o transporte.');
      }, 3000);
    },
    'cancelar-transporte': function (el) {
      var res = E.reserva(el.dataset.id);
      confirmar('Cancelar o transporte?', 'Marcos é avisado e sai da conversa.', 'Sim, cancelar', 'Não', function () {
        res.transporte = null; res.msgs.push({ de: 'sistema', txt: 'Pedido de transporte cancelado.' });
        salvar(); atualizar();
        toast('Transporte cancelado.', { acao: 'Desfazer', fn: function () { res.transporte = 'aceito'; res.msgs.pop(); salvar(); atualizar(); } });
      }, true);
    },

    /* notificações */
    'abrir-notif': function (el) { var n = E.get().notifs.find(function (x) { return x.id === el.dataset.id; }); if (n) { n.lida = true; salvar(); } if (n && n.link.indexOf('combina=1') >= 0) { filtros.combina = true; ir('#/vitrine'); return false; } },
    'ler-todas': function () { E.get().notifs.forEach(function (n) { n.lida = true; }); salvar(); atualizar(); },

    /* perfil */
    'papel': function (el) { E.get().usuario.papel = el.dataset.valor; salvar(); atualizar(); toast('Preferência salva.'); },
    'pref': function (el) {
      var p = E.get().prefs, k = el.dataset.valor; p[k] = !p[k]; salvar(); atualizar();
      toast(k === 'economia' ? (p[k] ? 'Economia de internet ligada. As fotos não serão carregadas.' : 'Fotos ligadas de novo.') : (p[k] ? 'Texto maior ligado.' : 'Texto no tamanho normal.'));
    },
    'editar-perfil': function () {
      var u = E.get().usuario;
      abrirModal('<h2 id="modal-titulo">Meus dados</h2><form data-form="perfil" style="display:flex;flex-direction:column;gap:14px" novalidate>' +
        '<div class="campo"><label for="p-nome">Primeiro nome</label><input class="entrada" id="p-nome" name="nome" value="' + esc(u.nome) + '"></div>' +
        '<div class="campo"><label for="p-bairro">Bairro</label><input class="entrada" id="p-bairro" name="bairro" value="' + esc(u.bairro) + '"><span class="ajuda">Só o bairro aparece para os outros.</span></div>' +
        '<div class="grade-2"><button type="button" class="btn btn-contorno" data-acao="fechar-modal">Cancelar</button><button type="submit" class="btn btn-primario">Salvar</button></div></form>');
    },
    'como-funciona': function () {
      abrirModal('<h2 id="modal-titulo">Como o Elo funciona</h2>' +
        '<p><strong>Vitrine:</strong> itens doados por pessoas perto de você. Nada tem preço.</p>' +
        '<p><strong>Corredores:</strong> as categorias, como roupas, alimentos e móveis.</p>' +
        '<p><strong>Minha lista:</strong> o que você precisa. É privada e avisamos quando algo combina.</p>' +
        '<p><strong>Reserva:</strong> você escolhe o horário e combina a retirada pelo chat.</p>' +
        '<p><strong>Comprovante:</strong> na entrega, quem recebe mostra um código de 4 números e quem doa digita. Assim os dois sabem que deu certo.</p>' +
        '<button type="button" class="btn btn-primario btn-largo" data-acao="fechar-modal">Entendi</button>');
    },
    'privacidade': function () {
      abrirModal('<h2 id="modal-titulo">Privacidade e segurança</h2>' +
        '<p>Os outros veem só seu <strong>primeiro nome, bairro, avaliação e quantas doações você fez</strong>.</p>' +
        '<p>Seu telefone, endereço e sua lista de necessidades <strong>nunca aparecem</strong>. A localização é aproximada (pelo menos 500 metros).</p>' +
        '<p>Toda tela de conversa tem o botão de denúncia. As denúncias são analisadas em até 48 horas.</p>' +
        '<button type="button" class="btn btn-primario btn-largo" data-acao="fechar-modal">Entendi</button>');
    },
    'denunciar': function (el) {
      var alvo = el.dataset.alvo || 'anúncio';
      var motivos = alvo === 'problema' ? ['O app travou ou deu erro', 'Não entendi como usar', 'Outro problema']
        : ['Parece golpe ou venda', 'Item diferente da foto', 'Pessoa pediu dados pessoais', 'Comportamento ofensivo', 'Outro motivo'];
      abrirModal('<h2 id="modal-titulo">' + (alvo === 'problema' ? 'Relatar um problema' : 'Denunciar ' + alvo) + '</h2>' +
        '<form data-form="denuncia" style="display:flex;flex-direction:column;gap:10px" novalidate><fieldset><legend class="legenda">O que aconteceu?</legend><div role="radiogroup" data-grupo="motivo" style="display:flex;flex-direction:column;gap:8px">' +
        motivos.map(function (m) { return '<button type="button" class="opcao-grande" role="radio" aria-checked="false" data-acao="escolher" data-valor="' + m + '"><span class="bolinha"></span><span><strong style="font-size:1rem">' + m + '</strong></span></button>'; }).join('') +
        '</div></fieldset><div class="campo"><label for="den-txt">Quer contar mais? (opcional)</label><textarea class="entrada" id="den-txt" name="txt"></textarea></div>' +
        '<p style="font-size:.9rem">A outra pessoa não fica sabendo quem denunciou.</p>' +
        '<div class="grade-2"><button type="button" class="btn btn-contorno" data-acao="fechar-modal">Cancelar</button><button type="submit" class="btn btn-escuro">Enviar</button></div></form>');
    },
    'sair': function () {
      confirmar('Sair da conta?', 'Seus dados de teste continuam salvos neste navegador.', 'Sair', 'Cancelar', function () {
        var s = E.get(); rascunhos.cadastro = { nome: s.usuario.nome, bairro: s.usuario.bairro, papel: s.usuario.papel };
        s.usuario = null; visitante = false; salvar(); ir('#/inicio');
      }, true);
    }
  };

  function enviarMensagem(res, texto) {
    texto = (texto || '').trim();
    if (!texto || !res) return;
    res.msgs.push({ de: 'eu', txt: texto });
    ctx.rascunhoMsg = '';
    salvar(); atualizar();
    var lista = RESPOSTAS[res.papel];
    res._n = ((res._n || 0) + 1);
    outroResponde(res, lista[(res._n - 1) % lista.length], 2000);
    var campo = document.getElementById('msg'); if (campo) campo.focus();
  }

  /* ============================================================ Formulários */
  var formularios = {
    'busca': function () { var b = document.getElementById('busca'); if (b) b.blur(); },
    'cadastro': function (f) {
      var r = rascunhos.cadastro, erros = {};
      r.nome = f.elements.nome.value.trim(); r.celular = f.elements.celular.value; r.bairro = f.elements.bairro.value.trim();
      r.papel = r.papel || 'ambos';
      var dig = r.celular.replace(/\D/g, '');
      if (r.nome.length < 2) erros.nome = 'Escreva seu primeiro nome.';
      if (dig.length < 10 || dig.length > 11) erros.celular = 'Confira o número: DDD e celular, só números.';
      if (!r.bairro) erros.bairro = 'Escreva seu bairro ou toque no alfinete.';
      if (Object.keys(erros).length) { ctx.erros = erros; atualizar(); var inv = tela.querySelector('[aria-invalid="true"]'); if (inv) inv.focus(); return; }
      smsCodigo = E.codigo();
      ir('#/codigo');
      setTimeout(function () { toast('SMS simulado: seu código do Elo Solidário é ' + smsCodigo + '.', { tempo: 15000 }); }, 600);
    },
    'codigo': function (f) {
      var v = f.elements.sms.value.replace(/\D/g, '');
      if (v !== smsCodigo) { ctx.erro = v.length < 4 ? 'O código tem 4 números.' : 'Código errado. Confira o SMS ou peça outro.'; atualizar(); document.getElementById('sms').focus(); return; }
      var r = rascunhos.cadastro, d = new Date();
      E.get().usuario = { nome: r.nome, celular: r.celular, bairro: r.bairro, papel: r.papel || 'ambos', raio: 5, desde: MESES[d.getMonth()] + ' de ' + d.getFullYear() };
      visitante = false; salvar();
      ir(r.papel === 'doar' ? '#/doar' : '#/vitrine');
      toast('Conta criada. Que bom ter você no Elo, ' + esc(r.nome) + '!');
    },
    'mensagem': function (f) { enviarMensagem(E.reserva(f.dataset.id), f.elements.msg.value); },
    'agradecer': function (f) {
      var res = E.reserva(f.dataset.id);
      res.agradecimento = f.elements.obrigado.value.trim() || 'Muito obrigado(a) pela doação!';
      salvar(); atualizar(); toast('Agradecimento enviado para ' + E.pessoa(res.outro).nome + '.');
    },
    'doar': function (f) {
      var d = rascunhos.doar, erros = {};
      d.titulo = f.elements.titulo.value.trim(); d.tamanho = f.elements.tamanho.value.trim(); d.desc = f.elements.desc.value.trim();
      if (!d.img) erros.img = 'Adicione uma foto do item.';
      if (!d.titulo) erros.titulo = 'Diga em poucas palavras o que é o item.';
      if (!d.cat) erros.cat = 'Escolha um corredor.';
      if (!d.estado) erros.estado = 'Escolha o estado do item.';
      if (!d.horarios || !d.horarios.length) erros.horarios = 'Escolha pelo menos um horário.';
      if (Object.keys(erros).length) {
        ctx.erros = erros; atualizar();
        toast('Falta ' + (Object.keys(erros).length === 1 ? '1 informação' : Object.keys(erros).length + ' informações') + ' para publicar.');
        var inv = tela.querySelector('[aria-invalid="true"]') || tela.querySelector('.erro');
        if (inv) { inv.scrollIntoView({ block: 'center' }); if (inv.focus) inv.focus(); }
        return;
      }
      if (d.ilustracao) d.img = ILUSTRACOES[d.cat] || d.img;
      var s = E.get();
      var it = { id: E.novoId('i'), dono: 'eu', titulo: d.titulo, cat: d.cat, estado: d.estado, tamanho: d.tamanho, desc: d.desc, dist: 0,
        img: d.img, horarios: d.horarios.slice(), grande: !!d.grande, status: 'disponivel', quando: 'agora' };
      s.itens.push(it);
      salvar();
      var guardado = JSON.parse(JSON.stringify(d));
      rascunhos.doar = { horarios: [] }; ctx.erros = null;
      atualizar();
      abrirModal('<div class="sucesso"><span class="sucesso-bola" style="width:72px;height:72px">' + I('check', 40) + '</span><h2 id="modal-titulo">Está na vitrine!</h2>' +
        '<p>Vamos avisar quem pediu algo parecido perto de você. Você recebe uma mensagem quando alguém quiser reservar.</p></div>' +
        '<button type="button" class="btn btn-primario btn-largo" data-acao="fechar-modal">Doar outro item</button>' +
        '<button type="button" class="btn btn-contorno btn-largo" data-acao="desfazer-publicacao">' + I('desfazer', 20) + 'Desfazer publicação</button>' +
        '<a class="btn btn-contorno btn-largo" href="#/sacola?aba=doando" data-acao="fechar-modal">Ver minhas doações</a>');
      acoes['desfazer-publicacao'] = function () {
        it.status = 'removido'; salvar(); fecharModal(); tela.innerHTML = ''; rascunhos.doar = guardado; ir('#/doar'); toast('Publicação desfeita. Seus dados continuam no formulário.');
      };
      setTimeout(function () {
        if (it.status !== 'disponivel') return;
        var res = { id: E.novoId('r'), item: it.id, papel: 'doador', outro: 'rosangela', horario: it.horarios[0], status: 'solicitada', codigo: E.codigo(),
          transporte: null, avaliacao: 0, agradecimento: '',
          msgs: [{ de: 'sistema', txt: 'Rosângela pediu para reservar ' + it.titulo.toLowerCase() + '.' }, { de: 'outro', txt: 'Oi! Estava precisando muito disso. Posso buscar ' + it.horarios[0].toLowerCase() + '?' }] };
        s.reservas.push(res); it.status = 'reservado';
        E.notificar('sacola', 'Rosângela quer reservar ' + it.titulo.toLowerCase() + '.', '#/reserva/' + res.id);
        salvar(); montarNavSe();
        toast('Rosângela quer reservar seu item.', { acao: 'Ver', fn: function () { ir('#/reserva/' + res.id); } });
      }, 9000);
    },
    'pedido': function (f) {
      var s = E.get(), g = f.querySelector('[data-grupo="catPedido"]');
      var cat = g.dataset.valor || 'roupas', det = f.elements.detalhe.value.trim();
      s.pedidos.push({ id: E.novoId('p'), cat: cat, detalhe: det });
      ctx.catPedido = cat;
      var n = s.itens.filter(function (it) { return it.cat === cat && E.combina(it) && E.dentroDoRaio(it); }).length;
      if (n) E.notificar('coracao', (n === 1 ? '1 item perto de você combina' : n + ' itens perto de você combinam') + ' com ' + E.categoria(cat).nome.toLowerCase() + '.', '#/vitrine');
      salvar(); atualizar();
      toast(n ? 'Pedido adicionado. Já tem ' + (n === 1 ? '1 item' : n + ' itens') + ' perto de você.' : 'Pedido adicionado. Avisamos você quando aparecer algo.');
    },
    'perfil': function (f) {
      var u = E.get().usuario, nome = f.elements.nome.value.trim(), bairro = f.elements.bairro.value.trim();
      if (nome.length < 2 || !bairro) { toast('Preencha nome e bairro.'); return; }
      u.nome = nome; u.bairro = bairro; salvar(); fecharModal(); atualizar(); toast('Dados atualizados.');
    },
    'denuncia': function (f) {
      var g = f.querySelector('[data-grupo="motivo"]');
      if (!g.dataset.valor) { toast('Escolha o que aconteceu.'); var b = g.querySelector('button'); if (b) b.focus(); return; }
      fecharModal();
      toast('Recebemos seu relato. Nossa equipe analisa em até 48 horas.', { tempo: 5000 });
    }
  };

  /* ============================================================ Eventos */
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-acao]');
    if (!el) return;
    if (el.getAttribute('aria-disabled') === 'true' && el.dataset.acao !== 'reservar') { e.preventDefault(); return; }
    var fn = acoes[el.dataset.acao];
    if (!fn) return;
    var r = fn(el, e);
    if (r === false) e.preventDefault();
  });

  document.addEventListener('submit', function (e) {
    var f = e.target.closest('form[data-form]');
    if (!f) return;
    e.preventDefault();
    var fn = formularios[f.dataset.form];
    if (fn) fn(f);
  });

  document.addEventListener('input', function (e) {
    var el = e.target;
    if (el.dataset.entrada === 'busca') {
      filtros.q = el.value;
      var lista = document.getElementById('lista-itens');
      if (lista) lista.innerHTML = T.listaVitrine(filtros);
    } else if (el.dataset.entrada === 'raio') {
      var u = E.get().usuario; u.raio = Number(el.value);
      el.setAttribute('aria-valuetext', u.raio + ' quilômetros');
      ['raio-rotulo', 'raio-modal-rotulo'].forEach(function (id) { var r = document.getElementById(id); if (r) r.textContent = (id === 'raio-rotulo' ? 'até ' : '') + u.raio + ' km'; });
      salvar();
      if (lerRota().nome === 'vitrine' && !modal.hidden) { clearTimeout(el._t); el._t = setTimeout(function () { var m = document.getElementById('raio-modal'); var ativo = document.activeElement === m; atualizarFundo(); if (ativo && m) m.focus(); }, 150); }
    } else if (el.dataset.mascara === 'tel') {
      var d = el.value.replace(/\D/g, '').slice(0, 11), out = d;
      if (d.length > 2) out = '(' + d.slice(0, 2) + ') ' + d.slice(2);
      if (d.length > 7) out = '(' + d.slice(0, 2) + ') ' + d.slice(2, d.length - 4) + '-' + d.slice(-4);
      el.value = out;
    }
  });

  /* Atualiza a vitrine por trás da janela da distância sem fechar a janela. */
  function atualizarFundo() { var html = modal.innerHTML, aberto = !modal.hidden, sim = modalSim; render(false); if (aberto) { modal.innerHTML = html; modal.hidden = false; modalSim = sim; var m = document.getElementById('raio-modal'); if (m) m.value = E.get().usuario.raio; } }

  document.addEventListener('change', function (e) {
    var el = e.target;
    if (el.dataset.entrada === 'foto' && el.files && el.files[0]) {
      var arq = el.files[0];
      if (!/^image\//.test(arq.type)) { toast('Escolha um arquivo de imagem.'); return; }
      reduzirImagem(arq, function (url) {
        guardarCampos();
        rascunhos.doar.img = url; rascunhos.doar.ilustracao = false;
        if (ctx.erros) delete ctx.erros.img;
        atualizar(); toast('Foto adicionada e comprimida para gastar menos internet.');
      });
    } else if (el.dataset.entrada === 'raio' && lerRota().nome !== 'vitrine') {
      atualizar();
    }
  });

  modal.addEventListener('click', function (e) { if (e.target === modal) fecharModal(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.hidden) fecharModal();
    if (e.key === 'Tab' && !modal.hidden) {
      var f = modal.querySelectorAll('a[href], button:not([disabled]), input, textarea');
      if (!f.length) return;
      var prim = f[0], ult = f[f.length - 1];
      if (e.shiftKey && document.activeElement === prim) { e.preventDefault(); ult.focus(); }
      else if (!e.shiftKey && document.activeElement === ult) { e.preventDefault(); prim.focus(); }
    }
  });

  /* Reduz a foto para no máximo 900 px e JPEG ~70% (RNF02: imagens leves). */
  function reduzirImagem(arq, cb) {
    var leitor = new FileReader();
    leitor.onload = function () {
      var img = new Image();
      img.onload = function () {
        var max = 900, w = img.width, h = img.height, k = Math.min(1, max / Math.max(w, h));
        var c = document.createElement('canvas'); c.width = Math.round(w * k); c.height = Math.round(h * k);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        try { cb(c.toDataURL('image/jpeg', 0.7)); } catch (err) { cb(leitor.result); }
      };
      img.onerror = function () { toast('Não consegui abrir essa imagem. Tente outra.'); };
      img.src = leitor.result;
    };
    leitor.readAsDataURL(arq);
  }

  window.addEventListener('hashchange', function () {
    if (!modal.hidden && !pendenteConta) fecharModal();
    var h0 = location.hash;
    render(true);
    /* Se a tela pedia conta, o app volta para a vitrine e só então abre o aviso. */
    if (pendenteConta && location.hash === h0 && lerRota().nome === 'vitrine') { pendenteConta = false; pedirConta(); }
  });

  E.carregar();
  render(true);
})();
