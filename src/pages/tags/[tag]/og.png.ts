import type { APIRoute } from 'astro';
import { renderOg } from '../../../utils/og';
import { getTagInfo } from '../../../utils/tags';

export async function getStaticPaths() {
  return (await getTagInfo()).map(({ tag, label }) => ({ params: { tag }, props: { label } }));
}

export const GET: APIRoute = ({ props }) => {
  const { label } = props as { label: string };
  return renderOg({ title: label, cta: 'Browse the posts' });
};
