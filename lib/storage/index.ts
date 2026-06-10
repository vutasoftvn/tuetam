import type { ColoringProgress, ParentTemplate } from "@/lib/types";

export type ColoringStore = {
  loadProgress(): Promise<Record<string, ColoringProgress>>;
  saveProgress(progress: ColoringProgress): Promise<void>;
  resetProgress(templateId: string): Promise<void>;
  loadParentTemplates(): Promise<ParentTemplate[]>;
  saveParentTemplate(template: ParentTemplate): Promise<void>;
  deleteParentTemplate(templateId: string): Promise<void>;
};

export function createMemoryColoringStore(): ColoringStore {
  let progress: Record<string, ColoringProgress> = {};
  let parentTemplates: ParentTemplate[] = [];
  return {
    async loadProgress() {
      return progress;
    },
    async saveProgress(item) {
      progress = { ...progress, [item.templateId]: item };
    },
    async resetProgress(templateId) {
      const next = { ...progress };
      delete next[templateId];
      progress = next;
    },
    async loadParentTemplates() {
      return parentTemplates;
    },
    async saveParentTemplate(template) {
      parentTemplates = [...parentTemplates.filter((item) => item.id !== template.id), template];
    },
    async deleteParentTemplate(templateId) {
      parentTemplates = parentTemplates.filter((item) => item.id !== templateId);
    },
  };
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("kids-coloring", 1);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains("progress")) database.createObjectStore("progress", { keyPath: "templateId" });
      if (!database.objectStoreNames.contains("parentTemplates")) database.createObjectStore("parentTemplates", { keyPath: "id" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export function createBrowserColoringStore(): ColoringStore {
  if (typeof indexedDB === "undefined") {
    return createMemoryColoringStore();
  }

  async function withStore<T>(
    storeName: "progress" | "parentTemplates",
    mode: IDBTransactionMode,
    callback: (store: IDBObjectStore) => IDBRequest<T>,
  ): Promise<T> {
    const database = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(storeName, mode);
      const store = transaction.objectStore(storeName);
      const request = callback(store);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      transaction.oncomplete = () => database.close();
      transaction.onerror = () => {
        database.close();
        reject(transaction.error);
      };
    });
  }

  return {
    async loadProgress() {
      const rows = await withStore<ColoringProgress[]>("progress", "readonly", (store) => store.getAll());
      return Object.fromEntries(rows.map((item) => [item.templateId, item]));
    },
    async saveProgress(progress) {
      await withStore<IDBValidKey>("progress", "readwrite", (store) => store.put(progress));
    },
    async resetProgress(templateId) {
      await withStore<undefined>("progress", "readwrite", (store) => store.delete(templateId));
    },
    async loadParentTemplates() {
      return withStore<ParentTemplate[]>("parentTemplates", "readonly", (store) => store.getAll());
    },
    async saveParentTemplate(template) {
      await withStore<IDBValidKey>("parentTemplates", "readwrite", (store) => store.put(template));
    },
    async deleteParentTemplate(templateId) {
      await withStore<undefined>("parentTemplates", "readwrite", (store) => store.delete(templateId));
    },
  };
}
