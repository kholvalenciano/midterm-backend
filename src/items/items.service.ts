import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class ItemsService {
  constructor(@Inject('DATA_SOURCE') private readonly db: any) {}

  async create(createItemDto: CreateItemDto) {
    const { category_id, name, status } = createItemDto as any;
    if (!category_id || !name) {
      throw new BadRequestException('category_id and name are required');
    }

    const itemStatus = status || 'pending';
    const [result]: any = await this.db.query(
      'INSERT INTO items (category_id, name, status) VALUES (?, ?, ?)',
      [category_id, name, itemStatus],
    );

    return {
      id: result.insertId,
      category_id,
      name,
      status: itemStatus,
      message: 'Item created successfully',
    };
  }

  async findAll() {
    const [rows]: any = await this.db.query('SELECT * FROM items');
    return rows;
  }

  async findOne(id: number) {
    const [rows]: any = await this.db.query(
      'SELECT * FROM items WHERE id = ?',
      [id],
    );
    if (rows.length === 0) {
      throw new NotFoundException(`Item with id ${id} not found`);
    }
    return rows[0];
  }

  async update(id: number, updateItemDto: UpdateItemDto) {
    const { name, status } = updateItemDto as any;
    await this.findOne(id);

    await this.db.query(
      'UPDATE items SET name = COALESCE(?, name), status = COALESCE(?, status) WHERE id = ?',
      [name || null, status || null, id],
    );

    return { message: `Item with id ${id} updated successfully` };
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.db.query('DELETE FROM items WHERE id = ?', [id]);
    return { message: `Item with id ${id} deleted successfully` };
  }
}