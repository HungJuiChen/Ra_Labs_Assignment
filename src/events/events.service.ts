import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event, EventStatus } from './event.entity';
import { Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { User } from '../users/user.entity';
import { In } from 'typeorm';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(dto: CreateEventDto): Promise<Event> {
    const invitees = await this.userRepository.findBy({
      id: In(dto.invitees),
    });

    const event = this.eventRepository.create({
      ...dto,
      startTime: new Date(dto.startTime),
      endTime: new Date(dto.endTime),
      invitees,
    });

    return this.eventRepository.save(event);
  }

  async findById(id: number): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['invitees'],
    });
    if (!event) throw new NotFoundException(`Event ID ${id} not found`);
    return event;
  }

  async delete(id: number): Promise<void> {
    const result = await this.eventRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Event ID ${id} not found`);
    }
  }

  async mergeAll(userId: number): Promise<Event[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['events'],
    });
    if (!user) throw new NotFoundException(`User ID ${userId} not found`);

    const events = user.events.sort((a, b) =>
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
    );

    const mergedEvents: Event[] = [];
    let current = null;

    for (const event of events) {
      if (!current) {
        current = { ...event };
        current.invitees = [...event.invitees];
        continue;
      }

      const currentEnd = new Date(current.endTime).getTime();
      const eventStart = new Date(event.startTime).getTime();

      if (eventStart <= currentEnd) {
        // Merge logic
        current.endTime = new Date(
          Math.max(new Date(current.endTime).getTime(), new Date(event.endTime).getTime()),
        );

        current.title += ' | ' + event.title;
        current.description = (current.description ?? '') + ' ' + (event.description ?? '');
        current.status = this.mergeStatus(current.status, event.status);
        current.invitees = Array.from(
          new Map(
            [...current.invitees, ...event.invitees].map((user) => [user.id, user]),
          ).values(),
        );

        // Delete old event
        await this.eventRepository.delete(event.id);
      } else {
        // Save current and move to next
        const saved = await this.eventRepository.save(current);
        mergedEvents.push(saved);
        current = { ...event };
        current.invitees = [...event.invitees];
      }
    }

    if (current) {
      const saved = await this.eventRepository.save(current);
      mergedEvents.push(saved);
    }

    // Update user’s events
    user.events = mergedEvents;
    await this.userRepository.save(user);

    return mergedEvents;
  }

  private mergeStatus(a: EventStatus, b: EventStatus): EventStatus {
    const order = {
      TODO: 0,
      IN_PROGRESS: 1,
      COMPLETED: 2,
    };
    return order[a] < order[b] ? a : b;
  }
}

