import { CacheMap } from "dataloader";

import { DataLoader } from "./data-loader.class";
import { DataLoaderContext } from "./data-loader-context.class";
import { DataLoaderContextMiddleware } from "./data-loader-context.middleware";

/**
 * Provide a clean cache state for each request.
 */
export class DataLoaderCacheMap<Key, Value, ValuePromise extends Promise<Value>>
  implements CacheMap<Key, ValuePromise>
{
  constructor(private loader: DataLoader<Key, Value>) {}

  get(key: Key) {
    return this.getContext().get(key);
  }
  set(key: Key, promise: ValuePromise) {
    return this.getContext().set(key, promise);
  }
  delete(key: Key) {
    return this.getContext().delete(key);
  }
  clear() {
    return this.getContext().clear();
  }

  private getContext() {
    const map = DataLoaderContext.current?.cacheMapContexts;
    if (!map)
      throw new Error(
        `${DataLoaderContextMiddleware.name} must be applied for this route`,
      );

    let context = map.get(this.loader) as Map<Key, ValuePromise> | undefined;
    if (!context) {
      context = new Map();
      map.set(this.loader, context);
    }

    return context;
  }
}