import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { VersionProvider } from '@/contexts/VersionContext'
import { UpdateModal } from '@/components/UpdateModal'
import { AuthProvider } from '@/components/AuthProvider'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { MainLayout } from '@/components/layout'
import {
  LoginPage,
  GoogleCallbackPage,
  AppleCallbackPage,
  DashboardPage,
  TransactionsPage,
  TransactionDetailPage,
  LoansPage,
  LoanDetailPage,
  SettingsPage,
  AccountsPage,
  CategoriesPage,
} from '@/pages'

function App() {
  return (
    <BrowserRouter>
      <VersionProvider>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />
            <Route path="/auth/apple/callback" element={<AppleCallbackPage />} />

            {/* Protected routes with tab bar */}
            <Route
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="transactions" element={<TransactionsPage />} />
              <Route path="loans" element={<LoansPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Protected detail routes without tab bar */}
            <Route
              path="transactions/:id"
              element={
                <ProtectedRoute>
                  <TransactionDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="loans/:id"
              element={
                <ProtectedRoute>
                  <LoanDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="settings/accounts"
              element={
                <ProtectedRoute>
                  <AccountsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="settings/categories"
              element={
                <ProtectedRoute>
                  <CategoriesPage />
                </ProtectedRoute>
              }
            />

            {/* Catch-all redirect to dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <UpdateModal />
        </AuthProvider>
      </VersionProvider>
    </BrowserRouter>
  )
}

export default App
