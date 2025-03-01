import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { Response } from 'express';
import { OnlineService } from './online.service';
import { CreateOnlineDto } from './dto/create-online.dto';
import { UpdateOnlineDto } from './dto/update-online.dto';
import {FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { GameListEntity } from './entities/game_list.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import * as argon2 from 'argon2';
import * as fs from 'fs';
import { AddScriptDto } from './dto/add-script';
import { ScriptListEntity } from './entities/scrip_list.entity';
import { createReadStream, existsSync } from 'fs';
@Controller('online')
export class OnlineController {
  constructor(
    private readonly onlineService: OnlineService,
    @InjectRepository(GameListEntity) private readonly gameListEntity: Repository<GameListEntity>,
    @InjectRepository(UserEntity) private readonly userEntity: Repository<UserEntity>,
    @InjectRepository(ScriptListEntity) private readonly scriptListEntity: Repository<ScriptListEntity>,


  ) {}
  //获取游戏列表
  @Post('gameList')
  async gameList() {
    const gameList=await this.gameListEntity.find()
    return gameList;
  }
  @Post('register')
  async create(@Body() createOnlineDto: CreateOnlineDto) {
    let res=await this.userEntity.findOneBy({userName:createOnlineDto.userName});
    if(res){
      return {errorMsg:'用户名已存在'};
    }
    const user={
      userName:createOnlineDto.userName,
      passWord:await argon2.hash(createOnlineDto.passWord),
      nickName:createOnlineDto.nickName,
      signature:await argon2.hash(createOnlineDto.userName+createOnlineDto.passWord)
    }
    try {
      let res=await this.userEntity.save(user);
      if(res){
        return {
          userName:res.userName,
          nickName:res.nickName,
          signature:res.signature
        };
      }
      return {errorMsg:'注册失败'};
    } catch (error) {
      return {errorMsg:'系统未知错误'};
    }
    
  }
  @Post('login')
  async login(@Body() createOnlineDto: CreateOnlineDto) {
    let user=await this.userEntity.findOneBy({userName:createOnlineDto.userName});
    if(user){
      const auth=await argon2.verify(user.passWord,createOnlineDto.passWord);
      if(auth){
        return {
          userName:user.userName,
          nickName:user.nickName,
          signature:user.signature
        };
      }else{
        return {errorMsg:'密码错误'};
      }
    }else{
      return {errorMsg:'用户不存在'};
    }
  }
  @Post('userInfo')
  async userInfo(@Body() createOnlineDto: CreateOnlineDto) {
    let user=await this.userEntity.findOneBy({userName:createOnlineDto.signature});
    if(user){
      return {
        userName:user.userName,
        nickName:user.nickName,
        signature:user.signature
      };
    }else{
      return {errorMsg:'用户不存在'};
    }
  }
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb)=>{
          const uploadPath = `./uploads/${req.body.gameTitle || 'default'}`; // 根据body中的uploadDir参数确定上传目录
          // 如果目录不存在则创建
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
          }
          cb(null, uploadPath);
        }, // 上传文件存储的目录
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`); // 生成唯一的文件名
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Body() body:AddScriptDto) {
    console.log('body', body);
    let user=await this.userEntity.findOneBy({signature
      :body.signature});
    if(!user){
      return '请先登录';
    }
    let script={
      userId:user.id,
      nickName:user.nickName,
      scriptName:body.scriptName,
      scriptDesc:body.scriptDesc,
      gameId:body.gameId,
      gameTitle:body.gameTitle,
      scriptPath:file.filename
    }
    let res=await this.scriptListEntity.save(script);
    if(res){
      return {
        successMeg:'上传成功',
      };
    }else{
      return {errorMsg:'上传失败'};
    }
  }
  @Post('download')
  async download(@Body() body, @Res() res: Response) {
    let user=await this.userEntity.findOneBy({signature
      :body.signature});
    if(!user){
      return '请先登录';
    }
    const filePath = join(__dirname, '../../', '/uploads/'+body.gameTitle, body.scriptPath);
    console.log('filePath', filePath);
    if (existsSync(filePath)) {
      res.download(filePath, (err) => {
        if (err) {
          res.status(500).send('Error downloading file');
        }
      });
    }else{
      res.status(404).json({ errorMsg: '文件不存在' });
    }
  }
}
