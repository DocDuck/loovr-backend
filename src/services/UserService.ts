import { FindOptionsWhere } from 'typeorm';
import { User } from '../entities/User.entity';
import { UploadedFile } from 'express-fileupload';
import path from 'path';
import fs from 'fs';
import { AppDataSource } from '../config/data-source';

type UpdatedUser = Pick<Partial<User>, 'name' | 'email' | 'avatarUrl'>

export class UserService {
  private userRepo = AppDataSource.getRepository(User);
  private uploadPath = path.join(__dirname, '../../uploads');

  async getProfile(userId: string | undefined) {
    const user = await this.userRepo.findOne({
      where: { id: userId } as FindOptionsWhere<User>
    });
    if (!user) throw new Error('User not found');
    return user;
  }

  async updateProfile(userId: string | undefined, data: UpdatedUser) {
  const allowedFields = ['name', 'email', 'avatarUrl'] as const;
  const updates = Object.entries(data).reduce((acc, [key, value]) => {
    if (allowedFields.includes(key as keyof UpdatedUser)) {
      acc[key as keyof UpdatedUser] = value;
    }
    return acc;
  }, {} as UpdatedUser);
    if (Object.keys(updates).length === 0) {
      throw new Error('No valid fields to update');
    }

    await this.userRepo.update(
      { id: userId } as FindOptionsWhere<User>,
      updates
    );
    return this.getProfile(userId);
  }

  async updateAvatar(userId: string | undefined, file: UploadedFile) {
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }

    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error('Invalid file type');
    }

    const extension = path.extname(file.name);
    const filename = `avatar-${userId}-${Date.now()}${extension}`;
    const filePath = path.join(this.uploadPath, filename);

    await file.mv(filePath);

    await this.userRepo.update(
      { id: userId } as FindOptionsWhere<User>,
      { avatarUrl: `/uploads/${filename}` }
    );

    return this.getProfile(userId);
  }
}