import { HelixDB } from '../src';

describe('Database', () => {
  let database = new HelixDB();

  beforeEach(() => {
    // Clean the database before running each test
    database.erase();
  });

  describe('getAll', () => {
    it('should return an empty array when there are no documents', () => {
      expect(database.getAll()).toEqual([]);
    });

    it('should return all documents in the database', () => {
      const doc1 = database.create({
        title: 'Document 1',
        content: 'Lorem ipsum',
      });
      const doc2 = database.create({
        title: 'Document 2',
        content: 'Dolor sit amet',
      });
      const docs = database.getAll();
      expect(docs).toContainEqual(doc1);
      expect(docs).toContainEqual(doc2);
    });
  });

  describe('getById', () => {
    it('should return undefined when the document does not exist', () => {
      expect(database.getById('non-existent-id')).toBeUndefined();
    });

    it('should return the document with the specified ID', () => {
      const doc = database.create({
        title: 'Document 1',
        content: 'Lorem ipsum',
      });
      expect(database.getById(doc.id)).toEqual(doc);
    });
  });

  describe('create', () => {
    it('should create a new document with a unique ID', () => {
      const doc1 = database.create({
        title: 'Document 1',
        content: 'Lorem ipsum',
      });
      const doc2 = database.create({
        title: 'Document 2',
        content: 'Dolor sit amet',
      });
      expect(doc1.id).not.toBe(doc2.id);
    });

    it('should save the document to the database', () => {
      const doc = database.create({
        title: 'Document 1',
        content: 'Lorem ipsum',
      });
      const savedDoc = database.getById(doc.id);
      expect(savedDoc).toEqual(doc);
    });
  });

  describe('update', () => {
    it('should update the specified document', () => {
      const doc = database.create({
        title: 'Document 1',
        content: 'Lorem ipsum',
      });
      const updatedDoc = database.update(doc.id, { title: 'Updated document' });
      expect(updatedDoc).toHaveProperty('title', 'Updated document');
      const savedDoc = database.getById(doc.id);
      expect(savedDoc).toEqual(updatedDoc);
    });
  });

  describe('delete', () => {
    it('should delete the specified document', () => {
      const doc = database.create({
        title: 'Document 1',
        content: 'Lorem ipsum',
      });
      database.delete(doc.id);
      expect(database.getById(doc.id)).toBeUndefined();
    });
  });

  describe('erase', () => {
    it('should erase the database', () => {
      database.create({ title: 'Document 1', content: 'Lorem ipsum' });
      database.create({ title: 'Document 2', content: 'Dolor sit amet' });
      database.erase();
      expect(database.getAll()).toEqual([]);
    });
  });

  describe('maxSize config option', () => {
    it('should use default max size of 5 MB if not specified', () => {
      const db = new HelixDB();
      expect(db['maxSize']).toEqual(5 * 1024 * 1024);
    });

    it('should use specified max size if provided', () => {
      const db = new HelixDB({ maxSize: 10 });
      expect(db['maxSize']).toEqual(10 * 1024 * 1024);
    });

    it('should throw an error if the total size of stored documents exceeds the maximum database size', () => {
      const db = new HelixDB({ maxSize: 8 });
      const largeData = 'x'.repeat(4 * 1024 * 1024); // 4 MB string

      expect(() => {
        for (let i = 0; i < 3; i++) {
          db.create({ key: `key_${i}`, largeData }); // Add 3 documents that are each 4 MB in size
        }
      }).toThrowError(
        "Database file size limit (8.00 MB) exceeded. You can configure the database to allow more space by increasing the 'maxSize' option."
      );

      db.erase();
    });
  });
});
