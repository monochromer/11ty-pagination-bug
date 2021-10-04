// ts-check
const { URL, URLSearchParams } = require('url')
const path = require('path')
const { builder } = require('@netlify/functions')
const chromium = require('chrome-aws-lambda')
const puppeteer = require('puppeteer-core')

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
 * @type {import('@netlify/functions').Handler}
 */
async function handler(event) {
  try {
    const pathSegments = event.path.split('/').filter(segment => !!segment)
    const [tag, articleId] = pathSegments
    const imageFileName = pathSegments[pathSegments.length - 1]
    const imageType = path.basename(imageFileName, path.extname(imageFileName))
    const imageSize = sizes[imageType] || sizes['og']
    const url = new URL(`/${tag}/${articleId}/index.og.html`, 'https://doka-guide-platform-pr-413.surge.sh')

    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: {
        width: 1200,
        height: 630,
      },
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });
    const page = await browser.newPage()
    await page.setViewport(imageSize)
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
    const body = imageBuffer.toString('base64')
    await browser.close();

    return {
      statusCode: 200,
      heades: {
        'Content-Type': 'image/png',
      },
      body,
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