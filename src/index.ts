import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { IDatabase, IDocument } from './interfaces/database.interface';

const DB_FILE = 'data.json';

class Database implements IDatabase {
  private documents: Record<string, IDocument>;

  constructor() {
    this.documents = {};

    try {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      this.documents = JSON.parse(data);
    } catch (err) {
      this._save();
    }
  }

  getAll(): IDocument[] {
    return Object.values(this.documents);
  }

  getById(id: string): IDocument | undefined {
    return this.documents[id];
  }

  create(data: Omit<IDocument, 'id'>): IDocument {
    const id = uuidv4();
    const document = { id, ...data };
    this.documents[id] = document;
    this._save();
    return document;
  }

  update(id: string, data: Partial<IDocument>): IDocument {
    const document = { ...this.documents[id], ...data, id };
    this.documents[id] = document;
    this._save();
    return document;
  }

  delete(id: string): void {
    delete this.documents[id];
    this._save();
  }

  erase(): void {
    this.documents = {};
    this._save();
  }

  private _save(): void {
    const data = JSON.stringify(this.documents);
    const size = Buffer.byteLength(data, 'utf8');

    if (size > 5 * 1024 * 1024) {
      throw new Error(
        `Database file size (${(size / 1024 / 1024).toFixed(
          2
        )} MB) exceeded the maximum allowed size (5 MB). Please remove some data from the database.`
      );
    }

    fs.writeFileSync(DB_FILE, JSON.stringify(this.documents));
  }
}

export { Database as HelixDB };
