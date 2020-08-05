var request = window.indexedDB.open("testDB", 1);
// 如果testDB不存在，就创建一个数据库testDB
request.onerror = function() {
  // console.log("数据库打开报错", event);
};

var db;
request.onsuccess = function() {
  db = request.result;
  // console.log("数据库打开成功", db);
};
// 第一次创建数据库时，如果数据库中没有仓库(表)sendToToolbar，创建同名的仓库/表sendToToolbar
request.onupgradeneeded = function(event) {
  db = event.target.result;
  var objectStore;
  if (!db.objectStoreNames.contains("sendToToolbar")) {
    // console.log("现在开始新建数据表sendToToolbar");
    objectStore = db.createObjectStore("sendToToolbar", { keyPath: "id" });
    objectStore.createIndex("trees", "trees", { unique: false });
    objectStore.createIndex("rangeFactor", "rangeFactor", { unique: false });
  }
};
// export default class StorageSetStyle {

// }
// 集成增删查改动作，通过事务对象IDBTransaction完成

export function add(storeName, data) {
  return new Promise(res => {
    var request = db
      .transaction([storeName], "readwrite")
      .objectStore(storeName)
      .add({ id: 1, rangeFactor: data.rangeFactor, trees: data.trees });

    request.onsuccess = function() {
      // console.log("数据写入成功");
      res(true);
    };

    request.onerror = function() {
      // console.log("数据写入失败");
      res(false);
    };
  });
}

export function read(storeName, keyPath) {
  return new Promise(res => {
    var transaction = db.transaction([storeName]);
    var objectStore = transaction.objectStore(storeName);
    var request = objectStore.get(keyPath);

    request.onerror = function() {
      // console.log("事务失败");
      // rej();
    };

    request.onsuccess = function() {
      if (request.result) {
        // console.log("request.result", request.result);
        res(request.result);
      } else {
        // console.log("未获得数据记录");
        res(false);
      }
    };
  });
}

export function update(storeName, keyPath, data) {
  return new Promise(res => {
    var request = db
      .transaction([storeName], "readwrite")
      .objectStore(storeName)
      .put({ id: keyPath, rangeFactor: data.rangeFactor, trees: data.trees });

    request.onsuccess = function() {
      // console.log("数据更新成功");
      res(true);
    };

    request.onerror = function() {
      // console.log("数据更新失败");
      res(false);
    };
  });
}

export function remove(storeName, keyPath) {
  return new Promise(res => {
    var request = db
      .transaction([storeName], "readwrite")
      .objectStore(storeName)
      .delete(keyPath);

    request.onsuccess = function() {
      // console.log("数据删除成功");
      res(true);
    };
    request.onerror = function() {
      // console.log("数据删除失败");
      res(false);
    };
  });
}
