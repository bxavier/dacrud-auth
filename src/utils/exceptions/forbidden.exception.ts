import HttpException from './http.exception';

/**
 * Exception for forbidden access
 */
class ForbiddenException extends HttpException {
  constructor(message: string = 'Access forbidden') {
    super(403, message, undefined, 'FORBIDDEN');

    Object.setPrototypeOf(this, ForbiddenException.prototype);
  }
}

export default ForbiddenException;
