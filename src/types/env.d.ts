declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_SPACEX_API_BASE_URL: string;
      NODE_ENV: 'development' | 'production' | 'test';
    }
  }
}

export {};
