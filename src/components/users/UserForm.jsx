import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, Input, Select } from '@/components/ui'

const schema = z.object({
  name: z.string().min(2, 'نام باید حداقل ۲ کاراکتر باشد'),
  email: z.string().email('ایمیل نامعتبر است'),
  role: z.enum(['admin', 'editor', 'viewer']),
  status: z.enum(['active', 'inactive', 'pending']),
})

export default function UserForm({ defaultValues, onSubmit, onCancel }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      email: defaultValues?.email ?? '',
      role: defaultValues?.role ?? 'viewer',
      status: defaultValues?.status ?? 'active',
    },
  })

  const handleSave = (data) => {
    onSubmit({
      ...data,
      joinedAt: defaultValues?.joinedAt ?? new Date().toISOString().slice(0, 10),
    })
  }

  return (
    <form onSubmit={handleSubmit(handleSave)} className="space-y-4">
      <Input
        label="نام کامل"
        placeholder="مثلاً علی محمدی"
        error={errors.name?.message}
        {...register('name')}
      />
      <Input
        label="ایمیل"
        type="email"
        placeholder="email@example.com"
        error={errors.email?.message}
        {...register('email')}
      />
      <div className="grid grid-cols-2 gap-3">
        <Select
          label="نقش"
          error={errors.role?.message}
          options={[
            { value: 'admin', label: 'مدیر' },
            { value: 'editor', label: 'ویرایشگر' },
            { value: 'viewer', label: 'بیننده' },
          ]}
          {...register('role')}
        />
        <Select
          label="وضعیت"
          error={errors.status?.message}
          options={[
            { value: 'active', label: 'فعال' },
            { value: 'inactive', label: 'غیرفعال' },
            { value: 'pending', label: 'در انتظار' },
          ]}
          {...register('status')}
        />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>انصراف</Button>
        <Button type="submit" loading={isSubmitting}>
          {defaultValues ? 'ذخیره تغییرات' : 'افزودن'}
        </Button>
      </div>
    </form>
  )
}