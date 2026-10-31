import { useEffect, useMemo, useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table'
import {
  Plus, Search, Trash2, Edit, MoreVertical,
  ChevronUp, ChevronDown, ChevronsUpDown, Users as UsersIcon,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import {
  PageHeader, Button, Input, Select, Badge, Avatar,
  Card, Modal, Dropdown, Pagination, EmptyState,
  SkeletonTable, Checkbox,
} from '@/components/ui'
import { api } from '@/lib/api'
import { formatDate } from '@/lib/formatters'
import { cn } from '@/lib/cn'
import UserForm from '@/components/users/UserForm'

const ROLE_LABEL = { admin: 'مدیر', editor: 'ویرایشگر', viewer: 'بیننده' }
const STATUS_LABEL = { active: 'فعال', inactive: 'غیرفعال', pending: 'در انتظار' }
const STATUS_VARIANT = { active: 'success', inactive: 'default', pending: 'warning' }

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [globalFilter, setGlobalFilter] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sorting, setSorting] = useState([{ id: 'joinedAt', desc: true }])

  const [modalOpen, setModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  async function load() {
    setLoading(true)
    try {
      const data = await api.getUsers()
      setUsers(data)
    } catch (e) {
      toast.error('خطا در بارگذاری کاربران')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  // فیلترهای دستی
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (roleFilter && u.role !== roleFilter) return false
      if (statusFilter && u.status !== statusFilter) return false
      return true
    })
  }, [users, roleFilter, statusFilter])

  // === Columns ===
  const columns = useMemo(() => [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllRowsSelected()}
          indeterminate={table.getIsSomeRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onChange={row.getToggleSelectedHandler()}
        />
      ),
      size: 40,
      enableSorting: false,
    },
    {
      id: 'name',
      accessorKey: 'name',
      header: 'کاربر',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.original.name} status={row.original.status} size="sm" />
          <div className="min-w-0">
            <p className="font-medium truncate">{row.original.name}</p>
            <p className="text-xs text-slate-500 truncate">{row.original.email}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'role',
      header: 'نقش',
      cell: ({ getValue }) => (
        <span className="text-sm">{ROLE_LABEL[getValue()] ?? getValue()}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'وضعیت',
      cell: ({ getValue }) => (
        <Badge variant={STATUS_VARIANT[getValue()] ?? 'default'}>
          {STATUS_LABEL[getValue()] ?? getValue()}
        </Badge>
      ),
    },
    {
      accessorKey: 'joinedAt',
      header: 'تاریخ عضویت',
      cell: ({ getValue }) => (
        <span className="text-sm text-slate-500">{formatDate(getValue())}</span>
      ),
    },
    {
      id: 'actions',
      header: '',
      enableSorting: false,
      cell: ({ row }) => (
        <Dropdown
          trigger={
            <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition">
              <MoreVertical className="w-4 h-4" />
            </button>
          }
items={[
  {
    label: 'ویرایش',
    icon: Edit,
    onClick: () => {
      console.log('editing user:', row.original)  // ← اضافه کن برای دیباگ
      setEditingUser(row.original)
      setModalOpen(true)
    },
  },
  { divider: true },
  {
    label: 'حذف',
    icon: Trash2,
    danger: true,
    onClick: () => setDeleteTarget(row.original),
  },
]}
        />
      ),
      size: 50,
    },
  ], [])

  const table = useReactTable({
    data: filteredUsers,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: (row, _id, value) => {
      const search = value.toLowerCase()
      return (
        row.original.name.toLowerCase().includes(search) ||
        row.original.email.toLowerCase().includes(search)
      )
    },
    initialState: { pagination: { pageSize: 8 } },
  })

  // === Handlers ===
  const openAdd = () => { setEditingUser(null); setModalOpen(true) }
  const closeModal = () => { setModalOpen(false); setEditingUser(null) }

  const handleSave = async (data) => {
    try {
      if (editingUser) {
        const updated = await api.updateUser(editingUser.id, data)
        setUsers((prev) => prev.map((u) => (u.id === editingUser.id ? updated : u)))
        toast.success('کاربر با موفقیت ویرایش شد')
      } else {
        const created = await api.createUser({
          ...data,
          joinedAt: new Date().toISOString().slice(0, 10),
        })
        setUsers((prev) => [...prev, created])
        toast.success('کاربر با موفقیت افزوده شد')
      }
      closeModal()
    } catch (e) {
      toast.error(e.message || 'خطا در ذخیره‌سازی')
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await api.deleteUser(deleteTarget.id)
      setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id))
      toast.success('کاربر حذف شد')
      setDeleteTarget(null)
    } catch (e) {
      toast.error(e.message || 'خطا در حذف')
    }
  }

  const selectedIds = table.getSelectedRowModel().rows.map((r) => r.original.id)
  const handleBulkDelete = async () => {
    if (!selectedIds.length) return
    try {
      await Promise.all(selectedIds.map((id) => api.deleteUser(id)))
      setUsers((prev) => prev.filter((u) => !selectedIds.includes(u.id)))
      table.resetRowSelection()
      toast.success(`${selectedIds.length} کاربر حذف شد`)
    } catch (e) {
      toast.error('خطا در حذف گروهی')
    }
  }

  const clearFilters = () => {
    setGlobalFilter('')
    setRoleFilter('')
    setStatusFilter('')
  }
  const hasFilters = globalFilter || roleFilter || statusFilter

  return (
    <div className="space-y-4">
      <PageHeader
        title="کاربران"
        description={`مدیریت ${users.length} کاربر`}
        action={
          <Button onClick={openAdd}>
            <Plus className="w-4 h-4" /> افزودن کاربر
          </Button>
        }
      />

      {/* Filters bar */}
      <Card className="!p-3">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="جستجو در نام یا ایمیل..."
              icon={Search}
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
          </div>
          <Select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            placeholder="همه نقش‌ها"
            options={Object.entries(ROLE_LABEL).map(([v, l]) => ({ value: v, label: l }))}
            className="min-w-[140px]"
          />
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            placeholder="همه وضعیت‌ها"
            options={Object.entries(STATUS_LABEL).map(([v, l]) => ({ value: v, label: l }))}
            className="min-w-[140px]"
          />
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="w-4 h-4" /> پاک کردن
            </Button>
          )}
        </div>

        {selectedIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 flex items-center gap-3 p-2.5 rounded-xl bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/20"
          >
            <span className="text-sm font-medium">
              {selectedIds.length} کاربر انتخاب شده
            </span>
            <Button variant="danger" size="sm" onClick={handleBulkDelete}>
              <Trash2 className="w-4 h-4" /> حذف
            </Button>
          </motion.div>
        )}
      </Card>

      {/* Table */}
      <Card className="!p-0 overflow-hidden">
        {loading ? (
          <div className="p-5"><SkeletonTable rows={6} /></div>
        ) : filteredUsers.length === 0 ? (
          <EmptyState
            icon={UsersIcon}
            title="کاربری یافت نشد"
            description={hasFilters ? 'با فیلترهای دیگری امتحان کنید' : 'اولین کاربر را اضافه کنید'}
            action={
              hasFilters
                ? <Button variant="outline" size="sm" onClick={clearFilters}>پاک کردن فیلترها</Button>
                : <Button size="sm" onClick={openAdd}><Plus className="w-4 h-4" /> افزودن کاربر</Button>
            }
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-white/[0.02] border-b border-slate-200 dark:border-slate-800">
                  {table.getHeaderGroups().map((hg) => (
                    <tr key={hg.id}>
                      {hg.headers.map((header) => (
                        <th
                          key={header.id}
                          className="px-4 py-3 text-right font-medium text-slate-500 whitespace-nowrap"
                          style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                        >
                          {header.isPlaceholder ? null : (
                            <div
                              className={cn(
                                'inline-flex items-center gap-1',
                                header.column.getCanSort() && 'cursor-pointer select-none hover:text-slate-800 dark:hover:text-white'
                              )}
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              {flexRender(header.column.columnDef.header, header.getContext())}
                              {header.column.getCanSort() && (
                                header.column.getIsSorted() === 'asc' ? <ChevronUp className="w-3.5 h-3.5" />
                                : header.column.getIsSorted() === 'desc' ? <ChevronDown className="w-3.5 h-3.5" />
                                : <ChevronsUpDown className="w-3.5 h-3.5 opacity-40" />
                              )}
                            </div>
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className={cn(
                        'border-b border-slate-100 dark:border-slate-800/60 last:border-0',
                        'hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors',
                        row.getIsSelected() && 'bg-brand-50/50 dark:bg-brand-500/5'
                      )}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-4 py-3">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-slate-200 dark:border-slate-800">
              <Pagination
                page={table.getState().pagination.pageIndex + 1}
                pageSize={table.getState().pagination.pageSize}
                total={filteredUsers.length}
                onPageChange={(p) => table.setPageIndex(p - 1)}
              />
            </div>
          </>
        )}
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editingUser ? 'ویرایش کاربر' : 'افزودن کاربر جدید'}
        size="md"
      >
<UserForm
  key={editingUser?.id ?? 'new'}
  defaultValues={editingUser}
  onSubmit={handleSave}
  onCancel={closeModal}
/>
      </Modal>

      {/* Delete confirm */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="حذف کاربر"
        description={`آیا مطمئنید که می‌خواهید «${deleteTarget?.name}» را حذف کنید؟ این عمل بازگشت‌ناپذیر است.`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>انصراف</Button>
            <Button variant="danger" onClick={handleDelete}>حذف</Button>
          </>
        }
      />
    </div>
  )
}