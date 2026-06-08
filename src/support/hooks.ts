import { Before, After, Status, setDefaultTimeout } from '@cucumber/cucumber';
import { CustomWorld } from './world';
import * as fs from 'fs';
import * as path from 'path';

setDefaultTimeout(60000);

Before(async function (this: CustomWorld) {
  await this.init();
});

After(async function (this: CustomWorld, scenario) {
  if (!this.page) {
    await this.destroy();
    return;
  }

  const scenarioName = scenario.pickle.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const status = scenario.result?.status;

  // Always take a screenshot at end of scenario
  const screenshot = await this.page.screenshot({ fullPage: true });
  this.attach(screenshot, 'image/png');

  // Save screenshot to disk for CI artifacts
  const screenshotDir = path.join('reports', 'screenshots');
  fs.mkdirSync(screenshotDir, { recursive: true });
  const label = status === Status.FAILED ? 'FAILED' : 'PASSED';
  const screenshotPath = path.join(screenshotDir, `${label}_${scenarioName}.png`);
  fs.writeFileSync(screenshotPath, screenshot);

  // Attach video if available (requires video recording in world.ts)
  if (this.context) {
    const pages = this.context.pages();
    if (pages.length > 0) {
      const videoPath = await pages[0].video()?.path();
      if (videoPath && fs.existsSync(videoPath)) {
        const video = fs.readFileSync(videoPath);
        this.attach(video, 'video/webm');
      }
    }
  }

  await this.destroy();
});
