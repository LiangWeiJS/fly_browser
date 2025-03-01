import { Injectable } from '@nestjs/common';
import { CreateOnlineDto } from './dto/create-online.dto';
import { UpdateOnlineDto } from './dto/update-online.dto';

@Injectable()
export class OnlineService {
  create(createOnlineDto: CreateOnlineDto) {
    return 'This action adds a new online';
  }

  findAll() {
    return `This action returns all online`;
  }

  findOne(id: number) {
    return `This action returns a #${id} online`;
  }

  update(id: number, updateOnlineDto: UpdateOnlineDto) {
    return `This action updates a #${id} online`;
  }

  remove(id: number) {
    return `This action removes a #${id} online`;
  }
}
