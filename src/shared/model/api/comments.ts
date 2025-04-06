import { supabase } from '../lib/supabase'

export interface Comment {
  id: string
  playlist_id: string
  profile_id: string
  parent_id: string | null
  content: string
  created_at: string
  updated_at: string
  // 중첩 댓글을 위한 필드
  replies?: Comment[]
  // 사용자 정보를 위한 조인 필드
  profiles?: {
    nickname: string
  }
}

// 특정 플레이리스트의 댓글 목록 가져오기
export const getCommentsByPlaylistId = async (playlistId: string): Promise<Comment[]> => {
  try {
    // 모든 댓글 가져오기 (프로필 정보 포함)
    const { data, error } = await supabase
      .from('comments')
      .select(
        `
        *,
        profiles (
          id,
          nickname
        )
      `,
      )
      .eq('playlist_id', playlistId)
      .is('parent_id', null) // 최상위 댓글만 가져오기
      .order('created_at', { ascending: false }) // 최신순 정렬

    if (error) {
      console.error('댓글을 가져오는 중 오류 발생:', error)
      return []
    }

    // 각 최상위 댓글에 대한 대댓글 가져오기
    const commentsWithReplies = await Promise.all(
      data.map(async (comment) => {
        const { data: replies, error: repliesError } = await supabase
          .from('comments')
          .select(
            `
            *,
            profiles (
              id,
              nickname
            )
          `,
          )
          .eq('parent_id', comment.id)
          .order('created_at', { ascending: true })

        if (repliesError) {
          console.error('대댓글을 가져오는 중 오류 발생:', repliesError)
          return { ...comment, replies: [] }
        }

        return { ...comment, replies: replies || [] }
      }),
    )

    return commentsWithReplies || []
  } catch (error) {
    console.error('댓글 목록을 가져오는 중 예상치 못한 오류 발생:', error)
    return []
  }
}

// 댓글 추가하기
export const addComment = async (
  content: string,
  playlistId: string,
  profileId: string,
  parentId?: string,
): Promise<Comment | null> => {
  try {
    const { data, error } = await supabase
      .from('comments')
      .insert({
        content,
        playlist_id: playlistId,
        profile_id: profileId,
        parent_id: parentId || null,
      })
      .select('*')
      .single()

    if (error) {
      console.error('댓글 추가 중 오류 발생:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('댓글 추가 중 예상치 못한 오류 발생:', error)
    return null
  }
}

// 댓글 삭제하기 (실제로는 is_deleted 필드를 추가해야 함)
export const deleteComment = async (commentId: string): Promise<boolean> => {
  try {
    const { error } = await supabase.from('comments').delete().eq('id', commentId)

    if (error) {
      console.error('댓글 삭제 중 오류 발생:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('댓글 삭제 중 예상치 못한 오류 발생:', error)
    return false
  }
}
