import { FindOptionsWhere } from 'typeorm';
import { Board, User, BoardUser } from '../entities';
import { UserRole } from '../enums/UserRole.enum'
import { AppDataSource } from '../config/data-source';

export class BoardService {
  private boardRepo = AppDataSource.getRepository(Board);
  private userRepo = AppDataSource.getRepository(User);
  private boardUserRepo = AppDataSource.getRepository(BoardUser);

  async createBoard(data: Partial<Board>) {
    // const user = await this.userRepo.findOne({ 
    //   where: { id: userId } as FindOptionsWhere<User>
    // });
    // if (!user) throw new Error('User not found');
    const board = this.boardRepo.create(data);
    const savedBoard = await this.boardRepo.save(board);
    // await this.boardUserRepo.save({
    //   user,
    //   board: savedBoard,
    //   role: UserRole.ADMIN
    // });
    return savedBoard;
  }

  async getBoard(boardId: string) {
    const board = await this.boardRepo.findOne({
      where: { id: boardId } as FindOptionsWhere<Board>,
      relations: ['boardUsers', 'boardUsers.user']
    });
    if (!board) throw new Error('Board not found');
    return board;
  }

  async updateBoard(boardId: string, userId: string | undefined, data: Partial<Board>) {
    await this.checkPermission(userId, boardId, UserRole.EDITOR);
    
    await this.boardRepo.update(
      { id: boardId } as FindOptionsWhere<Board>,
      { ...data, updatedAt: new Date() }
    );
    return this.getBoard(boardId);
  }

  async deleteBoard(boardId: string, userId: string | undefined) {
    await this.checkPermission(userId, boardId, UserRole.ADMIN);
    await this.boardRepo.softDelete(boardId);
    return { message: 'Board deleted' };
  }

  //async listBoards(userId: string | undefined, page: number = 1, limit: number = 10) {
    // const [items, count] = await this.boardUserRepo.findAndCount({
    //   where: { user: { id: userId } } as FindOptionsWhere<BoardUser>,
    //   relations: ['board'],
    //   skip: (page - 1) * limit,
    //   take: limit,
  // });
  async listBoards(page: number = 1, limit: number = 10) {
    const [items, count] = await this.boardRepo.findAndCount({
      // TODO вернуть комменченое после того как с юзером и кейклоком разберемся
      // where: { user: { id: userId } } as FindOptionsWhere<BoardUser>,
      // relations: ['board'],
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      //data: items.map(bu => bu.board),
      data: items,
      meta: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    };
  }

  async shareBoard(boardId: string, userId: string | undefined, targetUserId: string, role: UserRole) {
    await this.checkPermission(userId, boardId, UserRole.ADMIN);
    
    const [board, user] = await Promise.all([
      this.boardRepo.findOne({ where: { id: boardId } }),
      this.userRepo.findOne({ where: { id: targetUserId } })
    ]);

    if (!board || !user) throw new Error('Board or User not found');

    const existing = await this.boardUserRepo.findOne({
      where: {
        board: { id: boardId },
        user: { id: targetUserId }
      }
    });

    if (existing) throw new Error('User already has access');

    return this.boardUserRepo.save({
      board,
      user,
      role
    });
  }

  private async checkPermission(userId: string | undefined, boardId: string, requiredRole: UserRole) {
    const permission = await this.boardUserRepo.findOne({
      where: {
        user: { id: userId },
        board: { id: boardId }
      } as FindOptionsWhere<BoardUser>
    });

    const rolePriority = {
      [UserRole.VIEWER]: 0,
      [UserRole.EDITOR]: 1,
      [UserRole.ADMIN]: 2
    };

    if (!permission || rolePriority[permission.role] < rolePriority[requiredRole]) {
      throw new Error('Permission denied');
    }
  }
}