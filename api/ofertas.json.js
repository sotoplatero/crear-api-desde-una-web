var got = require('got')
var cheerio = require('cheerio')

module.exports = async (req, res) => {

  // COMO EJEMPLO TOMAMOS TRES URLS DE CATEGORIAS.
  const urls = [
    'http://ofertas.cu/c/390/pc/1.html',
    'http://ofertas.cu/c/391/laptop/1.html',
    'http://ofertas.cu/c/394/celulares-accesorios/1.html',
  ]

  let ads = []

  // recorremos el arreglo de url
  for (var i = urls.length - 1; i >= 0; i--) {

    const url = urls[i]
    // ABRIMOS LA URL Y TOMAMOS EL CONTENIDO HTML
    const body = await got(url).text()

    // INICIALIZAMOS CHEERIO CON EL HTML DE LA PAGINA
    const $ = cheerio.load(body)

    // EN LA PÁGINA BUSCAMOS LOS ELEMENTOS CON LAS LAS CLASES .listing.list-mode 
    // LOS DATOS DEVUELTOS DE CADA ANUNCIO SON AGREGADOS A ads 
    ads.push( 
      ...$('.listing.list-mode')
        // EN CADA ANUNCIO BUSCAMOS LOS DATOS NECESARIO Y CONFORMAMOS EL JSON 
        .map( (i, el) => ({
            price:$(el).find('strong')?.text()?.replace(/\D/g,'')?.slice(0,-2) || '0',
            title: $(el).find('a').text(),
            url: 'http://ofertas.cu' + $(el).find('a').attr('href'),
            category: url.split('/')[5].replace('-', ' '),
        }) )
        .toArray()
    )

  }

  // RETORNAMOS EL ARREGLO DE LOS ANUNCIOS
  res.json(ads);
};
