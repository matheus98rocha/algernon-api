import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from '../book.controller';
import { BookService } from '../book.service';
import { CreateBookDto } from '../dto/create-book.dto';
import { EnumStatusBook, IBook } from '../interface/book.types';

describe('BookController', () => {
  let controller: BookController;
  let service: BookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookController],
      providers: [BookService],
    }).compile();

    controller = module.get<BookController>(BookController);
    service = module.get<BookService>(BookService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a book', async () => {
      const createBookDto: CreateBookDto = {
        id: '1',
        title: 'Test Book',
        author: 'Test Author',
        status: EnumStatusBook.IS_READ,
        startedDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-15'),
      };

      const createdBook: IBook = {
        id: 'some-id',
        ...createBookDto,
      };

      jest.spyOn(service, 'create').mockResolvedValue(createdBook);

      const result = await controller.create(createBookDto);

      expect(result).toEqual(createdBook);
    });
  });
});
