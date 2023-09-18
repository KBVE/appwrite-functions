import { Client } from 'node-appwrite';
import axios from 'axios';
import { getStaticFile } from './utils.js';
const { verify } = require('hcaptcha');

export default async ({ req, res, log, error }) => {
  if (req.method === 'GET') {
    return res.send(getStaticFile('index.html'), 200, {
      'Content-Type': 'text/html; charset=utf-8',
    });
  }

  const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  //! Safety

  const data = req.body;

  const email = data['email'];
  const token = data['h-captcha-response'];
  const username = data['username'];
  const password = data['password'];

  const secret = process.env.HCAPTCHA_SECRET;

  verify(secret, token)
    .then((data) => {
      if (data.success === true) {
        log('Token was valid');
      } else {
        return res.json({ ok: false, error: '' }, 400);
      }
    })
    .catch((error) => {
      return res.json({ error: error }, 400);
    });

  

  //log(`This is to see ${req.body?.email} Email`);
  //log(`This is to see ${JSON.stringify(req.body)} B`);

  log(`This is the email ${email}`);
  log(`This is the token ${token}`);
  log(`This is the username ${username}`);

  return res.json({
    kbve: 'Beep! Got your request buddy! oh pal!',
    v: 'v1.0.16',
  });
};
