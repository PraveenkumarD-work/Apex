import { useStoryBank } from '../../hooks/useStoryBank'
import { StoryForm } from './StoryForm'
import { StoryCard } from './StoryCard'
import { EmptyState } from '../ui/EmptyState'
import { Spinner } from '../ui/Spinner'

export function StoryBankTab() {
  const { stories, loading, addStory, editStory, removeStory } = useStoryBank()

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size={24} />
      </div>
    )
  }

  return (
    <div>
      <StoryForm onSubmit={addStory} />
      {stories.length === 0 ? (
        <EmptyState
          icon="📖"
          heading="No stories in your bank yet"
          subtext="Add your first STAR+R story to build your interview arsenal"
        />
      ) : (
        stories.map((story) => (
          <StoryCard
            key={story.id}
            story={story}
            onEdit={editStory}
            onDelete={removeStory}
          />
        ))
      )}
    </div>
  )
}
