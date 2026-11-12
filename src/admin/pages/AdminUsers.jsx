import { useState, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Users,
  Search,
  Filter,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  UserX,
  Mail,
} from 'lucide-react'
import { fetchUsers, toggleBlockUser } from '../../redux/usersSlice'
import { showToast } from '../../redux/toastSlice'
import { ConfirmModal } from '../components/ConfirmModal'
import { Pagination } from '../components/Pagination'
import { StatusBadge } from '../components/StatusBadge'
import { EmptyState } from '../components/EmptyState'

export default function AdminUsers() {
  const dispatch = useDispatch()
  const { items: users = [], loading } = useSelector((state) => state.users)

  // Filters & Pagination
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 8

  // Block Modal state
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [targetUser, setTargetUser] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(u.id)?.toLowerCase().includes(searchTerm.toLowerCase())

      const isBlocked = Boolean(u.isBlocked)
      const matchesStatus =
        statusFilter === 'All'
          ? true
          : statusFilter === 'active'
          ? !isBlocked
          : isBlocked

      return matchesSearch && matchesStatus
    })
  }, [users, searchTerm, statusFilter])

  // Paginated
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredUsers.slice(start, start + pageSize)
  }, [filteredUsers, currentPage, pageSize])

  function handleOpenToggle(user) {
    setTargetUser(user)
    setIsConfirmOpen(true)
  }

  async function handleConfirmToggle() {
    if (!targetUser) return
    setActionLoading(true)
    const willBlock = !targetUser.isBlocked

    try {
      await dispatch(
        toggleBlockUser({ id: targetUser.id, isBlocked: targetUser.isBlocked })
      ).unwrap()

      dispatch(
        showToast(
          `User "${targetUser.name}" has been ${
            willBlock ? 'blocked' : 'unblocked'
          } successfully.`,
          willBlock ? 'warning' : 'success'
        )
      )
      setIsConfirmOpen(false)
      setTargetUser(null)
    } catch (err) {
      dispatch(showToast(err || 'Failed to update user status.', 'error'))
    } finally {
      setActionLoading(false)
    }
  }

  const getInitials = (name) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-xl font-bold font-serif text-[#263D70]">
            Users Management ({filteredUsers.length})
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Monitor registered customers, manage account access, and block/unblock users
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <span>
              {users.filter((u) => !u.isBlocked).length} Active
            </span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-800 text-xs font-semibold">
            <UserX className="w-4 h-4 text-rose-600" />
            <span>
              {users.filter((u) => u.isBlocked).length} Blocked
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search users by name, email, or user ID..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#263D70]/10 focus:border-[#263D70] transition"
          />
        </div>

        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#263D70]/10 focus:border-[#263D70] transition cursor-pointer appearance-none"
          >
            <option value="All">All User Statuses</option>
            <option value="active">Active Only</option>
            <option value="blocked">Blocked Only</option>
          </select>
          <Filter className="w-3.5 h-3.5 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading && users.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-3 border-[#263D70]/20 border-t-[#263D70] rounded-full animate-spin mb-3" />
            <p className="text-xs text-gray-400 font-medium">
              Loading users list...
            </p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No Users Found"
            description={
              searchTerm || statusFilter !== 'All'
                ? 'No users match your search query or filter selection.'
                : 'No users have registered on your store yet.'
            }
            actionLabel={
              searchTerm || statusFilter !== 'All' ? 'Reset Filters' : undefined
            }
            onAction={() => {
              setSearchTerm('')
              setStatusFilter('All')
            }}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F7F5F0]/70 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Account ID</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Access Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedUsers.map((user) => {
                    const isBlocked = Boolean(user.isBlocked)
                    return (
                      <tr
                        key={user.id}
                        className={`hover:bg-gray-50/70 transition ${
                          isBlocked ? 'bg-rose-50/30' : ''
                        }`}
                      >
                        {/* Avatar & Name */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                                isBlocked
                                  ? 'bg-rose-100 text-rose-700'
                                  : 'bg-[#263D70]/10 text-[#263D70]'
                              }`}
                            >
                              {getInitials(user.name)}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">
                                {user.name}
                              </p>
                              <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                                Customer
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-gray-600 font-medium">
                            <Mail className="w-3.5 h-3.5 text-gray-400" />
                            <span>{user.email}</span>
                          </div>
                        </td>

                        {/* Account ID */}
                        <td className="px-6 py-4">
                          <span className="font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded text-[11px]">
                            {user.id}
                          </span>
                        </td>

                        {/* Status Badge */}
                        <td className="px-6 py-4">
                          <StatusBadge status={isBlocked} type="user" />
                        </td>

                        {/* Action: Block / Unblock */}
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleOpenToggle(user)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer shadow-xs ${
                              isBlocked
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                            }`}
                          >
                            {isBlocked ? (
                              <>
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Unblock User</span>
                              </>
                            ) : (
                              <>
                                <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                                <span>Block User</span>
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalItems={filteredUsers.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmToggle}
        title={targetUser?.isBlocked ? 'Unblock User Account?' : 'Block User Account?'}
        message={
          targetUser?.isBlocked
            ? `Are you sure you want to restore access for "${targetUser?.name}" (${targetUser?.email})? They will immediately be able to log in and make purchases.`
            : `Are you sure you want to block "${targetUser?.name}" (${targetUser?.email})? They will immediately be restricted from logging in to the store.`
        }
        confirmText={
          targetUser?.isBlocked ? 'Yes, Unblock User' : 'Yes, Block User'
        }
        type={targetUser?.isBlocked ? 'primary' : 'danger'}
        loading={actionLoading}
      />
    </div>
  )
}
