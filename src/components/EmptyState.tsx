
import emptyStateIllustration from '/empty-state.jpg'

export default function EmptyState() {
  return (
    <div className="col-span-full text-center py-4 px-6">
      <div className="max-w-md mx-auto">
        <div className="relative mb-8">
          <img 
            src={emptyStateIllustration}
            alt="empty state illustration" 
            className="relative w-32 h-32 mx-auto rounded-2xl transform hover:scale-105 transition-transform duration-300 grayscale"
          />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-3">No projects found yet</h3>
        <p className="text-gray-700 text-lg mb-6">Create or join your first project to get started on your journey!</p>
      </div>
    </div>
  )
}
