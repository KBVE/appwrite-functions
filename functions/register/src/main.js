import { Client } from 'node-appwrite';
//import axios from 'axios';
import { getStaticFile } from './utils.js';

export default async ({ req, res, log, error }) => {

  
  if (req.method === 'GET') {
    return res.send(getStaticFile('index.html'), 200, { 'Content-Type': 'text/html; charset=utf-8' });
  }


  const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  log('Hello, Logs!');

  error('Hello, Errors!');


  return res.json({
    motto: 'Build Fast. Scale Big. All in One Place.',
    learn: 'https://appwrite.io/docs',
    connect: 'https://appwrite.io/discord',
    getInspired: 'https://builtwith.appwrite.io',
  });
};
