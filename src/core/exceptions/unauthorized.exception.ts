import HttpException from './http.exception';

class UnauthorizedException extends HttpException {
  constructor(message: string = 'Unauthorized access') {
    super(401, message, undefined, 'UNAUTHORIZED');

    Object.setPrototypeOf(this, UnauthorizedException.prototype);
  }
}

export default UnauthorizedException;
