import React from 'react'
import { Heart, Bookmark } from 'lucide-react'
import {
  Avatar as AvatarComponent,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui/avatar'

export default function AuthorInfo() {
  return (
    <div className="mt-4 mb-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <AvatarComponent className="h-12 w-12">
          <AvatarImage src="https://github.com/shadcn.png" alt="작성자 이미지" />
          <AvatarFallback>JK</AvatarFallback>
        </AvatarComponent>
        <div>
          <p className="text-lg font-medium text-white">짜파게티오리사</p>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <div className="flex flex-col items-center">
          <Heart className="h-7 w-7 text-slate-300" />
          <span className="mt-1 text-sm text-slate-400">332</span>
        </div>
        <div className="flex flex-col items-center">
          <Bookmark className="h-7 w-7 text-slate-300" />
          <span className="mt-1 text-sm text-slate-400">21</span>
        </div>
      </div>
    </div>
  )
}
