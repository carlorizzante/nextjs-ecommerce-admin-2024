import { ApiAlert } from '@/components/api-alert';

export default function DashboardPage() {
  return (
    <div className="max-w-4xl p-4">
      <h1>Dashboard Page</h1>
      <ApiAlert title="title" description="description" variant="admin" />
    </div>
  )
}
