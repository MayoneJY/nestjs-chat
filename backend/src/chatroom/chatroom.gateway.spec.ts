import { Test, TestingModule } from '@nestjs/testing';
import { ChatroomGateway } from './chatroom.gateway';

describe('ChatroomGateway', () => {
  let gateway: ChatroomGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatroomGateway],
    }).compile();

    gateway = module.get<ChatroomGateway>(ChatroomGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
