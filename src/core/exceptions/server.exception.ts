import HttpException from './http.exception';

class ServerException extends HttpException {
  constructor(message: string = 'Internal server error', errors?: any) {
    super(500, message, errors, 'SERVER_ERROR');

    Object.setPrototypeOf(this, ServerException.prototype);
  }
}

export default ServerException;
