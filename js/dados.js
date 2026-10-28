/* Dados de exemplo do protótipo. As pessoas abaixo são fictícias e baseadas nas personas do projeto. */
window.Dados = (function () {
  var CATEGORIAS = [
    { id: 'roupas', nome: 'Roupas e calçados', curto: 'Roupas', icone: 'roupas' },
    { id: 'alimentos', nome: 'Alimentos', curto: 'Alimentos', icone: 'alimentos' },
    { id: 'moveis', nome: 'Móveis e cama', curto: 'Móveis', icone: 'moveis' },
    { id: 'eletro', nome: 'Eletrodomésticos', curto: 'Eletro', icone: 'eletro' },
    { id: 'escolar', nome: 'Material escolar', curto: 'Escolar', icone: 'escolar' },
    { id: 'bebe', nome: 'Bebê', curto: 'Bebê', icone: 'bebe' },
    { id: 'higiene', nome: 'Higiene', curto: 'Higiene', icone: 'higiene' }
  ];

  var PESSOAS = {
    beatriz: { nome: 'Beatriz', bairro: 'Vila Mariana', nota: 5.0, avaliacoes: 2, doacoes: 2, recebidas: 0, desde: 'março de 2026', inicial: 'B' },
    rosangela: { nome: 'Rosângela', bairro: 'Brasilândia', nota: 5.0, avaliacoes: 2, doacoes: 0, recebidas: 2, desde: 'agosto de 2026', inicial: 'R' },
    carlos: { nome: 'Carlos', bairro: 'Casa Verde', nota: 4.8, avaliacoes: 6, doacoes: 7, recebidas: 0, desde: 'janeiro de 2026', inicial: 'C' },
    lucia: { nome: 'Lúcia', bairro: 'Freguesia do Ó', nota: 4.9, avaliacoes: 11, doacoes: 12, recebidas: 1, desde: 'dezembro de 2025', inicial: 'L' },
    joana: { nome: 'Joana', bairro: 'Limão', nota: 5.0, avaliacoes: 3, doacoes: 4, recebidas: 0, desde: 'junho de 2026', inicial: 'J' },
    paulo: { nome: 'Paulo', bairro: 'Santana', nota: 4.7, avaliacoes: 5, doacoes: 5, recebidas: 0, desde: 'abril de 2026', inicial: 'P' },
    marcos: { nome: 'Marcos', bairro: 'Casa Verde', nota: 4.9, avaliacoes: 9, doacoes: 0, recebidas: 0, desde: 'maio de 2026', inicial: 'M', voluntario: 'Voluntário com carro (pickup)' }
  };

  var HORARIOS = ['Manhã', 'Tarde', 'Noite (dias úteis)', 'Sábado', 'Domingo'];

  function inicial() {
    return {
      versao: 1,
      usuario: null,
      prefs: { economia: false, fonteGrande: false },
      seq: 100,
      itens: [
        { id: 'i1', dono: 'beatriz', titulo: 'Sacola de roupa infantil, 6 anos', cat: 'roupas', estado: 'Bom', tamanho: '6 anos',
          desc: 'Camisetas, bermudas e dois agasalhos. Tudo lavado e sem rasgos.', dist: 4.2, img: 'assets/itens/sacola-6-anos.svg',
          horarios: ['Noite (dias úteis)', 'Sábado'], grande: false, status: 'disponivel', quando: 'há 2 horas' },
        { id: 'i2', dono: 'beatriz', titulo: 'Sacola de roupa infantil, 12 anos', cat: 'roupas', estado: 'Bom', tamanho: '12 anos',
          desc: 'Agasalhos, duas calças jeans e camisetas.', dist: 4.2, img: 'assets/itens/sacola-12-anos.svg',
          horarios: ['Noite (dias úteis)', 'Sábado'], grande: false, status: 'disponivel', quando: 'há 2 horas' },
        { id: 'i3', dono: 'carlos', titulo: 'Geladeira em funcionamento', cat: 'eletro', estado: 'Usado', tamanho: '',
          desc: 'Funcionando bem. Troquei por uma maior e não tenho espaço para as duas.', dist: 2.8, img: 'assets/itens/geladeira.svg',
          horarios: ['Sábado', 'Domingo'], grande: true, status: 'disponivel', quando: 'ontem' },
        { id: 'i4', dono: 'lucia', titulo: 'Cesta com alimentos não perecíveis', cat: 'alimentos', estado: 'Novo', tamanho: '',
          desc: 'Arroz, feijão, macarrão, óleo e enlatados. Tudo dentro da validade.', dist: 1.3, img: 'assets/itens/cesta-alimentos.svg',
          horarios: ['Tarde', 'Noite (dias úteis)'], grande: false, status: 'disponivel', quando: 'há 30 minutos' },
        { id: 'i5', dono: 'joana', titulo: 'Kit de material escolar', cat: 'escolar', estado: 'Novo', tamanho: '',
          desc: 'Mochila, cadernos e lápis. Serve para o ensino fundamental.', dist: 0.9, img: 'assets/itens/kit-escolar.svg',
          horarios: ['Manhã', 'Sábado'], grande: false, status: 'disponivel', quando: 'há 3 dias' },
        { id: 'i6', dono: 'paulo', titulo: 'Colchão de solteiro', cat: 'moveis', estado: 'Bom', tamanho: 'Solteiro',
          desc: 'Colchão de espuma com travesseiro. Sem manchas.', dist: 3.5, img: 'assets/itens/colchao.svg',
          horarios: ['Sábado', 'Domingo'], grande: true, status: 'disponivel', quando: 'há 1 dia' },
        { id: 'i7', dono: 'eu', titulo: 'Carrinho de bebê reclinável', cat: 'bebe', estado: 'Bom', tamanho: '',
          desc: 'Usado por dois anos, rodinhas em ordem.', dist: 0, img: 'assets/itens/carrinho-bebe.svg',
          horarios: ['Noite (dias úteis)', 'Sábado'], grande: false, status: 'reservado', quando: 'há 5 dias' }
      ],
      pedidos: [
        { id: 'p1', cat: 'roupas', detalhe: 'Tamanhos 6 e 12 anos' },
        { id: 'p2', cat: 'eletro', detalhe: 'Geladeira' }
      ],
      reservas: [
        { id: 'r1', item: 'i7', papel: 'doador', outro: 'rosangela', horario: 'Sábado', status: 'solicitada', codigo: '4827',
          transporte: null, avaliacao: 0, agradecimento: '',
          msgs: [{ de: 'sistema', txt: 'Rosângela pediu para reservar seu carrinho de bebê.' },
                 { de: 'outro', txt: 'Oi! Meu sobrinho vai nascer mês que vem e o carrinho ia ajudar muito. Posso buscar no sábado?' }] }
      ],
      notifs: [
        { id: 'n1', icone: 'coracao', txt: '2 itens novos perto de você combinam com sua lista.', link: '#/vitrine?combina=1', lida: false, quando: 'há 2 horas' },
        { id: 'n2', icone: 'sacola', txt: 'Rosângela quer reservar seu carrinho de bebê.', link: '#/reserva/r1', lida: false, quando: 'há 1 hora' }
      ]
    };
  }

  return { CATEGORIAS: CATEGORIAS, PESSOAS: PESSOAS, HORARIOS: HORARIOS, inicial: inicial };
})();
