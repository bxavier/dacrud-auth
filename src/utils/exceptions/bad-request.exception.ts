import HttpException from './http.exception';

/**
 * Exception for bad request errors
 */
class BadRequestException extends HttpException {
  constructor(message: string = 'Bad Request', errors?: any) {
    super(400, message, errors, 'BAD_REQUEST');

    Object.setPrototypeOf(this, BadRequestException.prototype);
  }
}

export default BadRequestException;
