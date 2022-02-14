# apartman

## Motivasyon

Bir gün, web geliştirici 3 dairelik apartmanda, giderler için sorumlu tutulur ve hikaye başlar...
Kısaca her seferinde yeni bir duyuru asmak yerine bir kere uygulama yazıp onu kullanmak çok mantıklı ve verimli geldi.
Bu uygulamanın kaynaklarına ücret vermeden koşturulması gerekiyor çünkü 3 dairelik bir apartmanda kimse profesyonel bir uygulamaya ücret vermek istemez.
Eğer s3 domainini kullanacaksak(HTTPS desteklemiyor), tüm işlemlerin ücretsiz bir şekilde koşturulması için AWS her zamanki gibi yardım için hazır beklemekte.
Bu uygulama, apartman sakinlerinin otomat ve diğer giderlerini gösteren ve gidere ait dökümantayonu indirebilmesini sağlayan ve benzeri basit ve kullanışlı araçlar içerir.

## Demo
Link: https://testapartman.hakkisabah.com

Kullanıcı şifre: `test`

Yönetici şifre: `testyonetici`

Not : Kullanıcı adı bulunmamaktadır gireceğiniz şifreye göre kullanıcı modunuz belirlenmektedir.


## Kullanım hakkında

Örneğin yeni bir kayıt gireceksiniz, girdiğinzi bu kayıtta ilgili gider hakkındaki dosya ilgili dönem(Ay), sene ve Toplam tutarı girmeniz gerekmektedir.
Daire başına düşen tutar, toplam daire sayısına bölünüp liste hali ile gösterilmek üzere kayıt edilir.
Uygulama herhangi bir veritabanına ihtiyaç duymaz. JSON formatlı bir dosyaya kaydedilen veriler üzerinden işlemleri yürütür.

## Ön gereklilikler

Uygulama için ;
- [Node.js](https://nodejs.org/)
- [AWS hesabı](https://aws.amazon.com/)
- [AWS CLI](https://aws.amazon.com/cli/)
- Node.js yükledikten sonra serverless -g parametresi ile kurulması gerekli.

## Ön hazırlıklar

Eğer AWS ile aranız iyiyse burayı atlayabilirsiniz. Fakat ben ücretsiz bir şekilde bu uygulamayı ayağa kaldırmak istiyorum derseniz, takip etmeniz iyi olabilir.


- İlk olarak AWS anahtarlarımızı AWS CLI kullanarak tanımlayalım. Anahtarları nasıl alacağınızı bilmiyorsanız, [buradan](https://www.dinamikfikir.com/content/aws-access-key-nasil-olusturulur/index.html) nasıl elde edildiğini öğrenebilirsiniz. Daha sonra AWS CLI ile anahtarlarınızı nasıl tanımlayabileceğinizi [buradan](https://docs.aws.amazon.com/cli/latest/reference/configure/index.html#examples) öğrenebilirsiniz.
- [s3 Sepet oluşturma](https://www.dinamikfikir.com/content/aws-s3-ayarlari/index.html) adresinden nasıl sepet oluşturulacağını öğrenin.
- daha sonra api klasöründe ve ana dizininde bulunan .env-example dosyalarını inceleyelim özellikle api klasörünün içerisinde bulunan ``.env-example`` 'da FIX_DEC değişkenini değiştirmemeniz tavsiye edilir. 
Diğer bir yandan ise UPLOAD_FOLDER s3 sepetiniz içerisinde bulunan klasör yapınızı belirleyecek ve dosyalar buraya yüklenecek örneğin ``apartmanadi/uploads/`` şeklinde tanımlayabilirsiniz. Ayrıca adında da anlaşılacağı üzere `TOTAL_RESIDENT` apartmandaki toplam apartman sakinini belirtir, daire sayısına göre bu rakamı değiştiriniz.
- api dizininde bulunan `.env-example` dosyasının ya da serverenv-example.json içerisindeki bilgileri, serverenv.json dosyası oluşturarak json biçiminde giriş yapıyoruz.

## Kurulum

- Ön hazırlıklar tamamlandıktan sonra eğer yapmadıysanız hem ana dizinde hem de api dizininde `npm install` komutunu çalıştırın.
- daha sonra ilk olarak api dizininde `npm run deploy` diyerek serverless apimizi ayağa kaldıralım. Uygulama sorunsuz bir şekilde ayağa kalktıktan sonra bize apinin adresini geri döndürecektir.
Örneğin `https://msg2uiem21.execute-api.eu-central-1.amazonaws.com/api/` gibi bir adres. Bu adresi `https://msg2uiem21.execute-api.eu-central-1.amazonaws.com/api/aptapi/getitems` şeklinde ekleme yaparak tarayıcımızda test edelim.
eğer `{"status":"error","message":"Auth failed","token":null}` cevabı dönerse, bu uygulamamızın başarılı bir şekilde çalıştığını gösterir.
- Önceki adımlar başarılı bir şekilde tamamlandıktan sonra api dizininden bir üst dizin yani ana dizine gelip `npm run build` komutunu çalıştırıyoruz. Burada oluşturulan `dist` klasörünün tüm içeriğini oluşturduğumuz s3 sepetinin ana dizinine yüklüyoruz.

ÖNEMLİ NOT : Yüklemeyi yaparken yetkilendirmeleri aşağıdaki görseldeki gibi `Public` yapınız.

![SetupIndex](https://testapartman.s3.eu-central-1.amazonaws.com/test/s3-permission.png)

## Kurulum sonrası

- Eğer CloudFront Yapılandırmasını bilmiyorsanız s3 sepetinizi static hosting özelliğini aktif etmeniz gereklidir.
Aşağıdaki görseldeki ekrana erişebilmek için sepetinizin `Properties` bölümüne gelip en aşağıda bulunan `Static web hosting` bölümüne Edit diyoruz.
![SetupIndex](https://testapartman.s3.eu-central-1.amazonaws.com/test/s3-static-hosting.png)
Bu ekranda static web hosting i `Enable` ettikten sonra index document bölümüne `ìndex.html` yazıyoruz ve kaydediyoruz.
- Diğer bir konu ise Lambda(serverless) apimize s3 yetkilerini atamak, aşağıdaki görselleri Lambda uygulamamıza girdikten sonra sırasıyla yapmalısınız.

---

![SetupIndex](https://testapartman.s3.eu-central-1.amazonaws.com/test/lambda-role-link.png)
![SetupIndex](https://testapartman.s3.eu-central-1.amazonaws.com/test/attach-policies-button.png)
![SetupIndex](https://testapartman.s3.eu-central-1.amazonaws.com/test/s3FullAccess-policy.png)

## Sonuç

Eğer adımlar sağlıklı bir şekilde tamamlandıysa static web hosting bölümünü tamamladıktan sonra erişebileceğiniz bir link belirtir.
Bu link aracılığıyla uygulamanıza erişabilirsiniz.