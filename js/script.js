document.addEventListener('DOMContentLoaded', () => {
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

      if (recurso.dataset.recurso === 'fonte-grande') {
        document.documentElement.style.fontSize = recurso.checked ? '19px' : '';
        document.body.style.fontSize = recurso.checked ? '19px' : '';
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

    if (estadoAcessibilidade) estadoAcessibilidade.textContent = mensagem;
    if (botaoOuvir) botaoOuvir.disabled = !recursoAudio?.checked;
    if (!recursoAudio?.checked && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (botaoParar) botaoParar.disabled = true;
    }
  };

  recursos.forEach((recurso) => recurso.addEventListener('change', atualizarPreferencias));

  seletorTema.forEach((opcao) => {
    opcao.addEventListener('change', () => {
      if (opcao.checked) document.body.dataset.tema = opcao.value;
    });
  });

  botaoOuvir?.addEventListener('click', () => {
    if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
      if (estadoAcessibilidade) estadoAcessibilidade.textContent = 'A leitura em voz alta não está disponível neste navegador.';
      return;
    }

    window.speechSynthesis.cancel();
    const fala = new SpeechSynthesisUtterance(document.querySelector('main')?.innerText ?? '');
    fala.lang = 'pt-BR';
    fala.onend = () => {
      if (botaoParar) botaoParar.disabled = true;
    };
    fala.onerror = () => {
      if (botaoParar) botaoParar.disabled = true;
      if (estadoAcessibilidade) estadoAcessibilidade.textContent = 'Não foi possível concluir a leitura em voz alta.';
    };

    window.speechSynthesis.speak(fala);
    if (botaoParar) botaoParar.disabled = false;
    if (estadoAcessibilidade) estadoAcessibilidade.textContent = 'Lendo o conteúdo da página em voz alta.';
  });

  botaoParar?.addEventListener('click', () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    botaoParar.disabled = true;
    if (estadoAcessibilidade) estadoAcessibilidade.textContent = 'Leitura em voz alta pausada.';
  });

  atualizarPreferencias();
});
