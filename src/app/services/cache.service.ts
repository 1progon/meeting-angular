import {Injectable} from '@angular/core';
import {ICache} from "./ICache";

@Injectable({
  providedIn: 'root'
})
export class CacheService {

  constructor() {
    this.cache = {}
  }

  private cache: ICache;


  getCache(key: string) {
    if (!this.hasCache(key)) {
      return undefined;
    }

    if (!this.isExpired(key)) {
      return this.cache[key];
    }
    return undefined;
  }

  // default cache time 300 seconds = 5 minutes
  setCache(key: string, data: any, seconds: number = 300) {
    if (!this.cache) {
      this.cache = {}
    }
    let d = new Date();

    // Set timestamp to expire in seconds
    let expires = Math.round(d.getTime() / 1000 + seconds);

    this.cache[key] = {expires, data};
  }

  // Check cache expired
  isExpired(key: string) {
    let d = new Date();

    // Timestamp Now in seconds
    let timeNow = Math.round(d.getTime() / 1000);

    let expires = this.cache[key]?.expires ?? 0;

    if (expires <= timeNow) {
      this.removeCacheByKey(key);
      return true;
    }

    return false;
  }

  hasCache(key: string) {
    if (!this.cache) {
      return false;
    }

    return this.cache[key] != undefined
  }

  removeAllCache() {
    this.cache = {};
  }

  removeCacheByKey(key: string) {
    delete this.cache[key];
  }
}
