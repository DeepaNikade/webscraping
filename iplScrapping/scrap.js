const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const seasons = ["2020", "2021", "2022", "2023"]; 
  let allData = {};

  for (const season of seasons) {
    await page.goto(`https://www.iplt20.com/stats/${season}/most-runs`, {
      waitUntil: "networkidle2",
    });

    await page.waitForSelector("table tbody tr");

    const seasonData = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll("table tbody tr"));
      return rows.slice(0, 10).map((row) => {
        const cells = row.querySelectorAll("td");
        return {
          player: cells[1]?.innerText.trim(),
          runs: parseInt(cells[2]?.innerText.replace(/,/g, ""), 10),
        };
      });
    });

    allData[season] = seasonData;
  }
  const dir = path.join(__dirname, 'iplScrapping');
  const filePath = path.join(dir, "data.json");

  // Ensure the directory exists
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(filePath, JSON.stringify(allData, null, 2));
  console.log("Data has been written to", filePath);
  await browser.close();
})();
