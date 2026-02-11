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

Club-Event_Management_System/
├── frontend/
│ ├── node_modules/
│ ├── src/
│ │ ├── assets/ # Images, icons, static files
│ │ ├── components/ # Reusable React components
│ │ ├── context/ # React Context API provider
│ │ ├── hooks/ # Custom hooks
│ │ ├── provider/ # State or theme providers
│ │ ├── App.css
│ │ ├── App.jsx
│ │ ├── index.css
│ │ ├── index.jsx
│ │ └── main.jsx # Entry point
│ ├── package.json
│ ├── vite.config.js
│ ├── postcss.config.js
│ └── eslint.config.js
│
├── backend/
│ ├── clubBackend/
│ │ ├── Events/ # Event-related models, views
│ │ ├── Users/ # User models, authentication
│ │ ├── clubBackend/ # App-specific logic
│ │ ├── clubs/ # Club-related models, views
│ │ ├── core/ # Core backend files
│ │ ├── manage.py # Django management commands
│ │ └── requirements.txt # Python dependencies
│
├── .gitignore
├── README.md
├── package-lock.json
└── package.json


---

## 🛠️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/sandeepkhadk/Club-Event_Management_System.git
cd Club-Event_Management_System
```
### 2️⃣ Backend Setup (Django)

I. Navigate to backend folder:
