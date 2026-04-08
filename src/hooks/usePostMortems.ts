import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { getPostMortems, createPostMortem, updatePostMortem, deletePostMortem } from '../lib/supabase'
import type { PostMortem } from '../lib/types'

export function usePostMortems() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [postMortems, setPostMortems] = useState<PostMortem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPMs = useCallback(async () => {
    if (!user) return
    try {
      const data = await getPostMortems(user.id)
      setPostMortems(data)
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to fetch post-mortems')
    } finally {
      setLoading(false)
    }
  }, [user, showToast])

  useEffect(() => {
    fetchPMs()
  }, [fetchPMs])

  const addPM = async (pm: Omit<PostMortem, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return
    try {
      await createPostMortem(user.id, pm)
      await fetchPMs()
      showToast('success', 'Post-mortem saved')
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to save post-mortem')
      throw err
    }
  }

  const editPM = async (pmId: string, updates: Partial<PostMortem>) => {
    try {
      await updatePostMortem(pmId, updates)
      await fetchPMs()
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to update post-mortem')
      throw err
    }
  }

  const removePM = async (pmId: string) => {
    try {
      await deletePostMortem(pmId)
      await fetchPMs()
      showToast('success', 'Post-mortem deleted')
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to delete post-mortem')
    }
  }

  return { postMortems, loading, addPM, editPM, removePM, refetch: fetchPMs }
}
