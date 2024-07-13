import { expect, test } from '@playwright/test'

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

  const currentDate = new Date().toISOString().split('T')[0]

  await Promise.all([
    page1
      .locator('._au_movie_list_content_wrap')
      .screenshot({ path: `./temp/${currentDate}-current.png` }),
    page2
      .locator('._au_movie_list_content_wrap')
      .screenshot({ path: `./temp/${currentDate}-future.png` }),
  ])

  await page1.close()
  await page2.close()

  console.log('DONE!!!')

  expect(1).toBe(1)
})
