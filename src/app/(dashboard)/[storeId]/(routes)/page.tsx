import { ApiAlert } from '@/components/api-alert';

export default function DashboardPage() {
  return (
    <>
      <h1>Dashboard Page</h1>
      <ApiAlert title="title" description="description" variant="admin" />
    </>
  )
}
