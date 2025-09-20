import { Book } from '../models/Book';
import { generateId } from '../utils/generateId';
import { createCrudRouter } from '../utils/create-crud-router';

export default createCrudRouter({
  model: Book,
  prefix: 'b',
  generateId,
  log: true
});