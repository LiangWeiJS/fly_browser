import { Module } from '@nestjs/common';
import { OnlineService } from './online.service';
import { OnlineController } from './online.controller';
import { ScriptListEntity } from './entities/scrip_list.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameListEntity } from './entities/game_list.entity';
import { UserEntity } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    ScriptListEntity,
    GameListEntity,
    UserEntity
  ])],
  controllers: [OnlineController],
  providers: [OnlineService],
})
export class OnlineModule {}
