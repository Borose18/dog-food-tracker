# 🐕 Dog Food Tracker

A Next.js 14 application for tracking family dog food purchases with separate turn rotations for wet and dry food.

## ✨ Features

- **Separate Turn Management**: Independent rotation for wet and dry food
- **Real-time Updates**: Supabase integration with live data sync
- **Family Member Management**: Add/remove family members with color coding
- **Purchase History**: Track all food purchases with timestamps
- **Mobile Responsive**: Clean, modern UI that works on all devices
- **Turn Adjustment**: Set initial turns and lock them to prevent accidental changes

## 🚀 Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Supabase** (Database + Real-time)
- **React Hooks** (State management)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd dog-food-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase database**
   - Create a new Supabase project
   - Run the SQL schema from `supabase-schema.sql` in your Supabase SQL Editor
   - Copy your project URL and anon key to `.env.local`

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Schema

The app uses three main tables:

- **`family_members`**: Stores family member information
- **`purchases`**: Tracks all food purchases
- **`rotation_state`**: Manages turn rotations and setup state

## 🎯 How It Works

### Separate Turn Rotations
- **Wet Food**: Rotates independently (e.g., Bo → Emily → Louise → Bo...)
- **Dry Food**: Rotates independently (e.g., Louise → Bo → Emily → Louise...)
- Each food type maintains its own "last purchased by" record

### Turn Management
1. **Initial Setup**: Add family members
2. **Set Turns**: Use the Turn Adjuster to set who's turn it is for each food type
3. **Lock Turns**: Prevent accidental changes after initial setup
4. **Purchase Tracking**: Mark purchases to advance only the specific food type's turn

## 🛠️ Development

### Project Structure
```
src/
├── app/                 # Next.js app router pages
├── components/          # React components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── types/              # TypeScript type definitions
```

### Key Components
- **`FamilySetup`**: Add/remove family members
- **`CurrentTurn`**: Display whose turn it is
- **`FoodSection`**: Wet/dry food purchase buttons
- **`TurnAdjuster`**: Set initial turns and lock them
- **`PurchaseHistory`**: View all purchases

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📱 Mobile Support

The app is fully responsive and works great on:
- 📱 Mobile phones
- 📱 Tablets
- 💻 Desktop computers

## 🎨 UI/UX Features

- **Purple/Blue Gradient Theme**: Modern, clean design
- **Glass Morphism**: Backdrop blur effects
- **Color-coded Family Members**: Easy identification
- **Intuitive Navigation**: Simple, clear interface

## 🔒 Security

- **Row Level Security (RLS)**: Enabled on all Supabase tables
- **Environment Variables**: Sensitive data stored securely
- **Type Safety**: Full TypeScript coverage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Troubleshooting

### Common Issues

1. **"Running in local mode"**: Check your `.env.local` file has correct Supabase credentials
2. **Database errors**: Ensure you've run the SQL schema in Supabase
3. **TypeScript errors**: Run `npm run build` to check for type issues

### Getting Help

If you encounter any issues:
1. Check the troubleshooting section above
2. Review the Supabase setup in your dashboard
3. Ensure all environment variables are set correctly

---

**Happy Dog Food Tracking! 🐕✨**

<!-- Trigger deploy after adding Netlify environment variables -->