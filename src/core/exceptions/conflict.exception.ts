import HttpException from './http.exception';

class ConflictException extends HttpException {
  constructor(resource: string = 'Resource') {
    super(409, `${resource} already exists`, undefined, 'RESOURCE_CONFLICT');

    Object.setPrototypeOf(this, ConflictException.prototype);
  }
}

export default ConflictException;
