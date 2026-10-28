import { test, expect } from '@playwright/test';

for (const [lang,title] of [['ru','Поступление'],['kk','Оқуға түсу'],['en','Admissions']]) {
  test(`navigation and content in ${lang}`, async ({page}) => {
    const errors=[]; page.on('pageerror',e=>errors.push(e.message));
    await page.goto(`/#/${lang}/home`);
    await expect(page.locator('#navigation a')).toHaveCount(5);
    await expect(page.locator('h1')).toBeVisible();
    await page.locator(`#navigation a[href="#/${lang}/admissions"]`).click();
    await expect(page.locator('h1')).toHaveText(title);
    await page.locator('summary').first().click();
    await expect(page.locator('details').first()).toHaveAttribute('open','');
    for (const route of ['about','education','students','news','administration','documents','contacts','privacy']) {
      await page.goto(`/#/${lang}/${route}`);
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('html')).toHaveAttribute('lang',lang);
      await expect(page.locator('body')).not.toContainText('undefined');
    }
    expect(errors).toEqual([]);
  });
}

test('language switches preserve the page and persist across reloads',async({page})=>{
  await page.goto('/#/ru/admissions');
  await page.getByRole('link',{name:'English',exact:true}).click();
  await expect(page).toHaveURL(/#\/en\/admissions$/);
  await expect(page.locator('h1')).toHaveText('Admissions');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang','en');
  await page.goto('/');
  await expect(page).toHaveURL(/#\/en\/home$/);
  await page.getByRole('link',{name:'Қазақша',exact:true}).click();
  await expect(page.locator('html')).toHaveAttribute('lang','kk');
});

test('mobile menu, keyboard dismissal and overflow',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  for(const lang of ['ru','kk','en']) {
    await page.goto(`/#/${lang}/home`);
    await expect(page.locator('#navigation')).toBeHidden();
    await page.locator('.menu-toggle').click();
    await expect(page.locator('#navigation')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('#navigation')).toBeHidden();
    await page.locator('.menu-toggle').click();
    await page.locator('#navigation a').first().click();
    await expect(page.locator('#navigation')).toBeHidden();
    for (const route of ['home','contacts','admissions']) {
      await page.goto(`/#/${lang}/${route}`);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
    }
  }
});

test('direct links, browser back, missing page and no fake contact form',async({page})=>{
  await page.goto('/#/ru/home');
  await page.locator('.contact-button').click();
  await expect(page.locator('h1')).toHaveText('Контакты');
  await expect(page.locator('form')).toHaveCount(0);
  await page.goBack();
  await expect(page).toHaveURL(/#\/ru\/home$/);
  await page.goto('/#/ru/missing');
  await expect(page.locator('h1')).toHaveText('Страница не найдена');
  await page.locator('main .underlined').click();
  await expect(page).toHaveURL(/#\/ru\/home$/);
});
