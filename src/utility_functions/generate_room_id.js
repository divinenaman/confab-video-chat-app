function generateRid() {
  let datee = (new Date())
  let rid = datee.getDate()+datee.getSeconds();
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      let rand = Math.floor(Math.random() * 26) + 97;
      rid = rid + String.fromCharCode(rand);
      rand = Math.floor(Math.random() * 10) + 48;
      rid = rid + rand;
    }
    rid = rid + "$";
  }
  rid = rid.substr(0, rid.length-1);
  return rid;
}

module.exports = generateRid;
