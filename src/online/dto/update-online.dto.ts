import { PartialType } from '@nestjs/mapped-types';
import { CreateOnlineDto } from './create-online.dto';

export class UpdateOnlineDto extends PartialType(CreateOnlineDto) {}
