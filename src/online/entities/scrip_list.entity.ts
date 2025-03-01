import {Entity , Column ,PrimaryGeneratedColumn} from 'typeorm'
@Entity()
export class ScriptListEntity {
    @PrimaryGeneratedColumn()
    id: number
    @Column({ type: 'int', nullable: true })
    userId: number
    //用户昵称
    @Column({ type: 'varchar', length: 20 })
    nickName: string
    @Column({ type: 'varchar' })
    scriptName: string
    //描述
    @Column({ type: 'varchar', length: 200 })
    scriptDesc: string
    //游戏id
    @Column({ type: 'int' })
    gameId: number
    //游戏名称
    @Column({ type: 'varchar' })
    gameTitle: string
    //脚本地址
    @Column({ type: 'varchar' })
    scriptPath: string

    //创建时间
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

}
