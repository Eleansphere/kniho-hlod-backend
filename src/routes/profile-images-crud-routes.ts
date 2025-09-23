import { ProfileImage } from '../models/profile-images';
import { createCrudRouter } from '../utils/create-crud-router';
import { generateId } from '../utils/generate-id';

export default createCrudRouter({
  model: ProfileImage,
  prefix: 'f',
  generateId,
  log: true,
});
