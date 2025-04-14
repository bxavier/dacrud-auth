import ApiException from './api.exception';

/**
 * General HTTP exception
 */
class HttpException extends ApiException {
  constructor(status: number, message: string, errors?: any, code?: string) {
    super(status, message, errors, code);

    Object.setPrototypeOf(this, HttpException.prototype);
  }
}

export default HttpException;
