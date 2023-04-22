# 🌀 Helix DB

Helix DB is a simple NoSQL database written in TypeScript for Node.js. It uses a JSON file as its data store, making it easy to set up and use.

## ✨ Features

- Simple and easy-to-use API
- Supports basic CRUD operations (create, read, update, delete)
- Stores data in a JSON file
- Uses UUIDs as document IDs for uniqueness
- Lightweight and minimalistic, with no external dependencies

## 📥 Installation

You can install Helix DB using npm:

```
npm install helix-db
```

## 🧑‍💻 Getting Started

To use Helix DB in your Node.js project, you can import the `HelixDB` class from the `helix-db` module and create an instance of the class to start using its API.

```typescript
import { HelixDB } from "helix-db";

// Create DB Instance
const db = new HelixDB();

// Create a new document
const doc = db.create({ name: "Rohit Dhas", age: 20 });

// Read a document by ID
const retrievedDoc = db.getById(doc.id);

// Update a document
db.update(doc.id, { age: 21 });

// Delete a document
db.delete(doc.id);
```

You can also retrieve all documents from the database using the `getAll` method:

```typescript
const allDocs = db.getAll();
```

You can erase the database using `erase` method:

```typescript
// 🚧 this will erase all data
db.erase();
```


## 🚧 Limitations

Helix DB is designed to be a simple and lightweight database for small to medium-sized applications. As such, it has some limitations:

- Helix DB is not suitable for very large datasets, as all documents are loaded into memory when the database is initialized.
- The maximum size of the database is limited to `5 MB` by default. This can be changed by providing a `maxSize` option in the Database constructor. If the database size exceeds the configured limit, an error will be thrown.

## 🚀 Contributing

If you find a bug or have a feature request, please open an issue on the [GitHub repository](https://github.com/rohitdhas/helix-db/issues). Pull requests are welcome too! 

## 📜 License

Helix DB is licensed under the [MIT License](https://opensource.org/licenses/MIT).