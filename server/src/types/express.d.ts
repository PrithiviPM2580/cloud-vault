declare global {
  namespace Express {
    interface Request {
      session?: {
        user: {
          id: string;
        };
      };
    }
  }
}

export {};
