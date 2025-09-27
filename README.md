# Modern Mobile Hamburger Menu Component

Bu komponent zamonaviy va to'liq funksionalli mobile hamburger menu bilan React header komponenti.

## Xususiyatlari

### 🎨 Zamonaviy Dizayn
- Smooth animatsiyalar va transitions
- Modern hamburger icon animatsiyasi
- Responsive dizayn
- Dark mode qo'llab-quvvatlash
- High contrast mode qo'llab-quvvatlash

### 📱 Mobile-First Approach
- Touch-friendly interface
- Swipe gestures qo'llab-quvvatlash
- Mobile-optimized navigation
- Accessibility features

### ⚡ Performance
- Optimized animations
- Reduced motion support
- Efficient event handling
- Memory leak prevention

## O'rnatish

1. CSS faylini import qiling:
```jsx
import './HeaderOne.css';
```

2. Komponentni ishlatish:
```jsx
import HeaderOne from './HeaderOne';

function App() {
  return (
    <div>
      <HeaderOne />
      {/* Boshqa komponentlar */}
    </div>
  );
}
```

## Konfiguratsiya

### Menu Data
Menu ma'lumotlari `data/menu/HeaderMenu.json` faylida saqlanadi:

```json
[
  {
    "label": "홈",
    "path": "/"
  },
  {
    "label": "서비스",
    "path": "/services",
    "submenu": [
      {
        "sublabel": "웹 개발",
        "subpath": "/services/web-development"
      }
    ]
  }
]
```

### CSS Customization

Asosiy CSS o'zgaruvchilari:

```css
:root {
  --mobile-menu-width: 320px;
  --mobile-menu-bg: #fff;
  --mobile-menu-text: #333;
  --mobile-menu-hover: #007bff;
}
```

## Xususiyatlar

### Mobile Menu Features
- **Hamburger Animation**: Smooth 3-line to X transformation
- **Slide-in Menu**: Right-to-left slide animation
- **Backdrop Blur**: Modern glassmorphism effect
- **Touch Gestures**: Swipe to close support
- **Keyboard Navigation**: Full keyboard accessibility

### Accessibility
- ARIA labels va roles
- Keyboard navigation
- Screen reader support
- Focus management
- High contrast support

### Responsive Breakpoints
- Desktop: 992px+
- Tablet: 768px - 991px
- Mobile: < 768px

## API

### Props
Komponent hech qanday props qabul qilmaydi - barcha konfiguratsiya JSON fayl orqali amalga oshiriladi.

### State Management
- `mobileToggle`: Mobile menu ochiq/yopiq holati
- `searchshow`: Search form ko'rinish holati

### Event Handlers
- `MobileMenuToggler`: Mobile menu toggle
- `headerSearchShow/Close`: Search form boshqaruvi

## Styling

### CSS Classes
- `.mobile-menu-toggler`: Hamburger button
- `.mobile-menu-overlay`: Background overlay
- `.mobile-menu-content`: Menu container
- `.mobile-menu-list`: Menu items list
- `.mobile-submenu`: Submenu container

### Animation Classes
- `.active`: Active state
- `.hamburger-line`: Hamburger lines
- `.mobile-menu-item`: Menu items

## Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Performance Tips
1. CSS faylini production da minify qiling
2. Images uchun lazy loading ishlatish
3. Unused CSS ni olib tashlash
4. Critical CSS ni inline qilish

## Troubleshooting

### Umumiy Muammolar

**Menu ochilmaydi:**
- CSS fayl import qilinganligini tekshiring
- JavaScript errors ni console da tekshiring

**Animatsiyalar ishlamaydi:**
- Browser CSS transitions qo'llab-quvvatlashini tekshiring
- `prefers-reduced-motion` setting ni tekshiring

**Mobile da to'g'ri ishlamaydi:**
- Viewport meta tag ni tekshiring
- Touch events qo'llab-quvvatlashini tekshiring

## Contributing

1. Fork qiling
2. Feature branch yarating
3. O'zgarishlarni commit qiling
4. Pull request yuboring

## License

MIT License