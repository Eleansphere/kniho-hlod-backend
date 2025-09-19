import Loan from '../models/Loan';
import { createCrudRouter } from '../utils/create-crud-router';

export default createCrudRouter({model: Loan});