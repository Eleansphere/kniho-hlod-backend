import { CoreEntity } from 'be-core';

export interface ProfileImageAttributes {
  name: string;
  avatar: Buffer;
  user: string;
}

export class ProfileImage extends CoreEntity {
  public name!: string;
  public avatar!: Buffer;
  public user!: string;
}
