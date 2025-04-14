/**
 * Base exception class for all API errors
 */
class ApiException extends Error {
  public status: number;
  public message: string;
  public errors?: any;
  public code?: string;

  constructor(status: number, message: string, errors?: any, code?: string) {
    super(message);
    this.status = status;
    this.message = message;
    this.errors = errors;
    this.code = code;

    Object.setPrototypeOf(this, ApiException.prototype);
  }
}

export default ApiException;
