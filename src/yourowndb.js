class YourownDB {
    constructor() {
        this.repoOwner = 'simplyYan';
        this.repoName = 'YourownDB';
        this.apiUrl = `<YOUR-TOKEN-HERE>`;
        this.token = this.getToken();
    }

    getToken() {
        return atob('YOUR-TOKEN-HERE');
    }

    async request(method, url, data) {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Authorization': `token ${this.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return response.json();
    }

    async createDatabase(dbName, password) {
        const encryptionKey = await this.generateKey();
        const dbContent = {
            dbName: dbName,
            password: password,
            encryptionKey: encryptionKey,
            data: {}
        };
        const encryptedContent = await this.encryptData(encryptionKey, dbContent);
        const base64Content = btoa(String.fromCharCode.apply(null, new Uint8Array(encryptedContent)));
        const response = await this.request('PUT', `${this.apiUrl}/${dbName}.json`, {
            message: `Create database ${dbName}`,
            content: base64Content
        });
        return response;
    }

    async getDatabase(dbName, password, encryptionKey) {
        const response = await fetch(`${this.apiUrl}/${dbName}.json`, {
            headers: {
                'Authorization': `token ${this.token}`
            }
        });
        const data = await response.json();
        const content = atob(data.content);
        const decryptedContent = await this.decryptData(encryptionKey, content);
        const dbContent = JSON.parse(decryptedContent);
        if (dbContent.password !== password) {
            throw new Error('Incorrect password');
        }
        return dbContent;
    }

    async updateDatabase(dbName, password, encryptionKey, newData) {
        const dbContent = await this.getDatabase(dbName, password, encryptionKey);
        dbContent.data = { ...dbContent.data, ...newData };
        const encryptedContent = await this.encryptData(encryptionKey, dbContent);
        const base64Content = btoa(String.fromCharCode.apply(null, new Uint8Array(encryptedContent)));
        const response = await this.request('PUT', `${this.apiUrl}/${dbName}.json`, {
            message: `Update database ${dbName}`,
            content: base64Content,
            sha: dbContent.sha
        });
        return response;
    }

    async deleteDatabase(dbName) {
        const dbContent = await this.getDatabase(dbName, password, encryptionKey);
        const response = await this.request('DELETE', `${this.apiUrl}/${dbName}.json`, {
            message: `Delete database ${dbName}`,
            sha: dbContent.sha
        });
        return response;
    }

    async getField(dbName, password, encryptionKey, fieldName) {
        const dbContent = await this.getDatabase(dbName, password, encryptionKey);
        return dbContent.data[fieldName];
    }

    async updateField(dbName, password, encryptionKey, fieldName, fieldValue) {
        const dbContent = await this.getDatabase(dbName, password, encryptionKey);
        dbContent.data[fieldName] = fieldValue;
        return this.updateDatabase(dbName, password, encryptionKey, dbContent.data);
    }

    async deleteField(dbName, password, encryptionKey, fieldName) {
        const dbContent = await this.getDatabase(dbName, password, encryptionKey);
        delete dbContent.data[fieldName];
        return this.updateDatabase(dbName, password, encryptionKey, dbContent.data);
    }

    async generateKey() {
        const key = await crypto.subtle.generateKey(
            {
                name: "AES-GCM",
                length: 256,
            },
            true,
            ["encrypt", "decrypt"]
        );
        return key;
    }

    async encryptData(key, data) {
        const encoded = new TextEncoder().encode(JSON.stringify(data));
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const cipherText = await crypto.subtle.encrypt(
            {
                name: "AES-GCM",
                iv: iv
            },
            key,
            encoded
        );
        return this.concatUint8Arrays(iv, new Uint8Array(cipherText));
    }

    async decryptData(key, data) {
        const iv = data.slice(0, 12);
        const cipherText = data.slice(12);
        const decrypted = await crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv: iv
            },
            key,
            cipherText
        );
        return new TextDecoder().decode(decrypted);
    }

    concatUint8Arrays(a, b) {
        const c = new Uint8Array(a.length + b.length);
        c.set(a, 0);
        c.set(b, a.length);
        return c;
    }
}
