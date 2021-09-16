class IndexedDBSettings {
  protected db: IDBDatabase;
  private database: string;

  constructor(database: string) {
    this.database = database;
  }
  async openDB(): Promise<void>{

    //Create or open the database
    var request = await indexedDB.open(this.database);
    return await new Promise((resolve, reject) => {
    request.onblocked = (e) => {
      console.log(e.target);
    };

    //on upgrade needed, create object store
    request.onupgradeneeded = async (e) => {
      this.db = (<IDBOpenDBRequest>e.target).result;
      this.db.createObjectStore("Keystore", { keyPath: "keyName" });
    };

    //on success
    request.onsuccess = (e) => {
      this.db = (<IDBOpenDBRequest>e.target).result;
      resolve();
    };

    //on error
    request.onerror = (e) => {
      console.log((<IDBOpenDBRequest>e.target).error);
      reject();
    };
  });
  }

 closeDB() {
   this.db.close();
  }

  async set(key: string, value: any): Promise<void> {
    const record = {
      keyName: key,
      keyValue: value
    };
    const tx = this.db.transaction("Keystore", "readwrite");
    const store = tx.objectStore("Keystore");
    store.put(record);
  }

  async get(key: string): Promise<any> {
    var userKey = await new Promise((resolve, reject) => {
      const tx = this.db.transaction("Keystore", "readonly");
      const store = tx.objectStore("Keystore");
      const request = store.get(key);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });

    return userKey;
  }

  async remove(tableName: string, key: string[]): Promise<void> {
    const tx = this.db.transaction(tableName, "readwrite");
    const store = tx.objectStore(tableName);
    const result = await store.get(key);
    if (!result) {
      console.log("Key not found", key);
    }
    await store.delete(key);
    console.log("Data Deleted", key);
    return;
  }
}

export const indexedDatabase = new IndexedDBSettings("Wallet");
