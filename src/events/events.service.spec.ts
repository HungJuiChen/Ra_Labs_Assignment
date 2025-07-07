import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { Event, EventStatus } from './event.entity';
import { User } from '../users/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';

/* ---------- helpers ---------- */
const deleteOk: DeleteResult = { raw: {}, affected: 1 };
const deleteZero: DeleteResult = { raw: {}, affected: 0 };

const mockEventRepo = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
});

const mockUserRepo = () => ({
  findBy: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
});

describe('EventsService', () => {
  let service: EventsService;
  let eventRepo: jest.Mocked<Repository<Event>>;
  let userRepo: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        { provide: getRepositoryToken(Event), useFactory: mockEventRepo },
        { provide: getRepositoryToken(User), useFactory: mockUserRepo },
      ],
    }).compile();

    service  = module.get(EventsService);
    eventRepo = module.get(getRepositoryToken(Event));
    userRepo  = module.get(getRepositoryToken(User));
  });

  it('creates an event', async () => {
    const dto = {
      title: 'T',
      description: 'D',
      status: EventStatus.TODO,
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      invitees: [1],
    };

    const user = { id: 1 } as User;
    const saved = {
      id: 99,
      ...dto,
      startTime: new Date(dto.startTime),
      endTime:  new Date(dto.endTime),
      createdAt: new Date(),
      updatedAt: new Date(),
      invitees: [user],
    } as unknown as Event;

    userRepo.findBy.mockResolvedValue([user]);
    eventRepo.create.mockReturnValue(saved);
    eventRepo.save.mockResolvedValue(saved);

    await expect(service.create(dto)).resolves.toBe(saved);
  });

  it('delete throws on not found', async () => {
    eventRepo.delete.mockResolvedValue(deleteZero);
    await expect(service.delete(42)).rejects.toThrow();
  });

  it('delete succeeds', async () => {
    eventRepo.delete.mockResolvedValue(deleteOk);
    await expect(service.delete(1)).resolves.toBeUndefined();
  });

  it('merges two overlapping events', async () => {
    const baseTime = (h: number, m: number = 0) =>  new Date(Date.UTC(2025, 0, 1, h, m, 0, 0)); 
    const e1 = { id: 1, title: 'E1', description: 'D1', status: EventStatus.TODO,
                 startTime: baseTime(10), endTime: baseTime(11),
                 createdAt: new Date(), updatedAt: new Date(), invitees: [] } as Event;
    const e2 = { id: 2, title: 'E2', description: 'D2', status: EventStatus.IN_PROGRESS,
                 startTime: baseTime(10, 30), endTime: baseTime(12),
                 createdAt: new Date(), updatedAt: new Date(), invitees: [] } as Event;

    const user: User = { id: 1, name: 'U', events: [e1, e2] } as unknown as User;

    userRepo.findOne.mockResolvedValue(user);
    eventRepo.delete.mockResolvedValue(deleteOk);
    eventRepo.save.mockImplementation(
      (e) => Promise.resolve({ ...e, id: 10, createdAt: new Date(), updatedAt: new Date() } as Event)
    );

    const merged = await service.mergeAll(1);
    expect(merged).toHaveLength(1);
    expect(merged[0].status).toBe(EventStatus.TODO);
    expect(merged[0].startTime).toEqual(e1.startTime);
    expect(merged[0].endTime).toEqual(e2.endTime);
  });
});

