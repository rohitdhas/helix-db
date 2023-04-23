import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { IDatabase, IDocument, IDbConfig } from './interfaces/database.interface';
import { isFileError } from './utils/error.util';

const DB_FILE = path.join(__dirname, '..', '.helix', 'store.json');
const DEFAULT_MAX_SIZE = 5; // Default size of 5 MB

class Database implements IDatabase {
  private documents: Record<string, IDocument>;
  private maxSize: number;

  constructor(configOptions?: IDbConfig) {
    const { maxSize = DEFAULT_MAX_SIZE } = configOptions || {};

    this.documents = {};
    this.maxSize = maxSize * 1024 * 1024;

    try {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      this.documents = JSON.parse(data);
    } catch (err) {
      if (isFileError(err)) {
        // Creates .helix/store.json file if it doesn't exist
        fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
      } else {
        throw err;
      }
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

    if (size > this.maxSize) {
      throw new Error(
        `Database file size limit (${(this.maxSize / 1024 / 1024).toFixed(2)} MB) exceeded. ` +
        `Maximum allowed size is ${this.maxSize} bytes. ` +
        `You can configure the database to allow more space by increasing the 'maxSize' option.`
      );      
    }

    fs.writeFileSync(DB_FILE, JSON.stringify(this.documents));
  }
}

export { Database as HelixDB };
