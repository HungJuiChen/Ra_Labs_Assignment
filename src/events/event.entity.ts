import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
  ManyToMany, JoinTable, Index,
} from 'typeorm';
import { User } from '../users/user.entity';

export enum EventStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

@Entity()
export class Event {
  /** INT AUTO_INCREMENT primary key */
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  /** MySQL ENUM('TODO','IN_PROGRESS','COMPLETED') */
  @Column({ type: 'enum', enum: EventStatus })
  status: EventStatus;

  /** Keep dates in UTC; MySQL DATETIME has no TZ info */
  @Index()
  @Column({ type: 'datetime' })
  startTime: Date;

  @Index()
  @Column({ type: 'datetime' })
  endTime: Date;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;

  /** Many-to-many pivot table: event_invitees */
  @ManyToMany(() => User, (user) => user.events, { cascade: true })
  @JoinTable({
    name: 'event_invitees',
    joinColumn: { name: 'event_id' },
    inverseJoinColumn: { name: 'user_id' },
  })
  invitees: User[];
}
