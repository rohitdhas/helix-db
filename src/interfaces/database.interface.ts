interface IDocument {
  id: string;
  [key: string]: any;
}

interface IDatabase {
  getAll: () => IDocument[];
  getById: (id: string) => IDocument | undefined;
  create: (data: Omit<IDocument, 'id'>) => IDocument;
  update: (id: string, data: Partial<IDocument>) => IDocument;
  delete: (id: string) => void;
  erase: (id: string) => void;
}

interface IDbConfig {
  maxSize?: number;
}

export { IDocument, IDatabase, IDbConfig };
