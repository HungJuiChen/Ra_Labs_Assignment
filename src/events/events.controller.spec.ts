import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

const mockEventsService = {
  create   : jest.fn(),
  findById : jest.fn(),
  delete   : jest.fn(),
  mergeAll : jest.fn(),
};

describe('EventsController', () => {
  let controller: EventsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers : [{ provide: EventsService, useValue: mockEventsService }],
    }).compile();

    controller = module.get(EventsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

