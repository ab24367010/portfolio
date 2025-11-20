# Portfolio Website - Batkhishig Altan-Ochir

Миний хувийн портфолио вэбсайт. Технологийн чиглэлээр суралцагч, хөгжүүлэгч болохын хувьд миний туршлага, төслүүд, чадваруудыг танилцуулсан байна.

## 🌟 Онцлог шинж чанарууд

- **Responsive дизайн** - Бүх төхөөрөмжид (компьютер, таблет, гар утас) сайн харагдана
- **Интерактив чатбот** - Монгол хэл дээрх асуулт-хариултын систем
- **Төсөл танилцуулга** - Миний хийсэн төслүүдийн дэлгэрэнгүй мэдээлэл
- **Холбоо барих форм** - Validation-тэй холбоо барих хэсэг
- **Дөхөм зөөх боломжтой чатбот** - Drag & drop функцтэй
- **Keyboard навигаци** - Accessibility дэмжлэг (ARIA labels, keyboard shortcuts)
- **Lazy loading** - Зургуудыг хурдан ачаалах

## 🛠️ Технологиуд

- **Frontend:**
  - HTML5
  - CSS3 (Custom styles + TailwindCSS)
  - Vanilla JavaScript (ES6+)

- **Fonts:** Google Fonts - Inter
- **Icons:** Emoji icons
- **Version Control:** Git/GitHub

## 📁 Файлын бүтэц

```
portfolio/
├── index.html          # Үндсэн хуудас
├── project.html        # RFID төслийн дэлгэрэнгүй
├── web-project.html    # Вэб хөгжүүлэлтийн төслийн дэлгэрэнгүй
├── 404.html           # Алдааны хуудас
├── style.css          # Нэмэлт CSS загварууд
├── script.js          # JavaScript логик
├── data.json          # Чатботын өгөгдөл
├── img/               # Зургууд
│   ├── bg.jpg
│   ├── profile.jpg
│   ├── esp32.jpg
│   ├── rfid.jpg
│   ├── oled.jpg
│   └── scheme.jpg
└── README.md          # Энэ файл
```

## 🚀 Хэрхэн ашиглах

1. **Репозиторийг clone хийх:**
   ```bash
   git clone https://github.com/ab24367010/portfolio.git
   cd portfolio
   ```

2. **Локал дээр ажиллуулах:**
   - `index.html` файлыг браузер дээр нээх
   - Эсвэл Live Server ашиглах (VS Code extension)

3. **GitHub Pages дээр deploy хийх:**
   - Repository Settings > Pages хэсэгт очих
   - Source-г `main` branch сонгох
   - Save дарах

## 📝 Үндсэн функцууд

### Чатбот

- Монгол хэл дээрх мэдээлэл өгөх
- Олон түвшний асуулт-хариулт
- Drag & drop-оор байрлалыг өөрчлөх
- Escape товчоор хаах
- Автомат retry логик (алдаа гарсан үед)

### Холбоо барих форм

- Нэр, имэйл, мессеж талбарууд
- Real-time validation
- Зөв форматыг шалгах
- Амжилтын мессеж харуулах

### Accessibility

- ARIA labels бүх товчнууд дээр
- Keyboard навигаци дэмжлэгтэй
- Focus management
- Screen reader дэмжлэг

## 🎨 Дизайны онцлог

- **Өнгөний схем:** Dark theme (Gray-900, Gray-800)
- **Font:** Inter (Google Fonts)
- **Анимацууд:**
  - Fade-in messages
  - Hover effects
  - Scale animations
  - Smooth transitions

## 🔧 Сайжруулсан зүйлс

✅ **Аюулгүй байдал:**
- XSS согогийг засварласан (`.innerHTML` → `.textContent`)

✅ **Гүйцэтгэл:**
- Lazy loading нэмэгдсэн
- CSS анимацууд (JavaScript setTimeout-ийн оронд)
- Зургуудын оптимизаци заавартай (доор үзнэ үү)

✅ **Код чанар:**
- JSDoc тайлбарууд нэмэгдсэн
- Error handling сайжруулсан
- Retry логик нэмэгдсэн
- Функцүүд refactor хийгдсэн

✅ **Хэрэглэгчийн туршлага:**
- Mobile responsive
- Keyboard navigation
- Contact form validation
- Chatbot drag & drop

## 📸 Зургуудын оптимизаци

Сайтын ачаалах хурдыг нэмэгдүүлэхийн тулд зургуудыг оптимизаци хийх шаардлагатай:

### Зөвлөмж:

1. **WebP формат руу хөрвүүлэх:**
   ```bash
   # ImageMagick ашиглах (суулгасан бол)
   convert img/bg.jpg -quality 80 img/bg.webp
   convert img/esp32.jpg -quality 80 img/esp32.webp
   ```

2. **Онлайн хэрэгслүүд:**
   - [TinyPNG](https://tinypng.com/) - PNG/JPG багасгах
   - [Squoosh](https://squoosh.app/) - Google-ийн зураг оптимизаци
   - [CloudConvert](https://cloudconvert.com/) - Формат хөрвүүлэх

3. **Зорилтот хэмжээ:**
   - Hero background (bg.jpg): < 200KB
   - Profile photo: < 50KB
   - Project images: < 100KB

4. **HTML код өөрчлөх (WebP ашиглах):**
   ```html
   <picture>
     <source srcset="img/bg.webp" type="image/webp">
     <img src="img/bg.jpg" alt="Background">
   </picture>
   ```

## 🌐 Холбоосууд

- **GitHub:** [ab24367010](https://github.com/ab24367010)
- **Email:** ab24367010@ga.ttc.ac.jp
- **Instagram:** [@_ciol_ft](https://instagram.com/_ciol_ft/)
- **Facebook:** [ciolft](https://facebook.com/ciolft/)

## 📄 License

© 2025 Batkhishig Altan-Ochir. All rights reserved.

---

## 💡 Цаашдын төлөвлөгөө

- [ ] Analytics нэмэх (Google Analytics)
- [ ] Blog хэсэг нэмэх
- [ ] Илүү олон төсөл нэмэх
- [ ] Мобайл аппликэйшн хувилбар
- [ ] Dark/Light mode toggle
- [ ] Олон хэлний дэмжлэг (English, Монгол)

---

**Санал, санал хүсэлт байвал GitHub Issues хэсэг рүү бичнэ үү!**
