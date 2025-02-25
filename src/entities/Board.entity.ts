import { Entity, OneToMany, Column } from 'typeorm';
import { BoardUser } from './BoardUser.entity';
import { BaseEntity } from './Base.entity';

@Entity()
export class Board extends BaseEntity {
  @Column('jsonb')
  data!: Record<string, any>;

  @Column()
  name!: string;

  @OneToMany(() => BoardUser, (boardUser) => boardUser.board)
  boardUsers!: BoardUser[];
}