import { useState } from 'react'
import {
  Button, Input, Textarea, Select, Checkbox, Switch,
  Card, CardHeader, Badge, Avatar, Tooltip, Dropdown,
  Modal, Drawer, Tabs, Accordion,
  Skeleton, SkeletonCard, SkeletonTable,
  EmptyState, Pagination, Breadcrumb, PageHeader, StatCard,
} from '@/components/ui'
import {
  Users, DollarSign, Eye, ShoppingCart, Plus, Download,
  MoreVertical, Edit, Trash2, Settings, LogOut, Inbox,
} from 'lucide-react'
import { formatNumber } from '@/lib/formatters'

export default function KitchenSink() {
  const [tab, setTab] = useState('overview')
  const [page, setPage] = useState(1)
  const [modal, setModal] = useState(false)
  const [drawer, setDrawer] = useState(false)

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      <PageHeader
        title="UI Kit — تست کامپوننت‌ها"
        description="این صفحه موقت است و در فاز نهایی حذف می‌شود"
        breadcrumb={<Breadcrumb items={[{ label: 'خانه', to: '/' }, { label: 'UI Kit' }]} />}
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4" /> خروجی
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4" /> افزودن
            </Button>
          </div>
        }
      />

      {/* Stat Cards */}
      <section>
        <h2 className="font-bold mb-3">Stat Cards</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="کاربران" value={formatNumber(8420)} change={12.5} icon={Users} gradient />
          <StatCard label="درآمد" value={formatNumber(27400000)} change={8.2} icon={DollarSign} delay={0.05} />
          <StatCard label="بازدید" value={formatNumber(121000)} change={-3.1} icon={Eye} delay={0.1} />
          <StatCard label="سفارش‌ها" value={formatNumber(1260)} change={5.7} icon={ShoppingCart} delay={0.15} />
        </div>
      </section>

      {/* Buttons */}
      <section>
        <h2 className="font-bold mb-3">Buttons</h2>
        <div className="flex flex-wrap gap-2">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button loading>Loading</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
        </div>
      </section>

      {/* Form */}
      <section>
        <h2 className="font-bold mb-3">Form</h2>
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="نام" placeholder="نام خود را وارد کنید" icon={Users} />
            <Input label="ایمیل" placeholder="email@example.com" error="ایمیل نامعتبر است" />
            <Select
              label="نقش"
              placeholder="انتخاب کنید"
              options={[
                { value: 'admin', label: 'مدیر' },
                { value: 'editor', label: 'ویرایشگر' },
                { value: 'viewer', label: 'بیننده' },
              ]}
            />
            <Input label="با راهنما" hint="این یک راهنماست" />
          </div>
          <div className="mt-4">
            <Textarea label="توضیحات" placeholder="..." />
          </div>
          <div className="mt-4 flex flex-wrap gap-6">
            <Checkbox label="مرا به خاطر بسپار" defaultChecked />
            <Switch label="اعلان‌ها" defaultChecked />
          </div>
        </Card>
      </section>

      {/* Badges & Avatars */}
      <section>
        <h2 className="font-bold mb-3">Badges & Avatars</h2>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge>پیش‌فرض</Badge>
          <Badge variant="success">فعال</Badge>
          <Badge variant="warning">در انتظار</Badge>
          <Badge variant="danger">غیرفعال</Badge>
          <Badge variant="info">اطلاع</Badge>
          <Badge variant="brand">ویژه</Badge>
        </div>
        <div className="flex items-center gap-3">
          <Avatar name="علی محمدی" size="sm" status="active" />
          <Avatar name="سارا احمدی" status="pending" />
          <Avatar name="رضا کریمی" size="lg" status="inactive" />
          <Avatar name="مریم رحیمی" size="xl" status="active" />
        </div>
      </section>

      {/* Tooltip & Dropdown */}
      <section>
        <h2 className="font-bold mb-3">Tooltip & Dropdown</h2>
        <div className="flex items-center gap-4">
          <Tooltip content="این یک tooltip است">
            <Button variant="outline">هاور کن</Button>
          </Tooltip>
          <Dropdown
            trigger={
              <Button variant="outline">
                <MoreVertical className="w-4 h-4" /> منو
              </Button>
            }
            items={[
              { label: 'ویرایش', icon: Edit, onClick: () => {} },
              { label: 'تنظیمات', icon: Settings, onClick: () => {} },
              { divider: true },
              { label: 'حذف', icon: Trash2, danger: true, onClick: () => {} },
            ]}
          />
        </div>
      </section>

      {/* Tabs */}
      <section>
        <h2 className="font-bold mb-3">Tabs</h2>
        <Tabs
          value={tab}
          onChange={setTab}
          tabs={[
            { value: 'overview', label: 'نمای کلی' },
            { value: 'analytics', label: 'تحلیلی' },
            { value: 'reports', label: 'گزارش‌ها' },
          ]}
        />
      </section>

      {/* Modal & Drawer */}
      <section>
        <h2 className="font-bold mb-3">Modal & Drawer</h2>
        <div className="flex gap-2">
          <Button onClick={() => setModal(true)}>باز کردن Modal</Button>
          <Button variant="outline" onClick={() => setDrawer(true)}>باز کردن Drawer</Button>
        </div>

        <Modal
          open={modal}
          onClose={() => setModal(false)}
          title="عنوان Modal"
          description="این یک توضیح کوتاه است"
          footer={
            <>
              <Button variant="ghost" onClick={() => setModal(false)}>انصراف</Button>
              <Button onClick={() => setModal(false)}>تأیید</Button>
            </>
          }
        >
          <Input label="نام" placeholder="..." />
        </Modal>

        <Drawer
          open={drawer}
          onClose={() => setDrawer(false)}
          title="Drawer"
          footer={
            <>
              <Button variant="ghost" onClick={() => setDrawer(false)}>انصراف</Button>
              <Button onClick={() => setDrawer(false)}>ذخیره</Button>
            </>
          }
        >
          <div className="space-y-4">
            <Input label="نام" />
            <Input label="ایمیل" />
          </div>
        </Drawer>
      </section>

      {/* Accordion */}
      <section>
        <h2 className="font-bold mb-3">Accordion</h2>
        <Accordion
          items={[
            { title: 'سوال اول', content: 'پاسخ سوال اول...' },
            { title: 'سوال دوم', content: 'پاسخ سوال دوم...' },
            { title: 'سوال سوم', content: 'پاسخ سوال سوم...' },
          ]}
        />
      </section>

      {/* Skeleton */}
      <section>
        <h2 className="font-bold mb-3">Skeleton</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <div className="mt-4">
          <SkeletonTable rows={3} />
        </div>
      </section>

      {/* Empty State */}
      <section>
        <h2 className="font-bold mb-3">Empty State</h2>
        <Card>
          <EmptyState
            icon={Inbox}
            title="هیچ داده‌ای وجود ندارد"
            description="اولین آیتم خود را اضافه کنید"
            action={<Button size="sm"><Plus className="w-4 h-4" /> افزودن</Button>}
          />
        </Card>
      </section>

      {/* Pagination */}
      <section>
        <h2 className="font-bold mb-3">Pagination</h2>
        <Card>
          <Pagination page={page} pageSize={10} total={120} onPageChange={setPage} />
        </Card>
      </section>
    </div>
  )
}