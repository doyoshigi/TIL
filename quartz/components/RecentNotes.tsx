import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { FullSlug, SimpleSlug, resolveRelative } from "../util/path"
import { QuartzPluginData } from "../plugins/vfile"
import { GlobalConfiguration } from "../cfg"
import { i18n } from "../i18n"
import { classNames } from "../util/lang"

import { PageList, SortFn } from "./PageList"
import style from "./styles/listPage.scss"

import { concatenateResources } from "../util/resources"

interface Options {
  title?: string
  limit: number
  linkToMore: SimpleSlug | false
  showTags: boolean
  filter: (f: QuartzPluginData) => boolean
  sort: SortFn
}

const defaultOptions = (cfg: GlobalConfiguration): Options => ({
  limit: 3,
  linkToMore: false,
  showTags: true,
  filter: () => true,
  sort: (f1: QuartzPluginData, f2: QuartzPluginData): number => {
    const d1 = f1.dates?.created?.getTime() ?? 0
    const d2 = f2.dates?.created?.getTime() ?? 0

    if (d2 !== d1) {
      return d2 - d1
    }

    const t1 = f1.frontmatter?.title ?? f1.slug ?? ""
    const t2 = f2.frontmatter?.title ?? f2.slug ?? ""
    return t1.localeCompare(t2)
  },
})

export default ((userOpts?: Partial<Options>) => {
  const RecentNotes: QuartzComponent = (props: QuartzComponentProps) => {
    const { allFiles, fileData, displayClass, cfg } = props

    const opts = { ...defaultOptions(cfg), ...userOpts }

    const pages = allFiles.filter(opts.filter)

    const remaining = Math.max(0, pages.length - opts.limit)

    return (
      <div class={classNames(displayClass, "page-listing", "recent-notes")}>
        <h3>{opts.title ?? i18n(cfg.locale).components.recentNotes.title}</h3>
        <div>
          <PageList {...props} allFiles={pages} sort={opts.sort} limit={opts.limit} />
        </div>

        {opts.linkToMore && remaining > 0 && (
          <p>
            <a href={resolveRelative(fileData.slug!, opts.linkToMore)}>
              {i18n(cfg.locale).components.recentNotes.seeRemainingMore({ remaining })}
            </a>
          </p>
        )}
      </div>
    )
  }

  RecentNotes.css = concatenateResources(style, PageList.css)
  return RecentNotes
}) satisfies QuartzComponentConstructor
