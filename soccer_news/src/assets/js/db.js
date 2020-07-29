import * as idb from "../idb-2.1.3/lib/idb.js";

const promiseDB = idb.open("TeamDetails", 1, (upradeDB) => {
  const teamDetails = upradeDB.createObjectStore("teamDetails", {
    keyPath: "id",
  });
  teamDetails.createIndex("name", "name", { unique: false });
});

const save = async (teamDetails) => {
  const db = await promiseDB;
  const tx = db.transaction("teamDetails", "readwrite");
  const store = tx.objectStore("teamDetails");
  await store.put(teamDetails);
  await tx.complete;
  return "The page has been saved.";
};

const getAll = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await promiseDB;
      const tx = db.transaction("teamDetails", "readonly");
      const store = tx.objectStore("teamDetails");
      const teamDetails = store.getAll();
      resolve(teamDetails);
    } catch (err) {
      reject(err);
    }
  });
};

const getById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await promiseDB;
      const tx = db.transaction("teamDetails", "readonly");
      const store = tx.objectStore("teamDetails");
      const teamDetails = store.get(id);
      resolve(teamDetails);
    } catch (err) {
      console.log(err);
    }
  });
};

const deleteTeamDetails = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await promiseDB;
      const tx = db.transaction("teamDetails", "readwrite");
      const store = tx.objectStore("teamDetails");
      store.delete(id);
      await tx.complete;
    } catch (error) {
      console.error("Error: ", err);
    }
  });
};

export { save, getAll, getById, deleteTeamDetails };
