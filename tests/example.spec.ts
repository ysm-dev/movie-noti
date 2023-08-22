import { test, expect } from '@playwright/test'
import { readFile, readdir } from 'fs/promises'
import { TOKENS, getRandom } from './getRandom'
import { pipe, map, toArray, tap, toAsync, concurrent } from '@fxts/core'
import { sendDiscordMessage } from './sendDiscordMessage'
import { uploadIPFS } from './uploadIPFS'

test('Screenshot movie info and send discord message', async ({
  context,
  page,
}) => {
  const page1 = await context.newPage()
  const page2 = await context.newPage()

  await Promise.all([
    page1.goto(`https://search.naver.com/search.naver?query=현재상영영화`),
    page2.goto(`https://search.naver.com/search.naver?query=개봉예정영화`),
  ])

  const remove = () => {
    const element = document.querySelector('#header_wrap')
    element?.remove()
  }

  await Promise.all([page1.evaluate(remove), page2.evaluate(remove)])

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

  const paths = [`./temp/current.png`, `./temp/future.png`]

  const urls = await pipe(
    paths,
    toAsync,
    map(uploadIPFS),
    concurrent(paths.length),
    map((data) => `https://${data.value.cid}.ipfs.dweb.link`),
    toArray,
  )

  console.log(urls)

  await pipe(
    urls,
    toAsync,
    map((url) => fetch(url)),
    concurrent(urls.length),
    toArray,
  )

  await sendDiscordMessage('#movie', urls[0])
  await sendDiscordMessage('#movie', urls[1])

  console.log('DONE!!!')

  expect(1).toBe(1)
})
