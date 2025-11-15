import { QuartzComponent, QuartzComponentProps } from "./types"
import RecentNotes from "./RecentNotes"

const AllRecentNotes: QuartzComponent = (props: QuartzComponentProps) => {
  if (props.fileData.slug === "all-posts") {
    return RecentNotes({
      title: "",
      limit: 999,
      showTags: true,
    })(props)
  }
  return null
}

export default AllRecentNotes
