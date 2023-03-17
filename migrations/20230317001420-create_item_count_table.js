module.exports = {
  async up(db, client) {
    return db.collection("ItemCount").createIndex({ "id": 1 }, { unique: true });
  },

  async down(db, client) {
    return db.collection("ItemCount").drop();
  }
};
