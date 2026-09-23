# GamerEscrow — Kapsamlı Geliştirici ve Özelleştirme Kılavuzu

Bu belge, **GamerEscrow** platformundaki tüm sayfaları, bileşenleri, veri yapılarını, oyun ve görsel ekleme/değiştirme adımlarını ve geri sayım süresi (45 dakikadan 24 saate çıkarma vb.) gibi tüm ayarları detaylıca açıklar.

---

## 🚀 1. Projeyi Çalıştırma

Proje şu anda geliştirme sunucusunda arka planda çalışmaktadır:
- **Yerel Adres:** [http://localhost:3000](http://localhost:3000)
- **Komut:** `npm run dev` (Windows PowerShell script kısıtlaması olan ortamlarda: `cmd /c "npm run dev"`)

---

## 🎮 2. Yeni Oyun Ekleme (Örn: Valorant)

Sitede oyunların seçildiği ve listelendiği **2 ana yer** vardır:
1. **İlan Oluşturma Sihirbazı** (`/create-listing`) — Kullanıcının ilan verirken seçtiği 6 kartlık liste.
2. **Veri Modeli ve Vitrin Listesi** (`mock/mockData.ts` & `app/page.tsx`) — Ana sayfadaki filtreler ve ilanlar.

### Adım 2.1: İlan Oluşturma Ekranına Yeni Oyun Ekleme
Dosya: `app/create-listing/page.tsx`

14. satırda `GAME_OPTIONS` dizisi yer alır. Buraya yeni oyununuzu (örneğin Valorant veya GTA V) ekleyebilirsiniz:

```typescript
// app/create-listing/page.tsx
const GAME_OPTIONS: GameOption[] = [
  { id: 'valorant', name: 'VALORANT', image: '/images/valorant.jpg' },
  { id: 'fortnite', name: 'Fortnite', image: '/images/fortnite.jpg' },
  { id: 'lol', name: 'League of Legends', image: '/images/lol.jpg' },
  { id: 'cs2', name: 'Counter-Strike 2 (CS2)', image: '/images/cs2.jpg' },
  { id: 'ea-sports-fc-26', name: 'EA Sports FC 26', image: '/images/fc26.jpg' },
  { id: 'pubg', name: 'PUBG: BATTLEGROUNDS', image: '/images/pubg.jpg' },
];
```

### Adım 2.2: Mock Veri Havuzuna ve Tiplere Ekleme
Dosya: `mock/mockData.ts`

1. **Tip Tanımı (Satır 3):**
   ```typescript
   export interface Listing {
     id: string;
     game: 'Valorant' | 'CS2' | 'LoL' | 'Steam' | 'Vanguard Strike' | 'Ashen Realm' | 'Aethermoor' | 'Dropzone 99' | 'Velocity X' | 'Void Command' | 'YeniOyun';
     // ...
   ```
2. **Kategori ve Filtre Listesi (Satır 116):**
   ```typescript
   export const MOCK_CATEGORIES = [
     'All',
     'Valorant',
     'CS2',
     'LoL',
     'Steam',
     'FPS',
     'MMORPG',
     // ...
   ];
   ```
3. **Yeni İlan Eklemek İsterseniz (`MOCK_LISTINGS` dizisine):**
   ```typescript
   {
     id: 'list-7',
     game: 'Valorant',
     gameSlug: 'valorant',
     category: 'FPS',
     title: 'Valorant Radiant · Vandal Yağmacı + Ejder Seti',
     rank: 'Radiant',
     rating: 5.0,
     priceSol: 18.0,
     priceUsd: 2610.0,
     seller: {
       address: '7xKX...9q2W',
       username: 'VandalMaster',
       verified: true,
       rating: 4.99,
       completedSales: 87,
     },
     featured: true,
     verified: true,
     image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
     tags: ['Yağmacı Vandal', 'Ejder Operatör', 'Asil Vandal'],
     description: 'İlk sahibi olunan Valorant hesabı. Tüm ajanlar açık, 12 bıçak.',
     escrowDetails: {
       vaultAddress: 'EscrowV1_Valo...99x',
       timelockHours: 24,
       inspectionPeriodHours: 24,
     },
   }
   ```

---

## 🖼️ 3. Fotoğrafları ve Görselleri Değiştirme

Platformdaki görseller 2 şekilde verilebilir:

### 1. Harici URL ile (Mevcut Durum)
Unsplash veya herhangi bir doğrudan resim linki kullanılabilir.
- **İlan Oluşturma Görselleri:** `app/create-listing/page.tsx` -> `GAME_OPTIONS[i].image`
- **Ana Sayfa İlan Kartları:** `mock/mockData.ts` -> `MOCK_LISTINGS[i].image`
- **Sipariş Ekranı Oyun Resmi:** `mock/mockData.ts` -> `MOCK_ORDERS[i].gameImage`
- **Profil Resmi (Avatar):** `mock/mockData.ts` -> `MOCK_PROFILE.avatarUrl`

### 2. Kendi Bilgisayarınızdaki Yerel Resimleri Kullanma
Eğer kendi resimlerinizi koymak isterseniz:
1. Resminizi projenin `public/` klasörüne (örneğin `public/images/valorant.jpg`) kaydedin. (Eğer `public` klasörü yoksa ana dizinde `public/images` oluşturabilirsiniz).
2. Kodda resim yolunu `/images/valorant.jpg` şeklinde verin:
   ```typescript
   image: '/images/valorant.jpg'
   ```

---

## ⏱️ 4. Süre Ayarı (45 Dakikayı 24 Saate Çıkarma)

Sitedeki alıcı inceleme süresi (Auto-Release countdown timer), escrow sipariş sayfasında yer almaktadır.

### Adım 4.1: Sipariş Sayfasındaki Başlangıç Değerini Değiştirme
Dosya: `app/orders/page.tsx`

136. satırda:
```tsx
// ŞU ANKİ HALİ (2570 saniye = ~42 dakika 50 saniye):
<CountdownTimer initialSeconds={2570} />

// 24 SAAT YAPMAK İÇİN (24 saat = 24 * 60 * 60 = 86400 saniye):
<CountdownTimer initialSeconds={86400} />
```

### Adım 4.2: Zamanlayıcı Bileşenini Saat (HH:MM:SS) Formatına Uyumlu Yapma
Dosya: `components/ui/CountdownTimer.tsx`

Varsayılan sayaç sadece dakika ve saniyeyi gösterecek şekilde (`MM:SS`) tasarlanmıştır. 24 saat gibi büyük sürelerde saat görünmesi için:

```typescript
// components/ui/CountdownTimer.tsx

// 1. totalSeconds referansını 24 saat (86400) yapın:
const totalSeconds = 86400; // 24 saat referans penceresi

// 2. Saat, dakika ve saniye hesaplamasını güncelleyin:
const hours = Math.floor(timeLeft / 3600);
const minutes = Math.floor((timeLeft % 3600) / 60);
const seconds = timeLeft % 60;
const formatPad = (num: number) => String(num).padStart(2, '0');

// 3. Ekrana basılan metin:
// MM:SS yerine HH:MM:SS:
<span className="font-sans text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
  {formatPad(hours)}:{formatPad(minutes)}:{formatPad(seconds)}
</span>
```

### Adım 4.3: Mock Sipariş Verisindeki Bitiş Zamanını Güncelleme
Dosya: `mock/mockData.ts` (Satır 335)

```typescript
// ŞU ANKİ (42 dakika):
expiresAt: new Date(Date.now() + 42 * 60 * 1000 + 50 * 1000).toISOString(),

// 24 SAAT YAPMAK İÇİN:
expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
```

---

## 🗺️ 5. Sayfalar ve Özellikler Rehberi

| Rota / Sayfa | Dosya Yolu | Açıklama & İşlevler |
| :--- | :--- | :--- |
| **Ana Sayfa / Pazar Yeri** | `app/page.tsx` | Tüm ilanların sergilendiği vitrin. Arama çubuğu, kategori butonları, sıralama (fiyata göre artan/azalan, puan, öne çıkanlar), platform istatistikleri ve "Buy / Escrow Lock" açılır penceresi. |
| **İlan Oluşturma** | `app/create-listing/page.tsx` & `app/create/page.tsx` | 4 adımlı ilan verme sihirbazı: 1) Oyun seçimi (`GAME_OPTIONS`), 2) İlan başlığı ve fiyat (SOL), 3) Şifrelenecek giriş bilgileri (Kullanıcı adı, şifre, e-posta), 4) Önizleme ve Solana Escrow'a yükleme onayı. |
| **Sipariş / Escrow Detayı** | `app/orders/page.tsx` | Alıcının satın aldığı hesabı test ettiği yer: Solana Vault cüzdan adresi, 4 adımlı işlem durumu (Stepper), geri sayım sayacı (`CountdownTimer`), hesap şifresini güvenle açma (`DecryptBox`), itiraz açma (`DisputeModal`) ve satıcıya parayı aktarma (`Release Funds`). |
| **Satıcı Paneli** | `app/seller/page.tsx` | Satıcının toplam kazancını, aktif ilanlarını, taslaklarını (Drafts) ve emanetteki (In Escrow) satışlarını yönettiği kontrol paneli. |
| **Admin & Hakem Paneli** | `app/admin/page.tsx` | Moderatör ekranı: İhtilaf (Dispute) durumundaki işlemleri inceler, alıcı ve satıcının sunduğu kanıtları/fotoğrafları görür ve hakem kararı vererek parayı iade eder veya serbest bırakır. |
| **Kullanıcı Paneli** | `app/dashboard/page.tsx` | Kullanıcının genel sipariş geçmişi, aktif işlemleri ve hızlı kısayolları. |
| **Profil & Cüzdan** | `app/profile/page.tsx` | Kullanıcı profili, güven puanı (Trust Score), işlem hacmi ve bağlı cüzdan adresi. |

---

## 🧩 6. Modallar ve Özel Bileşenler

| Bileşen Adı | Dosya Yolu | Ne İşe Yarar? |
| :--- | :--- | :--- |
| `BuyEscrowModal` | `components/modals/BuyEscrowModal.tsx` | İlan kartında "Buy Now" tıklandığında açılan, Solana kasasına fon kitleyen ödeme modalı. Komisyon oranları ve toplam SOL burada hesaplanır. |
| `DisputeModal` | `components/modals/DisputeModal.tsx` | Alıcı hesapta sorun çıkarsa itiraz sebebi seçip ekran görüntüsü kanıtı ekleyerek moderatöre uyuşmazlık bildirdiği pencere. |
| `PublishingWizardModal` | `components/modals/PublishingWizardModal.tsx` | Satıcı yeni ilan oluştururken verilerin şifrelenip Solana akıllı sözleşmesine kaydedilme animasyonu. |
| `CountdownTimer` | `components/ui/CountdownTimer.tsx` | Dairesel SVG animasyonlu geri sayım sayacı. Süre bittiğinde otomatik fon aktarımı mantığı. |
| `DecryptBox` | `components/ui/DecryptBox.tsx` | Satın alınan hesabın şifre ve kullanıcı adını gizleyen, tıklandığında görünür kılan ve tek tıkla kopyalatan güvenli kutu. |
| `ListingCard` | `components/ui/ListingCard.tsx` | Vitrindeki ilan kartları (resim, rütbe, satıcı doğrulama rozeti, fiyat etiketi). |
| `Stepper` | `components/ui/Stepper.tsx` | Escrow aşamalarını (1. Fon Kilitleme -> 2. Bilgi İletimi -> 3. İnceleme -> 4. Tamamlanma) görselleştiren ilerleme çubuğu. |
| `Header` | `components/layout/Header.tsx` | Logo, menü bağlantıları, Solana Phantom cüzdan bağlama butonu ve Karanlık/Aydınlık tema seçici. |

---

## 🖨️ 7. PDF Olarak Çıktı Alma

Bu kılavuzun şık ve baskıya hazır bir HTML/PDF versiyonu `pdf/gamer_escrow_rehberi.html` dosyası olarak projeye dahil edilmiştir.
- Bu dosyayı Google Chrome, Microsoft Edge veya herhangi bir tarayıcıda açıp **Ctrl + P** (Yazdır) tuşlarına basarak **"Hedef: PDF Olarak Kaydet"** seçeneğiyle doğrudan PDF'e dönüştürebilirsiniz!
