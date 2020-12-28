const { Builder, By } = require('selenium-webdriver');

(async function test() {
    const driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions({
            "browserName": "chrome",
            "goog:chromeOptions": {
                "args": ["--headless", "--no-sandbox", "--disable-dev-shm-usage"]
            }
        }).build();

    let failedTests = 0;
    let totalTests = 0;

    /**
     * Test open editais page
     * Should open the editais page
     */
    try {
        await driver.get('https://prosas.com.br/editais');
    }
    catch (error) {
        console.log('Failed at Accessing Editais');
        console.log(error);

        failedTests += 1;
    }
    finally {
        totalTests += 1;
    }

    /**
     * Test search using only the name / description filter
     * Itens should contain the search key in its name or sponsor's name
     */
    try {
        /**
         * Searchs for a given name
         */
        let searchKey = 'Fundação Renova';
        let nameInput = await driver.findElement(By.name('nome-filtro'));
        nameInput.sendKeys(searchKey);

        let submitButton = await driver.findElement(By.className('btn-azul md-raised md-button uppercase md-full nomargin nopadding md-button md-ink-ripple'));
        await submitButton.click();

        let result = await driver.findElement(By.className('md-body'));
        /**
         * Waits for search results and then begins processing each element of the result
         */
        await driver.sleep(3000);

        let cards = await result.findElements(By.className('md-row ng-scope'));

        for (let card of cards) {
            let title = await card.findElement(By.className('subtitulo link1 ng-binding'))
            let sponsorField = await card.findElement(By.className('descritivo-lists-result'));
            let sponsor = await sponsorField.findElement(By.className('ng-binding'));

            let titleText = await title.getText();
            let sponsorText = await sponsor.getText();

            let patternFound = titleText.includes(searchKey) || sponsorText.includes(searchKey);

            if (!patternFound) {
                throw new Error('Search key not found in one of the results');
            }
        }
    }
    catch (error) {
        console.log('Failed at Asserting Search Fields');
        console.log(error);

        failedTests += 1;
    }
    finally {
        totalTests += 1;
    }

    /**
     * Test search using the name / description filter and a location
     * Itens should contain the search key in its name or sponsor's name regarding a partcular location
     */
    try {
        await driver.get('https://prosas.com.br/editais');

        /**
         * Searchs for a given name and and location
         */
        let searchKey = 'Fundação Renova';
        let nameInput = await driver.findElement(By.name('nome-filtro'));
        nameInput.sendKeys(searchKey);


        let locationKey = 'São Paulo';
        let locationInput = driver.findElement(By.id('fl-input-10'));
        locationInput.sendKeys(locationKey);

        let locationList = await driver.findElement(By.id('ul-10'));
        let locations = await locationList.findElements(By.className('ng-scope'));

        let locationExactKey = 'São Paulo SP';
        for (let locationField of locations) {
            let location = await locationField.getText();

            if (location === locationExactKey) {
                await locationField.click();
            }
        }

        let submitButton = await driver.findElement(By.className('btn-azul md-raised md-button uppercase md-full nomargin nopadding md-button md-ink-ripple'));
        await submitButton.click();

        let result = await driver.findElement(By.className('md-body'));
        /**
         * Waits for search results and then begins processing each element of the result
         */
        await driver.sleep(3000);

        let cards = await result.findElements(By.className('md-row ng-scope'));

        for (let card of cards) {
            let title = await card.findElement(By.className('subtitulo link1 ng-binding'))
            let sponsorField = await card.findElement(By.className('descritivo-lists-result'));
            let sponsor = await sponsorField.findElement(By.className('ng-binding'));

            let titleText = await title.getText();
            let sponsorText = await sponsor.getText();

            let patternFound = titleText.includes(searchKey) || sponsorText.includes(searchKey);

            if (!patternFound) {
                throw new Error('Search key not found in one of the results');
            }
        }
    }
    catch (error) {
        console.log('Failed at Asserting Search Fields');
        console.log(error);
        failedTests += 1;
    }
    finally {
        totalTests += 1;
    }

    await driver.quit();

    if (failedTests > 0) {
        console.log(failedTests + " of " + totalTests + " Tests Failed");
        process.exit(1);
    }
    else {
        console.log("All Tests Successfully Executed!!");
        process.exit(0);
    }
})();
