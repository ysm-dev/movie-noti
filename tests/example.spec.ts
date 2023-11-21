import { concurrent, map, pipe, toArray, toAsync } from '@fxts/core'
import { expect, test } from '@playwright/test'
import { sendDiscordMessage } from './sendDiscordMessage'
import { getIPFSURL, uploadIPFS } from './uploadIPFS'

test('Screenshot movie info and send discord message', async ({
  context,
  page,
}) => {
  const page1 = await context.newPage()
  const page2 = await context.newPage()

  console.log('Go to naver.com...')

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

  console.log('Uploading to IPFS...')

  const urls = await pipe(
    paths,
    toAsync,
    map(uploadIPFS),
    concurrent(paths.length),
    map(({ value: { cid } }) => getIPFSURL(cid)),
    toArray,
  )

  console.log('Sending Discord message...')

  await sendDiscordMessage('#movie', urls[0])
  await sendDiscordMessage('#movie', urls[1])

  console.log('DONE!!!')

  expect(1).toBe(1)
})
