const { describe, it, after, before } = require('mocha');
const { Builder, By, until } = require('selenium-webdriver');
const edge = require('selenium-webdriver/edge');

describe('Microsoft Edge Test', function () {
    let driver;

    before(async function () {
        // Edge WebDriver'ı oluştur
        driver = await new Builder()
            .forBrowser('MicrosoftEdge')
            .setEdgeOptions(new edge.Options())
            .build();

        // Tarayıcıyı görsel olarak tam ekran yap
        await driver.manage().window().maximize();
    });

    after(async function () {
        try {
            // WebDriver'ı kapat
            await driver.quit();
        } finally {
            // Test tamamlandığında burada bir şey yapabilirsiniz
        }
    });

    it('yerel ana sayfayı açmalı, giriş yapmalı ve ardından çıkmalıdır', function (done) {
        // localhost:3000 adresine gidin
        driver.get('http://localhost:3000');

        // Sayfanın yüklenip yüklenmediğini kontrol et
        driver.wait(until.urlContains('/'), 5000)
            .then(() => {
                // Login işlemi için gerekli adımları gerçekleştir
                let usernameInput = driver.findElement(By.name('name'));
                let passwordInput = driver.findElement(By.name('password'));
                let loginButton = driver.findElement(By.id('giris'));

                // Örnek olarak username ve password girişi
                usernameInput.sendKeys('ev');
                passwordInput.sendKeys('123');
                loginButton.click();
                this.timeout(5000); 
                // /home sayfasına yönlendirilene kadar bekleyin
                return driver.wait(until.urlContains('/home'), 5000);
            })
           
            .then(() => {
                // Çıkış işlemi başarıyla gerçekleşti
                console.log('Kullanıcı başarıyla çıkış yaptı');
                done();
            })
            .catch((error) => {
                console.error('Hata:', error);
                done(error);
            });
    });
});
