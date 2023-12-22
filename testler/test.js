const { describe, before, after, it } = require('mocha');
const { Builder, By, until } = require('selenium-webdriver');
const edge = require('selenium-webdriver/edge');

describe('Microsoft Edge Test', function () {
    let driver;

    before(async function () {
        try {
            // Edge WebDriver'ı oluştur
            driver = await new Builder()
                .forBrowser('MicrosoftEdge')
                .setEdgeOptions(new edge.Options())
                .build();

            // Tarayıcıyı görsel olarak tam ekran yap
            await driver.manage().window().maximize();
            
            
        } catch (error) {
            console.error('Hata:', error);
            throw error;
        }
    });

    after(async function () {
        try {
            // WebDriver'ı kapat
            await driver.quit();
        } finally {
            // Test tamamlandığında burada bir şey yapabilirsiniz
        }
    });

    it('yerel çıkmalıdır', async function () {
        try {
            // Test edilecek web sayfasını aç
            await driver.get('http://localhost:3000');

            // Sayfanın yüklenip yüklenmediğini kontrol et
            await driver.wait(until.urlContains('/'), 5000);

            // Diğer testleri buraya ekleyebilirsiniz

        } catch (error) {
            console.error('Hata:', error);
            throw error;
        }
    });
});
