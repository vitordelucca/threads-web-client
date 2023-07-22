import { NextApiRequest, NextApiResponse } from "next";
import { Client } from '@threadsjs/threads.js';
import { setTimeout } from 'timers/promises';
import * as fs from 'fs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token, post_id } = req.body;
  
  let payload: any = {};

  if (fs.existsSync('./json/repost.json')) {
    console.log('sent test post');
    payload = JSON.parse(fs.readFileSync('./json/repost.json', 'utf8'));
    await setTimeout(1000);
  }
  else {
    try {
      const client = new Client({ token });
      payload = await client.rest.request(`/api/v1/repost/delete_text_app_repost/`, {
        method: 'POST',
        body: 'original_media_id=' + post_id
      });
    } catch (e: any) {
      payload['error'] = e.message;
    }
  }

  return res.status(200).json(payload);
}