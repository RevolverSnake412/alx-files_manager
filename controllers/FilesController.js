const { ObjectID } = require('mongodb');
const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');

class FilesController {
  // Existing postUpload method here

  static async getShow(req, res) {
    const token = req.headers['x-token'];
    const fileId = req.params.id;

    // Check if the user is authenticated
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Validate and find the file
    if (!ObjectID.isValid(fileId)) {
      return res.status(404).json({ error: 'Not found' });
    }

    const file = await dbClient.db.collection('files').findOne({ _id: ObjectID(fileId), userId });
    if (!file) {
      return res.status(404).json({ error: 'Not found' });
    }

    return res.status(200).json(file);
  }

  static async getIndex(req, res) {
    const token = req.headers['x-token'];
    const { parentId = 0, page = 0 } = req.query;

    // Check if the user is authenticated
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const query = { userId };
    if (parentId !== 0) {
      query.parentId = ObjectID.isValid(parentId) ? ObjectID(parentId) : 0;
    }

    const files = await dbClient.db.collection('files')
      .find(query)
      .skip(parseInt(page, 10) * 20)
      .limit(20)
      .toArray();

    return res.status(200).json(files);
  }
}

module.exports = FilesController;
