module.exports = function(err, res) {
  res.status(500).send('server error');
  console.log(err);
};
