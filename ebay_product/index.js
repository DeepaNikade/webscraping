const axios=require('axios');
const cheerio=require('cheerio');
const ExcelJs=require('exceljs');


async function scrapEbay(){
    try {
        
        const HTMLRespone=await axios.get('https://www.ebay.com/sch/i.html?_nkw=laptop');
        const html=HTMLRespone.data;

        const $=cheerio.load(html);

        const products=[];

        $('li.s-item').each((index,element)=>{
            const productName = $(element).find('a.s-item__link').text().trim();
            // console.log('Product Name:', productName); 
            const price = $(element).find('span.s-item__price').text().trim();
            products.push({ productName, price });
        })

        const workbook=new ExcelJs.Workbook();
        const worksheet=workbook.addWorksheet('ebay Products');

        //headers
        worksheet.columns=[
            {header:'Product Name', key: 'productName', width: 30},
            { header: 'Price', key: 'price', width: 15 }
        ];

        //adding data to worksheet
        products.forEach(product=>{
            worksheet.addRow(product);
        });

        await workbook.xlsx.writeFile('ebay_products.xlsx');
        // console.log("data saved to ebay_product.xlsx");
    } catch (error) {
        console.log(error);
        
    }
}
// scrapEbay();