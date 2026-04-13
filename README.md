# Poll 11 Local Development Guide

Follow these steps to set up and run Poll 11 on your local machine.

## Prerequisites

- **Node.js**: Version 18 or higher.
- **npm**: Usually comes with Node.js.
- **Supabase Account**: For the database and authentication.
- **Football-Data.org API Key**: For syncing match and player data.

## 1. Clone the Repository

If you haven't already, download or clone the project files to your local machine.

## 2. Install Dependencies

Open your terminal in the project root and run:

```bash
npm install
```

## 3. Configure Environment Variables

Create a `.env` file in the root directory. You can use `.env.example` as a template:

```bash
cp .env.example .env
```

Fill in the following variables in your `.env` file:

- `VITE_SUPABASE_URL`: Your Supabase Project URL.
- `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Key.
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase Service Role Key (required for syncing).
- `FOOTBALL_DATA_API_KEY`: Your API key from [football-data.org](https://www.football-data.org/).
- `SYNC_SECRET`: A secret string to protect the sync script.

## 4. Set Up Supabase

Follow the instructions in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) to create the necessary tables and policies in your Supabase project.

## 5. Sync Data

Before running the app, you need to populate your database with matches and players. Run the sync script:

```bash
npm run sync
```

*Note: The script respects rate limits, so it may take a minute to complete.*

## 6. Run the Development Server

Start the Vite development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000` (or the port specified in your terminal).

## 7. Build for Production

To create a production build:

```bash
npm run build
```

The output will be in the `dist/` directory.

---

## Project Structure

- `src/`: React application source code.
- `scripts/`: Backend scripts (like `sync.js`).
- `public/`: Static assets.
- `components.json`: shadcn/ui configuration.
