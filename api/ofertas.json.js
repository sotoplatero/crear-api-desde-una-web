var got = require('got')
var cheerio = require('cheerio')

module.exports = async (req, res) => {

  // tomamos el nombre desde  querystring del la url 
  const urls = [
    'http://ofertas.cu/c/390/pc/1.html',
    'http://ofertas.cu/c/391/laptop/1.html',
    'http://ofertas.cu/c/394/celulares-accesorios/1.html',
  ]

  let ads = []
  for (var i = urls.length - 1; i >= 0; i--) {
    const url = urls[i]
    const body = await got(url).text()
    // return 'url'
    const $ = cheerio.load(body)
    ads = $('.listing.list-mode')
      .map( (i, el) => ({
          title: $(el).find('a').text(),
          url: $(el).find('a').attr('href'),
      }) )
      .toArray()
  }

  // retornamos un JSON con el saludo
  res.json(ads);
};
