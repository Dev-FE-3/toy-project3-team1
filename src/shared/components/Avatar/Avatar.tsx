import {
  Avatar as AvatarComponent,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui/avatar'

export default function Avatar() {
  return (
    <>
      <AvatarComponent>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </AvatarComponent>
    </>
  )
}
