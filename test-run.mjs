import puppeteer from "puppeteer";
import fs from "fs";
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("http://localhost:3001");
  await new Promise(r => setTimeout(r, 2000));
  const html = await page.content();
  console.log(html.includes("Initializing Terminal...") ? "STUCK ON INITIALIZING" : "LOADED SUCCESSFULLY");
  await browser.close();
})();
