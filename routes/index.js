const init = (app, nextjs) => {
  // Custom routes
  app.get('/a', (req, res) => nextjs.render(req, res, '/b', req.query))
  app.get('/b', (req, res) => nextjs.render(req, res, '/a', req.query))
  app.get('/clog/:id', async (request, response) => {
    const Episode = require('../graphql/clogii/models/Episode').Model;
    try {
      const { id } = request.params;
          // find Avaliable clog
      const result = await Episode.findById(id);
      if (result) {
        const { binary } = result.toObject().data;
            // parse buffer
        response.send(binary.toString('utf8'));
      } else {
        response.status(404).end();
      }
    } catch (e) {
      console.error(e);
      response.status(500).send('Invalid request').end();
    }
  });
}

module.exports = init