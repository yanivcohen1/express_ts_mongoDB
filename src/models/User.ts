import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';
import { UserRole } from '../config/env';

@Entity({ collection: 'users' })
export class User {
  @PrimaryKey()
  _id!: ObjectId;

  @Property({ type: 'string' })
  @Unique()
  username!: string;

  @Property({ type: 'string' })
  password!: string;

  @Property({ type: 'string' })
  role!: UserRole;
}
