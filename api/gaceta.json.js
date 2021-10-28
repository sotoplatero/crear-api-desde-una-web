var got = require('got')
var cheerio = require('cheerio')

module.exports = async (req, res) => {

  try {

    let url = 'https://www.gacetaoficial.gob.cu'
    let response, body, $

    // ABRIR LA PÁGINA DE LA GACETA DE CUBA Y GURADR EL HTML
    body = await got( url ).text();
    $ = cheerio.load( body );

    // BUSCAR LOS DATOS DE LA GACETA
    const link = url + $('.views-field-view-node a').attr('href')
    const file = $('.views-field-field-fichero-gaceta a').attr('href')
    const type = $('.views-field-field-tipo-edicion-gaceta .field-content').first().text()
    const number = $('.views-field-field-numero-de-gaceta .field-content').first().text()
    const date = new Date($('.views-field-field-fecha-gaceta .date-display-single').first().text())
    const title = `Gaceta ${type} No.${number}`

    // ABRIR LA PÁGINA DE LOS DETALLES DE LA GACETA
    body = await got( link ).text();
    $ = cheerio.load( body );

    // BUSCAR LOS ITEMS DE LA GACETA
    const items = $('.node-norma-juridica').map( ( i, el ) => ({
      title: $('.title',el).text(),
      content: $('.field-type-text-with-summary p',el).text(),
    })).get()

    res.json({ title, link, date, file, items });
    
  } catch (err) {

    console.log(err)
    res.status(500).json(err);

  }
}
