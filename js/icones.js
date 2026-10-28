/* Ícones em traço (SVG inline). Sempre acompanhados de texto na interface (RNF01). */
(function () {
  var P = {
    loja: '<path d="M4 4h16l1 5H3z"/><path d="M5 9v11h14V9"/><path d="M10 20v-5h4v5"/>',
    mais: '<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',
    somar: '<path d="M12 5v14M5 12h14"/>',
    coracao: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
    sacola: '<path d="M5 8h14l-1 12H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
    usuario: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    busca: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
    pin: '<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    caminhao: '<path d="M2 6h12v10H2z"/><path d="M14 10h4l3 3v3h-7"/><circle cx="6.5" cy="17.5" r="1.8"/><circle cx="17.5" cy="17.5" r="1.8"/>',
    camera: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
    chat: '<path d="M4 5h16v11H9l-5 4z"/>',
    check: '<path d="M5 12l5 5 9-10"/>',
    bandeira: '<path d="M5 21V4"/><path d="M5 4h12l-2 4 2 4H5"/>',
    sino: '<path d="M6 16v-5a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
    cadeado: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    relogio: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    voltar: '<path d="M15 5l-7 7 7 7"/>',
    avancar: '<path d="M9 5l7 7-7 7"/>',
    enviar: '<path d="M4 12l16-8-6 16-2-7z"/>',
    escudo: '<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/><path d="M9 12l2 2 4-4"/>',
    lixo: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
    fechar: '<path d="M6 6l12 12M18 6L6 18"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
    sair: '<path d="M10 4H5v16h5"/><path d="M14 8l4 4-4 4M18 12H9"/>',
    lapis: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13 7l4 4"/>',
    desfazer: '<path d="M9 7L4 12l5 5"/><path d="M4 12h11a5 5 0 0 1 0 10h-3"/>',
    folha: '<path d="M5 19c8 0 14-6 14-14-8 0-14 6-14 14z"/><path d="M5 19l7-7"/>',
    letra: '<path d="M4 19l5-14 5 14M6 14h6"/><path d="M15 19l3-8 3 8M16 16.5h4"/>',
    ajuda: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6M12 17v.5"/>',
    roupas: '<path d="M8 4L4 7l2 4 2-1v10h8V10l2 1 2-4-4-3a4 4 0 0 1-8 0z"/>',
    alimentos: '<path d="M4 10h16l-2 10H6z"/><path d="M8 10l3-6M16 10l-3-6"/>',
    moveis: '<path d="M4 11V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3"/><path d="M3 11h18v6H3z"/><path d="M5 17v2M19 17v2"/>',
    eletro: '<rect x="6" y="3" width="12" height="18" rx="2"/><path d="M6 10h12M9 6v2M9 13v3"/>',
    escolar: '<path d="M5 4h12a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2z"/><path d="M5 18a2 2 0 0 1 2-2h12"/>',
    bebe: '<path d="M4 12h14a6 6 0 0 0-6-6h-1v6"/><path d="M4 12a7 7 0 0 0 14 0"/><circle cx="7" cy="20" r="1.5"/><circle cx="16" cy="20" r="1.5"/>',
    higiene: '<rect x="7" y="9" width="10" height="12" rx="2"/><path d="M10 9V6h4v3M14 4h-4"/>',
    estrela: 'CHEIA<path d="M12 3l2.7 5.6 6.1.8-4.4 4.3 1 6.1L12 17l-5.4 2.8 1-6.1-4.4-4.3 6.1-.8z"/>',
    coracaoCheio: 'CHEIA<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
    apagar: '<path d="M9 5h11v14H9l-6-7z"/><path d="M12 9l5 6M17 9l-5 6"/>'
  };
  window.Icone = function (nome, tam, rotulo) {
    var d = P[nome] || P.info;
    tam = tam || 24;
    var cheia = d.indexOf('CHEIA') === 0;
    if (cheia) d = d.slice(5);
    var a11y = rotulo ? ' role="img" aria-label="' + rotulo + '"' : ' aria-hidden="true"';
    return '<svg width="' + tam + '" height="' + tam + '" viewBox="0 0 24 24"' + a11y +
      (cheia ? ' fill="currentColor" stroke="none"' : ' fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"') +
      ' focusable="false">' + d + '</svg>';
  };
})();
