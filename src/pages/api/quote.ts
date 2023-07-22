import { NextApiRequest, NextApiResponse } from "next";
import { Client } from '@threadsjs/threads.js';
import { setTimeout } from 'timers/promises';
import * as fs from 'fs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token, text, post_id } = req.body;
  
  let payload: any = {};

  if (fs.existsSync('./json/unlike.json')) {
    console.log('sent test like');
    payload = JSON.parse(fs.readFileSync('./json/unlike.json', 'utf8'));
    await setTimeout(1000);
  }
  else {
    try {
      const client = new Client({ token });
      
      payload = await client.posts.quote(post_id, {post: post_id, contents: text});
    } catch (e: any) {
      payload['error'] = e.message;
    }
  }

  return res.status(200).json(payload);
}