import install from '@edgio/prefetch/window/install'
import installDevtools from '@edgio/devtools/install'
import { prefetch } from '@edgio/prefetch/window/prefetch'

document.addEventListener('DOMContentLoaded', () => {
  install({
    watch: [
      {
        selector: 'a[href^="/"]',
        callback: (el) => {
          const href = el.getAttribute('href')
          if (href) prefetch(href)
        },
      },
    ],
  })
  installDevtools()
})
