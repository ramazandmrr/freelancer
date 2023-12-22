const mongoose = require('mongoose');
const assert = require('assert');

describe('MongoDB Connection Test', function () {
    this.timeout(15000); // Timeout süresini 10 saniyeye çıkardık

    it('should connect to MongoDB', function (done) {
        // MongoDB'ye bağlan
        mongoose.connect("mongodb+srv://ramazan:123@cluster0.mhlwggh.mongodb.net/", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Bağlantı başarılı olduğunda bu kısım çalışır
        mongoose.connection.once('connected', function () {
            console.log('MongoDB\'ye başarıyla bağlandı!');
            assert.strictEqual(mongoose.connection.readyState, 1, 'Bağlantı durumu 1 olmalıdır.'); // 1: Bağlı
            done();
        });

        // Bağlantıda hata olduğunda bu kısım çalışır
        mongoose.connection.on('error', function (err) {
            console.error('MongoDB bağlantı hatası:', err);
            done(err);
        });
    });

    
});
