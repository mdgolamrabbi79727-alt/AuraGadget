# AuraGadget - Premium Gadget Accessories (Bangladesh)

A modern, responsive e-commerce storefront for gadget accessories in Bangladesh. Built with React 19, TypeScript, Vite, and Tailwind CSS.

## Features
- 🛒 Full shopping cart, wishlist, and search & category filtering
- 💳 **Bangladeshi Payment Options**: bKash, Nagad, and Cash on Delivery (COD)
- ⚙️ **Admin Panel**: Manage products, orders, categories, and payment settings (merchant numbers, instructions)
- 🌐 **Bilingual Support**: Instant toggle between Bengali (বাংলা) and English (US)
- 📱 **Fully Responsive**: Optimized for mobile, tablet, and desktop

---

## How to Upload this Project to GitHub (গিটহাবে নেওয়ার নিয়ম)

### পদ্ধতি ১: AI Studio থেকে ডাউনলোড করে গিটহাবে পুশ করা (সবচেয়ে সহজ)

1. **কোড ডাউনলোড করুন**:
   - AI Studio ইন্টারফেসের উপরে ডান পাশে থাকা **Export / Download** বা **Code** আইকনে ক্লিক করে পুরো প্রজেক্টের ZIP ফাইল ডাউনলোড করে আনজিপ করুন।

2. **GitHub-এ একটি নতুন Repository তৈরি করুন**:
   - [github.com/new](https://github.com/new) এ যান।
   - Repository name দিন (যেমন: `auragadget-store`).
   - এটি **Public** অথবা **Private** রাখুন।
   - *Add a README file*, *.gitignore* বা *license* অপশনে টিক **দেবেন না** (খালি রাখুন)।
   - **Create repository** বাটনে ক্লিক করুন।

3. **আপনার কম্পিউটারে Terminal / Command Prompt ওপেন করুন**:
   - আনজিপ করা ফোল্ডারে যান:
   ```bash
   cd auragadget-store
   ```

4. **Git কমান্ডগুলো রান করুন**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: AuraGadget store with bKash, Nagad, and COD"
   git branch -M main
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/auragadget-store.git
   git push -u origin main
   ```
   *(এখানে `YOUR_GITHUB_USERNAME` এর জায়গায় আপনার আসল GitHub ইউজারনেম দিন)*

---

### Cloudflare Pages এ ফ্রি ডিপ্লয় করার নিয়ম (Free Deployment)

1. [Cloudflare Dashboard](https://dash.cloudflare.com/) এ লগইন করুন।
2. **Workers & Pages** > **Create application** > **Pages** > **Connect to Git** সিলেক্ট করুন।
3. আপনার GitHub অ্যাকাউন্ট কানেক্ট করে `auragadget-store` রিপোজিটরিটি সিলেক্ট করুন।
4. **Build settings** সেট করুন:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. **Save and Deploy** বাটনে ক্লিক করুন। কয়েক সেকেন্ডেই ওয়েবসাইট লাইভ হয়ে যাবে!

---

## Local Development (আপনার কম্পিউটারে রান করার নিয়ম)

```bash
# ডিপেন্ডেন্সি ইন্সটল করুন
npm install

# ডেভেলপমেন্ট সার্ভার চালু করুন
npm run dev

# প্রোডাকশন বিল্ড তৈরি করুন
npm run build
```
