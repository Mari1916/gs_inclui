// Aguarda o HTML ser carregado antes de iniciar os recursos da página.
document.addEventListener('DOMContentLoaded', () => {
  // Chaves usadas para guardar as preferências no armazenamento local do navegador.
  const chavePreferenciasRecursos = 'inclui-recursos-acessibilidade';
  const chaveTamanhoFonte = 'inclui-tamanho-fonte';
  // Chaves específicas identificam cada preferência salva no localStorage.

  // Lê o tema salvo sem interromper o site caso o armazenamento esteja indisponível.
  const lerTemaSalvo = () => {
    // try/catch evita que navegadores sem suporte ao localStorage travem o site.
    try {
      return localStorage.getItem('inclui-tema');
    } catch (erro) {
      console.warn('Não foi possível carregar o tema salvo.', erro);
      return null;
    }
  };
  const salvarTema = (tema) => {
    try {
      localStorage.setItem('inclui-tema', tema);
    } catch (erro) {
      console.warn('Não foi possível salvar o tema escolhido.', erro);
    }
  };
  const lerPreferenciasRecursos = () => {
    // JSON.parse converte a string salva em objeto; dados inválidos são ignorados.
    try {
      const salvo = localStorage.getItem(chavePreferenciasRecursos);
      if (!salvo) return null;
      const preferencias = JSON.parse(salvo);
      if (!preferencias || typeof preferencias !== 'object' || Array.isArray(preferencias)) {
        throw new TypeError('O formato salvo não é válido.');
      }
      return preferencias;
    } catch (erro) {
      console.warn('Não foi possível carregar as preferências de acessibilidade.', erro);
      return null;
    }
  };
  const salvarPreferenciasRecursos = (preferencias) => {
    try {
      localStorage.setItem(chavePreferenciasRecursos, JSON.stringify(preferencias));
    } catch (erro) {
      console.warn('Não foi possível salvar as preferências de acessibilidade.', erro);
    }
  };
  const lerTamanhoFonteSalvo = () => {
    // Number valida o tamanho salvo e aplica 16 px como padrão seguro.
    try {
      const salvo = Number(localStorage.getItem(chaveTamanhoFonte));
      return Number.isFinite(salvo) && salvo >= 14 && salvo <= 24 ? salvo : 16;
    } catch (erro) {
      console.warn('Não foi possível carregar o tamanho de fonte salvo.', erro);
      return 16;
    }
  };

  // Troca a imagem da marca conforme o tema claro ou escuro escolhido.
  const imagensLogo = document.querySelectorAll('[data-logo-claro][data-logo-escuro]');
  // querySelectorAll encontra todas as imagens que podem trocar conforme o tema.
  const aplicarLogoDoTema = (tema) => {
    imagensLogo.forEach((imagem) => {
      imagem.src = imagem.dataset[tema === 'escuro' ? 'logoEscuro' : 'logoClaro'];
    });
  };
  const temaSalvo = lerTemaSalvo();
  if (temaSalvo === 'claro' || temaSalvo === 'escuro') {
    document.body.dataset.tema = temaSalvo;
  }
  aplicarLogoDoTema(document.body.dataset.tema);

  // Cria o botão flutuante de acessibilidade em páginas que ainda não possuem ele no HTML.
  if (!document.querySelector('#abrir-acessibilidade-flutuante')) {
    const botaoAcessibilidade = document.createElement('button');
    botaoAcessibilidade.className = 'botao-acessibilidade-flutuante';
    botaoAcessibilidade.id = 'abrir-acessibilidade-flutuante';
    botaoAcessibilidade.type = 'button';
    botaoAcessibilidade.setAttribute('aria-haspopup', 'dialog');
    botaoAcessibilidade.setAttribute('aria-controls', 'acessibilidade');
    botaoAcessibilidade.innerHTML = '<span aria-hidden="true">♿</span> Acessibilidade';
    document.body.append(botaoAcessibilidade);
  }

  // Monta o painel de acessibilidade quando ele não foi declarado diretamente na página.
  if (!document.querySelector('#acessibilidade')) {
    const opcoesAcessibilidade = [
      ['audio', 'Ouvir o conteúdo', 'Lê textos em voz alta ao passar o mouse ou navegar com o teclado.'],
      ['libras', 'Libras', 'Ativa o VLibras para traduzir textos da página em Língua Brasileira de Sinais. Requer internet.'],
      ['legendas', 'Legendas', 'Registra preferência por legendas em vídeos, quando disponíveis.'],
      ['leitor-tela', 'Leitor de tela', 'Informações de compatibilidade com leitores de tela.'],
      ['teclado', 'Navegar pelo teclado', 'Use Tab para avançar e Enter para ativar links e botões.'],
      ['daltonismo', 'Cores mais distinguíveis', 'Usa cores e contornos mais fáceis de diferenciar.'],
      ['contraste', 'Alto contraste', 'Aumenta o contraste de textos, botões e bordas.'],
      ['espacamento', 'Mais espaço entre letras', 'Aumenta o espaço entre letras e linhas.'],
      ['fonte-legivel', 'Fonte mais legível', 'Usa uma fonte simples e sem enfeites.'],
      ['linguagem-simples', 'Apoio para leitura simples', 'Destaca exemplos e orientações em linguagem simples disponíveis no INCLUI.'],
      ['imagens', 'Apoio visual', 'Destaca ícones e etapas numeradas das orientações.'],
      ['sem-animacoes', 'Reduzir animações', 'Reduz movimentos decorativos.'],
      ['leitura-facil', 'Modo de leitura', 'Reduz enfeites e limita a largura do texto.'],
    ];
    const dialogoAcessibilidade = document.createElement('dialog');
    dialogoAcessibilidade.className = 'painel-acessibilidade';
    dialogoAcessibilidade.id = 'acessibilidade';
    dialogoAcessibilidade.setAttribute('aria-labelledby', 'titulo-acessibilidade');
    dialogoAcessibilidade.innerHTML = `
      <button class="fechar-acessibilidade" type="button" aria-label="Fechar opções de acessibilidade">×</button>
      <div class="cabecalho-secao">
        <div>
          <p class="chamada">ACESSIBILIDADE EM DIFERENTES FORMAS</p>
          <h2 id="titulo-acessibilidade">O que cada recurso faz — e como pode ajudar?</h2>
        </div>
        <p class="introducao-secao">Escolha os recursos que tornam esta página mais confortável para você.</p>
      </div>
      <fieldset class="seletor-tema" aria-describedby="descricao-tema">
        <legend>Tema de cores</legend>
        <p id="descricao-tema">Escolha entre o tema claro e o escuro.</p>
        <label><input type="radio" name="tema" value="claro" /> Claro</label>
        <label><input type="radio" name="tema" value="escuro" /> Escuro</label>
      </fieldset>
      <div class="controle-tamanho-fonte" role="group" aria-labelledby="titulo-tamanho-fonte">
        <div><strong id="titulo-tamanho-fonte">Tamanho da fonte</strong><small>Ajuste o tamanho das letras.</small></div>
        <div class="botoes-tamanho-fonte">
          <button type="button" id="diminuir-fonte" aria-label="Diminuir tamanho da fonte">A−</button>
          <output id="valor-fonte" aria-live="polite">100%</output>
          <button type="button" id="aumentar-fonte" aria-label="Aumentar tamanho da fonte">A+</button>
        </div>
      </div>
      <fieldset class="grade-preferencias">
        <legend class="visualmente-oculto">Recursos de acessibilidade</legend>
        ${opcoesAcessibilidade.map(([recurso, titulo, descricao]) => `
          <label class="cartao-acessibilidade">
            <input type="checkbox" role="switch" data-recurso="${recurso}" />
            <span class="texto-preferencia"><strong>${titulo}</strong><small>${descricao}</small></span>
            <span class="interruptor" aria-hidden="true"></span>
          </label>
        `).join('')}
      </fieldset>
      <div class="acoes-acessibilidade">
        <button class="botao botao-primario" id="botao-ouvir-pagina" type="button" disabled>Ouvir esta página</button>
        <button class="botao botao-secundario" id="botao-parar-leitura" type="button" disabled>Parar leitura</button>
        <p class="nota-privacidade" id="estado-acessibilidade" aria-live="polite">Selecione os recursos que deseja usar.</p>
      </div>`;
    document.body.append(dialogoAcessibilidade);
  }

  // Controla o menu principal no formato responsivo de cada cabeçalho.
  const cabecalhos = document.querySelectorAll('.cabecalho-site');
  // Cada cabeçalho recebe comportamento independente para abrir e fechar o menu móvel.
  cabecalhos.forEach((cabecalho) => {
    const botaoMenu = cabecalho.querySelector('.botao-menu-mobile');
    const navegacao = cabecalho.querySelector('.navegacao-principal');
    if (!botaoMenu || !navegacao) return;

    const fecharMenu = (devolverFoco = false) => {
      cabecalho.classList.remove('menu-aberto');
      botaoMenu.setAttribute('aria-expanded', 'false');
      botaoMenu.setAttribute('aria-label', 'Abrir menu');
      if (devolverFoco) botaoMenu.focus();
    };

    botaoMenu.addEventListener('click', () => {
      const aberto = botaoMenu.getAttribute('aria-expanded') === 'true';
      cabecalho.classList.toggle('menu-aberto', !aberto);
      botaoMenu.setAttribute('aria-expanded', String(!aberto));
      botaoMenu.setAttribute('aria-label', aberto ? 'Abrir menu' : 'Fechar menu');
    });

    navegacao.addEventListener('click', (evento) => {
      if (evento.target instanceof Element && evento.target.closest('a')) fecharMenu();
    });

    document.addEventListener('click', (evento) => {
      if (evento.target instanceof Node && !cabecalho.contains(evento.target)) fecharMenu();
    });

    document.addEventListener('keydown', (evento) => {
      if (evento.key === 'Escape' && cabecalho.classList.contains('menu-aberto')) {
        fecharMenu(true);
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 800) fecharMenu();
    });
  });

  const yearNode = document.querySelector('[data-current-year]');
  if (yearNode) yearNode.textContent = new Date().getFullYear();

  // Remove acentos e padroniza textos para tornar as buscas mais tolerantes.
  const normalizarTextoBusca = (texto) => texto
    // normalize separa letras de acentos; a expressão regular remove os acentos.
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .trim();

  const configurarBusca = (seletorCampo, seletorItens, idEstado, rotulo) => {
    // O filtro compara o campo digitado com o texto e os dados-termos de cada item.
    const campo = document.querySelector(seletorCampo);
    const itens = [...document.querySelectorAll(seletorItens)];
    const estado = document.querySelector(`#${idEstado}`);
    if (!campo || !estado || !itens.length) return;

    const filtrar = () => {
      const consulta = normalizarTextoBusca(campo.value);
      let visiveis = 0;
      itens.forEach((item) => {
        const termos = normalizarTextoBusca(`${item.innerText} ${item.dataset.termos || ''}`);
        const corresponde = !consulta || termos.includes(consulta);
        item.hidden = !corresponde;
        if (corresponde) visiveis += 1;
      });

      if (!consulta) {
        estado.textContent = `${itens.length} ${rotulo}${itens.length === 1 ? '' : 's'} disponíveis.`;
      } else if (visiveis) {
        estado.textContent = `${visiveis} ${rotulo}${visiveis === 1 ? '' : 's'} encontrado${visiveis === 1 ? '' : 's'}.`;
      } else {
        estado.textContent = `Nenhum ${rotulo} encontrado. Tente outra palavra.`;
      }
    };

    campo.addEventListener('input', filtrar);
  };

  configurarBusca('#campo-busca-servicos', '.cartao-servico[data-termos]', 'estado-busca-servicos', 'tema');
  configurarBusca('#busca-glossario', '.termo-glossario[data-termos]', 'estado-busca-glossario', 'termo');

  // Mantém as listas de verificação marcadas somente no navegador do usuário.
  document.querySelectorAll('[data-lista-verificacao]').forEach((lista) => {
    // forEach cria uma lista persistente separada para cada bloco de verificação.
    const nomeLista = lista.dataset.listaVerificacao;
    const chaveArmazenamento = `inclui-lista-verificacao-${nomeLista}`;
    const estado = lista.querySelector('[data-status-lista-verificacao]');
    const itens = [...lista.querySelectorAll('[data-item-verificacao]')];
    let marcacoes = {};
    let armazenamentoDisponivel = true;

    try {
      const salvo = localStorage.getItem(chaveArmazenamento);
      if (salvo) {
        const dadosSalvos = JSON.parse(salvo);
        if (!dadosSalvos || typeof dadosSalvos !== 'object' || Array.isArray(dadosSalvos)) {
          throw new TypeError('O formato salvo não é válido.');
        }
        marcacoes = dadosSalvos;
      }
    } catch (erro) {
      armazenamentoDisponivel = false;
      console.warn('Não foi possível carregar as marcações locais da lista de verificação.', erro);
    }

    itens.forEach((item) => {
      item.checked = marcacoes[item.dataset.itemVerificacao] === true;
      item.addEventListener('change', () => {
        marcacoes[item.dataset.itemVerificacao] = item.checked;
        try {
          localStorage.setItem(chaveArmazenamento, JSON.stringify(marcacoes));
          armazenamentoDisponivel = true;
          if (estado) estado.textContent = 'Marcação salva somente neste navegador.';
        } catch (erro) {
          armazenamentoDisponivel = false;
          console.warn('Não foi possível salvar as marcações locais da lista de verificação.', erro);
          if (estado) estado.textContent = 'Não foi possível salvar. Suas marcações ficarão disponíveis somente enquanto esta página estiver aberta.';
        }
      });
    });

    if (estado && !armazenamentoDisponivel) {
      estado.textContent = 'O armazenamento local não está disponível. Suas marcações ficarão disponíveis somente enquanto esta página estiver aberta.';
    } else if (estado) {
      estado.textContent = 'As marcações são privadas e ficam neste navegador.';
    }
  });

  // Prepara o formulário de contato para abrir o aplicativo de e-mail do usuário.
  const formularioContato = document.querySelector('#formulario-contato');
  // submit impede o envio convencional e abre um link mailto com os dados preenchidos.
  const estadoFormularioContato = document.querySelector('#estado-formulario-contato');
  formularioContato?.addEventListener('submit', (evento) => {
    evento.preventDefault();
    if (!formularioContato.reportValidity()) return;

    const dados = new FormData(formularioContato);
    const assunto = `[INCLUI] ${dados.get('assunto')}`;
    const mensagem = [
      `Nome: ${dados.get('nome')}`,
      `E-mail para resposta: ${dados.get('email')}`,
      '',
      String(dados.get('mensagem')),
    ].join('\n');
    const linkEmail = document.createElement('a');
    linkEmail.href = `mailto:?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(mensagem)}`;
    linkEmail.hidden = true;
    document.body.append(linkEmail);
    linkEmail.click();
    linkEmail.remove();

    if (estadoFormularioContato) {
      estadoFormularioContato.textContent = 'Abrimos seu aplicativo de e-mail com a mensagem pronta. Informe o destinatário antes de enviar; o INCLUI não recebe nem armazena os dados por este formulário.';
    }
  });

  // Obtém os elementos do painel antes de sincronizar recursos e preferências.
  const recursos = document.querySelectorAll('[data-recurso]');
  // data-recurso identifica os interruptores exibidos no painel de acessibilidade.
  const seletorTema = document.querySelectorAll('input[name="tema"]');
  const estadoAcessibilidade = document.querySelector('#estado-acessibilidade');
  const botaoOuvir = document.querySelector('#botao-ouvir-pagina');
  const botaoParar = document.querySelector('#botao-parar-leitura');
  const recursoAudio = document.querySelector('[data-recurso="audio"]');
  const recursoLibras = document.querySelector('[data-recurso="libras"]');
  const conteudoPrincipal = document.querySelector('main');
  const botaoDiminuirFonte = document.querySelector('#diminuir-fonte');
  const botaoAumentarFonte = document.querySelector('#aumentar-fonte');
  const valorFonte = document.querySelector('#valor-fonte');
  let tamanhoFonte = lerTamanhoFonteSalvo();
  const painelAcessibilidade = document.querySelector('#acessibilidade');
  const gatilhosAcessibilidade = document.querySelectorAll(
    '#abrir-acessibilidade-flutuante, a[href="#acessibilidade"]',
  );
  const botaoFecharAcessibilidade = document.querySelector('.fechar-acessibilidade');
  const chavePreferenciaLibras = 'inclui-libras';
  let scriptVlibrasCarregado = false;
  let erroCarregamentoVlibras = false;
  let temporizadorLeitura = null;
  let ultimoAlvoLido = null;
  let alvoLeituraAtual = null;
  let idLeitura = 0;
  const suporteLeitura = 'speechSynthesis' in window
    && 'SpeechSynthesisUtterance' in window;
  // A constante indica se o navegador oferece API de síntese de voz em português.

  // Leitura e persistência da preferência específica do VLibras.
  const lerPreferenciaLibras = () => {
    try {
      return localStorage.getItem(chavePreferenciaLibras) === 'ativo';
    } catch (erro) {
      console.warn('Não foi possível carregar a preferência de Libras.', erro);
      return false;
    }
  };

  const salvarPreferenciaLibras = (ativo) => {
    try {
      localStorage.setItem(chavePreferenciaLibras, ativo ? 'ativo' : 'inativo');
    } catch (erro) {
      console.warn('Não foi possível salvar a preferência de Libras.', erro);
    }
  };

  // Restaura cada interruptor com base nas preferências salvas localmente.
  const preferenciasRecursosSalvas = lerPreferenciasRecursos();
  recursos.forEach((recurso) => {
    const nome = recurso.dataset.recurso;
    if (typeof preferenciasRecursosSalvas?.[nome] === 'boolean') {
      recurso.checked = preferenciasRecursosSalvas[nome];
    } else if (nome === 'libras') {
      recurso.checked = lerPreferenciaLibras();
    }
  });

  // Oculta ou mostra os elementos do VLibras conforme a escolha do usuário.
  const sincronizarVisibilidadeVlibras = () => {
    // checked indica se o usuário ativou Libras; os elementos do widget seguem esse estado.
    const ativo = recursoLibras?.checked;
    ['#vlibras-access-wrapper', '#vlibras-app-root'].forEach((seletor) => {
      const elemento = document.querySelector(seletor);
      if (elemento) elemento.style.display = ativo ? '' : 'none';
    });
  };

  // Carrega o script oficial do VLibras somente quando o recurso é ativado.
  const carregarVlibras = () => {
    // createElement('script') adiciona o VLibras externamente apenas sob demanda.
    if (scriptVlibrasCarregado || document.querySelector('script[data-inclusao-vlibras]')) return;
    scriptVlibrasCarregado = true;
    erroCarregamentoVlibras = false;
    const scriptVlibras = document.createElement('script');
    scriptVlibras.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
    scriptVlibras.async = true;
    scriptVlibras.dataset.inclusaoVlibras = 'true';
    scriptVlibras.onload = () => {
      window.setTimeout(() => {
        if (document.querySelector('#vlibras-access-wrapper')) {
          sincronizarVisibilidadeVlibras();
          return;
        }
        erroCarregamentoVlibras = true;
        scriptVlibrasCarregado = false;
        scriptVlibras.remove();
        if (estadoAcessibilidade) {
          estadoAcessibilidade.textContent = 'O VLibras não conseguiu iniciar. Verifique sua conexão e tente novamente.';
        }
      }, 500);
    };
    scriptVlibras.onerror = () => {
      erroCarregamentoVlibras = true;
      scriptVlibrasCarregado = false;
      scriptVlibras.remove();
      salvarPreferenciaLibras(false);
      if (recursoLibras) recursoLibras.checked = false;
      sincronizarVisibilidadeVlibras();
      if (estadoAcessibilidade) {
        estadoAcessibilidade.textContent = 'Não foi possível carregar o VLibras. Verifique sua conexão e tente novamente.';
      }
    };
    document.body.append(scriptVlibras);
  };

  const observadorVlibras = new MutationObserver(sincronizarVisibilidadeVlibras);
  // MutationObserver detecta quando o widget oficial é inserido no <body>.
  observadorVlibras.observe(document.body, { childList: true });

  if (recursoLibras) recursoLibras.checked = lerPreferenciaLibras();
  const indicadorLeitura = document.createElement('div');
  indicadorLeitura.className = 'indicador-leitura';
  indicadorLeitura.setAttribute('aria-hidden', 'true');
  indicadorLeitura.innerHTML = '<span class="indicador-leitura-mao">☝</span><span>Lendo</span>';
  document.body.append(indicadorLeitura);

  // Posiciona o indicador visual próximo ao texto que está sendo lido.
  const posicionarIndicadorLeitura = (x, y) => {
    // offsetWidth e offsetHeight calculam o limite seguro para o indicador na janela.
    const margem = 12;
    const largura = indicadorLeitura.offsetWidth || 88;
    const altura = indicadorLeitura.offsetHeight || 36;
    indicadorLeitura.style.left = `${Math.max(margem, Math.min(x + 16, window.innerWidth - largura - margem))}px`;
    indicadorLeitura.style.top = `${Math.max(margem, Math.min(y + 16, window.innerHeight - altura - margem))}px`;
  };

  const mostrarIndicadorLeitura = () => {
    if (!alvoLeituraAtual) return;
    indicadorLeitura.classList.add('indicador-leitura-ativo');
    const retangulo = alvoLeituraAtual.getBoundingClientRect();
    posicionarIndicadorLeitura(retangulo.left + Math.min(retangulo.width, 24), retangulo.top + Math.min(retangulo.height, 24));
  };

  const ocultarIndicadorLeitura = () => {
    indicadorLeitura.classList.remove('indicador-leitura-ativo');
    alvoLeituraAtual = null;
  };

  // Interrompe leitura em voz alta, limpa estados e atualiza o aviso ao usuário.
  const pararLeitura = (mensagem) => {
    // cancel encerra a fala atual e o temporizador; incrementa o id para invalidar callbacks antigos.
    window.clearTimeout(temporizadorLeitura);
    idLeitura += 1;
    if (suporteLeitura) window.speechSynthesis.cancel();
    if (botaoParar) botaoParar.disabled = true;
    ocultarIndicadorLeitura();
    if (mensagem && estadoAcessibilidade) estadoAcessibilidade.textContent = mensagem;
  };

  // Usa a síntese de voz do navegador para ler um texto em português.
  const lerTexto = (texto, anunciarEstado = true, statusDestino = estadoAcessibilidade) => {
    // SpeechSynthesisUtterance cria a fala; getVoices procura uma voz compatível com pt-BR.
    if (!suporteLeitura) {
      if (anunciarEstado && statusDestino) {
        statusDestino.textContent = 'A leitura em voz alta não está disponível neste navegador.';
      }
      return;
    }

    const textoPreparado = texto.replace(/\s+/g, ' ').trim();
    if (!textoPreparado) return;

    const leituraAtual = ++idLeitura;
    window.clearTimeout(temporizadorLeitura);
    window.speechSynthesis.cancel();
    const fala = new SpeechSynthesisUtterance(textoPreparado);
    fala.lang = 'pt-BR';
    const vozPortugues = window.speechSynthesis.getVoices()
      .find((voz) => voz.lang.toLowerCase().startsWith('pt'));
    if (vozPortugues) fala.voice = vozPortugues;
    fala.onstart = () => {
      if (leituraAtual === idLeitura) mostrarIndicadorLeitura();
    };
    fala.onend = () => {
      if (leituraAtual !== idLeitura) return;
      if (botaoParar) botaoParar.disabled = true;
      ocultarIndicadorLeitura();
      if (anunciarEstado && statusDestino) {
        statusDestino.textContent = 'Leitura concluída.';
      }
    };
    fala.onerror = () => {
      if (leituraAtual !== idLeitura) return;
      if (botaoParar) botaoParar.disabled = true;
      ocultarIndicadorLeitura();
      if (statusDestino) {
        statusDestino.textContent = 'Não foi possível concluir a leitura em voz alta.';
      }
    };

    window.speechSynthesis.speak(fala);
    if (botaoParar) botaoParar.disabled = false;
    if (anunciarEstado && statusDestino) {
      statusDestino.textContent = 'Lendo o conteúdo em voz alta.';
    }
  };

  const atributosRecursos = {
    // Cada chave liga um recurso a um atributo data-* aplicado no elemento <body>.
    daltonismo: ['paleta', 'daltonismo'],
    contraste: ['contraste', 'alto'],
    espacamento: ['espacamento', 'amplo'],
    'fonte-legivel': ['fonte', 'simples'],
    'linguagem-simples': ['linguagem', 'simples'],
    imagens: ['visuais', 'ativo'],
    teclado: ['teclado', 'ativo'],
    'sem-animacoes': ['animacao', 'reduzida'],
    'leitura-facil': ['leitura', 'foco'],
  };

  // Sincroniza opções rápidas da página inicial com os recursos detalhados do painel.
  const sincronizarEscolhasAcesso = () => {
    const escolhas = {
      audio: recursos.length && document.querySelector('[data-recurso="audio"]')?.checked,
      libras: recursoLibras?.checked,
      visao: document.querySelector('[data-recurso="contraste"]')?.checked
        && document.querySelector('[data-recurso="fonte-legivel"]')?.checked
        && tamanhoFonte >= 18,
      imagens: document.querySelector('[data-recurso="imagens"]')?.checked
        && document.querySelector('[data-recurso="linguagem-simples"]')?.checked,
    };
    document.querySelectorAll('[data-perfil-acesso]').forEach((opcao) => {
      opcao.checked = Boolean(escolhas[opcao.dataset.perfilAcesso]);
    });
  };

  // Aplica os atributos de acessibilidade no <body> e salva as escolhas.
  const atualizarPreferencias = () => {
    // Percorre os interruptores, altera atributos CSS e informa o status em aria-live.
    if (recursoAudio?.checked) {
      document.body.dataset.audio = 'ativo';
    } else {
      delete document.body.dataset.audio;
    }

    const avisoLinguagemSimples = document.querySelector('[data-aviso-linguagem-simples]');
    if (avisoLinguagemSimples) {
      avisoLinguagemSimples.hidden = !document.querySelector('[data-recurso="linguagem-simples"]')?.checked;
    }

    recursos.forEach((recurso) => {
      const atributo = atributosRecursos[recurso.dataset.recurso];
      if (atributo) {
        document.body.dataset[atributo[0]] = recurso.checked ? atributo[1] : '';
        if (!recurso.checked) delete document.body.dataset[atributo[0]];
      }

    });

    const selecionados = [...recursos].filter((recurso) => recurso.checked);
    const preferencias = selecionados
      .filter((recurso) => recurso.dataset.recurso === 'legendas')
      .map(() => 'legendas');
    let mensagem = selecionados.length
      ? `${selecionados.length} recurso${selecionados.length === 1 ? '' : 's'} selecionado${selecionados.length === 1 ? '' : 's'}.`
      : 'Nenhum recurso adicional selecionado.';

    if (preferencias.length) {
      mensagem += ` Preferência por ${preferencias.join(' e ')} registrada para conteúdos quando disponíveis.`;
    }

    if (recursoLibras?.checked) {
      if (!erroCarregamentoVlibras) carregarVlibras();
      mensagem += ' VLibras ativado. Use o botão do VLibras que aparece na página para escolher um avatar e iniciar a tradução.';
    }

    if (recursoAudio?.checked) {
      mensagem += ' Passe o mouse sobre um texto ou use Tab para ouvi-lo.';
    }
    salvarPreferenciasRecursos(Object.fromEntries(
      [...recursos].map((recurso) => [recurso.dataset.recurso, recurso.checked]),
    ));
    sincronizarEscolhasAcesso();
    [
      ['audio', 'Áudio', recursoAudio?.checked],
      ['libras', 'Libras', recursoLibras?.checked],
      ['contraste', 'Alto contraste', document.querySelector('[data-recurso="contraste"]')?.checked],
    ].forEach(([nome, titulo, ativo]) => {
      const indicador = document.querySelector(`[data-status-recurso="${nome}"]`);
      if (!indicador) return;
      const verbo = nome === 'libras'
        ? (ativo ? 'ativada' : 'desativada')
        : (ativo ? 'ativado' : 'desativado');
      indicador.textContent = `${ativo ? '✓ ' : ''}${titulo} ${verbo}`;
      indicador.classList.toggle('recurso-ativo', Boolean(ativo));
    });
    if (estadoAcessibilidade) estadoAcessibilidade.textContent = mensagem;
    if (botaoOuvir) botaoOuvir.disabled = !recursoAudio?.checked;
    if (!recursoAudio?.checked) {
      pararLeitura();
    }
  };

  recursos.forEach((recurso) => recurso.addEventListener('change', atualizarPreferencias));
  recursoLibras?.addEventListener('change', () => {
    salvarPreferenciaLibras(recursoLibras.checked);
    if (recursoLibras.checked) {
      erroCarregamentoVlibras = false;
      carregarVlibras();
    } else {
      sincronizarVisibilidadeVlibras();
    }
  });

  // Atualiza o tamanho da fonte em toda a página e salva o valor escolhido.
  const aplicarTamanhoFonte = () => {
    // style.fontSize usa um número entre 14 e 24 px e o output mostra a porcentagem.
    document.documentElement.style.fontSize = `${tamanhoFonte}px`;
    document.body.style.fontSize = `${tamanhoFonte}px`;
    try {
      localStorage.setItem(chaveTamanhoFonte, String(tamanhoFonte));
    } catch (erro) {
      console.warn('Não foi possível salvar o tamanho de fonte escolhido.', erro);
    }
    if (valorFonte) valorFonte.value = `${Math.round((tamanhoFonte / 16) * 100)}%`;
    if (botaoDiminuirFonte) botaoDiminuirFonte.disabled = tamanhoFonte <= 14;
    if (botaoAumentarFonte) botaoAumentarFonte.disabled = tamanhoFonte >= 24;
    sincronizarEscolhasAcesso();
  };

  botaoDiminuirFonte?.addEventListener('click', () => {
    tamanhoFonte = Math.max(14, tamanhoFonte - 2);
    aplicarTamanhoFonte();
  });

  botaoAumentarFonte?.addEventListener('click', () => {
    tamanhoFonte = Math.min(24, tamanhoFonte + 2);
    aplicarTamanhoFonte();
  });

  atualizarPreferencias();
  aplicarTamanhoFonte();

  const botaoAplicarEscolhasAcesso = document.querySelector('#aplicar-escolhas-acesso');
  const estadoEscolhasAcesso = document.querySelector('#estado-escolhas-acesso');
  // Aplica uma combinação rápida de recursos escolhida na página inicial.
  botaoAplicarEscolhasAcesso?.addEventListener('click', () => {
    const opcoesAcesso = [...document.querySelectorAll('[data-perfil-acesso]')];
    const visaoEstavaAtiva = opcoesAcesso.find((opcao) => opcao.dataset.perfilAcesso === 'visao')?.checked;
    const recursosPorPerfil = {
      audio: ['audio'],
      libras: ['libras'],
      visao: ['contraste', 'fonte-legivel', 'espacamento'],
      imagens: ['imagens', 'linguagem-simples', 'leitura-facil'],
    };
    const nomesControlados = new Set(Object.values(recursosPorPerfil).flat());
    const selecionados = new Set(
      opcoesAcesso.filter((opcao) => opcao.checked).map((opcao) => opcao.dataset.perfilAcesso),
    );

    recursos.forEach((recurso) => {
      if (!nomesControlados.has(recurso.dataset.recurso)) return;
      recurso.checked = Object.entries(recursosPorPerfil).some(([perfil, nomes]) => (
        selecionados.has(perfil) && nomes.includes(recurso.dataset.recurso)
      ));
    });

    if (selecionados.has('visao')) {
      tamanhoFonte = Math.max(tamanhoFonte, 20);
      aplicarTamanhoFonte();
    } else if (visaoEstavaAtiva) {
      tamanhoFonte = 16;
      aplicarTamanhoFonte();
    }

    atualizarPreferencias();
    if (estadoEscolhasAcesso) {
      estadoEscolhasAcesso.textContent = selecionados.size
        ? 'Pronto! Suas escolhas foram aplicadas e ficam salvas somente neste navegador. Você pode ajustar cada recurso no botão Acessibilidade.'
        : 'Tudo certo. Você pode navegar sem ativar recursos ou escolher novamente quando quiser.';
    }
  });

  const botaoAplicarPersona = document.querySelector('#aplicar-persona');
  // Perspectivas pré-definidas combinam recursos para perfis com necessidades diferentes.
  const estadoPersona = document.querySelector('#estado-persona');
  // Aplica um conjunto predefinido de recursos baseado no perfil selecionado.
  botaoAplicarPersona?.addEventListener('click', () => {
    const personaSelecionada = document.querySelector('input[name="persona"]:checked');
    const recursosPorPersona = {
      idosa: ['contraste', 'fonte-legivel', 'espacamento'],
      surda: ['libras', 'legendas'],
      cega: ['audio'],
      leitura: ['linguagem-simples', 'imagens', 'leitura-facil'],
      intelectual: ['linguagem-simples', 'imagens', 'espacamento'],
      motora: ['teclado'],
    };
    if (!personaSelecionada) {
      if (estadoPersona) estadoPersona.textContent = 'Escolha um perfil para aplicar uma experiência personalizada.';
      document.querySelector('input[name="persona"]')?.focus();
      return;
    }

    const recursosControlados = new Set(Object.values(recursosPorPersona).flat());
    const recursosAtivos = new Set(recursosPorPersona[personaSelecionada.value] || []);
    recursos.forEach((recurso) => {
      if (!recursosControlados.has(recurso.dataset.recurso)) return;
      recurso.checked = recursosAtivos.has(recurso.dataset.recurso);
      recurso.dispatchEvent(new Event('change', { bubbles: true }));
    });

    if (personaSelecionada.value === 'idosa') {
      tamanhoFonte = 20;
      aplicarTamanhoFonte();
    } else {
      tamanhoFonte = 16;
      aplicarTamanhoFonte();
    }

    const nomePersona = personaSelecionada.nextElementSibling?.textContent?.trim() || 'Perfil escolhido';
    if (estadoPersona) {
      estadoPersona.textContent = `Experiência personalizada aplicada para ${nomePersona}. Os recursos ficam salvos somente neste navegador e podem ser ajustados no botão Acessibilidade.`;
    }
    document.querySelector('#escolha-acesso')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  seletorTema.forEach((opcao) => {
    opcao.addEventListener('change', () => {
      if (opcao.checked) {
        document.body.dataset.tema = opcao.value;
        salvarTema(opcao.value);
        aplicarLogoDoTema(opcao.value);
        seletorTema.forEach((tema) => {
          tema.checked = tema.value === opcao.value;
        });
      }
    });
  });

  // Abre o painel como modal quando o navegador suporta <dialog>.
  const abrirPainelAcessibilidade = () => {
    // showModal cria uma camada modal; o fallback open permite compatibilidade com navegadores antigos.
    if (!painelAcessibilidade) return;
    if (!painelAcessibilidade.open) {
      if (typeof painelAcessibilidade.showModal === 'function') {
        painelAcessibilidade.showModal();
      } else {
        painelAcessibilidade.setAttribute('open', '');
      }
      const temaAtual = document.body.dataset.tema || 'claro';
      seletorTema.forEach((tema) => {
        tema.checked = tema.value === temaAtual;
      });
    }
  };

  gatilhosAcessibilidade.forEach((gatilho) => {
    gatilho.addEventListener('click', (evento) => {
      evento.preventDefault();
      abrirPainelAcessibilidade();
    });
  });

  document.querySelector('#abrir-traducao-libras')?.addEventListener('click', (evento) => {
    evento.preventDefault();
    abrirPainelAcessibilidade();
    if (!recursoLibras) {
      if (estadoComunicacao) estadoComunicacao.textContent = 'A opção Libras não está disponível nesta página.';
      return;
    }
    if (!recursoLibras.checked) {
      recursoLibras.checked = true;
      recursoLibras.dispatchEvent(new Event('change', { bubbles: true }));
    }
    recursoLibras.focus();
    if (estadoComunicacao) {
      estadoComunicacao.textContent = 'VLibras ativado. Use o avatar que aparece na página e selecione o texto da mensagem para ver a tradução. A tradução automática pode ter limitações.';
    }
  });

  botaoFecharAcessibilidade?.addEventListener('click', () => {
    painelAcessibilidade?.close();
  });

  painelAcessibilidade?.addEventListener('click', (evento) => {
    if (evento.target === painelAcessibilidade) painelAcessibilidade.close();
  });

  document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape' && painelAcessibilidade?.open) {
      painelAcessibilidade.close();
    }
  });

  // Monta uma cópia limpa do conteúdo principal e inicia sua leitura completa.
  botaoOuvir?.addEventListener('click', () => {
    // cloneNode cria uma cópia para remover elementos ocultos antes da leitura.
    const copiaConteudo = conteudoPrincipal?.cloneNode(true);
    copiaConteudo?.querySelectorAll('dialog, [aria-hidden="true"], [hidden]')
      .forEach((elemento) => elemento.remove());
    alvoLeituraAtual = botaoOuvir;
    lerTexto(copiaConteudo?.innerText ?? '');
  });

  botaoParar?.addEventListener('click', () => {
    pararLeitura('Leitura em voz alta interrompida.');
  });

  const botaoBuscarVoz = document.querySelector('#buscar-por-voz');
  const estadoBuscaVoz = document.querySelector('#estado-busca-voz');
  const campoBuscaServicos = document.querySelector('#campo-busca-servicos');
  // Usa o reconhecimento de voz do navegador para preencher a busca por serviços.
  botaoBuscarVoz?.addEventListener('click', () => {
    // SpeechRecognition recebe a fala, entrega uma transcrição e dispara o filtro do campo.
    const ReconhecedorDeVoz = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!ReconhecedorDeVoz) {
      if (estadoBuscaVoz) {
        estadoBuscaVoz.textContent = 'A busca por voz não está disponível neste navegador. Você pode digitar o que precisa no campo de busca.';
      }
      return;
    }

    const reconhecimento = new ReconhecedorDeVoz();
    reconhecimento.lang = 'pt-BR';
    reconhecimento.interimResults = false;
    reconhecimento.maxAlternatives = 1;
    botaoBuscarVoz.setAttribute('aria-pressed', 'true');
    reconhecimento.onstart = () => {
      if (estadoBuscaVoz) estadoBuscaVoz.textContent = 'Pode falar o assunto que está procurando. O microfone só é usado enquanto esta busca está ativa.';
    };
    reconhecimento.onresult = (evento) => {
      const transcricao = evento.results[0]?.[0]?.transcript?.trim();
      if (!transcricao || !campoBuscaServicos) {
        if (estadoBuscaVoz) estadoBuscaVoz.textContent = 'Não entendi a busca. Tente novamente ou digite o assunto.';
        return;
      }
      campoBuscaServicos.value = transcricao;
      campoBuscaServicos.dispatchEvent(new Event('input', { bubbles: true }));
      if (estadoBuscaVoz) estadoBuscaVoz.textContent = `Busca reconhecida: “${transcricao}”. Confira os resultados e escolha o serviço.`;
    };
    reconhecimento.onerror = (evento) => {
      const mensagem = evento.error === 'not-allowed'
        ? 'O acesso ao microfone não foi permitido. Você pode digitar o assunto no campo de busca.'
        : 'Não foi possível reconhecer a fala. Tente novamente ou digite o assunto.';
      if (estadoBuscaVoz) estadoBuscaVoz.textContent = mensagem;
    };
    reconhecimento.onend = () => {
      botaoBuscarVoz.setAttribute('aria-pressed', 'false');
    };
    try {
      reconhecimento.start();
    } catch (erro) {
      botaoBuscarVoz.setAttribute('aria-pressed', 'false');
      console.warn('Não foi possível iniciar a busca por voz.', erro);
      if (estadoBuscaVoz) estadoBuscaVoz.textContent = 'Não foi possível iniciar o microfone. Digite o assunto no campo de busca.';
    }
  });

  const exemplosEntenda = {
    // Objeto local guarda exemplos prontos sem enviar dados pessoais para nenhum servidor.
    documentos: {
      origem: 'Exemplo: confira as instruções do órgão para saber quais documentos são necessários e quais etapas seguir.',
      passos: [
        'Abra a página oficial do serviço.',
        'Confira a lista de documentos e as etapas.',
        'Se algo não estiver claro, pergunte ao órgão responsável antes de continuar.',
      ],
    },
    protocolo: {
      origem: 'Exemplo: depois de fazer um pedido, guarde o protocolo para consultar o andamento.',
      passos: [
        'Anote ou guarde o número do protocolo.',
        'Veja qual canal o órgão indica para acompanhar o pedido.',
        'Consulte o andamento por esse canal.',
      ],
    },
  };
  const seletorExemplo = document.querySelector('#selecionar-exemplo-entenda');
  const botaoExplicarExemplo = document.querySelector('#explicar-exemplo');
  const botaoOrganizarTexto = document.querySelector('#organizar-texto');
  const botaoLimparTexto = document.querySelector('#limpar-texto-entenda');
  const campoTextoEntenda = document.querySelector('#texto-para-simplificar');
  const resultadoEntenda = document.querySelector('#resultado-entenda');
  const origemEntenda = document.querySelector('#origem-entenda');
  const passosEntenda = document.querySelector('#passos-entenda');
  const estadoEntenda = document.querySelector('#estado-entenda');
  const botaoOuvirExplicacao = document.querySelector('#ouvir-explicacao');

  const mostrarPassosEntenda = (origem, passos) => {
    // replaceChildren substitui os itens anteriores por uma nova lista de elementos <li>.
    if (!resultadoEntenda || !origemEntenda || !passosEntenda) return;
    origemEntenda.textContent = origem;
    passosEntenda.replaceChildren(...passos.map((passo) => {
      const item = document.createElement('li');
      item.textContent = passo;
      return item;
    }));
    resultadoEntenda.hidden = false;
  };

  // Formata um exemplo pré-definido como uma sequência simples de passos.
  botaoExplicarExemplo?.addEventListener('click', () => {
    const exemplo = exemplosEntenda[seletorExemplo?.value];
    if (!exemplo) {
      if (estadoEntenda) estadoEntenda.textContent = 'Escolha um exemplo para ver a explicação.';
      seletorExemplo?.focus();
      return;
    }
    mostrarPassosEntenda(exemplo.origem, exemplo.passos);
    if (estadoEntenda) estadoEntenda.textContent = 'Exemplo preparado pelo INCLUI. Confira sempre as instruções atualizadas do órgão responsável.';
    resultadoEntenda?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  // Organiza um texto informado pelo usuário separando suas frases em passos.
  botaoOrganizarTexto?.addEventListener('click', () => {
    // split divide parágrafos e expressões regulares separaram frases por pontuação.
    const texto = campoTextoEntenda?.value.trim();
    if (!texto) {
      if (estadoEntenda) estadoEntenda.textContent = 'Cole um texto sem dados pessoais para separar em partes.';
      campoTextoEntenda?.focus();
      return;
    }
    const paragrafoEmFrases = texto.split(/\n+/).flatMap((paragrafo) => (
      paragrafo.match(/[^.!?]+[.!?]?/g) || []
    ));
    const partes = paragrafoEmFrases.map((parte) => parte.trim()).filter(Boolean);
    mostrarPassosEntenda('Seu texto, separado em frases. O conteúdo não foi simplificado nem verificado.', partes);
    if (estadoEntenda) estadoEntenda.textContent = `${partes.length} parte${partes.length === 1 ? '' : 's'} organizadas somente nesta página.`;
    resultadoEntenda?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  botaoLimparTexto?.addEventListener('click', () => {
    if (campoTextoEntenda) campoTextoEntenda.value = '';
    if (seletorExemplo) seletorExemplo.value = '';
    if (resultadoEntenda) resultadoEntenda.hidden = true;
    if (passosEntenda) passosEntenda.replaceChildren();
    if (estadoEntenda) estadoEntenda.textContent = 'Texto e resultado apagados desta página.';
    campoTextoEntenda?.focus();
  });

  botaoOuvirExplicacao?.addEventListener('click', () => {
    const passos = [...(passosEntenda?.querySelectorAll('li') || [])]
      .map((passo) => passo.textContent);
    if (origemEntenda?.textContent && passos.length) {
      lerTexto(`${origemEntenda.textContent} ${passos.join('. ')}`, true, estadoEntenda);
    }
  });

  // Obtém uma descrição utilizável para ler elementos apontados ou focados.
  const obterTextoDoAlvo = (alvo) => {
    // A prioridade busca data-leitura, aria-label, rótulo, valor ou texto visível do elemento.
    if (alvo.dataset.leitura) return alvo.dataset.leitura;
    if (alvo.getAttribute('aria-label')) return alvo.getAttribute('aria-label');
    if (alvo.matches('input, textarea, select')) {
      const rotulo = alvo.labels?.[0];
      if (rotulo) return rotulo.innerText;
    }
    if (alvo.matches('input, textarea, select')) {
      return alvo.value || alvo.getAttribute('placeholder') || alvo.getAttribute('title') || '';
    }

    const copiaAlvo = alvo.cloneNode(true);
    copiaAlvo.querySelectorAll('[aria-hidden="true"], [hidden]').forEach((elemento) => elemento.remove());
    return copiaAlvo.innerText || copiaAlvo.getAttribute('alt') || copiaAlvo.getAttribute('title') || '';
  };

  const lerAlvoApontado = (evento) => {
    // pointerover e focusin chamam esta função para ler apenas elementos elegíveis e diferentes do último.
    if (!recursoAudio?.checked || evento.pointerType === 'touch') return;
    if (!(evento.target instanceof Element)) return;
    const alvo = evento.target.closest(
      'h1, h2, h3, h4, p, li, a, button, summary, blockquote, figcaption, strong, small, label, textarea, input, select, output, legend, [role="button"], [data-leitura]',
    );
    if (!alvo || alvo.closest('[aria-hidden="true"], [hidden]')) return;
    if (alvo === ultimoAlvoLido || (evento.relatedTarget && alvo.contains(evento.relatedTarget))) return;

    ultimoAlvoLido = alvo;
    alvoLeituraAtual = alvo;
    window.clearTimeout(temporizadorLeitura);
    temporizadorLeitura = window.setTimeout(() => {
      temporizadorLeitura = null;
      lerTexto(obterTextoDoAlvo(alvo), false);
    }, 350);
  };

  document.addEventListener('pointerover', lerAlvoApontado);
  document.addEventListener('focusin', lerAlvoApontado);
  document.addEventListener('pointermove', (evento) => {
    // Enquanto o indicador estiver ativo, o ponteiro atualiza sua posição na tela.
    if (indicadorLeitura.classList.contains('indicador-leitura-ativo')) {
      posicionarIndicadorLeitura(evento.clientX, evento.clientY);
    }
  });
  document.addEventListener('pointerout', (evento) => {
    if (evento.target instanceof Element
      && (evento.target === ultimoAlvoLido || evento.target.contains(ultimoAlvoLido))
      && (!evento.relatedTarget || !evento.target.contains(evento.relatedTarget))) {
      ultimoAlvoLido = null;
    }
  });

  // Permite cancelar a leitura em voz alta com a tecla Escape.
  document.addEventListener('keydown', (evento) => {
    // Escape cancela a leitura em execução e limpa o temporizador pendente.
    if (evento.key === 'Escape'
      && suporteLeitura
      && (window.speechSynthesis.speaking || temporizadorLeitura !== null)) {
      pararLeitura();
    }
  });

  atualizarPreferencias();
  aplicarTamanhoFonte();

  if (window.location.hash === '#acessibilidade') abrirPainelAcessibilidade();

  // Revela cartões conforme entram na área visível da página.
  const elementosRevelar = document.querySelectorAll('[data-revelar]');
  // IntersectionObserver adiciona a classe revelada somente ao aproximar o elemento da tela.
  const movimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    || document.body.dataset.animacao === 'reduzida';
  if (elementosRevelar.length && 'IntersectionObserver' in window && !movimentoReduzido) {
    document.body.dataset.revelacao = 'ativa';
    const observadorRevelacao = new IntersectionObserver((entradas, observador) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        entrada.target.classList.add('revelar-visivel');
        observador.unobserve(entrada.target);
      });
    }, { threshold: 0.12 });
    elementosRevelar.forEach((elemento) => observadorRevelacao.observe(elemento));
  } else {
    elementosRevelar.forEach((elemento) => elemento.classList.add('revelar-visivel'));
  }
});
