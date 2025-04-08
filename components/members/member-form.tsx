import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Calendar as CalendarIcon, Loader2 } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { MemberFormData } from "@/lib/api"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Form schema
const formSchema = z.object({
  full_name: z.string().min(3, { message: "Nama lengkap harus diisi minimal 3 karakter" }),
  email: z.string().email({ message: "Format email tidak valid" }),
  phone_number: z.string().min(10, { message: "Nomor telepon harus diisi minimal 10 karakter" }),
  birth_date: z.date({
    required_error: "Tanggal lahir harus diisi",
  }),
  division: z.string().min(1, { message: "Divisi harus diisi" }),
  address: z.string().min(5, { message: "Alamat harus diisi minimal 5 karakter" }),
  position: z.string().min(1, { message: "Jabatan harus diisi" }),
})

interface MemberFormProps {
  defaultValues?: Partial<Omit<MemberFormData, 'birth_date'> & { birth_date: Date | string }>
  onSubmit: (data: z.infer<typeof formSchema>) => void
  isSubmitting?: boolean
}

export function MemberForm({ defaultValues, onSubmit, isSubmitting = false }: MemberFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: defaultValues?.full_name || "",
      email: defaultValues?.email || "",
      phone_number: defaultValues?.phone_number || "",
      birth_date: defaultValues?.birth_date ? (defaultValues.birth_date instanceof Date ? defaultValues.birth_date : new Date(defaultValues.birth_date)) : new Date(),
      division: defaultValues?.division || "",
      address: defaultValues?.address || "",
      position: defaultValues?.position || "",
    },
  })

  // List of divisions
  const divisions = [
    "Pengurus Inti",
    "Divisi Pendidikan",
    "Divisi Sosial",
    "Divisi Keagamaan",
    "Divisi Olahraga",
    "Divisi Kesenian",
    "Divisi Humas",
  ]

  // List of positions
  const positions = [
    "Ketua",
    "Wakil Ketua",
    "Sekretaris",
    "Bendahara",
    "Koordinator",
    "Anggota",
  ]

  function handleSubmit(values: z.infer<typeof formSchema>) {
    // Format the date to ISO string (YYYY-MM-DD)
    const formattedValues = {
      ...values,
      birth_date: values.birth_date.toISOString().split('T')[0],
    }
    onSubmit(formattedValues as any)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Lengkap</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan nama lengkap" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan alamat email" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nomor Telepon</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan nomor telepon" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="birth_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Tanggal Lahir</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP", { locale: id })
                      ) : (
                        <span>Pilih tanggal</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="division"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Divisi</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih divisi" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {divisions.map((division) => (
                    <SelectItem key={division} value={division}>
                      {division}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="position"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jabatan</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jabatan" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {positions.map((position) => (
                    <SelectItem key={position} value={position}>
                      {position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alamat</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan alamat lengkap" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            "Simpan"
          )}
        </Button>
      </form>
    </Form>
  )
}
