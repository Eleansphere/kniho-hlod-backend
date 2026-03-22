import { CoreEntity } from '@eleansphere/be-core';

export interface UserAttributes {
  username: string;
  password: string;
  email: string;
  role: string;
}

class User extends CoreEntity implements UserAttributes {
  public username!: string;
  public password!: string;
  public email!: string;
  public role!: string;
}

export default User;
