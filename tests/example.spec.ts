import { test, expect } from '@playwright/test'
import { readFile, readdir } from 'fs/promises'
import { TOKENS, getRandom } from './getRandom'
import { pipe, map, toArray, tap, toAsync, concurrent } from '@fxts/core'
import { sendDiscordMessage } from './sendDiscordMessage'

test('has title', async ({ context, page }) => {
  const page1 = await context.newPage()
  const page2 = await context.newPage()

  await Promise.all([
    page1.goto(`https://search.naver.com/search.naver?query=현재상영영화`),
    page2.goto(`https://search.naver.com/search.naver?query=개봉예정영화`),
  ])

  await Promise.all([
    page1
      .locator('._au_movie_list_content_wrap')
      .screenshot({ path: `./temp/current.png` }),
    page2
      .locator('._au_movie_list_content_wrap')
      .screenshot({ path: `./temp/future.png` }),
  ])

  await page1.close()
  await page2.close()

  const urls = await pipe(
    [`./temp/current.png`, `./temp/future.png`],
    toAsync,
    map(readFile),
    map((body) =>
      fetch('https://api.nft.storage/upload/', {
        headers: {
          authorization: `Bearer ${getRandom(TOKENS)}`,
          'content-type': 'image/png',
        },
        method: 'POST',
        body,
      }).then((res) => res.json()),
    ),
    concurrent(2),
    map((data) => `https://${data.value.cid}.ipfs.cf-ipfs.com`),
    toArray,
  )

  await pipe(
    urls,
    toAsync,
    map((url) => fetch(url)),
    toArray,
  )

  await sendDiscordMessage('#movie', urls[0])
  await sendDiscordMessage('#movie', urls[1])

  console.log('DONE!!!')

  expect(1).toBe(1)
})
