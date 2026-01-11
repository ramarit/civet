# Civet - Landing Page Builder for Professional Services

Civet lets professional services create simple landing pages with multi-step intake forms, automatically score leads, and manage follow-up - all in one tool.

## Features

- **Simple Page Builder**: Create professional landing pages in minutes
- **Multi-Step Forms**: Build custom intake forms with multiple steps
- **Lead Scoring**: Automatically score leads based on their responses
- **Lead Management**: View leads, add notes, and track status
- **Built-in Email**: Send follow-up emails directly from the dashboard
- **Analytics**: Track page views, form submissions, and conversion rates

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Directus 10.x (headless CMS with auto-generated APIs)
- **Database**: PostgreSQL (Supabase)
- **Email**: Resend API
- **Analytics**: PostHog
- **Hosting**: Vercel (frontend), Render (backend), Supabase (database)

## Prerequisites

- Node.js 18+ installed
- npm or yarn installed
- Git installed
- GitHub account (for deployment)
- Accounts for: Supabase, Render, Vercel, Resend, PostHog (all have free tiers)

## Local Development Setup

### 1. Clone and Install

```bash
cd /Users/ryanamarit/civet
npm install
```

### 2. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values (see deployment sections below for how to get these).

### 3. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the app.

## Production Deployment

### Step 1: Set Up PostgreSQL Database (Supabase)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click "New Project"
3. Choose a name, database password, and region
4. Wait for the project to be created (~2 minutes)
5. Go to **Project Settings** > **Database**
6. Copy the **Connection String** (URI format)
7. Save this for the next step (replace `[YOUR-PASSWORD]` with your database password)

### Step 2: Deploy Directus Backend (Render)

1. Go to [render.com](https://render.com) and create a free account
2. Click **New** > **Web Service**
3. Choose **Deploy from Docker Image**
4. Image URL: `directus/directus:10`
5. Name: `civet-directus` (or your preferred name)
6. Instance Type: **Free** (will sleep after 15 min of inactivity)
7. Add Environment Variables:

```
KEY=your-random-secret-key-here
SECRET=your-random-secret-here

DB_CLIENT=pg
DB_HOST=db.xxx.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USER=postgres
DB_PASSWORD=your-supabase-password

ADMIN_EMAIL=your@email.com
ADMIN_PASSWORD=your-secure-password

PUBLIC_URL=https://your-app.onrender.com
CORS_ENABLED=true
CORS_ORIGIN=true
```

8. Click **Create Web Service**
9. Wait for deployment (~5 minutes)
10. Copy your Render URL (e.g., `https://civet-directus.onrender.com`)

### Step 3: Configure Directus Collections

1. Visit your Directus URL: `https://your-app.onrender.com`
2. Log in with your admin credentials
3. Go to **Settings** > **Data Model**
4. Create the following collections (click **Create Collection** for each):

#### Collection: users
- **id**: UUID (Primary Key, auto-generated)
- **email**: String (unique, required)
- **password**: Hash (required, hidden)
- **name**: String (required)
- **subdomain**: String (unique, required)
- **date_created**: Timestamp (auto-generated)

#### Collection: pages
- **id**: UUID (Primary Key)
- **user_id**: UUID (Many-to-One relationship to users)
- **subdomain**: String (unique, required)
- **headline**: String (required)
- **description**: Text (required)
- **cta_text**: String (default: "Get Started")
- **form_id**: UUID (Many-to-One relationship to forms)
- **published**: Boolean (default: false)
- **date_created**: Timestamp

#### Collection: forms
- **id**: UUID (Primary Key)
- **user_id**: UUID (Many-to-One relationship to users)
- **name**: String (required)
- **steps**: JSON (required)
- **scoring_rules**: JSON
- **date_created**: Timestamp

#### Collection: leads
- **id**: UUID (Primary Key)
- **user_id**: UUID (Many-to-One relationship to users)
- **page_id**: UUID (Many-to-One relationship to pages)
- **form_id**: UUID (Many-to-One relationship to forms)
- **responses**: JSON (required)
- **score**: Integer (default: 0)
- **status**: String (default: "new")
- **date_created**: Timestamp
- **date_updated**: Timestamp

#### Collection: notes
- **id**: UUID (Primary Key)
- **lead_id**: UUID (Many-to-One relationship to leads)
- **user_id**: UUID (Many-to-One relationship to users)
- **content**: Text (required)
- **date_created**: Timestamp

#### Collection: emails
- **id**: UUID (Primary Key)
- **lead_id**: UUID (Many-to-One relationship to leads)
- **user_id**: UUID (Many-to-One relationship to users)
- **subject**: String (required)
- **body**: Text (required)
- **sent_at**: Timestamp (required)

5. **Set Permissions**: For each collection, go to **Settings** > **Access Control** > **Public** role:
   - Set all collections to **No Access** for public
   - Users can only access their own data (filter by user_id)

### Step 4: Get Resend API Key

1. Go to [resend.com](https://resend.com) and create a free account
2. Go to **API Keys** > **Create API Key**
3. Name: `civet-production`
4. Copy the API key (starts with `re_`)
5. Add to your `.env.local`

### Step 5: Get PostHog API Key

1. Go to [posthog.com](https://posthog.com) and create a free account
2. Go to **Project Settings**
3. Copy your **Project API Key** (starts with `phc_`)
4. Add to your `.env.local`

### Step 6: Update .env.local

Update your `.env.local` file with all the values from above:

```env
DIRECTUS_URL=https://your-app.onrender.com
NEXT_PUBLIC_DIRECTUS_URL=https://your-app.onrender.com

RESEND_API_KEY=re_xxxxxxxxxxxxx

NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxxxxxxxxxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 7: Deploy Frontend to Vercel

1. Push your code to GitHub:

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. Go to [vercel.com](https://vercel.com) and create a free account
3. Click **Add New** > **Project**
4. Import your GitHub repository
5. Framework Preset: **Next.js** (auto-detected)
6. Add Environment Variables (same as your `.env.local`)
7. Click **Deploy**
8. Wait for deployment (~2 minutes)
9. Copy your Vercel URL (e.g., `https://civet.vercel.app`)
10. Update `NEXT_PUBLIC_APP_URL` in Vercel environment variables

## Testing Locally

1. Start the dev server:
```bash
npm run dev
```

2. Visit `http://localhost:3000`
3. Click **Sign Up** and create an account
4. Create a form in the dashboard
5. Create a landing page
6. Visit `http://localhost:3000/your-subdomain` to see your public page

### Seed Mock Data for Inbox

To test the Inbox feature with realistic mock data:

```bash
# Seed 15 mock messages (6 unread, 3 contacted, 2 qualified, 4 archived)
npm run seed:inbox
```

This will:
- Create realistic contact inquiries with names, emails, phone numbers, and messages
- Backdate timestamps for a realistic timeline (5 min ago to 4 weeks ago)
- Include edge cases (long names, no names, long messages)
- Automatically create a test page and form if needed

To clean up the mock data:

```bash
# Delete all messages for the test user
npm run clean:inbox
```

**Note**: The seed script requires admin credentials in your `.env.local`:
- `DIRECTUS_ADMIN_EMAIL`
- `DIRECTUS_ADMIN_PASSWORD`

## Project Structure

```
civet/
├── app/
│   ├── (auth)/               # Authentication pages
│   │   ├── login/
│   │   └── signup/
│   ├── dashboard/            # Protected dashboard
│   │   ├── pages/           # Page management
│   │   ├── forms/           # Form builder
│   │   ├── leads/           # Lead management
│   │   └── analytics/       # Analytics
│   ├── [subdomain]/         # Public landing pages
│   ├── api/                 # API routes
│   │   ├── leads/          # Form submissions
│   │   └── emails/         # Send emails
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Marketing homepage
├── components/              # Reusable components
├── lib/
│   ├── directus.ts         # Directus SDK client
│   ├── auth.ts             # Auth helpers
│   ├── types.ts            # TypeScript types
│   └── utils.ts            # Utility functions
└── .env.local              # Environment variables (git ignored)
```

## Key Concepts

### Data Isolation (CRITICAL)
Every collection has `user_id` to ensure users only see their own data. Directus permissions enforce this with filters like `user_id._eq.$CURRENT_USER.id`.

### Form Configuration
Forms are stored as JSON with this structure:
```json
{
  "steps": [
    {
      "id": "step-1",
      "title": "Contact Info",
      "fields": [
        {
          "id": "name",
          "type": "text",
          "label": "Full Name",
          "required": true
        }
      ]
    }
  ]
}
```

### Lead Scoring
Scoring rules are JSON arrays:
```json
[
  {
    "field": "case_type",
    "operator": "equals",
    "value": "Personal Injury",
    "points": 15
  }
]
```

## Common Issues

### Directus Returns 401 Unauthorized
- Check that your Directus URL is correct in `.env.local`
- Make sure you're logged in (check browser cookies)
- Verify permissions in Directus admin panel

### Forms Not Submitting
- Check browser console for errors
- Verify API routes are working (`/api/leads`)
- Check Directus is running (may be sleeping on free tier)

### Can't Create User Account
- Verify Directus is running
- Check that `users` collection exists
- Verify CORS is enabled in Directus

## Next Steps

After getting the MVP running:

1. Implement the form builder UI (drag-and-drop fields)
2. Add real-time analytics with PostHog
3. Implement email sending with Resend
4. Add file uploads for lead documents
5. Build the scoring rules UI
6. Add team collaboration features
7. Implement custom domains

## Support

For issues or questions:
- Check the [Issues](https://github.com/yourusername/civet/issues) page
- Review Directus docs: https://docs.directus.io
- Review Next.js docs: https://nextjs.org/docs

## License

MIT License - feel free to use this project as a starting point for your own SaaS!
