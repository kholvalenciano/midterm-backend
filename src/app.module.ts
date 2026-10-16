import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { ItemsModule } from './items/items.module';

@Module({
  imports: [DatabaseModule, UsersModule, CategoriesModule, ItemsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}