import { NextApiRequest, NextApiResponse } from "next";
import { Client } from '@threadsjs/threads.js';
import * as fs from 'fs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token, user_id } = req.body;
  
  let payload: any = {};

  if (fs.existsSync('./mute.json')) {
    console.log('sent test mute');
    payload = JSON.parse(fs.readFileSync('./mute.json', 'utf8'));
  }
  else {
    try {
      const client = new Client({ token });
      payload = await client.friendships.mute(user_id);
    } catch (e: any) {
      payload['error'] = e.message;
    }
  }

  return res.status(200).json(payload);
}