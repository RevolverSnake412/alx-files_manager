const crypto = require('crypto');
const dbClient = require('../utils/db');

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }

    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    const userExists = await dbClient.db.collection('users').findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'Already exist' });
    }

    const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');

    const result = await dbClient.db.collection('users').insertOne({
      email,
      password: hashedPassword,
    });

    const newUser = {
      id: result.insertedId,
      email,
    };

    return res.status(201).json(newUser);
  }
}

module.exports = UsersController;
