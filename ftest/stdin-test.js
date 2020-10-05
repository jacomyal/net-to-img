const readStdin = require('../helpers').readStdin;

readStdin((err, data) => {
  if (err)
    return console.error(err);

  console.log(data);
});
