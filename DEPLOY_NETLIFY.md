# Deploy to Netlify

This project is ready for Netlify.

## What Netlify publishes

Netlify publishes only the `public` folder:

- `public/index.html`
- `public/styles.css`
- `public/app.js`
- `public/templateDocx.js`

The Groq proxy runs as a Netlify Function:

- `netlify/functions/suggest.js`
- `netlify/functions/summary.js`

Do not upload `.env` to Netlify. Add the key in Netlify's environment variables UI.

## Required Netlify environment variables

Add these variables in Netlify:

```txt
GROQ_API_KEY=your Groq key
GROQ_MODEL=openai/gpt-oss-20b
```

The variable scope must include Functions.

## Recommended deploy path

Use Git deploy:

1. Create a private GitHub repository.
2. Upload this project, excluding `.env`.
3. In Netlify, choose "Add new site" -> "Import an existing project".
4. Select the repository.
5. Netlify should read `netlify.toml` automatically.
6. Add the environment variables.
7. Deploy.

After deploy, the app calls `/api/suggest` and `/api/summary`, and Netlify rewrites them to the serverless functions.
