# 🪨 الحوت ماربل (Alhot Marble) - Premium Marble Export Website

A professional multilingual website for exporting premium marble, granite, and quartz from Egypt to global markets.

## 🌟 Features

- **🌐 Multilingual Support**: Arabic (RTL), English, Spanish, French
- **📱 Responsive Design**: Optimized for all devices
- **🎨 Modern UI/UX**: Built with TailwindCSS and custom components
- **🔍 SEO Optimized**: Meta tags, structured data, and clean URLs
- **🛡️ Type Safety**: Built with TypeScript
- **⚡ Performance**: Optimized images and code splitting
- **🔐 Authentication**: User management system
- **📊 Admin Dashboard**: Complete content management
- **💬 Contact Forms**: Quote requests and contact forms
- **🌍 Export Services**: Detailed shipping and export information

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: MySQL with Prisma ORM
- **Authentication**: NextAuth.js (planned)
- **Icons**: Lucide React
- **Styling**: TailwindCSS with RTL support
- **Fonts**: Cairo (Arabic), Inter (Latin)

## 📁 Project Structure

```
src/
├── app/
│   ├── [locale]/           # Localized routes
│   │   ├── page.tsx        # Home page
│   │   ├── products/       # Products pages
│   │   ├── about/          # About page
│   │   ├── contact/        # Contact page
│   │   └── layout.tsx      # Locale layout
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Root redirect
├── components/
│   ├── layout/             # Layout components
│   │   ├── Navbar.tsx      # Navigation bar
│   │   └── Footer.tsx      # Footer
│   └── ui/                 # UI components
│       ├── button.tsx      # Button component
│       ├── input.tsx       # Input component
│       └── card.tsx        # Card component
├── lib/
│   ├── db.ts              # Database connection
│   └── utils.ts           # Utility functions
└── types/
    └── index.ts           # Type definitions
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- MySQL database (for production)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/alhot-marble.git
   cd alhot-marble
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Copy `.env.example` to `.env` and update the values:
   ```bash
   cp .env.example .env
   ```
   
   Update the following variables:
   ```env
   DATABASE_URL="mysql://username:password@localhost:3306/alhot_marble"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma db push
   
   # (Optional) Seed the database
   npx prisma db seed
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the website.

## 🌍 Available Routes

### Public Routes
- `/ar` - Arabic homepage
- `/en` - English homepage  
- `/es` - Spanish homepage
- `/fr` - French homepage
- `/[locale]/products` - Products catalog
- `/[locale]/about` - About page
- `/[locale]/contact` - Contact page
- `/[locale]/export` - Export services (planned)
- `/[locale]/blog` - Blog (planned)

### Admin Routes (Planned)
- `/admin` - Admin dashboard
- `/admin/products` - Product management
- `/admin/orders` - Order management
- `/admin/settings` - Site settings

## 🎨 Customization

### Colors
The website uses a custom color palette defined in `tailwind.config.ts`:
- **Primary**: Golden (`#f59000`)
- **Secondary**: Dark blue (`#2c3e50`)
- **Accent**: Light gray (`#bdc3c7`)

### Fonts
- **Arabic**: Cairo font for RTL text
- **Latin**: Inter font for LTR text

### Images
Place your images in `public/images/`:
- `hero-marble.jpg` - Homepage hero background
- `marble-category.jpg` - Marble category thumbnail
- `granite-category.jpg` - Granite category thumbnail
- `quartz-category.jpg` - Quartz category thumbnail

## 📝 Content Management

### Adding Products
Products are managed through the database. Use Prisma Studio or the admin dashboard:
```bash
npx prisma studio
```

### Translations
All text content is stored in component files with language objects. To add a new language:

1. Add the locale to `src/app/[locale]/layout.tsx`
2. Add translations to each component's content object
3. Update the language selector in `Navbar.tsx`

## 🔧 Development Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npx prisma studio    # Open Prisma Studio
npx prisma generate  # Generate Prisma client
npx prisma db push   # Push schema changes
npx prisma migrate   # Run migrations
```

## 📊 Database Schema

### Main Tables
- **users** - User accounts and authentication
- **products** - Product catalog with multilingual content
- **blog_posts** - Blog articles with multilingual content
- **quote_requests** - Customer quote requests
- **site_settings** - Site configuration and content

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on every push

### Manual Deployment
1. Build the application: `npm run build`
2. Upload the `.next` folder and other necessary files
3. Set up your database and environment variables
4. Start the application: `npm start`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`  
5. Open a Pull Request

## 📧 Contact

**الحوت ماربل (Alhot Marble)**
- 📍 Egypt - Cairo - Shaq Al-Thuban Industrial Zone
- 📱 WhatsApp: +20 111 312 1444
- ✉️ Email: info@alhotmarble.com
- 🌐 Website: [alhotmarble.com](https://alhotmarble.com)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- TailwindCSS for the utility-first CSS framework
- Lucide React for the beautiful icons
- All contributors and supporters of this project

---

**Built with ❤️ for الحوت ماربل (Alhot Marble)**
