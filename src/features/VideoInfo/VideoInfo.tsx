import React from 'react'
import { Eye, Video, Calendar, Lock } from 'lucide-react'

export default function VideoInfo() {
  return (
    <article className="mt-3">
      <header className="flex gap-2 text-sm text-slate-400">
        <div className="flex items-center">
          <Lock size={14} className="mr-1" />
          <span>비공개</span>
        </div>
        <div className="flex items-center">
          <Video size={14} className="mr-1" />
          <span>동영상 7개</span>
        </div>
        <div className="flex items-center">
          <Eye size={14} className="mr-1" />
          <span>조회수 20</span>
        </div>
        <div className="flex items-center">
          <Calendar size={14} className="mr-1" />
          <span>7일 전</span>
        </div>
      </header>

      <section>
        <h1 className="mt-3 text-xl font-medium">
          더미글 입니다. 안녕하세요. 오버워치 2 오리사 플레이 영상 모음입니다아아아아.
          화이팅이이이이이임 와우 대박
        </h1>
        <p className="mt-2 text-slate-300">쩔어쩔어 대박 완전 길어요~~~~~</p>
      </section>
    </article>
  )
}
