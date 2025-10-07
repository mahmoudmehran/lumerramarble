import { redirect } from 'next/navigation'

export default function Home() {
  // Redirect to Arabic by default (can be changed to detect user language)
  redirect('/ar')
}
