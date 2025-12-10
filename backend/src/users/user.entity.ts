import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  firebaseUid!: string;

  @Column()
  email!: string;

  @Column({ nullable: false })
  firstName!: string;

  @Column({ nullable: true })
  middleName!: string;

  @Column({ nullable: false })
  lastName!: string;

  @Column({ nullable: true })
  avatar!: string;
}
