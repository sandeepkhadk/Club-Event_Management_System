# Club-Event_Management_System
College Based  Club-Event Management System designed to simplify the management of student clubs and events organized by them. The system allows admins and club coordinators to manage members, organize events, publish announcements, and track participation through a user-friendly web interface.
# Club‑Event Management System

## 🧩 Overview

This web application provides a centralized platform for managing student clubs and their activities. It allows colleges to:

- Create and manage clubs  
- Organize events and track participation  
- Register members and maintain records  
- Publish announcements for club activities  

Built with **React + Vite** for a fast and modern frontend, styled with **Tailwind CSS**, and **Django** in backend .

---

## 🚀 Features

### 🔹 General Features

- Fully responsive design  
- Smooth and interactive UI components  
- Role-based user access (Admin, Student(Member))  
- Easy navigation between clubs, events, and dashboards  

### 👤 User Roles

| Role | Capabilities |
|------|--------------|
| Admin | Manage clubs, events, announcements |
| Student | View clubs/events and register participation |

### 📌 Core Functionality

- Manage clubs  
- Schedule and manage events  
- Track event participation  
- Publish announcements  
- Login and registration system  

---

## 💻 Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Django, Python
- **Database:** PostgreSQL

---

## 📁 Folder Structure

<img width="220" height="459" alt="image" src="https://github.com/user-attachments/assets/3c8cd54c-cf36-43cd-aeff-8a37ef897a61" />



---

## 🛠️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/sandeepkhadk/Club-Event_Management_System.git
cd Club-Event_Management_System
```
### 2️⃣ Backend Setup (Django)

I. Navigate to backend folder:

```bash
cd backend/clubBackend
```

II. Create a virtual environment:

```bash
python -m venv venv
source venv/bin/activate     # Linux/Mac
venv\Scripts\activate        # Windows
```

III. Install dependencies:

```bash
pip install -r requirements.txt
```

IV. Apply migrations:

```bash
python manage.py makemigrations
python manage.py migrate
```

V. Start backend server:

```bash
python manage.py runserver
```

### 3️⃣ Frontend Setup (React + Vite + Tailwind CSS)

I. Navigate to frontend folder:

```bash
cd ../../../frontend
```

II. Install dependencies:

```bash
npm install 
```

III. Start frontend development server:

```bash
npm run dev
```

