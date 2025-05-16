import HttpException from './http.exception';

class NotFoundException extends HttpException {
  constructor(resource: string = 'Resource') {
    super(404, `${resource} not found`, undefined, 'RESOURCE_NOT_FOUND');

    Object.setPrototypeOf(this, NotFoundException.prototype);
  }
}

export default NotFoundException;
