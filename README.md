
# 🕳️ Pothole Detection Dashboard (with Supabase + ML)

A full-stack web application that captures, stores, and detects potholes from camera images using a machine learning model trained on 28,000+ labeled pothole images. The project uses Supabase for image storage and data management, and a real-time dashboard to visualize and sort results.

---

## 🔍 Project Overview

This project aims to automate pothole detection using image classification and provide a centralized dashboard to:

- Upload and store images captured from a mounted camera.
- Run inference using a custom-trained ML model (28k+ dataset).
- Store results in Supabase (image, confidence score, timestamp).
- Display pothole data with sorting (latest, severity, distance).
- Provide real-time access and visual analytics for road monitoring.

---

## 🧠 Tech Stack

### 💻 Frontend
- **Next.js 14+ (App Router)**
- **TailwindCSS**
- **TypeScript**

### 📦 Backend / Infra
- **Supabase** (for Auth, DB, and Storage)
- **Node.js** (for model inference API or server-side logic)
- **Custom ML Model** trained on 28,000 pothole images (CNN)

---

## 📁 Features

- 🚗 **Camera Integration**: Automatically captures road images during movement.
- 🧠 **Pothole Detection**: Processes images using a trained ML model.
- ☁️ **Supabase Storage**: Saves images and metadata (confidence, location, timestamp).
- 📊 **Analytics Dashboard**: Displays detection results with filters, heatmaps, and sort.
- 🔐 **Auth-ready**: Uses Supabase for user login (optional).

---

## ⚙️ How to Run Locally

1. Clone the repo:
   ```bash
   git clone https://github.com/anish41338/pothole-detection.git
   cd pothole-detection
  ````

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Setup environment variables:
   Create a `.env.local` file:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Start the development server:

   ```bash
   pnpm dev
   ````

---

## 🧪 Model Info

* ✅ Trained on **28,000+ labeled pothole images**
* ⚙️ CNN-based architecture (custom optimized)
* 📊 \~93% accuracy on validation set
* 🛣️ Real-world tested on roadside camera footage

---

## 📸 Sample Output

| Confidence | Location        | Time     |
| ---------- | --------------- | -------- |
| 91%        | Jayanagar, BLR  | 12:01 PM |
| 87%        | Whitefield, BLR | 12:06 PM |

---

## ✨ Features Additional

* GPS pinning with map overlay
* SMS/email alerts for municipal bodies
* Feedback loop to retrain model
* Role-based access for authorities

---

## 🤝 Contributing

1. Fork the repo
2. Create a new branch (`feature-xyz`)
3. Commit your changes
4. Open a PR

---

## 📄 License

MIT License

---

## 🚀 Author

**Anish Sihag**
[GitHub](https://github.com/anish41338) · [LinkedIn](https://linkedin.com/in/anish-s-46399133a)


