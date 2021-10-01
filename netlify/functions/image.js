// const { EleventyServerless } = require('@11ty/eleventy');
const { builder } = require('@netlify/functions');
const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

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

    console.log(event.queryStringParameters.url)
    console.log(event.rawQuery)

    // const browser = await puppeteer.launch();
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: {
        width: 1200,
        height: 630,
      },
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });
    const page = await browser.newPage();
    await page.setViewport({
      width: 1200,
      height: 630
    })
    // https://doka-guide-platform-pr-413.surge.sh/html/input/index.og.html
    await page.goto(event.queryStringParameters.url, {
      waitUntil: 'networkidle2',
    });
    const imageBuffer = await page.screenshot({
      // encoding: 'base64'
      // encoding: 'binary'
    })
    await browser.close();

    return {
      statusCode: 200,
      heades: {
        'Content-Type': 'image/png'
      },
      body: imageBuffer.toString('base64'),
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