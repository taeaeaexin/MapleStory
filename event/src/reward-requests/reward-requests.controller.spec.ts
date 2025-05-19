import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from 'src/events/events.service'
import { getModelToken } from '@nestjs/mongoose';
import { Event, EventDocument } from 'src/events/schemas/events.schema';
import { Model } from 'mongoose';

describe('EventsService', () => {
  let service: EventsService;
  let eventModel: Model<EventDocument>;

  const mockEvents = [
    {
      title: 'Login 3 Days',
      description: 'Login 3 days in a row',
      condition: 'login',
      amount: 3,
      unit: 'days',
      status: 'ACTIVE',
      startedAt: new Date(),
      endedAt: new Date(),
    },
  ];

  const mockEventModel = {
    find: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockEvents),
    }),
    create: jest.fn().mockResolvedValue(mockEvents[0]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getModelToken(Event.name),
          useValue: mockEventModel,
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    eventModel = module.get<Model<EventDocument>>(getModelToken(Event.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all events', async () => {
    const result = await service.findAllEvents();
    expect(mockEventModel.find).toHaveBeenCalled();
    expect(result).toEqual(mockEvents);
  });

  it('should create an event', async () => {
    const dto = {
      title: 'Login 3 Days',
      condition: 'login',
      amount: 3,
      unit: 'days',
      status: 'ACTIVE',
    };
    const result = await service.createEvent(dto);
    expect(mockEventModel.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(mockEvents[0]);
  });
});