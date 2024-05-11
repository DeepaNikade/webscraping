const cheerio = require("cheerio");
const axios = require("axios");
const fs = require("fs");
const ExcelJS = require("exceljs");

async function getSiteData() {
    try {
        const response = await axios.get("https://www.quikr.com/jobs/quicker-job-in-hyderabad+hyderabad+zwqxj4157493934");
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}

async function scrapeQuikrJobs() {
    const htmlData = await getSiteData();
    if (!htmlData) return;

    const $ = cheerio.load(htmlData);
    const jobData = [];

    $(".jsListItems .job-card").each((index, elem) => {
        const jobTitle = $(elem).find(".job-title").text().trim();
        const salary = $(elem).find(".perposelSalary").text().trim();
        const jobType = $(elem).find(".attributeVal").eq(0).text().trim(); // Corrected class for job type
        const company = $(elem).find(".attributeVal").eq(1).text().trim(); // Corrected class for company
        const experience = $(elem).find(".attributeVal").eq(2).text().trim(); // Corrected class for experience
        const jobPostedOn = $(elem).find(".jsPostedOn").text().trim();

        if (jobTitle) {
            const jobDetails = {
                "Job Title": jobTitle,
                "Salary": salary,
                "Job Type": jobType,
                "Company": company,
                "Experience": experience,
                "Job Posted On": jobPostedOn
            };
            jobData.push(jobDetails);
        }
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Quikr Jobs");

    worksheet.columns = [
        { header: "Job Title", key: "Job Title", width: 30 },
        { header: "Salary", key: "Salary", width: 20 },
        { header: "Job Type", key: "Job Type", width: 20 },
        { header: "Company", key: "Company", width: 30 },
        { header: "Experience", key: "Experience", width: 15 },
        { header: "Job Posted On", key: "Job Posted On", width: 20 }
    ];

    jobData.forEach(job => {
        worksheet.addRow(job);
    });

    await workbook.xlsx.writeFile("quikr_jobs.xlsx");
    console.log("Data saved to quikr_jobs.xlsx");
}

scrapeQuikrJobs();
