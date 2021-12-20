import Head from 'next/head';
import Link from 'next/link';
import { ReactQueryDevtools } from 'react-query/devtools';
import { trpc } from '../utils/trpc';

export default function IndexPage() {
  const utils = trpc.useContext();
  const linkQuery = trpc.useQuery(['link.getAll']);

  // prefetch all posts for instant navigation
  // useEffect(() => {
  //   for (const { id } of postsQuery.data ?? []) {
  //     utils.prefetchQuery(['post.byId', { id }]);
  //   }
  // }, [postsQuery.data, utils]);

  return (
    <>
      <Head>
        <title>Byte Url Shortner</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h2>
        Links
        {linkQuery.status === 'loading' && '(loading)'}
      </h2>
      {linkQuery.data?.map((item) => (
        <article key={item.id}>
          <h3>{item.shortSlug}</h3>
          <Link href={`${item.url}`}>
            <a>View more</a>
          </Link>
        </article>
      ))}

      <hr />

      {process.env.NODE_ENV !== 'production' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </>
  );
}

/**
 * If you want to statically render this page
 * - Export `appRouter` & `createContext` from [trpc].ts
 * - Make the `opts` object optional on `createContext()`
 *
 * @link https://trpc.io/docs/ssg
 */
// export const getStaticProps = async (
//   context: GetStaticPropsContext<{ filter: string }>,
// ) => {
//   const ssg = createSSGHelpers({
//     router: appRouter,
//     ctx: await createContext(),
//   });
//
//   await ssg.fetchQuery('post.all');
//
//   return {
//     props: {
//       trpcState: ssg.dehydrate(),
//       filter: context.params?.filter ?? 'all',
//     },
//     revalidate: 1,
//   };
// };
