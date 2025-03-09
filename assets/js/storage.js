/**
 * @copyright (c) 2025 Nxrix. All rights reserved.
 */

class Storage {
  constructor(name,store) {
    this.name = name;
    this.store = store;
    this.db = null;
  }
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.name,3);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.store)) {
          db.createObjectStore(this.store,{keyPath:"id"});
        }
      };
      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve();
      };
      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  }
  async set(id,value) {
    return new Promise((resolve, reject) => {
      const request = this.db.transaction([this.store],"readwrite").objectStore(this.store).put({ id, value });
      request.onsuccess = () => {
        resolve();
      };
      request.onerror = () => {
        reject(request.error);
      };
    });
  }
  async get(id) {
    return new Promise((resolve, reject) => {
      const request = this.db.transaction([this.store],"readonly").objectStore(this.store).get(id);
      request.onsuccess = (event) => {
        const result = event.target.result;
        if (result) {
          resolve(result.value);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => {
        reject(request.error);
      };
    });
  }
  async delete(id) {
    return new Promise((resolve, reject) => {
      const request = this.db.transaction([this.store],"readwrite").objectStore(this.store).delete(id);
      request.onsuccess = () => {
        resolve();
      };
      request.onerror = () => {
        reject(request.error);
      };
    });
  }
}
