import { Client, Databases } from 'node-appwrite';
import axios from 'axios';
import { getStaticFile } from './utils.js';
import { verify } from 'hcaptcha';

export default async ({ req, res, log, error }) => {
  if (req.method === 'GET') {
    return res.send(getStaticFile('index.html'), 200, {
      'Content-Type': 'text/html; charset=utf-8',
    });
  }

  if (req.method === 'POST') {
    const client = new Client()
      .setEndpoint('https://cloud.appwrite.io/v1')
      .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);

    const data = req.body;

    const email = data['email'];
    const token = data['h-captcha-response'];
    const username = data['username'];
    const password = data['password'];

    let valid = false;

    const secret = process.env.HCAPTCHA_SECRET;

    const v = await verify(secret, token)
      .then((data) => {
        if (data.success === true) {
          return true;
        } else {
          return false;
        }
      })
      .catch((error) => {
        return false;
      });

    if (!v) {
      return res.json({ ok: false, message: 'Captcha Failed' }, 401);
    }

    const pattern = /^[a-zA-Z0-9]*$/;

    if (!pattern.exec(username)) {
      return res.json(
        { ok: false, message: 'Username is not alpha-numeric' },
        401
      );
    }

    const database = new Databases(client);

    // Check if username is taken?
    try {
      const { total } = await db.listDocuments('user', 'profile', [
        Query.equal('username', username),
      ]);

      if (total > 0) {
        return res.json({ ok: false, message: 'Username is taken' }, 401);
      }
    } catch (error) {
      return res.json({ ok: false, message: 'Database Error' }, 401);
    }

    return res.json({ ok: true, message: 'Yay! You are registered!' }, 200);
  }

  return res.json({
    kbve: '/register/',
    v: '1.17',
  });
};
