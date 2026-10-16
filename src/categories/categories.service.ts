import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(@Inject('DATA_SOURCE') private readonly db: any) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const { user_id, name } = createCategoryDto as any;
    if (!user_id || !name) {
      throw new BadRequestException('user_id and name are required');
    }

    const [result]: any = await this.db.query(
      'INSERT INTO categories (user_id, name) VALUES (?, ?)',
      [user_id, name],
    );

    return { id: result.insertId, user_id, name, message: 'Category created successfully' };
  }

  async findAll() {
    const [rows]: any = await this.db.query('SELECT * FROM categories');
    return rows;
  }

  async findOne(id: number) {
    const [rows]: any = await this.db.query(
      'SELECT * FROM categories WHERE id = ?',
      [id],
    );
    if (rows.length === 0) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    return rows[0];
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const { name } = updateCategoryDto as any;
    await this.findOne(id);

    await this.db.query(
      'UPDATE categories SET name = COALESCE(?, name) WHERE id = ?',
      [name || null, id],
    );

    return { message: `Category with id ${id} updated successfully` };
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.db.query('DELETE FROM categories WHERE id = ?', [id]);
    return { message: `Category with id ${id} deleted successfully` };
  }
}