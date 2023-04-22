import { HelixDB } from '../src';
const database = new HelixDB();

describe('Database', () => {

  beforeEach(() => {
    // Clean the database before running each test
    database.erase();
  })

  describe('getAll', () => {
    it('should return an empty array when there are no documents', () => {
      expect(database.getAll()).toEqual([]);
    });

    it('should return all documents in the database', () => {
      const doc1 = database.create({ title: 'Document 1', content: 'Lorem ipsum' });
      const doc2 = database.create({ title: 'Document 2', content: 'Dolor sit amet' });
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
      const doc = database.create({ title: 'Document 1', content: 'Lorem ipsum' });
      expect(database.getById(doc.id)).toEqual(doc);
    });
  });

  describe('create', () => {
    it('should create a new document with a unique ID', () => {
      const doc1 = database.create({ title: 'Document 1', content: 'Lorem ipsum' });
      const doc2 = database.create({ title: 'Document 2', content: 'Dolor sit amet' });
      expect(doc1.id).not.toBe(doc2.id);
    });

    it('should save the document to the database', () => {
      const doc = database.create({ title: 'Document 1', content: 'Lorem ipsum' });
      const savedDoc = database.getById(doc.id);
      expect(savedDoc).toEqual(doc);
    });
  });

  describe('update', () => {
    it('should update the specified document', () => {
      const doc = database.create({ title: 'Document 1', content: 'Lorem ipsum' });
      const updatedDoc = database.update(doc.id, { title: 'Updated document' });
      expect(updatedDoc).toHaveProperty('title', 'Updated document');
      const savedDoc = database.getById(doc.id);
      expect(savedDoc).toEqual(updatedDoc);
    });
  });

  describe('delete', () => {
    it('should delete the specified document', () => {
      const doc = database.create({ title: 'Document 1', content: 'Lorem ipsum' });
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

  // test('throws an error if database file size exceeds the maximum allowed size', () => {
  //   // Fill up the database with a large amount of data
  //   for (let i = 0; i < 100000; i++) {
  //     db.create({ name: `Person ${i}`, age: i });
  //   }

  //   // Attempt to create another document, which should trigger an error
  //   expect(() => {
  //     db.create({ name: 'John Doe', age: 30 });
  //   }).toThrowError(
  //     'Database file size (5.29 MB) exceeded the maximum allowed size (5 MB). Please remove some data from the database.'
  //   );
  // });
});
