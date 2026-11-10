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
  let temporizadorLeitura = null;
  let ultimoAlvoLido = null;
  let idLeitura = 0;
  const suporteLeitura = 'speechSynthesis' in window
    && 'SpeechSynthesisUtterance' in window;

  const pararLeitura = (mensagem) => {
    window.clearTimeout(temporizadorLeitura);
    idLeitura += 1;
    if (suporteLeitura) window.speechSynthesis.cancel();
    if (botaoParar) botaoParar.disabled = true;
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
    fala.onend = () => {
      if (leituraAtual !== idLeitura) return;
      if (botaoParar) botaoParar.disabled = true;
      if (anunciarEstado && estadoAcessibilidade) {
        estadoAcessibilidade.textContent = 'Leitura concluída.';
      }
    };
    fala.onerror = () => {
      if (leituraAtual !== idLeitura) return;
      if (botaoParar) botaoParar.disabled = true;
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
    recursos.forEach((recurso) => {
      const atributo = atributosRecursos[recurso.dataset.recurso];
      if (atributo) {
        document.body.dataset[atributo[0]] = recurso.checked ? atributo[1] : '';
        if (!recurso.checked) delete document.body.dataset[atributo[0]];
      }

    });

    const selecionados = [...recursos].filter((recurso) => recurso.checked);
    const preferencias = selecionados
      .filter((recurso) => ['libras', 'legendas'].includes(recurso.dataset.recurso))
      .map((recurso) => recurso.dataset.recurso === 'libras' ? 'Libras' : 'legendas');
    let mensagem = selecionados.length
      ? `${selecionados.length} recurso${selecionados.length === 1 ? '' : 's'} selecionado${selecionados.length === 1 ? '' : 's'}.`
      : 'Nenhum recurso adicional selecionado.';

    if (preferencias.length) {
      mensagem += ` Preferência por ${preferencias.join(' e ')} registrada para conteúdos quando disponíveis.`;
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
    lerTexto(copiaConteudo?.innerText ?? '');
  });

  botaoParar?.addEventListener('click', () => {
    pararLeitura('Leitura em voz alta interrompida.');
  });

  const lerAlvoApontado = (evento) => {
    if (!recursoAudio?.checked || evento.pointerType === 'touch') return;
    const alvo = evento.target.closest(
      'h1, h2, h3, h4, p, li, a, button, summary, blockquote, figcaption',
    );
    if (!alvo || !conteudoPrincipal?.contains(alvo) || alvo.closest('dialog, [aria-hidden="true"]')) return;
    if (alvo === ultimoAlvoLido || (evento.relatedTarget && alvo.contains(evento.relatedTarget))) return;

    ultimoAlvoLido = alvo;
    window.clearTimeout(temporizadorLeitura);
    temporizadorLeitura = window.setTimeout(() => {
      temporizadorLeitura = null;
      lerTexto(alvo.innerText, false);
    }, 350);
  };

  conteudoPrincipal?.addEventListener('pointerover', lerAlvoApontado);
  conteudoPrincipal?.addEventListener('focusin', lerAlvoApontado);
  conteudoPrincipal?.addEventListener('pointerleave', () => {
    window.clearTimeout(temporizadorLeitura);
    temporizadorLeitura = null;
    ultimoAlvoLido = null;
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
