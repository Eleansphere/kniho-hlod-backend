import Loan from '../models/loan';
import { createCrudRouter } from '../utils/create-crud-router';
import { generateId } from '../utils/generate-id';

export default createCrudRouter({
  model: Loan,
  prefix: 'l',
  generateId,
  log: true
});