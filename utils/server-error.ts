export class ServerError extends Error {
  public statusCode: number;
  // public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    // this.isOperational = true; // marks errors we expect (not bugs)

    // Fix prototype chain (important for TS)
    Object.setPrototypeOf(this, new.target.prototype);

    // cleaner error stack trace (removes constructor)
    Error.captureStackTrace(this);
  }
}
