const webdriver = require('selenium-webdriver');

(async function test() {
    const driver = await new webdriver.Builder().forBrowser('chrome').setChromeOptions({
        "browserName": "chrome",
        "chromeOptions": {
            "args": ["--no-sandbox"]
        }
    }).build();

    try {
        await driver.get('https://prosas.com.br/editais');
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }
    finally {
        await driver.quit();
        console.log("Test Successfully Executed!!");
        process.exit(0);
    }
})();
