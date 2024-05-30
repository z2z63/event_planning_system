declare namespace NodeJS {
  interface ProcessEnv {
    SECRET: string;
    DATABASE_URL: string;
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: string;
    RECAPTCHA_SECRET_KEY: string;
  }
}
