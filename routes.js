import { load } from 'cheerio'
import { Router } from '@edgio/core'
import CustomCacheKey from '@edgio/core/router/CustomCacheKey'
import { injectBrowserScript, starterRoutes } from '@edgio/starter'
import responseBodyToString from '@edgio/core/utils/responseBodyToString'

export default new Router()
  .match('/:path*/:file.:ext(js|css|mjs|png|ico|svg|jpg|jpeg|gif|ttf|woff|otf)', {
    caching: {
      max_age: '86400s',
      service_worker_max_age: '60s',
      ignore_origin_no_cache: [200],
      bypass_client_cache: true,
      cache_key_query_string: {
        include_all_except: ['edgio_dt_pf', 'edgio_prefetch'],
      },
    },
    origin: {
      set_origin: 'origin',
    },
  })
  .match('/edgio-a/:path*', {
    caching: {
      max_age: '86400s',
      service_worker_max_age: '60s',
      ignore_origin_no_cache: [200],
      bypass_client_cache: true,
      cache_key_query_string: {
        include_all_except: ['edgio_dt_pf', 'edgio_prefetch'],
      },
    },
    origin: {
      set_origin: 'a',
    },
    url: {
      url_rewrite: [
        {
          source: '/edgio-a/:path*',
          syntax: 'path-to-regexp',
          destination: '/:path*',
        },
      ],
    },
  })
  .match('/', ({ removeUpstreamResponseHeader, cache, proxy }) => {
    removeUpstreamResponseHeader('cache-control')
    cache({
      browser: {
        maxAgeSeconds: 0,
        serviceWorkerSeconds: 60,
      },
      edge: { maxAgeSeconds: 60 * 60, staleWhileRevalidateSeconds: 60 * 60 * 24 },
      key: new CustomCacheKey().excludeQueryParameters('edgio_dt_pf', 'edgio_prefetch'),
    })
    proxy('origin', {
      transformResponse: (res, req) => {
        injectBrowserScript(res)
        const $ = load(responseBodyToString(res))
        $('body').append(`
          <script defer>
            function initEdgioRum() {
              new Edgio.Metrics({
                token: '0fd2901b-39ee-4a74-add9-bc3c1afa22a8'
              }).collect()
            }
          </script>
          <script src="https://rum.edgio.net/latest.js" defer onload="initEdgioRum()" />
        `)
        res.body = $.html().replace(/https?:\/\/files.smashing.media\//g, '/edgio-a/')
      },
    })
  })
  .match('/articles', ({ removeUpstreamResponseHeader, cache, proxy }) => {
    removeUpstreamResponseHeader('cache-control')
    cache({
      browser: {
        maxAgeSeconds: 0,
        serviceWorkerSeconds: 60,
      },
      edge: { maxAgeSeconds: 60 * 60, staleWhileRevalidateSeconds: 60 * 60 * 24 },
      key: new CustomCacheKey().excludeQueryParameters('edgio_dt_pf', 'edgio_prefetch'),
    })
    proxy('origin', {
      transformResponse: (res, req) => {
        injectBrowserScript(res)
        const $ = load(responseBodyToString(res))
        $('body').append(`
          <script defer>
            function initEdgioRum() {
              new Edgio.Metrics({
                token: '0fd2901b-39ee-4a74-add9-bc3c1afa22a8'
              }).collect()
            }
          </script>
          <script src="https://rum.edgio.net/latest.js" defer onload="initEdgioRum()" />
        `)
        res.body = $.html().replace(/https?:\/\/files.smashing.media\//g, '/edgio-a/')
      },
    })
  })
  .match('/2023/06/:path', ({ removeUpstreamResponseHeader, cache, proxy }) => {
    removeUpstreamResponseHeader('cache-control')
    cache({
      browser: {
        maxAgeSeconds: 0,
        serviceWorkerSeconds: 60,
      },
      edge: {
        maxAgeSeconds: 60 * 60,
        staleWhileRevalidateSeconds: 60 * 60 * 24,
      },
      key: new CustomCacheKey().excludeQueryParameters('edgio_dt_pf', 'edgio_prefetch'),
    })
    proxy('origin', {
      transformResponse: (res, req) => {
        injectBrowserScript(res)
        const $ = load(responseBodyToString(res))
        $('body').append(`
          <script defer>
            function initEdgioRum() {
              new Edgio.Metrics({
                token: '0fd2901b-39ee-4a74-add9-bc3c1afa22a8'
              }).collect()
            }
          </script>
          <script src="https://rum.edgio.net/latest.js" defer onload="initEdgioRum()" />
        `)
        res.body = $.html().replace(/https?:\/\/files.smashing.media\//g, '/edgio-a/')
      },
    })
  })
  .use(starterRoutes)
