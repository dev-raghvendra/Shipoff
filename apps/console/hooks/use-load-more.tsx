import { useCallback } from "react"

export function useLoadMore(
  hasNextPage: boolean,
  isFetchingNextPage: boolean,
  fetchNextPage: () => void
) {
  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  return {
    handleLoadMore,
    canLoadMore: hasNextPage && !isFetchingNextPage,
    isLoadingMore: isFetchingNextPage
  }
}

