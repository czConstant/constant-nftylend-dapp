const localStore = {
  save: function(key: string, value: any) {
    return localStorage.setItem(key, value);
  },
  get: function(key: string): any {
    return localStorage.getItem(key);
  },
  remove: function(key: string): any {
    return localStorage.removeItem(key);
  },
}

export default localStore;