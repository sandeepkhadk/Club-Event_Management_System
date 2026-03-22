# Project Overview
Project Name: CLUB & EVENT MANAGEMENT SYSTEM


Frontend Hosted at : https://club-eventmanagement.vercel.app (live)


Backend Hosted at : https://club-event-management-system-v0ll.onrender.com (live)

Video demo: https://drive.google.com/drive/folders/1MXx4VMEd8_cng-xofi6ONBATCo9YYprQ?usp=sharing

<img width="1831" height="885" alt="Screenshot 2026-02-19 220109" src="https://github.com/user-attachments/assets/c7fbaaed-fb0a-4194-8c9f-0a25d2e017fc" />


# CLUB & EVENT MANAGEMENT SYSTEM

This web application provides a centralized platform for managing student clubs and their activities. It allows colleges to:

- Create and manage clubs  
- Organize events and track participation  
- Register members and maintain records  
- Publish announcements for club activities  

Built with **React + Vite** for a fast and modern frontend, styled with **Tailwind CSS**, and **Django** in backend .

---

#  🚀 Features

## 🔹 General Features

- Fully responsive design  
- Smooth and interactive UI components  
- Role-based user access (Admin, Student(Member))  
- Easy navigation between clubs, events, and dashboards  

## 👤 User Roles and Permissions

| Role              | Description                     | Key Permissions                                                                                  |
|-------------------|---------------------------------|--------------------------------------------------------------------------------------------------|
| **Super Admin**   | System-level authority          | Create and remove admins, monitor all clubs                                                     |
| **Admin**         | Club-level authority            | Create and manage events, manage members, assign event handlers, and post announcements         |
| **Member**        | Registered club participant     | Join global and club-specific events, and access their respective club                          |
| **Event Handler** | Event-level authority           | Modify event activities, delete events, or reschedule them                                      |
| **Student**       | General user                    | Browse clubs, view events, join global events, and request membership                           |



## 📌 Core Functionality

- Manage clubs  
- Schedule and manage events  
- Track event participation  
- Publish announcements  
- Login and registration system  

---

# 💻 Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Django, Python
- **Database:** PostgreSQL

---

## 📁 Folder Structure

``` text
Club-Event_Management_System/
│
├── Frontend/
│ ├── src/
│ │ ├── assets/
│ │ ├── components/
│ │ │ ├── Members/
│ │ │ ├── admin/
│ │ │ ├── auth/
│ │ │ ├── event-club/
│ │ │ └── home/
│ │ │
│ │ ├── context/
│ │ ├── hooks/
│ │ ├── provider/
│ │ ├── App.css
│ │ ├── App.jsx
│ │ ├── api.jsx
│ │ ├── index.css
│ │ └── main.jsx
│ │
│ ├── eslint.config.js
│ ├── index.html
│ ├── package.json
│ ├── package-lock.json
│ ├── postcss.config.js
│ └── vite.config.js
│
├── backend/
│ ├── clubBackend/
│ │ ├── Events/
│ │ ├── Users/
│ │ ├── clubBackend/
│ │ ├── clubs/
│ │ ├── core/
│ │ ├── manage.py
│ │ └── requirements.txt
│
├── build.sh
├── package.json
├── package-lock.json
├── README.md
├── .gitignore
└── .gitattributes
```

## 🛠️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/sandeepkhadk/Club-Event_Management_System.git
cd Club-Event_Management_System
```
### 2️⃣ Backend Setup (Django)

1. Navigate to backend folder:

```bash
cd backend/clubBackend
```

2. Create a virtual environment:

```bash
python -m venv venv
source venv/bin/activate     # Linux/Mac
venv\Scripts\activate        # Windows
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Start backend server:

```bash
python manage.py runserver
```

### 3️⃣ Frontend Setup (React + Vite + Tailwind CSS)

1. Navigate to frontend folder:

```bash
cd ../../../frontend
```

2. Install dependencies:

```bash
npm install 
```

3. Configure Environment Variables
```
Create a .env file in the project root using .env.example with proper credentials.
```
    
4. Start frontend development server:

```bash
npm run dev
```
5. Access the Application
   
```bash
http://localhost:5173
```
