import AIChat from '../components/chat/AIChat'

export default function AIAssistant() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-ink font-display">MediGrid AI Assistant</h1>
        <p className="text-sm text-muted mt-1">
          Ask about saved medicines, prescriptions, interactions, or general guidance from the knowledge base.
        </p>
      </div>
      <AIChat />
    </div>
  )
}
