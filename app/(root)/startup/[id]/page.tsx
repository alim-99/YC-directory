import { formatDate } from '@/lib/utils';
import { client } from '@/sanity/lib/client';
import { STARTUP_BY_ID_QUERY } from '@/sanity/lib/queries';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import React, { Suspense } from 'react'
import markdownit from 'markdown-it';
import { Skeleton } from '@/components/ui/skeleton';
import View from '@/components/View';

const md = markdownit();

export const expermental_ppr = true;

const page = async ( {params}: { params: Promise<{id: string}>}) => {
  const id = (await params).id;

  const post = await client.fetch(STARTUP_BY_ID_QUERY, { id });
  const {title, description, image, author, category} = post;

  console.log(id);

  if(!post) return notFound();

  const parsedContent = md.render(post?.pitch || '');

  return (
    <>
      <section className='pink_container !min-h-[230px]'>
        <p className='tag'>{formatDate(post?._createdAt)}</p>
        <h1 className='heading'>{title}</h1>
        <p className='sub-heading !max-w-5xl'>{description}</p>
      </section>

      <section className='section_container'>
        <img 
        src={image}
        alt='thumbnail'
        className='w-full h-auto rounded-xl'
        />

        <div className='space-y-5 mt-10 max-w-4xl mx-auto'>
          <div className='flex-between gap-5'>
            <Link 
            href={`/user/${author?._id}`} 
            className='flex gap-2 items-center mb-3'>
              <Image 
              src={author.image} 
              width={64}
              height={64}
              alt='avatar'
              className='rounded-full drop-shadow-lg'
              />
              <div>
                <p className='text-20-medium'>{author.name}</p>
                <p className='text-16-medium !text-black-300'>{author.username}</p>
              </div>
            </Link>

            <p className='category-tag'>{category}</p>
          </div>

          <h3 className='text-30-bold'>Pitch Details</h3>
          {parsedContent ? (
            <article
            className='prose max-w-4xl font-work-sans break-all' 
            dangerouslySetInnerHTML={{ __html: parsedContent }}
            />
          ): (
            <p className='no-result'>No details provided</p>
          )}
        </div>

        <hr className='divider' />

        {/* Editor selected startups */}
      </section>

      <Suspense fallback={<Skeleton className='view_skeleton' />}>
      <View id={id} />
      </Suspense>
    </>
  )
}

export default page
