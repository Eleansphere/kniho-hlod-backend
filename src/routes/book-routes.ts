import { Book } from '../models/book';
import { generateId } from '../utils/generate-id';
import { createCrudRouter } from '../utils/create-crud-router';

export default createCrudRouter({
  model: Book,
  prefix: 'b',
  generateId,
  log: true
});