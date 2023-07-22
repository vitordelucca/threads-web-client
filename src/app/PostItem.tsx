"use client";

import useFetcher from '@/hooks/useFetcher';
import Image from 'next/image';
import { Link } from 'nextjs13-router-events';
import { useState } from 'react';

import TimeAgo from 'react-timeago'

export default function PostItem(props: any) {
  const token = props.token;
  const item = props.item;

  const hasChildren = props.hasChildren;
  const hasParent = props.hasParent;
  const isQuoted = props.isQuoted;
  const levels = props.levels;

  //console.log(hasChildren, hasParent, levels)

  //console.log(item);
  let post = item.posts[0];
  let attachment = null;

  const isRepost = post.text_post_app_info && post.text_post_app_info.share_info && post.text_post_app_info.share_info.reposted_post;
  const hasQuoted = post.text_post_app_info && post.text_post_app_info.share_info && post.text_post_app_info.share_info.quoted_post;

  const hasAttachment = post.text_post_app_info && post.text_post_app_info.link_preview_attachment
  if (hasAttachment) {
    attachment = post.text_post_app_info.link_preview_attachment
  }
  
  let repostUser = null;
  if (isRepost) {
    repostUser = post.user;
    post = post.text_post_app_info.share_info.reposted_post;
  }

  let id = post?.id ? (post.id as string).split('_')[0] : null;
  let user = post.user;

  const images = (post.image_versions2 && post.image_versions2.candidates) ? post.image_versions2.candidates : [];
  const videos = (post.video_versions) ? post.video_versions : [];

  //console.log(post);
  // convert unix timestamp to readable time
  const date = new Date(post.taken_at * 1000);

  // States
  const [liked, setLiked] = useState(post.has_liked);
  const [hasReposted, setHasReposted] = useState(
    (post.text_post_app_info && post.text_post_app_info.share_info && post.text_post_app_info.share_info.is_reposted_by_viewer) as boolean
  );
  const [likeCount, setLikeCount] = useState(post.like_count);

  const fetcher = useFetcher();

  async function likePost(e: any) {
    e.preventDefault();

    let response: any = null;
    if (liked) {
      response = await fetcher('/api/unlike', {
        post_id: id,
      });
      if (response.status === 'ok') {
        setLiked(false);
        setLikeCount(likeCount - 1);
      }
    }
    else {
      response = await fetcher('/api/like', {
        post_id: id,
      });

      if (response.status === 'ok') {
        setLiked(true);
        setLikeCount(likeCount + 1);
      }
    }
  }

  async function rePost(e: any) {
    e.preventDefault();

    let response: any = null;
    if (hasReposted) {
      response = await fetcher('/api/unrepost', {
          post_id: id,
      });

      if (response.status === 'ok') {
        setHasReposted(false);
      }
    }
    else {
      response = await fetcher('/api/repost', {
        post_id: id,
      });

      if (response.status === 'ok') {
        setHasReposted(true);
      }
    }
  }

  return (
    <>
      <div className={"flex flex-shrink-0 pb-0 " + ((hasParent) ? "px-8 py-4" : "p-4")}>
        <div className="flex-shrink-0 group block">
          {(isRepost) && 
            <div className="text-sm text-gray-500 pb-2">
              {repostUser.username} reposted
            </div>
          }
          {(hasParent) && 
            <div className="text-sm text-gray-500 pb-2">
              {user.username} replied
            </div>
          }
          {(hasQuoted) && 
            <div className="text-sm text-gray-500 pb-2">
              {user.username} quoted
            </div>
          }
          <Link href={"/user/" + (!!user?.pk ? user.pk : '')}>
            <div className="flex items-center">
              <div className="relative">
                <Image className="inline-block h-10 w-10 rounded-full" src={user?.profile_pic_url} width="100" height="100" alt="" />
                { (post?.user?.friendship_status?.following) && 
                  <span className="text-white absolute -bottom-1 right-0">
                    <svg className="svg-icon w-4 y-5" viewBox="0 0 20 20">
                      <path fill="none" strokeWidth="3" stroke="black" d="M7.629,14.566c0.125,0.125,0.291,0.188,0.456,0.188c0.164,0,0.329-0.062,0.456-0.188l8.219-8.221c0.252-0.252,0.252-0.659,0-0.911c-0.252-0.252-0.659-0.252-0.911,0l-7.764,7.763L4.152,9.267c-0.252-0.251-0.66-0.251-0.911,0c-0.252,0.252-0.252,0.66,0,0.911L7.629,14.566z"></path>
                      <path fill="none" strokeWidth="2" stroke="yellow" d="M7.629,14.566c0.125,0.125,0.291,0.188,0.456,0.188c0.164,0,0.329-0.062,0.456-0.188l8.219-8.221c0.252-0.252,0.252-0.659,0-0.911c-0.252-0.252-0.659-0.252-0.911,0l-7.764,7.763L4.152,9.267c-0.252-0.251-0.66-0.251-0.911,0c-0.252,0.252-0.252,0.66,0,0.911L7.629,14.566z"></path>
                    </svg>
                  </span>
                }
              </div>
              <div className="ml-2">
                <p className="text-base leading-6 font-medium text-white">
                  {user?.full_name}
                  {user?.is_verified && 
                    <svg className="inline-block -mt-0.5 ml-2" aria-label="Verified" color="rgb(0, 149, 246)" fill="rgb(0, 149, 246)" height="18" role="img" viewBox="0 0 40 40" width="18"><title>Verified</title><path d="M19.998 3.094 14.638 0l-2.972 5.15H5.432v6.354L0 14.64 3.094 20 0 25.359l5.432 3.137v5.905h5.975L14.638 40l5.36-3.094L25.358 40l3.232-5.6h6.162v-6.01L40 25.359 36.905 20 40 14.641l-5.248-3.03v-6.46h-6.419L25.358 0l-5.36 3.094Zm7.415 11.225 2.254 2.287-11.43 11.5-6.835-6.93 2.244-2.258 4.587 4.581 9.18-9.18Z" fillRule="evenodd"></path></svg>
                  }
                  <span className="text-sm leading-5 font-medium text-gray-400 group-hover:text-gray-300 transition ease-in-out duration-150 pl-1">
                    @{user?.username} - <TimeAgo date={date} />
                  </span>
                  <span className="text-sm leading-5 font-medium text-gray-400 group-hover:text-gray-300 transition ease-in-out duration-150 pl-1">
                    {(post?.user?.friendship_status?.followed_by) && 
                      <>( follows you )</>
                    }
                  </span>
                </p>
              </div>
            </div>
          </Link>
        </div>
    </div>
    <div className={(hasParent) ? "px-20" : "px-16"}>
        <p className="text-base width-auto font-medium text-white flex-shrink whitespace-pre-line">
          <Link href={"/post/" + id} className="block">
            {(post.caption) &&
              post.caption.text
            }
            {((videos === null || videos.length === 0 )&& images.length > 0 && !images[0].url.includes('null.jpg')) &&
              <Image className="rounded-md border-solid border-2 border-[#343638] bg-[#343638] mt-4" src={images[0].url} width={images[0].width} height={images[0].height} alt={''} />
            }
            {(videos !== null && videos.length > 0) &&
              <video className="rounded-md border-solid border-2 border-[#343638] bg-[#343638] mt-4" controls loop>
                <source src={"/api/video/" + encodeURIComponent(videos[0].url)} width={videos[0].width} height={videos[0].height} />
              </video>
            }
          </Link>
        </p>
        {(hasQuoted) && 
          <div className="border-1">
            <PostItem item={{posts: [post.text_post_app_info.share_info.quoted_post]}} token={token} hasChildren={true} isQuoted={true}/>
          </div>
        }
      <p className="text-base width-auto font-medium text-white flex-shrink">
        {(hasAttachment) &&
          <Link href={attachment.url} target="_blank" className="block">
            <Image className="mt-4" src={attachment.image_url} width="500" height="100" alt={''} />
            <span className="text-sm text-gray-500 block">
              {attachment.display_url}
            </span>
            <span className="block">
              {attachment.title}
            </span>
          </Link>
        }
      </p>
      <div className="flex">
          <div className="w-full">
            
            <div className="flex items-center">
              <div className="flex-1 text-center gap-2">
                <Link href={"/post/" + id} className="mt-1 group flex items-center text-gray-500 px-3 py-2 text-base leading-6 font-medium rounded-full hover:bg-gray-800 hover:text-gray-300 gap-1">
                  <svg className="text-center h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                  { post.text_post_app_info && 
                    <span>
                      { post.text_post_app_info.direct_reply_count }
                    </span>
                  }
                </Link>
              </div>

              <div className="flex-1 text-center py-2 m-2">
                <a href="#" className="gap-1 w-12 mt-1 group flex items-center text-gray-500 px-3 py-2 text-base leading-6 font-medium rounded-full hover:bg-gray-800 hover:text-gray-300" onClick={rePost}>
                  {hasReposted ?
                    <svg className="w-6 h-6 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 18">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 10v4H1l3 3M3 8V4h16l-3-3M9 8l2-1v4"></path>
                    </svg>
                  :
                  <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 18">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 14 3-3m-3 3 3 3m-3-3h16v-3m2-7-3 3m3-3-3-3m3 3H3v3"></path>
                  </svg>
                  }
                </a>
              </div>

              <div className="flex-1 text-center py-2 m-2">
                <a href="#" className="mt-1 gap-1 group flex items-center text-gray-500 px-3 py-2 text-base leading-6 font-medium rounded-full hover:bg-gray-800 hover:text-gray-300" onClick={likePost}>
                  <svg className="text-center h-7 w-6" fill={liked ? "white" : "none"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                  <span>
                    {likeCount}
                  </span>
                </a>
              </div>

              <div className="flex-1 text-center py-2 m-2">
                <a href="#" className="gap-1 w-12 mt-1 group flex items-center text-gray-500 px-3 py-2 text-base leading-6 font-medium rounded-full hover:bg-gray-800 hover:text-gray-300">
                  <svg className="text-center h-7 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                </a>
              </div>
              <div className="flex-1 text-center py-2 m-2">
                <a href="#" className="gap-1 w-12 mt-1 group flex items-center text-gray-500 px-3 py-2 text-base leading-6 font-medium rounded-full hover:bg-gray-800 hover:text-gray-300">
                  <svg className="text-center h-7 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20"></path></svg>
                </a>
              </div>
              <div className="flex-1 text-center py-2 m-2">
                <a href="#" className="gap-1 w-12 mt-1 group flex items-center text-gray-500 px-3 py-2 text-base leading-6 font-medium rounded-full hover:bg-gray-800 hover:text-gray-300">
                  <svg className="text-center h-7 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                </a>
              </div>
          </div>
        </div>

      </div>
      
    </div>
    {/* <textarea defaultValue={JSON.stringify(post, null, 2)}></textarea> */}
    {hasChildren ?
      <hr className="border-gray-800 ml-8"></hr>
      :
      <hr className="border-gray-600"></hr>
    }
    </>
  )
}
