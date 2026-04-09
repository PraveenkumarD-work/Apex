import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { getStories, createStory, updateStory, deleteStory } from '../lib/supabase'
import type { Story } from '../lib/types'

export function useStoryBank() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)

  const fetchStories = useCallback(async () => {
    if (!user) return
    try {
      const data = await getStories(user.id)
      setStories(data)
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to fetch stories')
    } finally {
      setLoading(false)
    }
  }, [user, showToast])

  useEffect(() => {
    fetchStories()
  }, [fetchStories])

  const addStory = async (story: Omit<Story, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return
    try {
      await createStory(user.id, story)
      await fetchStories()
      showToast('success', 'Story saved')
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to save story')
      throw err
    }
  }

  const editStory = async (storyId: string, updates: Partial<Story>) => {
    try {
      await updateStory(storyId, updates)
      await fetchStories()
      showToast('success', 'Story updated')
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to update story')
      throw err
    }
  }

  const removeStory = async (storyId: string) => {
    try {
      await deleteStory(storyId)
      await fetchStories()
      showToast('success', 'Story deleted')
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to delete story')
    }
  }

  return { stories, loading, addStory, editStory, removeStory, refetch: fetchStories }
}
