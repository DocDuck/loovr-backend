import { Entity, OneToMany, Column } from 'typeorm';
import { BoardUser } from './BoardUser.entity';
import { BaseEntity } from './Base.entity';
import { ExcalidrawInitialDataState } from "@excalidraw/excalidraw/types/types";

@Entity()
export class Board extends BaseEntity {
  @Column()
  name!: string;

  @Column()
  img!: string;

  @Column('jsonb')
  owner!: {
    name: string,
    avatar: string
  };

  @OneToMany(() => BoardUser, (boardUser) => boardUser.board)
  boardUsers?: BoardUser[];

  @Column('jsonb', { default: { elements: [], appState: {} }})
  initialData!: ExcalidrawInitialDataState;
}