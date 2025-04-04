import { Search } from 'lucide-react'
import { useState } from 'react'
import { Input } from '@/shared/components/ui/input'
import { cn } from '@/shared/model/lib/utils'

interface SearchBarProps {
  placeholder?: string
  onChange?: (value: string) => void
  onSearch?: (value: string) => void
  className?: string
}

export default function SearchBar({
  placeholder = '검색어를 입력해주세요.',
  onChange,
  onSearch,
  className,
}: SearchBarProps) {
  const [query, setQuery] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    onChange?.(value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(query)
  }

  return (
    <form onSubmit={handleSubmit} className={cn('relative flex w-full items-center', className)}>
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        className="w-full bg-[#1A2234] pr-4 pl-10 text-white placeholder:text-white/60"
      />
      <div className="absolute top-1/2 left-3 -translate-y-1/2 text-white/60">
        <Search className="h-5 w-5" />
      </div>
    </form>
  )
}
