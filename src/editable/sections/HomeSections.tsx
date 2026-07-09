import Link from 'next/link'
import { ArrowRight, MessageSquare, Star } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { getEditablePostImage, postHref } from '@/editable/cards/PostCards'
import { EditableHeroCollage } from '@/editable/sections/EditableHeroCollage'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const container = 'mx-auto w-full max-w-[var(--editable-container)] px-3 sm:px-4 lg:px-6'

function getContent(post?: SitePost | null) {
  return post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
}

function cleanText(value = '') {
  return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

function getExcerpt(post?: SitePost | null, limit = 130) {
  const content = getContent(post)
  const raw = (typeof content.description === 'string' && content.description) || (typeof content.summary === 'string' && content.summary) || post?.summary || ''
  const clean = cleanText(raw)
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

function categoryOf(post?: SitePost | null) {
  const content = getContent(post)
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || ''
}

function hashStr(value: string) {
  let h = 0
  for (let i = 0; i < value.length; i += 1) h = (h * 31 + value.charCodeAt(i)) >>> 0
  return h
}

function ratingOf(post: SitePost) {
  const real = Number(getContent(post).rating)
  if (real >= 1 && real <= 5) return Math.round(real * 10) / 10
  return Math.round((3.7 + (hashStr(post.slug || post.id || post.title || 'x') % 13) / 10) * 10) / 10
}

function Stars({ post }: { post: SitePost }) {
  const rating = ratingOf(post)
  return (
    <span className="inline-flex items-center gap-[3px]" aria-label={`${rating} out of 5`}>
      {[0, 1, 2, 3, 4].map((i) => <Star key={i} className={`h-4 w-4 ${i < Math.round(rating) ? 'fill-[var(--slot4-accent)] text-[var(--slot4-accent)]' : 'fill-[var(--editable-border)] text-[var(--editable-border)]'}`} />)}
    </span>
  )
}

function latestPostImages(posts: SitePost[], max = 8) {
  const seen = new Set<string>()
  const out: string[] = []
  for (const post of posts) {
    const img = getEditablePostImage(post)
    if (!img || img.includes('placeholder') || seen.has(img)) continue
    seen.add(img)
    out.push(img)
    if (out.length >= max) break
  }
  return out
}

function dedupePosts(posts: SitePost[]) {
  const seen = new Set<string>()
  const out: SitePost[] = []
  for (const post of posts) {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(post)
  }
  return out
}

function FeedCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group rounded-md border border-[var(--editable-border)] bg-white p-5 transition hover:border-[var(--slot4-accent)]">
      <span className="rounded-full border border-[var(--editable-border)] bg-white px-3 py-1 text-xs text-[var(--slot4-muted-text)]">{categoryOf(post) || `Post ${index + 1}`}</span>
      <h3 className="mt-3 text-2xl font-black leading-tight group-hover:text-[var(--slot4-accent)]">{post.title}</h3>
      <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--slot4-muted-text)]">{getExcerpt(post, 140)}</p>
      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-[var(--slot4-muted-text)]">
        <Stars post={post} />
        <span className="inline-flex items-center gap-1.5"><MessageSquare className="h-4 w-4" /> Comment</span>
      </div>
    </Link>
  )
}

export function EditableHomeHero({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
  const heroImages = latestPostImages(pool)
  const featured = pool[0]
  const feed = pool.slice(1, 8)
  return (
    <section className="bg-[var(--slot4-warm)]">
      <div className={`${container} grid gap-4 py-4 lg:grid-cols-[240px_minmax(0,1fr)_320px]`}>
        <aside className="hidden space-y-4 lg:block">
          <div className="rounded-md border border-[var(--editable-border)] bg-white p-4">
            <h1 className="text-xl font-black leading-tight">{SITE_CONFIG.name} is a community for useful ideas and professional connections.</h1>
            <p className="mt-4 text-sm leading-6 text-[var(--slot4-muted-text)]">{pagesContent.home.hero.description}</p>
            <Link href="/signup" className="mt-4 flex h-10 items-center justify-center rounded-md border border-[var(--slot4-accent)] text-sm font-semibold text-[var(--slot4-accent)] hover:bg-[var(--slot4-accent-soft)]">Create account</Link>
            <Link href="/login" className="mt-2 block text-center text-sm font-medium text-[var(--slot4-muted-text)] hover:text-[var(--slot4-page-text)]">Log in</Link>
          </div>
          <div className="rounded-md border border-[var(--editable-border)] bg-white p-4">
            <h2 className="text-sm font-black">Popular Tags</h2>
            <div className="mt-4 grid gap-3 text-sm text-[var(--slot4-muted-text)]">
              {['research', 'career', 'business', 'students', 'creators', 'resources'].map((tag) => <Link key={tag} href={`/search?q=${tag}`}>#{tag}</Link>)}
            </div>
          </div>
        </aside>

        <div className="min-w-0">
          <div className="mb-3 flex items-center gap-6 px-1 text-lg">
            {['Relevant', 'Latest', 'Top'].map((item, index) => <Link key={item} href={index ? `/search?q=${item.toLowerCase()}` : primaryRoute} className={index ? 'text-[var(--slot4-muted-text)] hover:text-[var(--slot4-page-text)]' : 'font-black text-[var(--slot4-page-text)]'}>{item}</Link>)}
          </div>
          {featured ? (
            <article className="overflow-hidden rounded-md border border-black bg-white">
              <div className="relative aspect-[16/7] min-h-[230px] overflow-hidden bg-[var(--slot4-media-bg)]">
                <EditableHeroCollage images={heroImages} />
              </div>
              <div className="p-5 sm:p-7">
                <span className="rounded-full border border-[var(--editable-border)] bg-white px-3 py-1 text-xs font-medium text-[var(--slot4-muted-text)]">{categoryOf(featured) || 'Featured update'}</span>
                <Link href={postHref(primaryTask, featured, primaryRoute)}>
                  <h2 className="mt-4 text-3xl font-black leading-tight text-[var(--slot4-page-text)] hover:text-[var(--slot4-accent)] sm:text-4xl">{featured.title}</h2>
                </Link>
                <p className="mt-3 line-clamp-2 text-base leading-7 text-[var(--slot4-muted-text)]">{getExcerpt(featured, 180)}</p>
                <div className="mt-5 flex flex-wrap items-center gap-5 text-sm text-[var(--slot4-muted-text)]">
                  <Stars post={featured} />
                  <span className="inline-flex items-center gap-2"><MessageSquare className="h-4 w-4" /> Join discussion</span>
                </div>
              </div>
            </article>
          ) : null}
          <div className="mt-3 grid gap-3">
            {feed.map((post, index) => <FeedCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />)}
          </div>
        </div>

        <aside className="hidden space-y-4 lg:block">
          <div className="rounded-md border border-[var(--editable-border)] bg-white p-4">
            <p className="text-sm font-black text-[var(--slot4-muted-text)]">What's happening this week</p>
            <h2 className="mt-5 text-xl font-black">Livestreams and reading picks</h2>
            <div className="mt-3 rounded-md border-2 border-[var(--slot4-page-text)] p-4">
              <p className="text-sm font-black">Tuesday focus</p>
              <p className="mt-3 text-sm leading-6 text-[var(--slot4-muted-text)]">Professional perspectives, research resources, and practical business notes.</p>
            </div>
          </div>
          <div className="rounded-md border border-[var(--editable-border)] bg-white">
            <h2 className="border-b border-[var(--editable-border)] p-4 text-lg font-black">#discuss</h2>
            {feed.slice(0, 5).map((post) => <Link key={post.id || post.slug} href={postHref(primaryTask, post, primaryRoute)} className="block border-b border-[var(--editable-border)] p-4 text-sm leading-6 text-[var(--slot4-muted-text)] last:border-0 hover:text-[var(--slot4-page-text)]">{post.title}</Link>)}
          </div>
        </aside>
      </div>
    </section>
  )
}

export function EditableStoryRail(_props: HomeSectionProps) {
  return null
}

function ActivityCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getEditablePostImage(post)
  const imageFirst = index % 3 === 0
  if (index % 3 === 1) {
    return (
      <Link href={href} className="group flex gap-4 rounded-md border border-[var(--editable-border)] bg-white p-4 hover:border-[var(--slot4-accent)]">
        <img src={image} alt="" className="h-24 w-24 shrink-0 rounded-md object-cover" loading="lazy" />
        <div className="min-w-0">
          <p className="text-xs font-bold text-[var(--slot4-accent)]">{categoryOf(post) || 'Update'}</p>
          <h3 className="mt-2 line-clamp-2 text-lg font-black leading-tight group-hover:text-[var(--slot4-accent)]">{post.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--slot4-muted-text)]">{getExcerpt(post, 100)}</p>
        </div>
      </Link>
    )
  }
  return (
    <Link href={href} className={`group block overflow-hidden rounded-md border border-[var(--editable-border)] bg-white hover:border-[var(--slot4-accent)] ${imageFirst ? 'md:col-span-2' : ''}`}>
      <div className={imageFirst ? 'aspect-[16/7] overflow-hidden bg-[var(--slot4-media-bg)]' : 'aspect-[16/10] overflow-hidden bg-[var(--slot4-media-bg)]'}>
        <img src={image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" loading="lazy" />
      </div>
      <div className="p-5">
        <p className="text-xs font-bold text-[var(--slot4-accent)]">{categoryOf(post) || 'Fresh update'}</p>
        <h3 className="mt-2 text-2xl font-black leading-tight group-hover:text-[var(--slot4-accent)]">{post.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--slot4-muted-text)]">{getExcerpt(post, 130)}</p>
      </div>
    </Link>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const activity = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)]).slice(0, 9)
  if (!activity.length) return null
  return (
    <section className="bg-[var(--slot4-warm)]">
      <div className={`${container} py-8`}>
        <h2 className="text-2xl font-black sm:text-3xl">Recent activity</h2>
        <p className="mt-2 text-[var(--slot4-muted-text)]">Fresh updates, useful ideas, and practical references from {SITE_CONFIG.name}.</p>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {activity.map((post, index) => <ActivityCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />)}
        </div>
      </div>
    </section>
  )
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const sections = timeSections.length ? timeSections : [
    { key: 'spotlight', posts: posts.slice(0, 6), href: primaryRoute },
    { key: 'browse', posts: posts.slice(6, 12), href: primaryRoute },
  ] as Pick<HomeTimeSection, 'key' | 'posts' | 'href'>[]
  const visible = sections.filter((section) => section.posts.length)
  if (!visible.length) return null
  return (
    <>
      {visible.map((section) => (
        <section key={section.key} className="border-t border-[var(--editable-border)] bg-white">
          <div className={`${container} py-8`}>
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-black">{section.key === 'spotlight' ? 'Fresh this week' : 'More to explore'}</h2>
              <Link href={section.href || primaryRoute} className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--slot4-accent)]">See all <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {section.posts.slice(0, 6).map((post, index) => <FeedCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />)}
            </div>
          </div>
        </section>
      ))}
    </>
  )
}

export function EditableHomeCta() {
  return (
    <section id="get-app" className="border-t border-[var(--editable-border)] bg-[var(--slot4-warm)]">
      <div className={`${container} py-10 text-center`}>
        <h2 className="text-3xl font-black">Got something useful to share?</h2>
        <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-[var(--slot4-muted-text)]">Share a useful resource that helps people make sense of work, study, research, and business.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/create" className="inline-flex items-center gap-2 rounded-md border border-[var(--slot4-accent)] bg-white px-5 py-3 text-sm font-bold text-[var(--slot4-accent)] hover:bg-[var(--slot4-accent-soft)]">Create a post</Link>
          <Link href="/contact" className="inline-flex items-center gap-2 rounded-md border border-[var(--editable-border)] bg-white px-5 py-3 text-sm font-bold">Contact</Link>
        </div>
      </div>
    </section>
  )
}
