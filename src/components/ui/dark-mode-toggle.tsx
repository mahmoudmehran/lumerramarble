'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

interface DarkModeToggleProps {
  enabled?: boolean
  className?: string
}

export function DarkModeToggle({ enabled = true, className = '' }: DarkModeToggleProps) {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Check if dark mode is enabled from settings
    if (!enabled) return
    
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark)
    setIsDark(shouldBeDark)
    
    if (shouldBeDark) {
      document.documentElement.classList.add('dark')
    }
  }, [enabled])

  const toggleDarkMode = () => {
    if (!enabled) return
    
    const newDarkMode = !isDark
    setIsDark(newDarkMode)
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted || !enabled) return null

  return (
    <button
      onClick={toggleDarkMode}
      className={`p-2 rounded-lg transition-colors duration-200 hover:bg-[var(--color-quinary-200)] ${className}`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'الوضع النهاري' : 'الوضع الليلي'}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-[var(--color-warning)]" />
      ) : (
        <Moon className="w-5 h-5 text-[var(--color-quaternary-700)]" />
      )}
    </button>
  )
}
