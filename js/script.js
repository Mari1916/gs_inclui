// Aguarda o HTML ser carregado antes de iniciar os recursos da página.
// Em addEventListener, quando o callback declara `(evento)`, o navegador passa
// esse objeto automaticamente; callbacks de forEach/map recebem cada item da lista.
document.addEventListener('DOMContentLoaded', () => {
  // Chaves usadas para guardar as preferências no armazenamento local do navegador.
  const chavePreferenciasRecursos = 'inclui-recursos-acessibilidade';
  const chaveTamanhoFonte = 'inclui-tamanho-fonte';
  // A chave acima nomeia onde as caixas de acessibilidade são guardadas no navegador.
  // Esta segunda chave identifica o tamanho de fonte salvo no localStorage.

  // Lê o tema salvo sem interromper o site caso o armazenamento esteja indisponível.
  // A seta => declara uma função curta que será chamada quando o tema for necessário.
  const lerTemaSalvo = () => {
    // try/catch evita que navegadores sem suporte ao localStorage travem o site.
    try {
      return localStorage.getItem('inclui-tema');
    } catch (erro) {
      console.warn('Não foi possível carregar o tema salvo.', erro);
      return null;
    }
  };
  // `tema` é parâmetro declarado nos parênteses; recebe `opcao.value` na chamada
  // de salvarTema mais abaixo, quando uma opção de tema é selecionada.
  const salvarTema = (tema) => {
    try {
      localStorage.setItem('inclui-tema', tema);
    } catch (erro) {
      console.warn('Não foi possível salvar o tema escolhido.', erro);
    }
  };
  // Lê as preferências salvas e converte o texto JSON para um objeto JavaScript.
  const lerPreferenciasRecursos = () => {
    // JSON.parse converte a string salva em objeto; dados inválidos são ignorados.
    try {
      const salvo = localStorage.getItem(chavePreferenciasRecursos);
      // Sem valor salvo, retorna null para indicar que ainda não há preferências.
      if (!salvo) return null;
      const preferencias = JSON.parse(salvo);
      // Aceita somente um objeto simples; evita tratar null, lista ou outro tipo como configuração.
      if (!preferencias || typeof preferencias !== 'object' || Array.isArray(preferencias)) {
        // Interrompe o processamento para cair no catch e mostrar o aviso de formato inválido.
        throw new TypeError('O formato salvo não é válido.');
      }
      // Devolve o objeto validado para o restante do script.
      return preferencias;
    } catch (erro) {
      console.warn('Não foi possível carregar as preferências de acessibilidade.', erro);
      return null;
    }
  };
  // `preferencias` é parâmetro recebido como objeto na chamada mais abaixo,
  // onde os interruptores são convertidos em pares recurso/estado.
  const salvarPreferenciasRecursos = (preferencias) => {
    try {
      localStorage.setItem(chavePreferenciasRecursos, JSON.stringify(preferencias));
    } catch (erro) {
      console.warn('Não foi possível salvar as preferências de acessibilidade.', erro);
    }
  };
  // Recupera o tamanho salvo e rejeita números fora do intervalo permitido.
  const lerTamanhoFonteSalvo = () => {
    // Number valida o tamanho salvo e aplica 16 px como padrão seguro.
    try {
      const salvo = Number(localStorage.getItem(chaveTamanhoFonte));
      // Retorna o tamanho válido entre 14 e 24; se inválido, usa 16 como padrão.
      return Number.isFinite(salvo) && salvo >= 14 && salvo <= 24 ? salvo : 16;
    } catch (erro) {
      console.warn('Não foi possível carregar o tamanho de fonte salvo.', erro);
      return 16;
    }
  };

  // Troca a imagem da marca conforme o tema claro ou escuro escolhido.
  // Busca todas as logos que declaram os caminhos dos dois temas em data-*.
  const imagensLogo = document.querySelectorAll('[data-logo-claro][data-logo-escuro]');
  // `tema` é parâmetro: na inicialização vem do data-tema do body e, depois,
  // recebe opcao.value quando a pessoa troca o tema no painel.
  const aplicarLogoDoTema = (tema) => {
    // O forEach fornece em `imagem` cada logo encontrada na linha anterior.
    imagensLogo.forEach((imagem) => {
      // A condição ternária seleciona logoEscuro ou logoClaro para atualizar src.
      imagem.src = imagem.dataset[tema === 'escuro' ? 'logoEscuro' : 'logoClaro'];
    });
  };
  // Recupera o tema persistido para decidir qual tema aplicar no início.
  const temaSalvo = lerTemaSalvo();
  // Só aceita os dois temas previstos; qualquer outro valor não altera o body.
  if (temaSalvo === 'claro' || temaSalvo === 'escuro') {
    document.body.dataset.tema = temaSalvo;
  }
  // Atualiza as logos para combinarem com o tema atual da página.
  aplicarLogoDoTema(document.body.dataset.tema);

  // Cria o botão flutuante de acessibilidade em páginas que ainda não possuem ele no HTML.
  // querySelector retorna null quando a página ainda não declara o botão.
  if (!document.querySelector('#abrir-acessibilidade-flutuante')) {
    // Cria o elemento HTML button na memória do documento.
    const botaoAcessibilidade = document.createElement('button');
    // Define a classe que fornece a aparência do botão pelo CSS.
    botaoAcessibilidade.className = 'botao-acessibilidade-flutuante';
    // Define um id único para que o JavaScript encontre o botão depois.
    botaoAcessibilidade.id = 'abrir-acessibilidade-flutuante';
    // Evita que o botão se comporte como envio de formulário.
    botaoAcessibilidade.type = 'button';
    // Informa às tecnologias assistivas que o botão abre uma janela de diálogo.
    botaoAcessibilidade.setAttribute('aria-haspopup', 'dialog');
    // Liga o botão ao painel que possui o id acessibilidade.
    botaoAcessibilidade.setAttribute('aria-controls', 'acessibilidade');
    // Insere o ícone e o rótulo visível dentro do botão.
    botaoAcessibilidade.innerHTML = '<span aria-hidden="true">♿</span> Acessibilidade';
    // Insere o botão criado no final do body para que apareça na página.
    document.body.append(botaoAcessibilidade);
  }

  // Monta o painel de acessibilidade quando ele não foi declarado diretamente na página.
  // A condição impede duplicar o painel caso ele já exista no HTML.
  if (!document.querySelector('#acessibilidade')) {
    // Cada item contém a chave interna, o nome mostrado e a explicação do recurso.
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
    // Cria um diálogo HTML nativo para agrupar as configurações de acesso.
    const dialogoAcessibilidade = document.createElement('dialog');
    // Aplica a classe visual do painel no arquivo CSS.
    dialogoAcessibilidade.className = 'painel-acessibilidade';
    // Define o identificador consultado pelos botões que abrem o painel.
    dialogoAcessibilidade.id = 'acessibilidade';
    // Associa o nome acessível do diálogo ao título com este id.
    dialogoAcessibilidade.setAttribute('aria-labelledby', 'titulo-acessibilidade');
    // O template string cria a estrutura HTML do painel em várias linhas.
    // O map recebe cada trio de opcoesAcessibilidade; recurso, titulo e descricao
    // são declarados por desestruturação e correspondem às posições 1, 2 e 3.
    // Para cada trio, o template gera um rótulo e um interruptor.
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
    // Coloca o painel no documento para que os controles possam ser encontrados.
    document.body.append(dialogoAcessibilidade);
  }

  // Controla o menu principal no formato responsivo de cada cabeçalho.
  // Busca todos os cabeçalhos, mesmo que páginas futuras tenham mais de um.
  const cabecalhos = document.querySelectorAll('.cabecalho-site');
  // O forEach fornece em `cabecalho` cada cabeçalho encontrado na linha anterior.
  cabecalhos.forEach((cabecalho) => {
    // Localiza o botão hambúrguer dentro do cabeçalho atual.
    const botaoMenu = cabecalho.querySelector('.botao-menu-mobile');
    // Localiza os links de navegação que o botão mostra ou esconde.
    const navegacao = cabecalho.querySelector('.navegacao-principal');
    // Encerra esta repetição se algum elemento necessário não existir.
    if (!botaoMenu || !navegacao) return;

    // `devolverFoco` é opcional: Escape chama fecharMenu(true); outros fechamentos
    // não passam argumento e usam false como valor padrão.
    const fecharMenu = (devolverFoco = false) => {
      cabecalho.classList.remove('menu-aberto');
      botaoMenu.setAttribute('aria-expanded', 'false');
      botaoMenu.setAttribute('aria-label', 'Abrir menu');
      if (devolverFoco) botaoMenu.focus();
    };

    // Alterna o menu quando a pessoa ativa o botão.
    botaoMenu.addEventListener('click', () => {
      // Lê o estado acessível atual para saber se o menu já estava aberto.
      const aberto = botaoMenu.getAttribute('aria-expanded') === 'true';
      // Adiciona ou remove a classe que controla a exibição visual do menu.
      cabecalho.classList.toggle('menu-aberto', !aberto);
      // Atualiza aria-expanded para leitores de tela.
      botaoMenu.setAttribute('aria-expanded', String(!aberto));
      // Atualiza o nome acessível para corresponder à ação disponível.
      botaoMenu.setAttribute('aria-label', aberto ? 'Abrir menu' : 'Fechar menu');
    });

    // Fecha o menu depois que a pessoa escolhe um link de navegação.
    // O navegador passa o objeto do clique automaticamente como `evento`.
    navegacao.addEventListener('click', (evento) => {
      // Confirma que o alvo é um elemento e que ele está dentro de um link.
      if (evento.target instanceof Element && evento.target.closest('a')) fecharMenu();
    });

    // Fecha o menu quando o clique acontece fora do cabeçalho.
    document.addEventListener('click', (evento) => {
      if (evento.target instanceof Node && !cabecalho.contains(evento.target)) fecharMenu();
    });

    // Permite fechar o menu com Escape e devolver o foco ao botão.
    document.addEventListener('keydown', (evento) => {
      if (evento.key === 'Escape' && cabecalho.classList.contains('menu-aberto')) {
        fecharMenu(true);
      }
    });

    // Fecha o menu móvel se a janela aumentar para o layout de desktop.
    window.addEventListener('resize', () => {
      if (window.innerWidth > 800) fecharMenu();
    });
  });

  // Procura o espaço reservado ao ano atual, se a página tiver esse elemento.
  const yearNode = document.querySelector('[data-current-year]');
  // Substitui o conteúdo pelo ano obtido do relógio do navegador.
  if (yearNode) yearNode.textContent = new Date().getFullYear();

  // `texto` é parâmetro: recebe a consulta digitada ou o texto de cada cartão
  // nas chamadas feitas dentro da função de busca mais abaixo.
  // Remove acentos e padroniza textos para tornar as buscas mais tolerantes.
  const normalizarTextoBusca = (texto) => texto
    // Converte caracteres acentuados em letras-base e marcas separadas.
    .normalize('NFD')
    // Retira as marcas diacríticas para que, por exemplo, "saude" encontre "saúde".
    .replace(/[\u0300-\u036f]/g, '')
    // Padroniza a caixa respeitando as regras de português brasileiro.
    .toLocaleLowerCase('pt-BR')
    // Elimina espaços antes e depois do texto pesquisado.
    .trim();

  // Os parâmetros vêm das duas chamadas configurarBusca logo abaixo:
  // seletorCampo/seletorItens são seletores CSS; idEstado localiza a mensagem;
  // rotulo define a palavra usada na contagem dos resultados.
  const configurarBusca = (seletorCampo, seletorItens, idEstado, rotulo) => {
    // Encontra o campo de texto identificado pelo seletor recebido.
    const campo = document.querySelector(seletorCampo);
    // Copia para uma lista os elementos que podem ser filtrados.
    const itens = [...document.querySelectorAll(seletorItens)];
    // Encontra a região acessível que anuncia quantos resultados foram localizados.
    const estado = document.querySelector(`#${idEstado}`);
    // Sai sem configurar eventos se a página não possuir todos os elementos necessários.
    if (!campo || !estado || !itens.length) return;

    // Executa o filtro com o texto que está atualmente no campo.
    const filtrar = () => {
      // Normaliza a busca para comparar sem diferenciar acentos ou maiúsculas.
      const consulta = normalizarTextoBusca(campo.value);
      // Inicia a contagem dos itens que permanecerão visíveis.
      let visiveis = 0;
      // forEach fornece em `item` cada cartão da lista `itens`.
      itens.forEach((item) => {
        // Combina o texto do cartão com termos alternativos declarados em data-termos.
        const termos = normalizarTextoBusca(`${item.innerText} ${item.dataset.termos || ''}`);
        // Mostra todos quando o campo está vazio; senão, exige que os termos contenham a consulta.
        const corresponde = !consulta || termos.includes(consulta);
        // O atributo hidden faz o navegador ocultar os itens que não correspondem.
        item.hidden = !corresponde;
        // Aumenta a contagem quando o item deve continuar visível.
        if (corresponde) visiveis += 1;
      });

      // Informa a quantidade de temas ou termos disponíveis quando não há busca.
      if (!consulta) {
        estado.textContent = `${itens.length} ${rotulo}${itens.length === 1 ? '' : 's'} disponíveis.`;
      } else if (visiveis) {
        // Informa a quantidade de resultados encontrados quando há correspondências.
        estado.textContent = `${visiveis} ${rotulo}${visiveis === 1 ? '' : 's'} encontrado${visiveis === 1 ? '' : 's'}.`;
      } else {
        // Dá uma mensagem e uma sugestão quando nenhum resultado corresponde.
        estado.textContent = `Nenhum ${rotulo} encontrado. Tente outra palavra.`;
      }
    };

    // Atualiza os resultados sempre que o usuário altera o conteúdo do campo.
    campo.addEventListener('input', filtrar);
  };

  // Configura a busca de cartões de serviços na página inicial.
  // Passa os seletores dos serviços, o id da mensagem de estado e o nome "tema".
  configurarBusca('#campo-busca-servicos', '.cartao-servico[data-termos]', 'estado-busca-servicos', 'tema');
  // Configura a busca dos verbetes do glossário, quando esse campo existe.
  // Neste caso, passa os seletores do glossário e usa "termo" como rótulo.
  configurarBusca('#busca-glossario', '.termo-glossario[data-termos]', 'estado-busca-glossario', 'termo');

  // Mantém as listas de verificação marcadas somente no navegador do usuário.
  // Seleciona cada lista declarada com data-lista-verificacao; forEach fornece
  // em `lista` o elemento atual para configurar cada checklist separadamente.
  document.querySelectorAll('[data-lista-verificacao]').forEach((lista) => {
    // Lê o nome identificador da lista, por exemplo "saude-vacinacao".
    const nomeLista = lista.dataset.listaVerificacao;
    // Cria uma chave única de armazenamento para que listas diferentes não se misturem.
    const chaveArmazenamento = `inclui-lista-verificacao-${nomeLista}`;
    // Encontra o parágrafo que apresenta o estado de salvamento desta lista.
    const estado = lista.querySelector('[data-status-lista-verificacao]');
    // Converte os checkboxes da lista em um array para percorrê-los.
    const itens = [...lista.querySelectorAll('[data-item-verificacao]')];
    // Começa com um objeto vazio caso ainda não existam marcações guardadas.
    let marcacoes = {};
    // Assume que o armazenamento funciona até que uma operação indique o contrário.
    let armazenamentoDisponivel = true;

    // Tenta ler e validar os dados já salvos para esta lista.
    try {
      // Obtém a string JSON da chave específica desta lista.
      const salvo = localStorage.getItem(chaveArmazenamento);
      // Só interpreta o conteúdo se existir algo salvo.
      if (salvo) {
        // Converte a string JSON em um objeto com as marcações.
        const dadosSalvos = JSON.parse(salvo);
        // Rejeita dados que não sejam um objeto simples de marcações.
        if (!dadosSalvos || typeof dadosSalvos !== 'object' || Array.isArray(dadosSalvos)) {
          throw new TypeError('O formato salvo não é válido.');
        }
        // Usa as marcações validadas como estado inicial dos checkboxes.
        marcacoes = dadosSalvos;
      }
    } catch (erro) {
      // Indica que não foi possível ler o armazenamento e registra o motivo no console.
      armazenamentoDisponivel = false;
      console.warn('Não foi possível carregar as marcações locais da lista de verificação.', erro);
    }

    // forEach fornece em `item` cada checkbox desta lista.
    itens.forEach((item) => {
      // Marca o item somente quando a chave salva contém o booleano true.
      item.checked = marcacoes[item.dataset.itemVerificacao] === true;
      // O evento change dispara o callback sempre que este checkbox muda.
      item.addEventListener('change', () => {
        // Atualiza no objeto local o estado atual do checkbox.
        marcacoes[item.dataset.itemVerificacao] = item.checked;
        // Tenta converter o objeto atualizado em JSON e gravá-lo no navegador.
        try {
          localStorage.setItem(chaveArmazenamento, JSON.stringify(marcacoes));
          armazenamentoDisponivel = true;
          if (estado) estado.textContent = 'Marcação salva somente neste navegador.';
        } catch (erro) {
          // Informa que a gravação falhou e que o estado só poderá durar nesta aba.
          armazenamentoDisponivel = false;
          console.warn('Não foi possível salvar as marcações locais da lista de verificação.', erro);
          if (estado) estado.textContent = 'Não foi possível salvar. Suas marcações ficarão disponíveis somente enquanto esta página estiver aberta.';
        }
      });
    });

    // Mostra uma orientação adequada ao estado do armazenamento desta lista.
    if (estado && !armazenamentoDisponivel) {
      estado.textContent = 'O armazenamento local não está disponível. Suas marcações ficarão disponíveis somente enquanto esta página estiver aberta.';
    } else if (estado) {
      estado.textContent = 'As marcações são privadas e ficam neste navegador.';
    }
  });

  // Prepara o formulário de contato para abrir o aplicativo de e-mail do usuário.
  // Busca o formulário e a região que anunciará o resultado da ação.
  const formularioContato = document.querySelector('#formulario-contato');
  const estadoFormularioContato = document.querySelector('#estado-formulario-contato');
  // Só registra o evento se esta página realmente tiver o formulário.
  formularioContato?.addEventListener('submit', (evento) => {
    // `evento` é fornecido automaticamente pelo navegador ao disparar submit.
    // Impede o navegador de enviar os campos a uma URL ou recarregar a página.
    evento.preventDefault();
    // Interrompe se a validação nativa detectar campos faltando ou e-mail inválido.
    if (!formularioContato.reportValidity()) return;

    // Lê os valores dos campos pelo nome informado em cada controle do formulário.
    const dados = new FormData(formularioContato);
    // Prepara o assunto da mensagem incluindo o nome do projeto.
    const assunto = `[INCLUI] ${dados.get('assunto')}`;
    // Monta o corpo do e-mail em linhas com nome, endereço e mensagem.
    const mensagem = [
      `Nome: ${dados.get('nome')}`,
      `E-mail para resposta: ${dados.get('email')}`,
      '',
      String(dados.get('mensagem')),
    ].join('\n');
    // Cria um link temporário para solicitar ao sistema a abertura do aplicativo de e-mail.
    const linkEmail = document.createElement('a');
    // Codifica assunto e corpo para que espaços e quebras sejam válidos na URL mailto.
    linkEmail.href = `mailto:?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(mensagem)}`;
    // Esconde o link temporário para não alterar visualmente a página.
    linkEmail.hidden = true;
    // Adiciona o link ao documento para que possa ser acionado pelo navegador.
    document.body.append(linkEmail);
    // Aciona o link e tenta abrir o aplicativo de e-mail configurado pelo usuário.
    linkEmail.click();
    // Remove o link temporário depois de usá-lo.
    linkEmail.remove();

    // Mostra que o usuário ainda precisa escolher destinatário e enviar o e-mail.
    if (estadoFormularioContato) {
      estadoFormularioContato.textContent = 'Abrimos seu aplicativo de e-mail com a mensagem pronta. Informe o destinatário antes de enviar; o INCLUI não recebe nem armazena os dados por este formulário.';
    }
  });

  // Obtém os elementos do painel antes de sincronizar recursos e preferências.
  // Guarda a lista de todas as caixas identificadas como recursos de acessibilidade.
  const recursos = document.querySelectorAll('[data-recurso]');
  // Busca as opções de rádio que alternam o tema claro e escuro.
  const seletorTema = document.querySelectorAll('input[name="tema"]');
  // Elemento de status usado para anunciar alterações no painel.
  const estadoAcessibilidade = document.querySelector('#estado-acessibilidade');
  // Botão que inicia a leitura integral do conteúdo principal.
  const botaoOuvir = document.querySelector('#botao-ouvir-pagina');
  // Botão que interrompe a leitura atual.
  const botaoParar = document.querySelector('#botao-parar-leitura');
  // Interruptor específico que habilita a leitura de textos apontados.
  const recursoAudio = document.querySelector('[data-recurso="audio"]');
  // Interruptor que habilita o widget de tradução em Libras.
  const recursoLibras = document.querySelector('[data-recurso="libras"]');
  // Região principal que será copiada para preparar a leitura completa.
  const conteudoPrincipal = document.querySelector('main');
  // Botões que diminuem e aumentam o tamanho da fonte.
  const botaoDiminuirFonte = document.querySelector('#diminuir-fonte');
  const botaoAumentarFonte = document.querySelector('#aumentar-fonte');
  // Saída de texto que exibe o tamanho relativo atual.
  const valorFonte = document.querySelector('#valor-fonte');
  // Estado numérico atual da fonte, iniciado com o valor persistido ou padrão.
  let tamanhoFonte = lerTamanhoFonteSalvo();
  // Janela de acessibilidade criada no começo do script.
  const painelAcessibilidade = document.querySelector('#acessibilidade');
  // Botões e links que podem abrir a janela de acessibilidade.
  const gatilhosAcessibilidade = document.querySelectorAll(
    '#abrir-acessibilidade-flutuante, a[href="#acessibilidade"]',
  );
  // Botão que fecha o painel.
  const botaoFecharAcessibilidade = document.querySelector('.fechar-acessibilidade');
  // Chave do armazenamento local dedicada à preferência Libras.
  const chavePreferenciaLibras = 'inclui-libras';
  // Indica se o script externo do VLibras já foi carregado.
  let scriptVlibrasCarregado = false;
  // Registra falha na tentativa mais recente de carregar o widget.
  let erroCarregamentoVlibras = false;
  // Guarda o identificador do atraso antes de começar a leitura por foco/ponteiro.
  let temporizadorLeitura = null;
  // Evita iniciar repetidamente a leitura do mesmo elemento.
  let ultimoAlvoLido = null;
  // Guarda o elemento associado ao indicador de leitura que aparece na tela.
  let alvoLeituraAtual = null;
  // Identificador crescente que permite ignorar eventos atrasados de falas anteriores.
  let idLeitura = 0;
  // Verifica se as duas APIs necessárias para síntese de voz existem neste navegador.
  const suporteLeitura = 'speechSynthesis' in window
    && 'SpeechSynthesisUtterance' in window;

  // Leitura e persistência da preferência específica do VLibras.
  // Tenta ler a chave local; retorna true somente se seu valor for "ativo".
  const lerPreferenciaLibras = () => {
    try {
      return localStorage.getItem(chavePreferenciaLibras) === 'ativo';
    } catch (erro) {
      console.warn('Não foi possível carregar a preferência de Libras.', erro);
      return false;
    }
  };

  // Salva "ativo" ou "inativo" conforme o interruptor Libras selecionado.
  // `ativo` recebe recursoLibras.checked nas chamadas ao salvar esta preferência.
  const salvarPreferenciaLibras = (ativo) => {
    try {
      localStorage.setItem(chavePreferenciaLibras, ativo ? 'ativo' : 'inativo');
    } catch (erro) {
      console.warn('Não foi possível salvar a preferência de Libras.', erro);
    }
  };

  // Restaura cada interruptor com base nas preferências salvas localmente.
  // Lê uma única vez o objeto de preferências para restaurar as caixas.
  const preferenciasRecursosSalvas = lerPreferenciasRecursos();
  // Atualiza cada controle de acordo com sua chave data-recurso.
  recursos.forEach((recurso) => {
    // Lê o identificador do recurso no HTML.
    const nome = recurso.dataset.recurso;
    // Usa a preferência salva quando ela é de fato um booleano.
    if (typeof preferenciasRecursosSalvas?.[nome] === 'boolean') {
      recurso.checked = preferenciasRecursosSalvas[nome];
    // Se não houver preferência geral para Libras, consulta sua chave específica.
    } else if (nome === 'libras') {
      recurso.checked = lerPreferenciaLibras();
    }
  });

  // Oculta ou mostra os elementos do VLibras conforme a escolha do usuário.
  const sincronizarVisibilidadeVlibras = () => {
    // checked é true quando a caixa Libras está marcada.
    const ativo = recursoLibras?.checked;
    // O widget pode criar qualquer um destes contêineres; verifica cada um.
    ['#vlibras-access-wrapper', '#vlibras-app-root'].forEach((seletor) => {
      // Procura o contêiner atualmente criado pelo script oficial.
      const elemento = document.querySelector(seletor);
      // Se existe, restaura sua exibição ou o oculta segundo a preferência.
      if (elemento) elemento.style.display = ativo ? '' : 'none';
    });
  };

  // Carrega o script oficial do VLibras somente quando o recurso é ativado.
  const carregarVlibras = () => {
    // Não insere uma segunda cópia se já carregou ou se um script equivalente está no documento.
    if (scriptVlibrasCarregado || document.querySelector('script[data-inclusao-vlibras]')) return;
    // Marca o carregamento em andamento e limpa o sinal de falha anterior.
    scriptVlibrasCarregado = true;
    erroCarregamentoVlibras = false;
    // Cria um elemento script que carregará o código oficial externo.
    const scriptVlibras = document.createElement('script');
    // Define o endereço de origem do plugin VLibras.
    scriptVlibras.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
    // Permite que o navegador baixe o script sem bloquear a montagem da página.
    scriptVlibras.async = true;
    // Marca este script para reconhecer uma tentativa de inclusão anterior.
    scriptVlibras.dataset.inclusaoVlibras = 'true';
    // Executa esta função quando o navegador terminar de carregar o script.
    scriptVlibras.onload = () => {
      // Aguarda o plugin inicializar e criar seu contêiner na página.
      window.setTimeout(() => {
        // Se o contêiner foi criado, sincroniza sua visibilidade com a escolha.
        if (document.querySelector('#vlibras-access-wrapper')) {
          sincronizarVisibilidadeVlibras();
          return;
        }
        // Se não houve contêiner, registra falha, remove o script e permite tentar de novo.
        erroCarregamentoVlibras = true;
        scriptVlibrasCarregado = false;
        scriptVlibras.remove();
        // Anuncia que o plugin baixou, mas não chegou a iniciar.
        if (estadoAcessibilidade) {
          estadoAcessibilidade.textContent = 'O VLibras não conseguiu iniciar. Verifique sua conexão e tente novamente.';
        }
      }, 500);
    };
    // Executa esta função se o download do script falhar.
    scriptVlibras.onerror = () => {
      // Libera uma nova tentativa futura e remove a tag que falhou.
      erroCarregamentoVlibras = true;
      scriptVlibrasCarregado = false;
      scriptVlibras.remove();
      // Desativa a preferência porque o recurso não pôde ser carregado.
      salvarPreferenciaLibras(false);
      if (recursoLibras) recursoLibras.checked = false;
      // Esconde qualquer fragmento de interface que tenha sido criado.
      sincronizarVisibilidadeVlibras();
      // Informa a falha no estado acessível do painel.
      if (estadoAcessibilidade) {
        estadoAcessibilidade.textContent = 'Não foi possível carregar o VLibras. Verifique sua conexão e tente novamente.';
      }
    };
    // Anexa o script ao documento para iniciar o download.
    document.body.append(scriptVlibras);
  };

  // Cria um observador para detectar alterações no conteúdo do body.
  const observadorVlibras = new MutationObserver(sincronizarVisibilidadeVlibras);
  // Observa filhos adicionados/removidos para esconder o widget logo que ele apareça.
  observadorVlibras.observe(document.body, { childList: true });

  // Sincroniza o interruptor com a preferência Libras específica salva anteriormente.
  if (recursoLibras) recursoLibras.checked = lerPreferenciaLibras();
  // Cria um indicador visual flutuante que acompanha a leitura em voz alta.
  const indicadorLeitura = document.createElement('div');
  // Aplica classe usada para posicionar e estilizar o indicador no CSS.
  indicadorLeitura.className = 'indicador-leitura';
  // Marca o indicador como decorativo para que não seja lido duas vezes por leitor de tela.
  indicadorLeitura.setAttribute('aria-hidden', 'true');
  // Define o ícone e a palavra mostrados enquanto um trecho é lido.
  indicadorLeitura.innerHTML = '<span class="indicador-leitura-mao">☝</span><span>Lendo</span>';
  // Insere o indicador no documento para poder posicioná-lo sobre a interface.
  document.body.append(indicadorLeitura);

  // Posiciona o indicador visual próximo ao texto que está sendo lido.
  // `x` e `y` são coordenadas da tela: vêm do retângulo do elemento lido
  // ou das posições do ponteiro do mouse enviadas pelo evento pointermove.
  const posicionarIndicadorLeitura = (x, y) => {
    // Define um afastamento mínimo para não encostar o indicador na borda da tela.
    const margem = 12;
    // Usa a largura real do indicador ou um tamanho padrão antes da primeira renderização.
    const largura = indicadorLeitura.offsetWidth || 88;
    // Usa a altura real ou um valor padrão enquanto o indicador ainda está oculto.
    const altura = indicadorLeitura.offsetHeight || 36;
    // Limita a coordenada horizontal para manter toda a caixa dentro da janela.
    indicadorLeitura.style.left = `${Math.max(margem, Math.min(x + 16, window.innerWidth - largura - margem))}px`;
    // Limita a coordenada vertical pelo mesmo motivo.
    indicadorLeitura.style.top = `${Math.max(margem, Math.min(y + 16, window.innerHeight - altura - margem))}px`;
  };

  // Mostra o indicador e o posiciona próximo ao elemento cuja fala começou.
  const mostrarIndicadorLeitura = () => {
    // Não tenta posicionar nada se a leitura não estiver ligada a um elemento.
    if (!alvoLeituraAtual) return;
    // Adiciona a classe que torna o indicador visível com a transição CSS.
    indicadorLeitura.classList.add('indicador-leitura-ativo');
    // Lê a posição e o tamanho do elemento-alvo na janela.
    const retangulo = alvoLeituraAtual.getBoundingClientRect();
    // Coloca o indicador próximo ao canto superior esquerdo do alvo.
    posicionarIndicadorLeitura(retangulo.left + Math.min(retangulo.width, 24), retangulo.top + Math.min(retangulo.height, 24));
  };

  // Oculta o indicador e limpa a referência ao elemento lido.
  const ocultarIndicadorLeitura = () => {
    indicadorLeitura.classList.remove('indicador-leitura-ativo');
    alvoLeituraAtual = null;
  };

  // Interrompe leitura em voz alta, limpa estados e atualiza o aviso ao usuário.
  // `mensagem` é opcional; o botão Parar passa um texto e chamadas internas
  // passam nada quando só precisam interromper a fala sem anunciar outro estado.
  const pararLeitura = (mensagem) => {
    // Cancela um atraso que ainda esteja esperando para começar uma leitura.
    window.clearTimeout(temporizadorLeitura);
    // Invalida eventos atrasados de falas anteriores, pois o id esperado mudou.
    idLeitura += 1;
    // Cancela a voz nativa se houver suporte no navegador.
    if (suporteLeitura) window.speechSynthesis.cancel();
    // Desativa o botão Parar quando já não há leitura ativa.
    if (botaoParar) botaoParar.disabled = true;
    // Remove o indicador de leitura da tela.
    ocultarIndicadorLeitura();
    // Mostra uma mensagem apenas quando a função recebeu uma.
    if (mensagem && estadoAcessibilidade) estadoAcessibilidade.textContent = mensagem;
  };

  // Usa a síntese de voz do navegador para ler um texto em português.
  // `texto` vem do conteúdo da página, de um elemento ou da ferramenta Entenda.
  // `anunciarEstado` controla se o status será narrado; `statusDestino` escolhe
  // a região HTML que recebe a mensagem e usa o painel como valor padrão.
  const lerTexto = (texto, anunciarEstado = true, statusDestino = estadoAcessibilidade) => {
    // Informa indisponibilidade e encerra se o navegador não oferecer síntese de voz.
    if (!suporteLeitura) {
      if (anunciarEstado && statusDestino) {
        statusDestino.textContent = 'A leitura em voz alta não está disponível neste navegador.';
      }
      return;
    }

    // Junta espaços e quebras repetidos para que a voz leia o texto com pausas naturais.
    const textoPreparado = texto.replace(/\s+/g, ' ').trim();
    // Não inicia uma fala vazia ou composta somente por espaços.
    if (!textoPreparado) return;

    // Gera um novo identificador para distinguir esta leitura das anteriores.
    const leituraAtual = ++idLeitura;
    // Cancela atraso e fala anteriores antes de iniciar outra leitura.
    window.clearTimeout(temporizadorLeitura);
    window.speechSynthesis.cancel();
    // Cria o objeto de fala do navegador com o texto já preparado.
    const fala = new SpeechSynthesisUtterance(textoPreparado);
    // Define o idioma da fala como português brasileiro.
    fala.lang = 'pt-BR';
    // Procura uma voz disponível cujo idioma comece por "pt".
    const vozPortugues = window.speechSynthesis.getVoices()
      .find((voz) => voz.lang.toLowerCase().startsWith('pt'));
    // Usa a voz localizada; se não houver uma, o navegador escolhe o padrão.
    if (vozPortugues) fala.voice = vozPortugues;
    // Ao começar a fala, mostra o indicador somente se ela ainda for a leitura atual.
    fala.onstart = () => {
      if (leituraAtual === idLeitura) mostrarIndicadorLeitura();
    };
    // Ao terminar, atualiza os controles e anuncia o fim se esta leitura ainda estiver ativa.
    fala.onend = () => {
      if (leituraAtual !== idLeitura) return;
      if (botaoParar) botaoParar.disabled = true;
      ocultarIndicadorLeitura();
      if (anunciarEstado && statusDestino) {
        statusDestino.textContent = 'Leitura concluída.';
      }
    };
    // Se a API falhar, informa o erro e retira o indicador para evitar estado falso.
    fala.onerror = () => {
      if (leituraAtual !== idLeitura) return;
      if (botaoParar) botaoParar.disabled = true;
      ocultarIndicadorLeitura();
      if (statusDestino) {
        statusDestino.textContent = 'Não foi possível concluir a leitura em voz alta.';
      }
    };

    // Envia a fala para a fila de síntese de voz do navegador.
    window.speechSynthesis.speak(fala);
    // Habilita o controle que pode cancelar a fala recém-iniciada.
    if (botaoParar) botaoParar.disabled = false;
    // Anuncia o estado inicial, quando a chamada pediu uma mensagem ao usuário.
    if (anunciarEstado && statusDestino) {
      statusDestino.textContent = 'Lendo o conteúdo em voz alta.';
    }
  };

  const atributosRecursos = {
    // A chave é o nome do recurso; o par guarda nome do data-* e valor CSS a aplicar.
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
    // Calcula se cada perfil rápido corresponde aos recursos atualmente ativados.
    const escolhas = {
      audio: recursos.length && document.querySelector('[data-recurso="audio"]')?.checked,
      libras: recursoLibras?.checked,
      visao: document.querySelector('[data-recurso="contraste"]')?.checked
        && document.querySelector('[data-recurso="fonte-legivel"]')?.checked
        && tamanhoFonte >= 18,
      imagens: document.querySelector('[data-recurso="imagens"]')?.checked
        && document.querySelector('[data-recurso="linguagem-simples"]')?.checked,
    };
    // Atualiza cada checkbox de perfil usando seu atributo data-perfil-acesso.
    document.querySelectorAll('[data-perfil-acesso]').forEach((opcao) => {
      opcao.checked = Boolean(escolhas[opcao.dataset.perfilAcesso]);
    });
  };

  // Aplica os atributos de acessibilidade no <body> e salva as escolhas.
  const atualizarPreferencias = () => {
    // Ativa a leitura ao passar/focar textos com um data-* que o CSS reconhece.
    if (recursoAudio?.checked) {
      document.body.dataset.audio = 'ativo';
    } else {
      // Remove o atributo quando o áudio está desligado para reverter os estilos.
      delete document.body.dataset.audio;
    }

    // Localiza a mensagem opcional que explica o recurso de linguagem simples.
    const avisoLinguagemSimples = document.querySelector('[data-aviso-linguagem-simples]');
    if (avisoLinguagemSimples) {
      // hidden mostra a mensagem somente quando a opção correspondente está marcada.
      avisoLinguagemSimples.hidden = !document.querySelector('[data-recurso="linguagem-simples"]')?.checked;
    }

    // Visita cada interruptor e procura a regra de atributo correspondente.
    recursos.forEach((recurso) => {
      const atributo = atributosRecursos[recurso.dataset.recurso];
      if (atributo) {
        // Define o data-* esperado quando ativo, ou uma string vazia quando inativo.
        document.body.dataset[atributo[0]] = recurso.checked ? atributo[1] : '';
        // Apaga completamente o atributo ao desativar o recurso.
        if (!recurso.checked) delete document.body.dataset[atributo[0]];
      }

    });

    // Cria uma lista apenas com interruptores que estão ligados.
    const selecionados = [...recursos].filter((recurso) => recurso.checked);
    // Registra separadamente a preferência por legendas, que não tem ação automática.
    const preferencias = selecionados
      .filter((recurso) => recurso.dataset.recurso === 'legendas')
      .map(() => 'legendas');
    // Escolhe uma mensagem inicial levando em conta plural e número de escolhas.
    let mensagem = selecionados.length
      ? `${selecionados.length} recurso${selecionados.length === 1 ? '' : 's'} selecionado${selecionados.length === 1 ? '' : 's'}.`
      : 'Nenhum recurso adicional selecionado.';

    if (preferencias.length) {
      // Acrescenta à mensagem que a preferência será considerada quando houver vídeos.
      mensagem += ` Preferência por ${preferencias.join(' e ')} registrada para conteúdos quando disponíveis.`;
    }

    // Garante que o plugin seja carregado quando a opção Libras estiver ativa.
    if (recursoLibras?.checked) {
      if (!erroCarregamentoVlibras) carregarVlibras();
      mensagem += ' VLibras ativado. Use o botão do VLibras que aparece na página para escolher um avatar e iniciar a tradução.';
    }

    // Acrescenta uma orientação de uso quando o recurso de leitura estiver ativo.
    if (recursoAudio?.checked) {
      mensagem += ' Passe o mouse sobre um texto ou use Tab para ouvi-lo.';
    }
    // Transforma os controles em pares chave/valor e salva tudo em uma única chave local.
    salvarPreferenciasRecursos(Object.fromEntries(
      [...recursos].map((recurso) => [recurso.dataset.recurso, recurso.checked]),
    ));
    // Atualiza os perfis rápidos para refletirem os interruptores ativos.
    sincronizarEscolhasAcesso();
    // Prepara os nomes e estados dos três indicadores apresentados na interface.
    [
      ['audio', 'Áudio', recursoAudio?.checked],
      ['libras', 'Libras', recursoLibras?.checked],
      ['contraste', 'Alto contraste', document.querySelector('[data-recurso="contraste"]')?.checked],
    ].forEach(([nome, titulo, ativo]) => {
      // Encontra o indicador correspondente ao recurso atual.
      const indicador = document.querySelector(`[data-status-recurso="${nome}"]`);
      // Ignora recursos cujo indicador não existe nesta página.
      if (!indicador) return;
      // Ajusta a concordância da palavra ligado/desligado para o nome do recurso.
      const verbo = nome === 'libras'
        ? (ativo ? 'ativada' : 'desativada')
        : (ativo ? 'ativado' : 'desativado');
      indicador.textContent = `${ativo ? '✓ ' : ''}${titulo} ${verbo}`;
      indicador.classList.toggle('recurso-ativo', Boolean(ativo));
    });
    // Atualiza a mensagem acessível com o resumo das preferências.
    if (estadoAcessibilidade) estadoAcessibilidade.textContent = mensagem;
    // Permite ouvir a página apenas quando o recurso áudio está marcado.
    if (botaoOuvir) botaoOuvir.disabled = !recursoAudio?.checked;
    // Interrompe qualquer fala em andamento ao desligar o recurso áudio.
    if (!recursoAudio?.checked) {
      pararLeitura();
    }
  };

  // Atualiza as preferências sempre que qualquer caixa do painel mudar.
  recursos.forEach((recurso) => recurso.addEventListener('change', atualizarPreferencias));
  // Salva e aplica a preferência Libras quando seu interruptor é alterado.
  recursoLibras?.addEventListener('change', () => {
    // Grava a escolha para restaurá-la na próxima visita.
    salvarPreferenciaLibras(recursoLibras.checked);
    // Ao ativar, limpa o erro anterior e tenta carregar o widget de novo.
    if (recursoLibras.checked) {
      erroCarregamentoVlibras = false;
      carregarVlibras();
    } else {
      // Ao desativar, esconde o widget sem removê-lo do documento.
      sincronizarVisibilidadeVlibras();
    }
  });

  // Atualiza o tamanho da fonte em toda a página e salva o valor escolhido.
  const aplicarTamanhoFonte = () => {
    // Define o tamanho na raiz do documento, afetando medidas baseadas em rem.
    document.documentElement.style.fontSize = `${tamanhoFonte}px`;
    // Define também no body para aplicar o tamanho base aos textos.
    document.body.style.fontSize = `${tamanhoFonte}px`;
    // Persiste o valor como string para que seja restaurado na próxima visita.
    try {
      localStorage.setItem(chaveTamanhoFonte, String(tamanhoFonte));
    } catch (erro) {
      console.warn('Não foi possível salvar o tamanho de fonte escolhido.', erro);
    }
    // Mostra a proporção em relação a 16 px como uma porcentagem.
    if (valorFonte) valorFonte.value = `${Math.round((tamanhoFonte / 16) * 100)}%`;
    // Desativa o botão de diminuir ao alcançar o limite mínimo.
    if (botaoDiminuirFonte) botaoDiminuirFonte.disabled = tamanhoFonte <= 14;
    // Desativa o botão de aumentar ao alcançar o limite máximo.
    if (botaoAumentarFonte) botaoAumentarFonte.disabled = tamanhoFonte >= 24;
    // Atualiza o estado dos perfis rápidos que dependem do tamanho atual.
    sincronizarEscolhasAcesso();
  };

  // Reduz a fonte em 2 px sem ultrapassar o mínimo aceito.
  botaoDiminuirFonte?.addEventListener('click', () => {
    // O clique não precisa de dados do evento; usa o tamanhoFonte declarado acima.
    tamanhoFonte = Math.max(14, tamanhoFonte - 2);
    aplicarTamanhoFonte();
  });

  // Aumenta a fonte em 2 px sem ultrapassar o máximo aceito.
  botaoAumentarFonte?.addEventListener('click', () => {
    // Soma 2 ao valor atual e limita o resultado a 24 px.
    tamanhoFonte = Math.min(24, tamanhoFonte + 2);
    aplicarTamanhoFonte();
  });

  // Aplica os valores iniciais restaurados para preferências e tamanho de fonte.
  atualizarPreferencias();
  aplicarTamanhoFonte();

  // Busca o botão que aplica combinações rápidas da página inicial.
  const botaoAplicarEscolhasAcesso = document.querySelector('#aplicar-escolhas-acesso');
  // Busca a região que anunciará o resultado dessa aplicação.
  const estadoEscolhasAcesso = document.querySelector('#estado-escolhas-acesso');
  // Aplica uma combinação rápida de acessibilidade quando o botão for acionado.
  botaoAplicarEscolhasAcesso?.addEventListener('click', () => {
    // Copia para uma lista todas as opções rápidas marcadas na página inicial.
    const opcoesAcesso = [...document.querySelectorAll('[data-perfil-acesso]')];
    // Registra se o perfil visual estava ligado para poder restaurar a fonte depois.
    const visaoEstavaAtiva = opcoesAcesso.find((opcao) => opcao.dataset.perfilAcesso === 'visao')?.checked;
    // Define quais recursos detalhados cada opção rápida controla.
    const recursosPorPerfil = {
      audio: ['audio'],
      libras: ['libras'],
      visao: ['contraste', 'fonte-legivel', 'espacamento'],
      imagens: ['imagens', 'linguagem-simples', 'leitura-facil'],
    };
    // Cria um conjunto dos nomes de recursos controlados por esses perfis.
    const nomesControlados = new Set(Object.values(recursosPorPerfil).flat());
    // Guarda em um conjunto os perfis rápidos que foram marcados.
    const selecionados = new Set(
      opcoesAcesso.filter((opcao) => opcao.checked).map((opcao) => opcao.dataset.perfilAcesso),
    );

    // Percorre os interruptores para sincronizá-los com as opções rápidas selecionadas.
    recursos.forEach((recurso) => {
      // Mantém inalterados recursos que não são controlados por esses perfis.
      if (!nomesControlados.has(recurso.dataset.recurso)) return;
      // Marca o recurso se algum perfil selecionado incluir seu nome.
      recurso.checked = Object.entries(recursosPorPerfil).some(([perfil, nomes]) => (
        selecionados.has(perfil) && nomes.includes(recurso.dataset.recurso)
      ));
    });

    // Eleva a fonte pelo menos a 20 px quando o perfil de visão foi selecionado.
    if (selecionados.has('visao')) {
      tamanhoFonte = Math.max(tamanhoFonte, 20);
      aplicarTamanhoFonte();
    // Se o perfil visual foi removido, retorna a fonte ao tamanho padrão.
    } else if (visaoEstavaAtiva) {
      tamanhoFonte = 16;
      aplicarTamanhoFonte();
    }

    // Reaplica estilos, salva recursos e atualiza os indicadores.
    atualizarPreferencias();
    // Confirma ao usuário que as escolhas foram aplicadas e onde ficam guardadas.
    if (estadoEscolhasAcesso) {
      estadoEscolhasAcesso.textContent = selecionados.size
        ? 'Pronto! Suas escolhas foram aplicadas e ficam salvas somente neste navegador. Você pode ajustar cada recurso no botão Acessibilidade.'
        : 'Tudo certo. Você pode navegar sem ativar recursos ou escolher novamente quando quiser.';
    }
  });

  // Busca o botão e a mensagem da ferramenta de perfis personalizados.
  const botaoAplicarPersona = document.querySelector('#aplicar-persona');
  const estadoPersona = document.querySelector('#estado-persona');
  // Aplica recursos sugeridos quando o usuário escolhe um perfil e confirma.
  botaoAplicarPersona?.addEventListener('click', () => {
    // Encontra a opção de perfil atualmente marcada.
    const personaSelecionada = document.querySelector('input[name="persona"]:checked');
    // Mapeia cada perfil para o conjunto de recursos que ele sugere.
    const recursosPorPersona = {
      idosa: ['contraste', 'fonte-legivel', 'espacamento'],
      surda: ['libras', 'legendas'],
      cega: ['audio'],
      leitura: ['linguagem-simples', 'imagens', 'leitura-facil'],
      intelectual: ['linguagem-simples', 'imagens', 'espacamento'],
      motora: ['teclado'],
    };
    // Se não existe escolha, informa o erro, foca a primeira opção e encerra.
    if (!personaSelecionada) {
      if (estadoPersona) estadoPersona.textContent = 'Escolha um perfil para aplicar uma experiência personalizada.';
      document.querySelector('input[name="persona"]')?.focus();
      return;
    }

    // Junta os nomes de todos os recursos que esses perfis podem alterar.
    const recursosControlados = new Set(Object.values(recursosPorPersona).flat());
    // Obtém os recursos correspondentes ao perfil escolhido.
    const recursosAtivos = new Set(recursosPorPersona[personaSelecionada.value] || []);
    // Atualiza os controles que são administrados pelos perfis.
    recursos.forEach((recurso) => {
      // Não altera interruptores que não pertençam a nenhum perfil.
      if (!recursosControlados.has(recurso.dataset.recurso)) return;
      // Marca somente os recursos incluídos no perfil selecionado.
      recurso.checked = recursosAtivos.has(recurso.dataset.recurso);
      // Dispara change para salvar e aplicar as mudanças como uma ação normal.
      recurso.dispatchEvent(new Event('change', { bubbles: true }));
    });

    // Define fonte maior para o perfil de pessoa idosa.
    if (personaSelecionada.value === 'idosa') {
      tamanhoFonte = 20;
      aplicarTamanhoFonte();
    } else {
      // Para os demais perfis, usa novamente o tamanho-base.
      tamanhoFonte = 16;
      aplicarTamanhoFonte();
    }

    // Lê o nome mostrado ao lado do rádio; usa texto genérico se estiver ausente.
    const nomePersona = personaSelecionada.nextElementSibling?.textContent?.trim() || 'Perfil escolhido';
    // Apresenta a confirmação e informa que os ajustes podem ser alterados.
    if (estadoPersona) {
      estadoPersona.textContent = `Experiência personalizada aplicada para ${nomePersona}. Os recursos ficam salvos somente neste navegador e podem ser ajustados no botão Acessibilidade.`;
    }
    // Rola suavemente para a área de escolhas rápidas.
    document.querySelector('#escolha-acesso')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  // Registra a troca de tema em cada opção de rádio do painel.
  // forEach fornece em `opcao` um rádio; seu value="claro"/"escuro" vem do HTML.
  seletorTema.forEach((opcao) => {
    // Só aplica o tema quando a opção atual fica marcada.
    opcao.addEventListener('change', () => {
      if (opcao.checked) {
        // Define o atributo que os seletores CSS usam para trocar a paleta.
        document.body.dataset.tema = opcao.value;
        // `opcao` é o rádio atual; seu value="claro"/"escuro" vem do HTML.
        // Este valor é passado como argumento ao parâmetro `tema` de salvarTema.
        salvarTema(opcao.value);
        // Troca os arquivos de logo para manter contraste com o fundo.
        aplicarLogoDoTema(opcao.value);
        // Mantém todas as opções de rádio coerentes com a escolha atual.
        seletorTema.forEach((tema) => {
          tema.checked = tema.value === opcao.value;
        });
      }
    });
  });

  // Abre o painel como modal quando o navegador suporta <dialog>.
  const abrirPainelAcessibilidade = () => {
    // showModal cria uma camada modal; o fallback open permite compatibilidade com navegadores antigos.
    // Sai sem fazer nada se o painel não foi encontrado.
    if (!painelAcessibilidade) return;
    // Evita pedir abertura novamente se o diálogo já está aberto.
    if (!painelAcessibilidade.open) {
      // Prefere o método nativo de modal quando disponível.
      if (typeof painelAcessibilidade.showModal === 'function') {
        painelAcessibilidade.showModal();
      } else {
        // Alternativa para navegadores sem showModal: adiciona o atributo open.
        painelAcessibilidade.setAttribute('open', '');
      }
      // Lê o tema ativo, usando claro como padrão caso ainda não esteja definido.
      const temaAtual = document.body.dataset.tema || 'claro';
      // Marca no painel o rádio que corresponde ao tema que está aplicado.
      seletorTema.forEach((tema) => {
        tema.checked = tema.value === temaAtual;
      });
    }
  };

  // Converte todos os links e botões configurados em acionadores do painel.
  gatilhosAcessibilidade.forEach((gatilho) => {
    // Abre o painel ao clicar e evita seguir o href padrão do link.
    gatilho.addEventListener('click', (evento) => {
      evento.preventDefault();
      abrirPainelAcessibilidade();
    });
  });

  // Configura um atalho opcional que abre o painel e ativa a tradução em Libras.
  document.querySelector('#abrir-traducao-libras')?.addEventListener('click', (evento) => {
    // Evita seguir o destino do link que representa o atalho.
    evento.preventDefault();
    // Abre o painel para deixar visível a configuração Libras.
    abrirPainelAcessibilidade();
    // Se esta página não tem o controle Libras, anuncia a indisponibilidade e encerra.
    if (!recursoLibras) {
      if (estadoComunicacao) estadoComunicacao.textContent = 'A opção Libras não está disponível nesta página.';
      return;
    }
    // Marca o controle e dispara a rotina padrão caso ele estivesse desligado.
    if (!recursoLibras.checked) {
      recursoLibras.checked = true;
      recursoLibras.dispatchEvent(new Event('change', { bubbles: true }));
    }
    // Move o foco do teclado para o controle recém-ativado.
    recursoLibras.focus();
    // Explica como usar o avatar e avisa sobre limitações da tradução automática.
    if (estadoComunicacao) {
      estadoComunicacao.textContent = 'VLibras ativado. Use o avatar que aparece na página e selecione o texto da mensagem para ver a tradução. A tradução automática pode ter limitações.';
    }
  });

  // Fecha o painel ao acionar seu botão de fechar.
  botaoFecharAcessibilidade?.addEventListener('click', () => {
    painelAcessibilidade?.close();
  });

  // Fecha o diálogo se o clique acontecer no fundo, e não dentro do conteúdo.
  painelAcessibilidade?.addEventListener('click', (evento) => {
    if (evento.target === painelAcessibilidade) painelAcessibilidade.close();
  });

  // Também fecha o painel com Escape, para teclado e métodos alternativos.
  document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape' && painelAcessibilidade?.open) {
      painelAcessibilidade.close();
    }
  });

  // Monta uma cópia limpa do conteúdo principal e inicia sua leitura completa.
  botaoOuvir?.addEventListener('click', () => {
    // Copia a região main, incluindo seus descendentes, sem alterar a página original.
    const copiaConteudo = conteudoPrincipal?.cloneNode(true);
    // Retira diálogos, elementos decorativos e conteúdo escondido da cópia de leitura.
    copiaConteudo?.querySelectorAll('dialog, [aria-hidden="true"], [hidden]')
      .forEach((elemento) => elemento.remove());
    // Associa o indicador visual ao botão que iniciou a leitura completa.
    alvoLeituraAtual = botaoOuvir;
    // O texto extraído é passado como argumento `texto`; os outros parâmetros usam seus padrões.
    lerTexto(copiaConteudo?.innerText ?? '');
  });

  // Permite interromper manualmente a voz e comunicar que ela foi parada.
  botaoParar?.addEventListener('click', () => {
    // A mensagem literal preenche o parâmetro `mensagem` de pararLeitura.
    pararLeitura('Leitura em voz alta interrompida.');
  });

  // Busca os controles de busca por voz e o campo de serviços que receberá a transcrição.
  const botaoBuscarVoz = document.querySelector('#buscar-por-voz');
  const estadoBuscaVoz = document.querySelector('#estado-busca-voz');
  const campoBuscaServicos = document.querySelector('#campo-busca-servicos');
  // Usa o reconhecimento de voz do navegador para preencher a busca por serviços.
  botaoBuscarVoz?.addEventListener('click', () => {
    // Usa a implementação disponível: nome padrão ou nome com prefixo WebKit.
    const ReconhecedorDeVoz = window.SpeechRecognition || window.webkitSpeechRecognition;
    // Se não existe API de voz, avisa que a busca digitada continua disponível.
    if (!ReconhecedorDeVoz) {
      if (estadoBuscaVoz) {
        estadoBuscaVoz.textContent = 'A busca por voz não está disponível neste navegador. Você pode digitar o que precisa no campo de busca.';
      }
      return;
    }

    // Cria uma sessão de reconhecimento de fala para este clique.
    const reconhecimento = new ReconhecedorDeVoz();
    // Define a língua que será reconhecida.
    reconhecimento.lang = 'pt-BR';
    // Espera o resultado final em vez de resultados parciais durante a fala.
    reconhecimento.interimResults = false;
    // Solicita apenas a alternativa de transcrição mais provável.
    reconhecimento.maxAlternatives = 1;
    // Mostra visualmente e acessivelmente que o botão está ativo.
    botaoBuscarVoz.setAttribute('aria-pressed', 'true');
    // Informa quando o microfone começou a ouvir.
    reconhecimento.onstart = () => {
      if (estadoBuscaVoz) estadoBuscaVoz.textContent = 'Pode falar o assunto que está procurando. O microfone só é usado enquanto esta busca está ativa.';
    };
    // Trata o resultado da transcrição fornecida pelo navegador.
    reconhecimento.onresult = (evento) => {
      // Obtém o primeiro texto reconhecido, se existir, e remove espaços externos.
      const transcricao = evento.results[0]?.[0]?.transcript?.trim();
      // Informa erro se não houve texto ou o campo de busca não existe.
      if (!transcricao || !campoBuscaServicos) {
        if (estadoBuscaVoz) estadoBuscaVoz.textContent = 'Não entendi a busca. Tente novamente ou digite o assunto.';
        return;
      }
      // Insere a transcrição no campo de busca.
      campoBuscaServicos.value = transcricao;
      // Dispara o evento input para o filtro pesquisar a transcrição.
      campoBuscaServicos.dispatchEvent(new Event('input', { bubbles: true }));
      // Exibe a frase reconhecida para que o usuário revise os resultados.
      if (estadoBuscaVoz) estadoBuscaVoz.textContent = `Busca reconhecida: “${transcricao}”. Confira os resultados e escolha o serviço.`;
    };
    // Traduz erros conhecidos em mensagens que ajudam a pessoa a continuar digitando.
    reconhecimento.onerror = (evento) => {
      const mensagem = evento.error === 'not-allowed'
        ? 'O acesso ao microfone não foi permitido. Você pode digitar o assunto no campo de busca.'
        : 'Não foi possível reconhecer a fala. Tente novamente ou digite o assunto.';
      if (estadoBuscaVoz) estadoBuscaVoz.textContent = mensagem;
    };
    // Desmarca o botão ao terminar, seja por sucesso, cancelamento ou erro.
    reconhecimento.onend = () => {
      botaoBuscarVoz.setAttribute('aria-pressed', 'false');
    };
    // Inicia a solicitação de acesso ao microfone dentro de um tratamento de erro.
    try {
      reconhecimento.start();
    } catch (erro) {
      // Se não for possível iniciar, volta o botão ao estado desligado.
      botaoBuscarVoz.setAttribute('aria-pressed', 'false');
      // Registra o erro técnico no console e orienta a usar o campo de texto.
      console.warn('Não foi possível iniciar a busca por voz.', erro);
      if (estadoBuscaVoz) estadoBuscaVoz.textContent = 'Não foi possível iniciar o microfone. Digite o assunto no campo de busca.';
    }
  });

  const exemplosEntenda = {
    // Objeto local guarda exemplos prontos sem enviar dados pessoais para nenhum servidor.
    // Chave documentos seleciona a explicação associada à conferência de documentos.
    documentos: {
      // Frase inicial exibida antes da lista para contextualizar o exemplo.
      origem: 'Exemplo: confira as instruções do órgão para saber quais documentos são necessários e quais etapas seguir.',
      // Passos apresentados em sequência na interface.
      passos: [
        'Abra a página oficial do serviço.',
        'Confira a lista de documentos e as etapas.',
        'Se algo não estiver claro, pergunte ao órgão responsável antes de continuar.',
      ],
    },
    // Chave protocolo seleciona o exemplo sobre acompanhamento de pedidos.
    protocolo: {
      // Texto de contexto que inicia a orientação.
      origem: 'Exemplo: depois de fazer um pedido, guarde o protocolo para consultar o andamento.',
      // Lista com ações recomendadas para consultar o andamento.
      passos: [
        'Anote ou guarde o número do protocolo.',
        'Veja qual canal o órgão indica para acompanhar o pedido.',
        'Consulte o andamento por esse canal.',
      ],
    },
  };
  // Localiza o menu onde a pessoa escolhe um exemplo pronto.
  const seletorExemplo = document.querySelector('#selecionar-exemplo-entenda');
  // Localiza o botão que mostra o exemplo escolhido.
  const botaoExplicarExemplo = document.querySelector('#explicar-exemplo');
  // Localiza o botão que organiza o texto digitado em frases.
  const botaoOrganizarTexto = document.querySelector('#organizar-texto');
  // Localiza o botão que apaga o campo e o resultado.
  const botaoLimparTexto = document.querySelector('#limpar-texto-entenda');
  // Localiza a área onde o usuário cola ou escreve seu texto.
  const campoTextoEntenda = document.querySelector('#texto-para-simplificar');
  // Localiza o contêiner que mostra o resultado produzido.
  const resultadoEntenda = document.querySelector('#resultado-entenda');
  // Localiza o elemento de saída do texto contextual do exemplo.
  const origemEntenda = document.querySelector('#origem-entenda');
  // Localiza a lista ordenada de passos exibidos no resultado.
  const passosEntenda = document.querySelector('#passos-entenda');
  // Localiza a mensagem que anuncia o estado da ferramenta.
  const estadoEntenda = document.querySelector('#estado-entenda');
  // Localiza o botão que lê em voz alta o resultado organizado.
  const botaoOuvirExplicacao = document.querySelector('#ouvir-explicacao');

  // Atualiza o contexto e os itens da lista e torna a região de resultado visível.
  // `origem` e `passos` são fornecidos pelas chamadas abaixo: exemplosEntenda
  // fornece seus campos ou o texto do usuário é dividido em partes.
  const mostrarPassosEntenda = (origem, passos) => {
    // Não tenta montar resultado se algum dos elementos necessários estiver ausente.
    if (!resultadoEntenda || !origemEntenda || !passosEntenda) return;
    // Insere o texto inicial como conteúdo textual seguro.
    origemEntenda.textContent = origem;
    // Cria um <li> para cada passo e troca os itens antigos pelos novos.
    passosEntenda.replaceChildren(...passos.map((passo) => {
      // Cria um novo item de lista.
      const item = document.createElement('li');
      // Coloca o passo como texto, sem interpretar HTML digitado pelo usuário.
      item.textContent = passo;
      // Devolve o item para ser inserido em replaceChildren.
      return item;
    }));
    // Remove o estado escondido da seção para exibir o resultado.
    resultadoEntenda.hidden = false;
  };

  // Formata um exemplo pré-definido como uma sequência simples de passos.
  botaoExplicarExemplo?.addEventListener('click', () => {
    // Procura no objeto o exemplo correspondente ao value selecionado.
    const exemplo = exemplosEntenda[seletorExemplo?.value];
    // Avisa e foca o seletor se nenhuma opção válida tiver sido escolhida.
    if (!exemplo) {
      if (estadoEntenda) estadoEntenda.textContent = 'Escolha um exemplo para ver a explicação.';
      seletorExemplo?.focus();
      return;
    }
    // Entrega o texto e os passos escolhidos à função que atualiza a tela.
    mostrarPassosEntenda(exemplo.origem, exemplo.passos);
    // Explica que o exemplo é informativo e deve ser conferido na fonte oficial.
    if (estadoEntenda) estadoEntenda.textContent = 'Exemplo preparado pelo INCLUI. Confira sempre as instruções atualizadas do órgão responsável.';
    // Rola até o resultado sem deslocar mais conteúdo que o necessário.
    resultadoEntenda?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  // Organiza um texto informado pelo usuário separando suas frases em passos.
  botaoOrganizarTexto?.addEventListener('click', () => {
    // Obtém o texto sem espaços extras nas extremidades.
    const texto = campoTextoEntenda?.value.trim();
    // Bloqueia o processamento vazio, orienta a pessoa e mantém o foco no campo.
    if (!texto) {
      if (estadoEntenda) estadoEntenda.textContent = 'Cole um texto sem dados pessoais para separar em partes.';
      campoTextoEntenda?.focus();
      return;
    }
    // Divide o texto em parágrafos e depois separa cada parágrafo em frases.
    const paragrafoEmFrases = texto.split(/\n+/).flatMap((paragrafo) => (
      paragrafo.match(/[^.!?]+[.!?]?/g) || []
    ));
    // Limpa os espaços de cada frase e remove entradas vazias.
    const partes = paragrafoEmFrases.map((parte) => parte.trim()).filter(Boolean);
    // Mostra as frases como passos, sem afirmar que o conteúdo foi simplificado ou validado.
    mostrarPassosEntenda('Seu texto, separado em frases. O conteúdo não foi simplificado nem verificado.', partes);
    // Conta as partes geradas e informa que o processamento ocorreu nesta página.
    if (estadoEntenda) estadoEntenda.textContent = `${partes.length} parte${partes.length === 1 ? '' : 's'} organizadas somente nesta página.`;
    // Leva a tela ao resultado.
    resultadoEntenda?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  // Limpa todos os campos e resultados da ferramenta.
  botaoLimparTexto?.addEventListener('click', () => {
    // Apaga o texto escrito, se o campo estiver presente.
    if (campoTextoEntenda) campoTextoEntenda.value = '';
    // Reseta a seleção de exemplo para seu valor inicial.
    if (seletorExemplo) seletorExemplo.value = '';
    // Oculta a seção onde o resultado aparecia.
    if (resultadoEntenda) resultadoEntenda.hidden = true;
    // Retira todos os itens de passo já criados.
    if (passosEntenda) passosEntenda.replaceChildren();
    // Confirma que o conteúdo da ferramenta foi apagado.
    if (estadoEntenda) estadoEntenda.textContent = 'Texto e resultado apagados desta página.';
    // Devolve o foco para o campo pronto para ser usado novamente.
    campoTextoEntenda?.focus();
  });

  // Lê em voz alta o texto contextual e os passos exibidos no resultado.
  botaoOuvirExplicacao?.addEventListener('click', () => {
    // Extrai o texto de cada item <li> e transforma a coleção em um array.
    const passos = [...(passosEntenda?.querySelectorAll('li') || [])]
      .map((passo) => passo.textContent);
    // Só inicia a fala se houver contexto e ao menos um passo.
    if (origemEntenda?.textContent && passos.length) {
      // Aqui lerTexto recebe o texto combinado, true para anunciar estado e a região desta ferramenta.
      lerTexto(`${origemEntenda.textContent} ${passos.join('. ')}`, true, estadoEntenda);
    }
  });

  // Obtém uma descrição utilizável para ler elementos apontados ou focados.
  // `alvo` recebe o elemento escolhido por lerAlvoApontado a partir do evento.
  const obterTextoDoAlvo = (alvo) => {
    // Prioriza uma descrição explícita preparada no HTML.
    if (alvo.dataset.leitura) return alvo.dataset.leitura;
    // Usa o nome acessível se ele existir.
    if (alvo.getAttribute('aria-label')) return alvo.getAttribute('aria-label');
    // Para controles, verifica se há um label associado e retorna seu texto.
    if (alvo.matches('input, textarea, select')) {
      const rotulo = alvo.labels?.[0];
      if (rotulo) return rotulo.innerText;
    }
    // Se não existe label, usa o valor preenchido ou uma dica/descrição alternativa.
    if (alvo.matches('input, textarea, select')) {
      return alvo.value || alvo.getAttribute('placeholder') || alvo.getAttribute('title') || '';
    }

    // Copia outros elementos para poder limpar apenas a cópia, sem mexer na página.
    const copiaAlvo = alvo.cloneNode(true);
    // Remove conteúdo invisível e ícones decorativos da cópia de leitura.
    copiaAlvo.querySelectorAll('[aria-hidden="true"], [hidden]').forEach((elemento) => elemento.remove());
    // Retorna o texto visível ou, se não houver, alternativas da imagem ou título.
    return copiaAlvo.innerText || copiaAlvo.getAttribute('alt') || copiaAlvo.getAttribute('title') || '';
  };

  // Decide se o texto sob o ponteiro ou foco deve ser lido após uma breve pausa.
  // `evento` é fornecido pelo navegador nos ouvintes pointerover e focusin abaixo.
  const lerAlvoApontado = (evento) => {
    // Não lê se o recurso áudio estiver desligado ou se a entrada veio de toque.
    if (!recursoAudio?.checked || evento.pointerType === 'touch') return;
    // Garante que o alvo seja um elemento HTML antes de consultar seletores.
    if (!(evento.target instanceof Element)) return;
    // Sobe do alvo até encontrar um tipo de conteúdo que pode ser lido.
    const alvo = evento.target.closest(
      'h1, h2, h3, h4, p, li, a, button, summary, blockquote, figcaption, strong, small, label, textarea, input, select, output, legend, [role="button"], [data-leitura]',
    );
    // Ignora conteúdo inexistente, escondido ou marcado como decorativo.
    if (!alvo || alvo.closest('[aria-hidden="true"], [hidden]')) return;
    // Evita repetir a leitura ao mover-se dentro do mesmo alvo.
    if (alvo === ultimoAlvoLido || (evento.relatedTarget && alvo.contains(evento.relatedTarget))) return;

    // Guarda o alvo para evitar repetições e posicionar o indicador.
    ultimoAlvoLido = alvo;
    alvoLeituraAtual = alvo;
    // Reinicia o atraso para esperar que o ponteiro/foco pare sobre o elemento.
    window.clearTimeout(temporizadorLeitura);
    // Aguarda 350 ms e então lê o texto do alvo.
    temporizadorLeitura = window.setTimeout(() => {
      // Limpa a referência ao temporizador antes de iniciar a fala.
      temporizadorLeitura = null;
      // O texto do alvo é o argumento principal; false evita anunciar status a cada foco.
      lerTexto(obterTextoDoAlvo(alvo), false);
    }, 350);
  };

  // Lê textos quando o ponteiro entra em elementos ou o teclado foca neles.
  document.addEventListener('pointerover', lerAlvoApontado);
  document.addEventListener('focusin', lerAlvoApontado);
  // Acompanha o ponteiro para mover o indicador enquanto a fala está ativa.
  document.addEventListener('pointermove', (evento) => {
    // Atualiza a posição só enquanto o indicador estiver visível.
    if (indicadorLeitura.classList.contains('indicador-leitura-ativo')) {
      posicionarIndicadorLeitura(evento.clientX, evento.clientY);
    }
  });
  // Libera o alvo atual quando o ponteiro deixa o elemento por completo.
  document.addEventListener('pointerout', (evento) => {
    // Confere se saiu do elemento lido e se não está apenas entrando em um filho.
    if (evento.target instanceof Element
      && (evento.target === ultimoAlvoLido || evento.target.contains(ultimoAlvoLido))
      && (!evento.relatedTarget || !evento.target.contains(evento.relatedTarget))) {
      // Limpa o controle para que o mesmo elemento possa ser lido novamente depois.
      ultimoAlvoLido = null;
    }
  });

  // Permite cancelar a leitura em voz alta com a tecla Escape.
  document.addEventListener('keydown', (evento) => {
    // Só interrompe quando Escape foi pressionado e há fala ou atraso pendente.
    if (evento.key === 'Escape'
      && suporteLeitura
      && (window.speechSynthesis.speaking || temporizadorLeitura !== null)) {
      pararLeitura();
    }
  });

  // Executa novamente a sincronização para os elementos criados ou restaurados depois.
  atualizarPreferencias();
  // Aplica o tamanho inicial da fonte e atualiza os controles de limite.
  aplicarTamanhoFonte();

  // Abre diretamente o painel se a URL terminar com a âncora de acessibilidade.
  if (window.location.hash === '#acessibilidade') abrirPainelAcessibilidade();

  // Revela cartões conforme entram na área visível da página.
  // Seleciona elementos marcados no HTML para animação de entrada.
  const elementosRevelar = document.querySelectorAll('[data-revelar]');
  // Consulta a preferência do sistema e a configuração de animação do próprio site.
  const movimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    || document.body.dataset.animacao === 'reduzida';
  // Só usa o observador se houver itens, suporte no navegador e movimento permitido.
  if (elementosRevelar.length && 'IntersectionObserver' in window && !movimentoReduzido) {
    // Habilita no body as regras CSS que ocultam os cartões antes da revelação.
    document.body.dataset.revelacao = 'ativa';
    // Cria um observador chamado quando um cartão cruza o limite de visibilidade.
    const observadorRevelacao = new IntersectionObserver((entradas, observador) => {
      // Processa cada alteração observada.
      entradas.forEach((entrada) => {
        // Ignora elementos que ainda não chegaram à área de observação.
        if (!entrada.isIntersecting) return;
        // Adiciona a classe que torna o item visível com a transição CSS.
        entrada.target.classList.add('revelar-visivel');
        // Para de observar o item depois da primeira revelação.
        observador.unobserve(entrada.target);
      });
    }, { threshold: 0.12 });
    // Registra cada cartão no observador; threshold indica 12% visível para ativar.
    elementosRevelar.forEach((elemento) => observadorRevelacao.observe(elemento));
  } else {
    // Se não houver suporte ou movimento estiver reduzido, mostra todos sem esperar.
    elementosRevelar.forEach((elemento) => elemento.classList.add('revelar-visivel'));
  }
});
