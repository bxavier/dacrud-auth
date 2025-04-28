import HealthController from './health/health.controller';
import UserController from './user/user.controller';
import AuthController from './auth';

export default [
  new HealthController(),
  new UserController(),
  new AuthController(),
  // Add future controllers here
];
