import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@Inject('DATA_SOURCE') private readonly db: any) {}

  async create(createUserDto: CreateUserDto) {
    const { username, password } = createUserDto as any;
    if (!username || !password) {
      throw new BadRequestException('Username and password are required');
    }

    const [result]: any = await this.db.query(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, password],
    );

    return { id: result.insertId, username, message: 'User created successfully' };
  }

  async findAll() {
    const [rows]: any = await this.db.query('SELECT id, username, created_at FROM users');
    return rows;
  }

  async findOne(id: number) {
    const [rows]: any = await this.db.query(
      'SELECT id, username, created_at FROM users WHERE id = ?',
      [id],
    );
    if (rows.length === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return rows[0];
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { username, password } = updateUserDto as any;
    await this.findOne(id);

    await this.db.query(
      'UPDATE users SET username = COALESCE(?, username), password = COALESCE(?, password) WHERE id = ?',
      [username || null, password || null, id],
    );

    return { message: `User with id ${id} updated successfully` };
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.db.query('DELETE FROM users WHERE id = ?', [id]);
    return { message: `User with id ${id} deleted successfully` };
  }
}