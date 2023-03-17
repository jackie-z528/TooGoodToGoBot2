module.exports = {
  async up(db, client) {
    return db.collection("User").createIndex({ "email": 1 }, { unique: true } );
  },

  async down(db, client) {
    return db.collection("User").drop();
  }
};
