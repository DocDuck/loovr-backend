import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './Base.entity';
import { BoardUser } from './BoardUser.entity';

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true }) keycloakId!: string;
  @Column({ unique: true }) email!: string;
  @Column() name!: string;
  @Column({ nullable: true }) avatarUrl?: string;
  @OneToMany(() => BoardUser, bu => bu.user) boardUsers!: BoardUser[];
}