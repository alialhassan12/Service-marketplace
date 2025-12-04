# Client Dashboard Homepage – Product Requirements Document (PRD)

## 1. Overview

The **Client Dashboard Homepage** is the landing screen users see after logging in as *Clients*.  
Its purpose is to:

- Welcome the user
- Provide quick shortcuts to key actions (Post Job, My Jobs, Messages, Payments)
- Display personalized suggested service providers
- Help users navigate easily to core features

---

## 2. Goals & Objectives

- Allow clients to quickly start new projects
- Provide intuitive navigation
- Increase provider engagement via suggestions
- Improve client satisfaction with a clean UI
- Reduce friction in managing jobs, messages, and payments

---

## 3. User Types

This homepage is accessible to:

- **Clients**

Not accessible to:

- Providers  
- Admins  
- Guests  

---

## 4. Page Structure

The homepage contains:

1. Left Sidebar Navigation  
2. Welcome Banner  
3. Quick Access Shortcut Cards  
4. Suggested Providers Section  
5. Sidebar Footer (Settings + User Preview)

---

# 5. Functional Requirements

## 5.1 Sidebar Navigation

### Contains:
- Marketplace Logo  
- Home (active)  
- My Jobs  
- Messages  
- Payments  
- Settings (footer)  
- User Profile Preview (avatar + name + email)

### Required Behaviors
- Active link is highlighted  
- All items must be clickable  
- Profile avatar opens full user profile  

---

## 5.2 Welcome Banner

### Contains:
- Greeting text: **“Welcome back, {ClientFirstName}!”**
- Subtext: Motivational message
- Dynamic user name
- Blue background (#2966F6)

### API Required:
`GET /api/user`

---

## 5.3 Quick Action Cards

### Cards:
1. **Post New Job**
   - Icon: plus (+)
   - Route: `/jobs/create`

2. **My Jobs**
   - Icon: briefcase
   - Route: `/jobs`

3. **Messages**
   - Icon: chat bubble
   - Route: `/messages`

4. **Payments**
   - Icon: credit card
   - Route: `/payments`

### Requirements
- Must be fully clickable  
- Hover state: lift + soft shadow  
- Responsive: 2×2 grid on mobile  

---

## 5.4 Suggested Providers Section

### Components of Each Provider Card:
- Avatar  
- Name  
- Profession  
- (Optional) rating  
- (Optional) starting price  

### Behavior:
- Clicking opens provider profile  
  Route: `/providers/{id}`

### API:
`GET /api/providers/suggested`

**Response Example:**
```json
[
  {
    "id": 12,
    "name": "Alex Carter",
    "profession": "Software Engineer",
    "avatar": "url"
  }
]
