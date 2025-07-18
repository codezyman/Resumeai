# ResumeAI - AI-Powered Resume Generator

A modern, fullstack web application for creating professional resumes with AI assistance. Built with Next.js frontend and Node.js backend, featuring MongoDB for data persistence and ready for OpenAI/Gemini API integration.

## Features

- **AI-Powered Content Generation**: Generate professional summaries and enhance achievements
- **Professional Templates**: Multiple ATS-friendly resume templates
- **PDF Export**: High-quality PDF generation with Puppeteer
- **Real-time Preview**: See changes as you build your resume
- **User Authentication**: Secure JWT-based authentication
- **Responsive Design**: Works perfectly on all devices
- **Template Management**: Easy template selection and customization

## Tech Stack

### Frontend
- Next.js 13 with App Router
- React 18 with TypeScript
- Tailwind CSS for styling
- Shadcn/UI components
- React Hook Form for form handling
- Lucide React for icons

### Backend
- Node.js with Express
- MongoDB with Mongoose ODM
- JWT authentication
- Puppeteer for PDF generation
- Bcrypt for password hashing
- Helmet for security

### AI Integration
- Abstraction layer for OpenAI/Gemini APIs
- Easy configuration switching
- Prompt engineering for resume content

## Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB (local or MongoDB Atlas)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd resume-ai-generator
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   npm run install:server
   ```

3. **Environment Setup**
   
   Create `server/.env` file:
   ```env
   MONGODB_URI=mongodb://localhost:27017/resume-generator
   JWT_SECRET=your-super-secret-jwt-key-here
   FRONTEND_URL=http://localhost:3000
   PORT=5000
   NODE_ENV=development
   
   # AI API Configuration (optional)
   # OPENAI_API_KEY=your-openai-api-key
   # GEMINI_API_KEY=your-gemini-api-key
   # AI_PROVIDER=openai
   ```

4. **Seed the database**
   ```bash
   npm run server:seed
   ```

5. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── components/         # React components
│   │   ├── Layout/        # Header, Footer components
│   │   ├── ResumeBuilder/ # Resume building components
│   │   └── Templates/     # Template-related components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions and API client
│   └── (pages)/           # Route pages
├── server/                # Node.js backend
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Express middleware
│   └── data/             # Sample data and seeders
└── public/               # Static assets
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Resumes
- `GET /api/resumes` - Get user's resumes
- `POST /api/resumes` - Create new resume
- `GET /api/resumes/:id` - Get specific resume
- `PUT /api/resumes/:id` - Update resume
- `DELETE /api/resumes/:id` - Delete resume

### Templates
- `GET /api/templates` - Get all templates
- `GET /api/templates/:id` - Get specific template

### AI Features
- `POST /api/ai/summary` - Generate professional summary
- `POST /api/ai/achievements` - Enhance achievements
- `GET /api/ai/status` - Check AI configuration

### Export
- `POST /api/export/pdf/:resumeId` - Export resume as PDF

## Database Schema

### User Model
```javascript
{
  email: String,
  password: String (hashed),
  firstName: String,
  lastName: String,
  profile: {
    avatar: String,
    phone: String,
    linkedin: String,
    github: String,
    website: String
  },
  subscription: {
    plan: String,
    expiresAt: Date
  }
}
```

### Resume Model
```javascript
{
  userId: ObjectId,
  title: String,
  templateId: ObjectId,
  personalInfo: Object,
  experience: Array,
  education: Array,
  skills: Array,
  projects: Array,
  certifications: Array,
  status: String,
  metadata: Object
}
```

## AI Integration

The application includes an abstraction layer for AI providers:

1. **Configure AI Provider**
   ```env
   AI_PROVIDER=openai  # or 'gemini'
   OPENAI_API_KEY=your-key
   ```

2. **AI Features**
   - Professional summary generation
   - Achievement enhancement
   - Easy provider switching

## Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
```

### Backend (Railway/Render/Heroku)
```bash
cd server
npm start
```

### Environment Variables
Make sure to set all required environment variables in your deployment platform.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@resumeai.com or join our Discord community.

---

**Built with ❤️ by the ResumeAI Team**

---

### 1. **Resume validation failed: user: Path `user` is required.**
- When creating a resume, Mongoose expects a `user` field, but it is missing in your request.
- This means the backend is not receiving the user ID (or reference) when saving a resume.

**How to fix:**
- In your backend `/api/resumes` POST route, make sure you are attaching the user ID to the new resume.
- Usually, this is done by extracting the user from the authentication middleware and adding it to the resume data before saving.

**Example fix in your backend route:**
```js
// server/routes/resumes.js (POST /api/resumes)
router.post('/', auth, async (req, res) => {
  try {
    const resumeData = {
      ...req.body,
      user: req.user._id // Attach the user ID from the auth middleware
    };
    const resume = new Resume(resumeData);
    await resume.save();
    res.status(201).json({ resume });
  } catch (error) {
    console.error('Create resume error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});
```
- Make sure your `auth` middleware sets `req.user`.

---

### 2. **StrictPopulateError: Cannot populate path `templateId` because it is not in your schema.**
- Your backend is trying to populate `templateId` in the Resume model, but `templateId` is not defined as a reference in your Mongoose schema.

**How to fix:**
- In your `Resume.js` Mongoose schema, make sure `templateId` is defined as a reference to the Template model.

**Example fix in your Resume schema:**
```js
// server/models/Resume.js
const ResumeSchema = new mongoose.Schema({
  // ... other fields ...
  templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Template' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // ... other fields ...
});
```
- Then, in your route, you can safely use `.populate('templateId')`.

---

## **Summary Table**

| Error | Cause | Fix |
|-------|-------|-----|
| Resume validation failed: user: Path `user` is required | Not attaching user ID to resume | Attach `req.user._id` to resume data in POST route |
| StrictPopulateError: Cannot populate path `templateId` | `templateId` not defined as ref in schema | Add `templateId: { type: ObjectId, ref: 'Template' }` to Resume schema |

---

**Would you like me to show you the exact code changes for your files?**  
If yes, let me know if you want to fix both issues at once!

---

## 1. **Broken Routing or Missing Resume ID**
- The View/Edit buttons should link to something like `/resume/[id]` or `/edit/[id]`.
- If the resume ID is missing or incorrect, the page may not load or may show a 404.

**Check:**  
- Hover over the View/Edit links and look at the URL in your browser’s status bar.
- Is the URL something like `/resume/undefined` or `/resume/`?  
  If so, the resume ID is not being passed correctly.

---

## 2. **Frontend Route or API Error**
- If you click View/Edit and see a blank page or error, check your browser console for errors.
- Check the Network tab for failed API requests (404, 500, etc.).

---

## 3. **Backend Route Issue**
- If the frontend is sending the correct ID, but the backend returns 404 or 500, there may be a bug in the backend route or the resume is not being found.

---

## **How to Debug**

1. **Hover over the View/Edit links. What is the URL?**
2. **Click the link. What happens?**
   - Do you see a 404 page? Blank page? Error message?
3. **Check the browser console and Network tab for errors.**
4. **If you see an error, copy it here.**

---

## **Common Fixes**

- Make sure your dashboard code is passing the correct `_id` to the View/Edit links:
  ```jsx
  <Link href={`/resume/${resume._id}`}>View</Link>
  <Link href={`/resume/${resume._id}/edit`}>Edit</Link>
  ```
- Make sure your backend GET `/api/resumes/:id` route is working and returns the resume for the logged-in user.

---

**Please let me know:**
- What URL do you see for View/Edit?
- What error (if any) do you see in the console or network tab when you click them?

Once you provide this info, I’ll give you the exact fix!

---

## Why This Happens

- In Next.js (App Router), if you use `output: 'export'` in your config, **dynamic routes** like `/resume/[id]` require you to export a function called `generateStaticParams`.
- This function tells Next.js which dynamic routes to pre-render at build time.
- Without it, Next.js cannot statically generate pages for dynamic routes.

---

## How to Fix

### **Option 1: Remove `output: 'export'` (Recommended for Dynamic Apps)**
If your app is not a static site and you want server-side rendering or dynamic routes, remove or comment out the `output: 'export'` line in your `next.config.js`:

```js
<code_block_to_apply_changes_from>
```
Then restart your dev server.

---

### **Option 2: Add `generateStaticParams` (For Static Export)**
If you want to keep static export, you must add a `generateStaticParams` function to your `[id]/page.tsx`:

```ts
// app/resume/[id]/page.tsx

export async function generateStaticParams() {
  // Return an array of all possible params, e.g. [{ id: '1' }, { id: '2' }]
  // For now, you can return an empty array to avoid the error:
  return [];
}
```
But this means no dynamic resume pages will be generated unless you list all possible IDs.

---

## **What Should You Do?**

- If you want your resume pages to work dynamically (most common for dashboards, user content, etc.), **remove `output: 'export'` from your `next.config.js`**.
- If you are deploying as a static site and know all possible resume IDs at build time, implement `generateStaticParams`.

---

## **Summary Table**

| Use Case                | Solution                                      |
|-------------------------|-----------------------------------------------|
| Dynamic app (SSR/ISR)   | Remove `output: 'export'` from config         |
| Static export           | Add `generateStaticParams` to `[id]/page.tsx` |

---

**Let me know if you want me to show you the exact edit for your `next.config.js`!**

---

Your `[id]/page.tsx` file and route are set up correctly, but you are getting a 404.  
This usually means one of the following:

---

## 1. **URL Mismatch or Routing Issue**
- Make sure the URL you are visiting is `/resume/[some-id]` (where `[some-id]` is a real resume ID).
- If the URL is correct, the page should match the dynamic route.

## 2. **Resume Not Found**
- If the backend returns a 404 or error for the resume ID, your code calls `notFound()`, which triggers the 404 page.
- This can happen if:
  - The resume ID in the URL is wrong or does not exist in the database.
  - The backend API is not reachable or returns an error.

## 3. **API URL Issue**
- Your fetch uses:
  ```js
  fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/resumes/${id}`)
  ```
- Make sure `NEXT_PUBLIC_API_URL` is set and correct in your `.env.local`.

---

## **How to Debug**

1. **Check the URL in your browser.**
   - Is it `/resume/<real-id>`? (Not `/resume/undefined` or `/resume/`)

2. **Check the Network Tab in DevTools.**
   - Look for the request to `/api/resumes/<id>`.
   - What is the response status? (200, 404, 500)
   - What is the response body?

3. **Check the Backend Logs.**
   - Is there an error or "Resume not found" message?

---

## **What to Do Next**

- Confirm the URL is correct and contains a real resume ID.
- Check the network request and backend logs for errors.
- Make sure your backend GET `/api/resumes/:id` route is working and returns the resume for the logged-in user.

---

**If you provide:**
- The URL you are visiting,
- The network request/response for `/api/resumes/<id>`,
- Any backend error logs,

I can give you the exact fix!

---

Great! Here’s what to do next to pinpoint and fix the 404 issue:

---

### 1. **Check the URL**
- When you click "View," does the URL in your browser look like this?
  ```
  http://localhost:3000/resume/<some-id>
  ```
  - `<some-id>` should be a real MongoDB ObjectId (a long string of letters and numbers).
  - If it says `/resume/undefined` or `/resume/`, the ID is not being passed correctly from your dashboard.

---

### 2. **Check the Network Tab**
- Open your browser’s DevTools (F12) → Network tab.
- Click "View" on a resume.
- Look for a request to something like:
  ```
  http://localhost:5002/api/resumes/<some-id>
  ```
- What is the **status code**? (200, 404, 401, 500, etc.)
- What is the **response body**?

---

### 3. **Check Backend Logs**
- Look at your backend terminal window.
- Do you see any error or "Resume not found" message when you click "View"?

---

### 4. **If the ID is undefined**
- Check your dashboard code to make sure you are passing `resume._id` to the View/Edit links:
  ```jsx
  <Link href={`/resume/${resume._id}`}>View</Link>
  ```

---

### 5. **If the ID is correct but still 404**
- The resume may not exist for the current user, or there may be an auth issue.
- Make sure the backend GET `/api/resumes/:id` route is working and the resume exists in the database.

---

**Please reply with:**
- The exact URL you see in your browser when you click "View"
- The status code and response from the network request to `/api/resumes/<id>`
- Any error message in your backend terminal

With this info, I’ll give you the precise fix!