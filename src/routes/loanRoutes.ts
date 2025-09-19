import Loan from '../models/Loan';
import { createCrudRouter } from '../utils/create-crud-router';
import { generateId } from '../utils/generateId';

export default createCrudRouter({
  model: Loan,
  prefix: 'l',
  generateId,
  log: true
});