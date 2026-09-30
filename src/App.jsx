import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { LoaderCircle } from 'lucide-react'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AppShell } from './layouts/AppShell'

const LoginPage = lazy(() => import('./pages/LoginPage').then((module) => ({ default: module.LoginPage })))
const ContactPage = lazy(() => import('./pages/ContactPage').then((module) => ({ default: module.ContactPage })))
const DashboardPage = lazy(() => import('./pages/DashboardPage').then((module) => ({ default: module.DashboardPage })))
const EntityPage = lazy(() => import('./pages/EntityPage').then((module) => ({ default: module.EntityPage })))
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage').then((module) => ({ default: module.AnalyticsPage })))
const SecurityPage = lazy(() => import('./pages/SecurityPage').then((module) => ({ default: module.SecurityPage })))
const ProfilePage = lazy(() => import('./pages/ProfilePage').then((module) => ({ default: module.ProfilePage })))
const ActivityPage = lazy(() => import('./pages/ActivityPage').then((module) => ({ default: module.ActivityPage })))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })))

const fallback = <div className="grid min-h-screen place-items-center bg-slate-50"><LoaderCircle className="h-8 w-8 animate-spin text-brand-500" /></div>

export default function App() {
  return <Suspense fallback={fallback}><Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/contact" element={<ContactPage />} />
    <Route element={<ProtectedRoute />}>
      <Route element={<AppShell />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="audits" element={<EntityPage entity="audits" />} />
        <Route path="risks" element={<EntityPage entity="risks" />} />
        <Route path="controls" element={<EntityPage entity="controls" />} />
        <Route path="incidents" element={<EntityPage entity="incidents" />} />
        <Route path="findings" element={<EntityPage entity="findings" />} />
        <Route path="action-plans" element={<EntityPage entity="action_plans" />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="information-security" element={<SecurityPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route element={<ProtectedRoute roles={['Administrador', 'Supervisor']} />}>
          <Route path="activity" element={<ActivityPage />} />
        </Route>
      </Route>
    </Route>
    <Route path="*" element={<NotFoundPage />} />
  </Routes></Suspense>
}
