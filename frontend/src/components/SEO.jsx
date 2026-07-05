import { Helmet } from "react-helmet-async";

const SITE_NAME = "MovieRater";
const SITE_URL = "https://movierater-ruddy.vercel.app";
const DEFAULT_DESCRIPTION =
  "Rate and review movies and TV shows, get personalized recommendations, and see what the community thinks.";
const DEFAULT_IMAGE = `${SITE_URL}/favicon.svg`;

/**
 * Drop this near the top of any page/route component.
 *
 * <SEO
 *   title="Inception (2010)"
 *   description="..."
 *   image="https://image.tmdb.org/t/p/w780/..."
 *   path="/movie/27205"
 *   type="video.movie"
 * />
 */
export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  path = "",
  type = "website",
  jsonLd = null,
}) {
  const fullTitle = title
    ? `${title} | ${SITE_NAME}`
    : `${SITE_NAME} — Movie & TV Ratings and Reviews`;

  const canonicalUrl = `${SITE_URL}${path}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph (Facebook, WhatsApp, Slack, Discord, LinkedIn...) */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonicalUrl} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}