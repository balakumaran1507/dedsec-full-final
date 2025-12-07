import { NextRequest, NextResponse } from 'next/server'

// Seeded random number generator for consistent but varying data
const seededRandom = (seed: number, min: number, max: number) => {
  const x = Math.sin(seed) * 10000
  return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min
}

// Generate dynamic profile stats
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    // Use timestamp-based seed that changes every 30 seconds for smooth updates
    const seed = Math.floor(Date.now() / 30000)

    // Dynamic solve history (last 6 months)
    const months = ['JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
    const solveHistory = months.map((month, i) => ({
      month,
      solves: seededRandom(seed + i, 8, 20) + i
    }))

    // Category breakdown - varies slightly
    const categories = [
      { name: 'Web', value: seededRandom(seed, 8, 15), fill: '#10b981' },
      { name: 'Pwn', value: seededRandom(seed + 1, 5, 12), fill: '#3b82f6' },
      { name: 'Rev', value: seededRandom(seed + 2, 4, 10), fill: '#8b5cf6' },
      { name: 'Crypto', value: seededRandom(seed + 3, 6, 14), fill: '#f59e0b' },
      { name: 'Misc', value: seededRandom(seed + 4, 3, 8), fill: '#6366f1' }
    ]

    // Difficulty breakdown - dynamic
    const difficultyBreakdown = [
      { name: 'Easy', count: seededRandom(seed, 15, 25) },
      { name: 'Med', count: seededRandom(seed + 1, 10, 18) },
      { name: 'Hard', count: seededRandom(seed + 2, 5, 12) }
    ]

    // Recent solves with varied data
    const challengePool = [
      { name: 'SQL Injection Master', category: 'Web', points: 500 },
      { name: 'Buffer Overflow', category: 'Pwn', points: 350 },
      { name: 'RSA Decryption', category: 'Crypto', points: 450 },
      { name: 'Reverse Shell', category: 'Rev', points: 300 },
      { name: 'XSS Hunter', category: 'Web', points: 400 },
      { name: 'Format String Attack', category: 'Pwn', points: 480 },
      { name: 'AES Cracking', category: 'Crypto', points: 520 },
      { name: 'Binary Analysis', category: 'Rev', points: 380 }
    ]

    const recentSolves = challengePool
      .slice(seed % 4, (seed % 4) + 4)
      .map((challenge, i) => ({
        ...challenge,
        time: i === 0 ? '2 hours ago' :
              i === 1 ? '5 hours ago' :
              i === 2 ? '1 day ago' : '2 days ago'
      }))

    return NextResponse.json({
      success: true,
      data: {
        solveHistory,
        categoryStats: categories,
        difficultyBreakdown,
        recentSolves
      }
    })
  } catch (error) {
    console.error('Profile stats error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch profile stats' },
      { status: 500 }
    )
  }
}
