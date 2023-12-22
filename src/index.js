const express = require("express")
const path = require("path")
const app = express()
const hbs = require("hbs")
const LogInCollection = require("./mongo")
const Blog = require("./blog")
const { get } = require("http")
const { title } = require("process")
const Pay = require("./odeme")
const port = process.env.PORT || 3000
app.use(express.json())

app.use(express.urlencoded({ extended: false }))

const tempelatePath = path.join(__dirname, '../tempelates')
const publicPath = path.join(__dirname, '../public')
console.log(publicPath);

app.set('view engine', 'hbs')
app.set('views', tempelatePath)
app.use(express.static(publicPath))


// hbs.registerPartials(partialPath)


app.get('/signup', (req, res) => {
    res.render('signup')
})
app.get('/', (req, res) => {
    res.render('login')
})
app.get('/login', (req, res) => {
    res.render('login');
});




//app.get('/home', (req, res) => {
//   res.render('home')
// })

app.post('/signup', async (req, res) => {
    try {
        const checking = await LogInCollection.findOne({ name: req.body.name });

        if (checking) {
            res.send("User details already exist");
        } else {
            const data = {
                name: req.body.name,
                password: req.body.password,
                tip : req.body.tip,
                para : 0
                
            };
            await LogInCollection.insertMany([data]);
            
            res.status(201).render("login", {
                
            });
        }
    } catch (error) {
        res.send("Error or wrong inputs");
    }
});




app.post('/login', async (req, res) => {
    try {
        const check = await LogInCollection.findOne({ name: req.body.name })
        
        if (check.password === req.body.password) {
            const userName = req.body.name;
            res.redirect(`/home?userName=${encodeURIComponent(userName)}`);

        }
        else {
            res.send("incorrect password")
        }
    } 
    
    catch (e) {

        res.send("wrong details")
        

    }

})

app.post('/home', async (req, res) => {
    
    try {
        const testet = await Blog.findOne({ ad: req.body.ad });

        if (testet) {
            res.send("User details already exist");
        } else {
            
            const data = {
                ad: req.body.ad,
                fiyat: req.body.fiyat,
                aciklama :  req.body.aciklama,      
                kim : req.body.kim,     
                  
            };
            await Blog.insertMany([data]);    
            console.log("veri tabanna kaydetti")               
            res.redirect('home')
        }
    } catch (error) {
        res.send("Error or wrong inputs");
    }
});



app.get('/home', async (req, res) => {
    console.log("veriler çekildi")
    try {
        // Blog koleksiyonundan verileri çek
        const blogs = await Blog.find();

        // LogInCollection koleksiyonundan verileri çek
        const mongos = await LogInCollection.find();

        // Şablonu render et ve hem blogs hem de mongos verilerini ileti
        res.render('home', { blogs, mongos });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Endpoint'i "/home" olarak güncelledik
app.delete('/home', async (req, res) => {
    try {
        const blogAdi = req.query.ad;

        if (!blogAdi) {
            return res.status(400).send('Geçersiz talep: "ad" parametresi eksik.');
        }

        const result = await Blog.deleteOne({ ad: blogAdi });

        if (result.deletedCount === 1) {
            // Silme işlemi başarılıysa, sayfayı güncelleyerek yönlendirme yapabilirsiniz.
            return res.redirect('/home');
        } else {
            return res.status(404).send('Belirtilen ad ile kayıt bulunamadı.');
        }
    } catch (error) {
        console.error('Silme işlemi sırasında bir hata oluştu:', error);
        return res.status(500).send('Silme işlemi sırasında bir hata oluştu.');
    }
});


app.post('/job', async (req, res) => {
    
    try {
       
        const testet = await Pay.findOne({ ad: req.body.odemead });

        if (testet) {
            res.send("User details already exist");
        } else {
            
            const data = {
                
                odemead : req.body.odemead,
                odemeadres :req.body.odemeadres,
                odemedosya: req.body.odemedosya
                        
            };
            
            await Pay.insertMany([data]);    
            console.log("odeme islemleri oldu");               
            res.redirect('home');
        }
    } catch (error) {
        res.send(error);
    }
});




app.get('/job', async (req, res) => {
    try {
        // Pay koleksiyonundan verileri çek
        const pays = await Pay.find();

        // Şablonu render et ve pays verilerini ileti
        res.render('job', { pays });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.delete('/job/:odemead', async (req, res) => {
    console.log("Silme işlemi");
    
    try {
        const blogAdi = req.params.odemead;
 
        if (!blogAdi) {
            return res.status(400).send('Geçersiz talep: "odemead" parametresi eksik.');
        }

        const result = await Pay.deleteOne({ odemead: blogAdi });

        if (result.deletedCount === 1) {
            return res.status(204).send(); // Başarılı olduğunda 204 No Content döndür
        } else {
            return res.status(404).send('Belirtilen odemead ile kayıt bulunamadı.');
        }
    } catch (error) {
        console.error('Silme işlemi sırasında bir hata oluştu:', error);
        return res.status(500).send('Silme işlemi sırasında bir hata oluştu.');
    }
});



const bodyParser = require('body-parser');
const { Blockchain, Transaction } = require('./blockchain');
const EC = require('elliptic').ec;


const ec = new EC('secp256k1');
const myKey = ec.keyFromPrivate('ff3f65cbfd38c967dc4cf6a08cda687e8cec24ba5d5badf691fa52d379c3d9f9');
const myWalletAddress = myKey.getPublic('hex');

const bestCoin = new Blockchain();

app.use(bodyParser.json());

app.get('/odeme', async (req, res) => {
   
    try {
        // Blog koleksiyonundan verileri çek
        const odemes = await LogInCollection.find();

        res.render('odeme', { odemes});
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }

});

app.get('/mine', (req, res) => {
    bestCoin.minePendingTransactions(myWalletAddress);
    res.send('Mining success! Check your balance.');
});

app.get('/transactions', (req, res) => {
    
    res.json(bestCoin.pendingTransactions);
});

app.post('/transactions/new', (req, res) => { //post tanımlıcan
    console.log("buton")
    const { toAddress, amount } = req.body;
    const tx = new Transaction(myWalletAddress, toAddress, amount);
    tx.signTransaction(myKey);
    bestCoin.addTransaction(tx);
    bestCoin.minePendingTransactions(myWalletAddress - amount);
    
    res.setHeader('Content-Type', 'application/json');
    res.json({ message: 'Transaction added successfully!' });
});

app.get('/balance', (req, res) => {
    const balance = bestCoin.getBalanceOfAddress(myWalletAddress);
    res.json({ balance });
});

app.get('/chain', (req, res) => {
    res.json(bestCoin.chain);
});

app.get('/validity', (req, res) => {
    const isChainValid = bestCoin.isChainValid();
    res.json({ isChainValid });
});


app.post('/mineblock', async (req, res) => {
     // Hedef kullanıcının adı
     try {
        const existingUser = await LogInCollection.findOne({ name: req.body.gidecekadres });
        const azalacak = await LogInCollection.findOne({ name: req.body.mineislemi });
   console.log(azalacak);
  
        if (!existingUser) {
            return res.status(404).json({ error: 'Belirtilen kullanıcı bulunamadı' });
        }
        if (!azalacak) {
            return res.status(404).json({ error: 'Belirtilen kullanıcı bulunamadı' });
        }
       
        const existingUserParaAsNumber = parseFloat(req.body.gidecekpara);
        const intValue = parseInt(existingUserParaAsNumber, 10);
        console.log(intValue)
        azalacak.para -= intValue;
        existingUser.para += intValue;
        await existingUser.save();
        await azalacak.save();

        try {
            await existingUser.save();
            await azalacak.save();
            console.log("Para miktarı güncellendi:", existingUser.para);
            res.redirect('/odeme')
        } catch (error) {
            console.error("Save Hatası:", error);
            res.status(500).json({ error: 'Bir hata oluştu (save)' });
        }
    } catch (error) {
        console.error("Ana Hata:", error);
        res.status(500).json({ error: 'Bir hata oluştu (ana)' });
    }
    res.render('/odeme');
});


app.post('/kazma', async (req, res) => {
    // Hedef kullanıcının adı
    try {
       const existingUser = await LogInCollection.findOne({ name: req.body.mineislemi });


       if (!existingUser) {
           return res.status(404).json({ error: 'Belirtilen kullanıcı bulunamadı' });
       }

       
       existingUser.para += 100;
       await existingUser.save();

       try {
           await existingUser.save();
           console.log("Para miktarı güncellendi:", existingUser.para);
           
           res.redirect('/odeme')
       } catch (error) {
           console.error("Save Hatası:", error);
           res.status(500).json({ error: 'Bir hata oluştu (save)' });
       }
   } catch (error) {
       console.error("Ana Hata:", error);
       res.status(500).json({ error: 'Bir hata oluştu (ana)' });
   }

});







app.listen(port, () => {
    console.log('port connected');
})