const BaseRepository = require('../../src/repositories/BaseRepository');
const db = require('../../src/config/database');

jest.mock('../../src/config/database');

describe('BaseRepository', () => {
  let repository;
  
  const MockModel = jest.fn(function(data) {
    Object.assign(this, data);
    this.toJSON = () => ({ ...data });
  });
  
  MockModel.tableName = 'test_table';
  MockModel.columns = ['id', 'name'];

  beforeEach(() => {
    repository = new BaseRepository(MockModel);
  });

  describe('findAll', () => {
    it('should return all items', async () => {
      const mockRows = [{ id: 1, name: 'Test' }];
      db.query.mockResolvedValue({ rows: mockRows });

      const result = await repository.findAll();

      expect(db.query).toHaveBeenCalledWith(
        'SELECT * FROM test_table ORDER BY created_at DESC'
      );
      expect(result).toHaveLength(1);
    });
  });

  describe('findById', () => {
    it('should return item by id', async () => {
      const mockRow = { id: 5, name: 'Test' };
      db.query.mockResolvedValue({ rows: [mockRow] });

      const result = await repository.findById(5);

      expect(db.query).toHaveBeenCalledWith(
        'SELECT * FROM test_table WHERE id = $1',
        [5]
      );
      expect(result).toBeTruthy();
    });
  });
});