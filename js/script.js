document.addEventListener('DOMContentLoaded', () => {
  const lerTemaSalvo = () => {
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
  const imagensLogo = document.querySelectorAll('[data-logo-claro][data-logo-escuro]');
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
      ['linguagem-simples', 'Linguagem simples', 'Registra preferência por palavras comuns e instruções diretas.'],
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

  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const button = item.querySelector('.faq-question');
    if (!button) return;

    button.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      faqItems.forEach((faq) => faq.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  const yearNode = document.querySelector('[data-current-year]');
  if (yearNode) yearNode.textContent = new Date().getFullYear();

  const recursos = document.querySelectorAll('[data-recurso]');
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
  let tamanhoFonte = 16;
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

  const sincronizarVisibilidadeVlibras = () => {
    const ativo = recursoLibras?.checked;
    ['#vlibras-access-wrapper', '#vlibras-app-root'].forEach((seletor) => {
      const elemento = document.querySelector(seletor);
      if (elemento) elemento.style.display = ativo ? '' : 'none';
    });
  };

  const carregarVlibras = () => {
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
  observadorVlibras.observe(document.body, { childList: true });

  if (recursoLibras) recursoLibras.checked = lerPreferenciaLibras();
  const indicadorLeitura = document.createElement('div');
  indicadorLeitura.className = 'indicador-leitura';
  indicadorLeitura.setAttribute('aria-hidden', 'true');
  indicadorLeitura.innerHTML = '<span class="indicador-leitura-mao">☝</span><span>Lendo</span>';
  document.body.append(indicadorLeitura);

  const posicionarIndicadorLeitura = (x, y) => {
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

  const pararLeitura = (mensagem) => {
    window.clearTimeout(temporizadorLeitura);
    idLeitura += 1;
    if (suporteLeitura) window.speechSynthesis.cancel();
    if (botaoParar) botaoParar.disabled = true;
    ocultarIndicadorLeitura();
    if (mensagem && estadoAcessibilidade) estadoAcessibilidade.textContent = mensagem;
  };

  const lerTexto = (texto, anunciarEstado = true) => {
    if (!suporteLeitura) {
      if (anunciarEstado && estadoAcessibilidade) {
        estadoAcessibilidade.textContent = 'A leitura em voz alta não está disponível neste navegador.';
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
      .find((voz) => /^pt(-|_)/i.test(voz.lang));
    if (vozPortugues) fala.voice = vozPortugues;
    fala.onstart = () => {
      if (leituraAtual === idLeitura) mostrarIndicadorLeitura();
    };
    fala.onend = () => {
      if (leituraAtual !== idLeitura) return;
      if (botaoParar) botaoParar.disabled = true;
      ocultarIndicadorLeitura();
      if (anunciarEstado && estadoAcessibilidade) {
        estadoAcessibilidade.textContent = 'Leitura concluída.';
      }
    };
    fala.onerror = () => {
      if (leituraAtual !== idLeitura) return;
      if (botaoParar) botaoParar.disabled = true;
      ocultarIndicadorLeitura();
      if (estadoAcessibilidade) {
        estadoAcessibilidade.textContent = 'Não foi possível concluir a leitura em voz alta.';
      }
    };

    window.speechSynthesis.speak(fala);
    if (botaoParar) botaoParar.disabled = false;
    if (anunciarEstado && estadoAcessibilidade) {
      estadoAcessibilidade.textContent = 'Lendo o conteúdo da página em voz alta.';
    }
  };

  const atributosRecursos = {
    daltonismo: ['paleta', 'daltonismo'],
    contraste: ['contraste', 'alto'],
    espacamento: ['espacamento', 'amplo'],
    'fonte-legivel': ['fonte', 'simples'],
    'sem-animacoes': ['animacao', 'reduzida'],
    'leitura-facil': ['leitura', 'foco'],
  };

  const atualizarPreferencias = () => {
    if (recursoAudio?.checked) {
      document.body.dataset.audio = 'ativo';
    } else {
      delete document.body.dataset.audio;
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

  const aplicarTamanhoFonte = () => {
    document.documentElement.style.fontSize = `${tamanhoFonte}px`;
    document.body.style.fontSize = `${tamanhoFonte}px`;
    if (valorFonte) valorFonte.value = `${Math.round((tamanhoFonte / 16) * 100)}%`;
    if (botaoDiminuirFonte) botaoDiminuirFonte.disabled = tamanhoFonte <= 14;
    if (botaoAumentarFonte) botaoAumentarFonte.disabled = tamanhoFonte >= 24;
  };

  botaoDiminuirFonte?.addEventListener('click', () => {
    tamanhoFonte = Math.max(14, tamanhoFonte - 2);
    aplicarTamanhoFonte();
  });

  botaoAumentarFonte?.addEventListener('click', () => {
    tamanhoFonte = Math.min(24, tamanhoFonte + 2);
    aplicarTamanhoFonte();
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

  const abrirPainelAcessibilidade = () => {
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

  botaoOuvir?.addEventListener('click', () => {
    const copiaConteudo = conteudoPrincipal?.cloneNode(true);
    copiaConteudo?.querySelectorAll('dialog, [aria-hidden="true"], [hidden]')
      .forEach((elemento) => elemento.remove());
    alvoLeituraAtual = botaoOuvir;
    lerTexto(copiaConteudo?.innerText ?? '');
  });

  botaoParar?.addEventListener('click', () => {
    pararLeitura('Leitura em voz alta interrompida.');
  });

  const obterTextoDoAlvo = (alvo) => {
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

  document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape'
      && suporteLeitura
      && (window.speechSynthesis.speaking || temporizadorLeitura !== null)) {
      pararLeitura();
    }
  });

  atualizarPreferencias();
  aplicarTamanhoFonte();

  if (window.location.hash === '#acessibilidade') abrirPainelAcessibilidade();
});
