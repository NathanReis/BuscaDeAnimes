window.addEventListener('load', () => {
  const formularioElemento = document.getElementById('formulario');
  const primeiraPaginaElemento = document.getElementById('primeira-pagina');
  const paginaAnteriorElemento = document.getElementById('pagina-anterior');
  const proximaPaginaElemento = document.getElementById('proxima-pagina');
  const ultimaPaginaElemento = document.getElementById('ultima-pagina');

  const limitePorPagina = 12;

  let paginaAtual = 1;
  let ultimaPagina = 1;

  formularioElemento.addEventListener('submit', filtrar, false);
  primeiraPaginaElemento.addEventListener('click', trocarPagina, false);
  paginaAnteriorElemento.addEventListener('click', trocarPagina, false);
  proximaPaginaElemento.addEventListener('click', trocarPagina, false);
  ultimaPaginaElemento.addEventListener('click', trocarPagina, false);

  function atualizarPaginacao(totalResultados) {
    ultimaPagina = Math.ceil(totalResultados / limitePorPagina);

    if(paginaAtual == 1) {
      primeiraPaginaElemento.classList.add('sr-only');
      paginaAnteriorElemento.classList.add('sr-only');
    } else {
      primeiraPaginaElemento.classList.remove('sr-only');
      paginaAnteriorElemento.classList.remove('sr-only');
    }

    if(paginaAtual == ultimaPagina) {
      proximaPaginaElemento.classList.add('sr-only');
      ultimaPaginaElemento.classList.add('sr-only');
    } else {
      proximaPaginaElemento.classList.remove('sr-only');
      ultimaPaginaElemento.classList.remove('sr-only');
    }
  }

  function exibirRetorno(animes) {
    const divResultados = document.getElementById('resultados');
    divResultados.innerHTML = '';

    animes.forEach((anime) => {
      const atributos = anime.attributes;
      const card = montarCard(atributos);

      divResultados.appendChild(card);
    });
  }

  function fazerRequisicaoAnimes() {
    const uri = montarURIAnimes();
    const parametrosRequisicao = {
      "method": "GET",
      "headers": {
        "Accept": "application/vnd.api+json",
        "content-type": "application/vnd.api+json"
      }
    };

    fetch(uri, parametrosRequisicao)
      .then(resposta => resposta.json())
      .then(resposta => {
        atualizarPaginacao(resposta.meta.count);
        exibirRetorno(resposta.data)
      })
      .catch(erro => console.log(erro));
  }

  function filtrar(event) {
    event.preventDefault();

    paginaAtual = 1;

    fazerRequisicaoAnimes();
  }

  function montarURIAnimes() {
    let categoria = document.getElementById('categoria').value.trim();
    let titulo = document.getElementById('titulo').value.trim();
    let offset = (paginaAtual * limitePorPagina) - limitePorPagina;

    let uri = `https://kitsu.io/api/edge/anime?page[limit]=${limitePorPagina}&page[offset]=${offset}`;

    if(categoria) {
      uri += '&filter[categories]=' + categoria;
    }

    if(titulo) {
      uri += '&filter[text]=' + titulo;
    }

    return uri;
  }

  function montarCard(atributos) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.classList.add('col-md-4');
    card.classList.add('col-sm-6');
    card.classList.add('mb-5');
    card.classList.add('bg-transparent');

    const image = document.createElement('img');
    image.classList.add('card-img-top');

    if(atributos.posterImage) {
      image.alt = `Poster ${atributos.canonicalTitle}`;
      image.src = atributos.posterImage.original;
    } else {
      image.alt = "Sem poster";
      image.src = "https://images.unsplash.com/photo-1599508704512-2f19efd1e35f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=375&q=80";
    }

    card.appendChild(image);

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    const titulo = document.createElement('h4');
    titulo.innerHTML = atributos.canonicalTitle;

    cardBody.appendChild(titulo);

    card.appendChild(cardBody);

    return card;
  }

  function trocarPagina(event) {
    event.preventDefault();

    switch(event.target.id) {
      case 'primeira-pagina':
        paginaAtual = 1;
        break;

      case 'pagina-anterior':
        paginaAtual--;
        break;

      case 'proxima-pagina':
        paginaAtual++;
        break;

      default:
        paginaAtual = ultimaPagina;
    }

    fazerRequisicaoAnimes();
  }
});
