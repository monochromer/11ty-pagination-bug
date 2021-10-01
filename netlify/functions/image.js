const { EleventyServerless } = require('@11ty/eleventy');
const { builder } = require('@netlify/functions');
const puppeteer = require('puppeteer');

// export interface Event {
//   rawUrl: string
//   rawQuery: string
//   path: string
//   httpMethod: string
//   headers: EventHeaders
//   multiValueHeaders: EventMultiValueHeaders
//   queryStringParameters: EventQueryStringParameters | null
//   multiValueQueryStringParameters: EventMultiValueQueryStringParameters | null
//   body: string | null
//   isBase64Encoded: boolean
// }


async function handler(event, context) {
  // let elev = new EleventyServerless('image', {
  //   path: event.path,
  //   query: event.queryStringParameters,
  // });

  try {
    // let html = await elev.render();

    const { queryStringParameters } = event

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({
      width: 1200,
      height: 630
    })
    await page.goto(queryStringParameters.url, {
      waitUntil: 'networkidle2',
    });
    const imageBuffer = await page.screenshot({
      encoding: 'base64'
      // encoding: 'binary'
    })
    await browser.close();

    return {
      statusCode: 200,
      heades: {
        'Content-Type': 'image/png'
      },
      body: imageBuffer,
      isBase64Encoded: true
    };
  } catch(error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message
      })
    };
  }
};

exports.handler = builder(handler);