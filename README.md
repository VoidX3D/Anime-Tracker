# MyAnimeTrack

MyAnimeTrack is a web application for tracking anime. It allows users to keep a record of the anime they have watched, are currently watching, or plan to watch. The application fetches data from various sources like Anilist, Kitsu, and MyAnimeList to provide comprehensive information about anime series.

## Tags

anime, tracker, anime tracker, myanimetrack, nextjs, react, typescript, tailwindcss, supabase, anilist, kitsu, myanimelist, framer-motion

## Features

- **Anime Tracking:** Keep track of your anime watching progress.
- **Comprehensive Data:** Fetches data from multiple sources to provide detailed information about anime.
- **Modern UI:** A clean and modern user interface built with Next.js, Tailwind CSS, and Framer Motion.
- **Database Integration:** Uses Supabase for database management.
- **Data Ingestion:** Scripts to ingest and process data from various anime websites.

## Technologies Used

- **Frontend:**
  - [Next.js](https://nextjs.org/)
  - [React](https://react.dev/)
  - [TypeScript](https://www.typescriptlang.org/)
  - [Tailwind CSS](https://tailwindcss.com/)
  - [Framer Motion](https://www.framer.com/motion/)
- **Database:**
  - [Supabase](https://supabase.com/)
- **Data Sources:**
  - [Anilist](https://anilist.co/)
  - [Kitsu](https://kitsu.io/)
  - [MyAnimeList](https://myanimelist.net/)
- **Tooling:**
  - [ESLint](https://eslint.org/)
  - [ts-node](https://typestrong.org/ts-node/)

## Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/MyAnimeTrack.git
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Set up your environment variables. Create a `.env.local` file and add the following:
    ```
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

## Usage

To run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Lints the codebase.
- `npm run ingest`: Ingests data using the `scripts/ingest-data.ts` script.

#### Other Scripts

The `scripts` directory contains various scripts for data management:

- `create_logs_table.sql`: SQL script to create a logs table.
- `final-extraction.ts`: TypeScript script for final data extraction.
- `final-parity.ts`: TypeScript script for final data parity checks.
- `ingest-data.ts`: TypeScript script to ingest data.
- `scrape-anilist.ts`: TypeScript script to scrape data from Anilist.
- `surgical-sync.ts`: TypeScript script for surgical data synchronization.
- `update_animes_table.sql`: SQL script to update the animes table.

## Data

The application uses data from Anilist, Kitsu, and MyAnimeList. The raw data is stored in the `data/raw` directory in JSON format.

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.