const { URL, URLSearchParams } = require('url')
const { builder } = require('@netlify/functions')
const chromium = require('chrome-aws-lambda')
const puppeteer = require('puppeteer-core')
const crypto = require('crypto');

const sizes = {
  og: {
    width: 1200,
    height: 630
  },
  twitter: {
    width: 1200,
    height: 1200
  }
}

/**
 * @typedef {Object} Event
 * @property {string} rawUrl
 * @property {string} rawQuery
 * @property {string} path
 * @property {string} httpMethod
 * @property {EventHeaders} headers
 * @property {EventMultiValueHeaders} multiValueHeaders
 * @property {EventQueryStringParameters | null}  queryStringParameters
 * @property {EventMultiValueQueryStringParameters | null} multiValueQueryStringParameters
 * @property {string | null} body
 * @property {boolean} isBase64Encoded
 */

/**
 *
 * @param {Event} event
 * @param {object} context
 * @returns {object}
 */
async function handler(event, context) {
  try {
    const params = new URLSearchParams(event.rawQuery)
    const imageSize = sizes[params.get('type')] || sizes.og

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
    await page.setViewport(imageSize)
    const url = new URL(`/${params.get('tag')}/${params.get('articleId')}/index.og.html`, 'https://doka-guide-platform-pr-413.surge.sh')
    console.log('rendered url: ', url)
    console.log('headers', event.headers)
    await page.goto(url.toString(), {
      waitUntil: 'domcontentloaded',
    });
    await page.evaluate(async () => {
      await document.fonts.ready
    })
    const imageBuffer = await page.screenshot({
      // fullPage: false
      // type: 'png',
      // encoding: 'base64'
      // encoding: 'binary'
    })
    await browser.close();

    return {
      statusCode: 200,
      heades: {
        'Content-Type': 'image/png',
        'ETag': crypto.createHash('md5').update(imageBuffer).digest('hex')
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