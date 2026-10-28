/* Estado do protótipo: guardado no navegador (localStorage) para o teste continuar de onde parou. */
window.Estado = (function () {
  var CHAVE = 'elo-solidario-prototipo-v1';
  var s = null;

  function carregar() {
    try {
      var bruto = localStorage.getItem(CHAVE);
      if (bruto) s = JSON.parse(bruto);
    } catch (e) { s = null; }
    if (!s || s.versao !== 1) s = Dados.inicial();
    return s;
  }

  function salvar() {
    try { localStorage.setItem(CHAVE, JSON.stringify(s)); return true; }
    catch (e) { return false; }
  }

  function reiniciar() {
    try { localStorage.removeItem(CHAVE); } catch (e) {}
    s = Dados.inicial();
    salvar();
  }

  function novoId(prefixo) { s.seq += 1; return prefixo + s.seq; }

  function item(id) { return s.itens.find(function (i) { return i.id === id; }); }
  function reserva(id) { return s.reservas.find(function (r) { return r.id === id; }); }
  function categoria(id) { return Dados.CATEGORIAS.find(function (c) { return c.id === id; }) || Dados.CATEGORIAS[0]; }
  function pessoa(id) {
    if (id === 'eu') {
      var u = s.usuario || { nome: 'Você', bairro: '' };
      return { nome: u.nome, bairro: u.bairro, inicial: (u.nome || 'V').charAt(0).toUpperCase(), nota: 5, avaliacoes: 0 };
    }
    return Dados.PESSOAS[id];
  }

  /* Correspondência automática (RF05): item disponível, de outra pessoa, dentro do raio e numa categoria pedida. */
  function combina(it) {
    if (!it || it.dono === 'eu' || it.status !== 'disponivel') return false;
    return s.pedidos.some(function (p) { return p.cat === it.cat; });
  }
  function dentroDoRaio(it) { return it.dono === 'eu' || it.dist <= (s.usuario ? s.usuario.raio : 5); }

  function reservaAtivaDoItem(itemId) {
    return s.reservas.find(function (r) { return r.item === itemId && (r.status === 'solicitada' || r.status === 'confirmada'); });
  }

  function notificar(icone, txt, link) {
    s.notifs.unshift({ id: novoId('n'), icone: icone, txt: txt, link: link, lida: false, quando: 'agora' });
  }
  function naoLidas() { return s.notifs.filter(function (n) { return !n.lida; }).length; }

  function codigo() { return String(Math.floor(1000 + Math.random() * 9000)); }

  return {
    get: function () { return s; },
    carregar: carregar, salvar: salvar, reiniciar: reiniciar, novoId: novoId,
    item: item, reserva: reserva, categoria: categoria, pessoa: pessoa,
    combina: combina, dentroDoRaio: dentroDoRaio, reservaAtivaDoItem: reservaAtivaDoItem,
    notificar: notificar, naoLidas: naoLidas, codigo: codigo
  };
})();
