## Testing locally

This project expects you to set up a `.env.testing` file that contains credentials for a test database. **Do not** point `.env.testing` at a production database. Use a dedicated test database (for example, a separate Supabase DB) to run the test suite.

Quick steps:

1. Copy `.env.testing.example` to `.env.testing` and fill it with your test DB credentials.

2. Run tests with the helper composer script (this will copy `.env` to `.env.testing` if the file doesn't exist, migrate the testing DB, and run tests):

    ```powershell
    cd backend
    composer test:local
    ```

Notes:

-   The `test:local` script will call `php artisan migrate --env=testing --force` — be sure the DB referenced in `.env.testing` is a disposable test DB.
-   If you prefer sqlite in-memory testing, set `DB_CONNECTION=sqlite` and `DB_DATABASE=:memory:` in `.env.testing`.
