/**
 * Re-export the shared User model.
 * This avoids directly coupling the auth module to other resource modules.
 */
import UserModel from '@/shared/models/user.model';
export default UserModel;
