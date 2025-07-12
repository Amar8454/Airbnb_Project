const mongoose = require("mongoose");
const initData = require("../initialize_data/allData");
const dataList = require("../models/data");

let MongoDB_URL = "mongodb://127.0.0.1:27017/wonderlust";
main()
  .then(() => {
    console.log("mongodb connected");
  })
  .catch((err) => console.log(err));
async function main() {
  await mongoose.connect(MongoDB_URL);
}

async function initialze() {
  await dataList.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: '682b069cee86f4f65501416f',
  }));
  await dataList.insertMany(initData.data);
}

initialze();
