import {Entity , Column ,PrimaryGeneratedColumn} from 'typeorm'
@Entity()
//游戏列表
export class GameListEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'varchar', length: 20, nullable: true })
    userName: string
    //描述
    @Column({ type: 'varchar', length: 200, nullable: true })
    desc: string
    @Column({ type: 'varchar' })
    title: string

    //创建时间
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

}
