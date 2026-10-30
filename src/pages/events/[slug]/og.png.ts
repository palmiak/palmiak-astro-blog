import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { renderOg } from '../../../utils/og';

export async function getStaticPaths() {
  const events = await getCollection('events');
  return events.map((event) => ({ params: { slug: event.id }, props: { name: event.data.name } }));
}

export const GET: APIRoute = ({ props }) => {
  const { name } = props as { name: string };
  return renderOg({
    title: name,
    cta: 'Get slides and links',
  });
};
