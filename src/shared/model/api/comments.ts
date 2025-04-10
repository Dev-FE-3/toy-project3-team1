import { supabase } from '../api/supabase'

export interface Comment {
  id: string
  playlist_id: string
  profile_id: string
  parent_id: string | null
  content: string
  created_at: string
  updated_at: string
  deleted_at: string | null
  // 중첩 댓글을 위한 필드
  replies?: Comment[]
  // 사용자 정보를 위한 조인 필드
  profiles?: {
    id: string
    nickname: string
  }
}

// 특정 플레이리스트의 댓글 목록 가져오기
export const getCommentsByPlaylistId = async (playlistId: string): Promise<Comment[]> => {
  try {
    const { data, error } = await supabase
      .from('comments')
      .select(
        `
        id,
        content,
        created_at,
        profile_id,
        playlist_id,
        parent_id,
        deleted_at,
        profiles:profile_id (
          id,
          nickname
        ),
        replies:comments (
          id,
          content,
          created_at,
          profile_id,
          deleted_at,
          profiles:profile_id (
            id,
            nickname          )
        )
      `,
      )
      .eq('playlist_id', playlistId)
      .is('parent_id', null)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    // 삭제되지 않은 답글만 필터링
    const commentsWithFilteredReplies = data.map((comment) => ({
      ...comment,
      replies: comment.replies?.filter((reply) => reply.deleted_at === null) || [],
    }))

    return commentsWithFilteredReplies
  } catch (error) {
    console.error('댓글 조회 중 에러:', error)
    throw error
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
  console.log(' deleteComment ~ deleteComment: ', commentId)

  try {
    const { error } = await supabase
      .from('comments')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', commentId)

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
