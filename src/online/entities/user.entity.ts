import {Entity , Column ,PrimaryGeneratedColumn} from 'typeorm'
@Entity()
//账户列表
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number
    //用户名  不能重复
    @Column({ type: 'varchar', length: 20, unique: true })
    userName: string
    @Column({ type: 'varchar', length: 97})
    passWord: string
    @Column({ type: 'varchar', length: 10, unique: true  })
    nickName: string
    @Column({ type: 'varchar', length: 97, unique: true  })
    signature: string

    //创建时间
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

}
