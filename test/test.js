const {Builder, By} = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome')


const HOST = 'http://localhost:4567'

describe('Grid boxes layout', function () {
  let driver
  beforeAll(async () => {
    const screen = { width: 640, height: 600 };
    const options = new chrome.Options();
    if (options.headless) {
      options.addArguments("--headless");
    }
    driver = await new Builder().forBrowser('chrome').setChromeOptions(options.windowSize(screen)).build();
    await driver.get(HOST);
  });

  afterAll(async () => {
    await driver.quit();
  });

  it('should use display grid for layout and keep absolute positioning for template boxes', async () => {
    const layout = await driver.findElement(By.className('layout'))
    const layoutDisplay = await layout.getCssValue('display')
    expect(layoutDisplay).toEqual('grid')

    const boxes = await driver.findElements(By.css('.template .box'))
    for (const box of boxes) {
      const templatePosition = await box.getCssValue('position')
      expect(templatePosition).toEqual('absolute')
    }
  })

  it.each(Array(12).fill().map((_, i) => i + 1))('should position %s correctly', async (index) => {
    const actual = await driver.findElement(By.css(`.layout [data-title="${index}"]`))
    const template = await driver.findElement(By.css(`.template [data-title="${index}"]`))

    const actualRect = await actual.getRect()
    const templateRect = await template.getRect()

    const epsilon = 1
    expect(Math.abs(templateRect.y - actualRect.y)).toBeLessThan(epsilon)
    expect(Math.abs(templateRect.x - actualRect.x)).toBeLessThan(epsilon)

    expect(Math.abs(templateRect.width - actualRect.width)).toBeLessThan(epsilon)
    expect(Math.abs(templateRect.height - actualRect.height)).toBeLessThan(epsilon)
  })
})