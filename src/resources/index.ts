import HealthController from './health/health.controller';
import UserController from './user/user.controller';

export default [
  new HealthController(),
  new UserController(),
  // Add future controllers here
];
