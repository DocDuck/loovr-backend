import { Entity, ManyToOne, Column } from 'typeorm';
import { User } from './User.entity';
import { Board } from './Board.entity';
import { UserRole } from '../enums/UserRole.enum';
import { BaseEntity } from './Base.entity';

@Entity()
export class BoardUser extends BaseEntity {
  // Связь с пользователем
  @ManyToOne(() => User, (user) => user.boardUsers, { onDelete: 'CASCADE' })
  user!: User;

  // Связь с доской
  @ManyToOne(() => Board, (board) => board.boardUsers, { onDelete: 'CASCADE' })
  board!: Board;

  // Роль пользователя для конкретной доски
  @Column({ 
    type: 'enum', 
    enum: UserRole, 
    default: UserRole.VIEWER 
  })
  role!: UserRole;
}