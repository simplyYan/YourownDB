# YourownDB

YourownDB is a simple, lightweight JavaScript library that allows you to create, access, and manage encrypted databases directly from the browser. It uses GitHub as the storage backend, making it easy to store and retrieve your data securely.

## Features

- **Create Databases**: Easily create new databases with encryption.
- **Access Databases**: Securely access and decrypt your existing databases.
- **CRUD Operations**: Perform Create, Read, Update, and Delete operations on individual fields within your databases.
- **Encryption**: All data is encrypted with a generated encryption key.
- **GitHub Storage**: Store your databases in a GitHub repository.

## Getting Started

To use YourownDB in your project, include it via CDN:

```html
<script src="https://cdn.jsdelivr.net/gh/simplyYan/YourownDB@main/dist/yourowndb.js"></script>
```

### Example Usage

```javascript
const db = new YourownDB();

// Create a new database
db.createDatabase('myDB', 'myPassword')
    .then(response => console.log(response))
    .catch(error => console.error(error));

// Access an existing database
db.getDatabase('myDB', 'myPassword', 'ENCRYPTION_KEY')
    .then(dbContent => console.log(dbContent))
    .catch(error => console.error(error));

// Get a specific field
db.getField('myDB', 'myPassword', 'ENCRYPTION_KEY', 'exampleField')
    .then(fieldValue => console.log(fieldValue))
    .catch(error => console.error(error));

// Update a specific field
db.updateField('myDB', 'myPassword', 'ENCRYPTION_KEY', 'exampleField', 'newValue')
    .then(response => console.log(response))
    .catch(error => console.error(error));

// Delete a specific field
db.deleteField('myDB', 'myPassword', 'ENCRYPTION_KEY', 'exampleField')
    .then(response => console.log(response))
    .catch(error => console.error(error));

// Delete a database
db.deleteDatabase('myDB')
    .then(response => console.log(response))
    .catch(error => console.error(error));
```

## Documentation

For detailed documentation, visit the [YourownDB Wiki](https://github.com/simplyYan/YourownDB/wiki).

## License

YourownDB is licensed under the [CC0-1.0](https://creativecommons.org/publicdomain/zero/1.0/) License.

## Contributing

We welcome contributions! To contribute, please open a pull request or issue on the [GitHub repository](https://github.com/simplyYan/YourownDB).
