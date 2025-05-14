import HttpException from './http.exception';

class ValidationException extends HttpException {
  constructor(errors: any) {
    super(400, 'Validation error', errors, 'VALIDATION_ERROR');

    Object.setPrototypeOf(this, ValidationException.prototype);
  }
}

export default ValidationException;
