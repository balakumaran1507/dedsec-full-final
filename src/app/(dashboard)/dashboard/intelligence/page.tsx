/* eslint-disable */
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, FileText, Eye, ThumbsUp, Tag, Loader2, Save, X } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { Writeup as DashboardWriteup, CategoryData } from "@/types/dashboard"
import { getWriteups, createWriteup } from "@/lib/db/writeups"
import { Writeup as FirestoreWriteup, WriteupCategory } from "@/types/writeup"
import { useAuth } from "@/lib/auth/useAuth"
import { Timestamp } from "firebase/firestore"

export default function IntelligencePage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDoc, setSelectedDoc] = useState<DashboardWriteup | null>(null)
  const [activeCategory, setActiveCategory] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [documents, setDocuments] = useState<DashboardWriteup[]>([])
  const [categoryData, setCategoryData] = useState<CategoryData[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)


  const [fullWriteupData, setFullWriteupData] = useState<Record<string, FirestoreWriteup>>({})
  const [newWriteup, setNewWriteup] = useState({
    title: '',
    challengeName: '',
    ctfName: '',
    category: 'Web' as WriteupCategory,
    difficulty: 'Medium',
    content: '',
    tags: ''
  })

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        // Fetch all writeups - try with date sort first, fallback to no sort
        let allWriteups = await getWriteups({ limit: 100, sortBy: 'date' })

        console.log('Fetched writeups:', allWriteups.length)

        if (allWriteups.length === 0) {
          console.log('No writeups with date sort, trying without sort...')
          allWriteups = await getWriteups({ limit: 100 })
          console.log('Fetched writeups without sort:', allWriteups.length)
        }

        // Store full writeup data for viewing
        const fullData: Record<string, FirestoreWriteup> = {}
        allWriteups.forEach(writeup => {
          const writeupId = writeup.id || `writeup_${Math.random()}`
          fullData[writeupId.slice(0, 8).toUpperCase()] = writeup
        })
        setFullWriteupData(fullData)

        // Convert to dashboard format
        const dashboardWriteups: DashboardWriteup[] = allWriteups.map((writeup, index) => {
          const date = writeup.date && 'toDate' in writeup.date
            ? writeup.date.toDate()
            : writeup.date instanceof Date
              ? writeup.date
              : new Date()

          // Handle missing id field (use index as fallback)
          const writeupId = writeup.id || `writeup_${index}`

          return {
            id: writeupId.slice(0, 8).toUpperCase(),
            title: writeup.title || 'Untitled',
            category: writeup.category || 'Misc',
            author: writeup.authorName || 'Unknown',
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            views: 0, // Could be tracked separately
            rating: writeup.upvotes || 0
          }
        })

        setDocuments(dashboardWriteups)

        // Calculate category distribution
        const categoryCounts: Record<string, number> = {}
        allWriteups.forEach(w => {
          categoryCounts[w.category] = (categoryCounts[w.category] || 0) + 1
        })

        const catData: CategoryData[] = Object.entries(categoryCounts).map(([name, value]) => ({
          name,
          value,
          fill: '#525252'
        }))

        setCategoryData(catData)
      } catch (error) {
        console.error("Failed to load intelligence data", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])





  const handleCreateWriteup = async () => {
    if (!user || !newWriteup.title || !newWriteup.challengeName || !newWriteup.content) {
      alert('Please fill in all required fields')
      return
    }

    setIsCreating(true)
    try {
      await createWriteup({
        title: newWriteup.title,
        challengeName: newWriteup.challengeName,
        ctfName: newWriteup.ctfName,
        category: newWriteup.category,
        difficulty: newWriteup.difficulty as any,
        content: newWriteup.content,
        tags: newWriteup.tags.split(',').map(t => t.trim()).filter(t => t),
        authorUid: user.uid,
        authorName: user.displayName
      })

      setIsCreateModalOpen(false)

      // Reload writeups
      const allWriteups = await getWriteups({ limit: 100, sortBy: 'date' })
      const dashboardWriteups: DashboardWriteup[] = allWriteups.map((writeup, index) => {
        const date = writeup.date && 'toDate' in writeup.date
          ? writeup.date.toDate()
          : writeup.date instanceof Date
            ? writeup.date
            : new Date()

        const writeupId = writeup.id || `writeup_${index}`

        return {
          id: writeupId.slice(0, 8).toUpperCase(),
          title: writeup.title || 'Untitled',
          category: writeup.category || 'Misc',
          author: writeup.authorName || 'Unknown',
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          views: 0,
          rating: writeup.upvotes || 0
        }
      })
      setDocuments(dashboardWriteups)

      // Reset form
      setNewWriteup({
        title: '',
        challengeName: '',
        ctfName: '',
        category: 'Web',
        difficulty: 'Medium',
        content: '',
        tags: ''
      })
    } catch (error) {
      console.error('Failed to create writeup:', error)
      alert('Failed to create writeup')
    } finally {
      setIsCreating(false)
    }
  }

  const categories = ["all", "WEB", "PWN", "CRYPTO", "REV", "MISC", "FORENSICS"]

  const filteredDocs = documents.filter(
    (d) =>
      (activeCategory === "all" || d.category.toUpperCase() === activeCategory) &&
      (d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.id.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          <p className="text-xs text-neutral-500 tracking-widest">DECRYPTING ARCHIVES...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-lg text-neutral-200 tracking-[0.2em]">WRITEUPS</h1>
          <p className="text-[10px] text-neutral-600 tracking-wider">CHALLENGE SOLUTIONS</p>
        </div>
        <div className="flex gap-2 flex-wrap">


          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 text-xs tracking-wider"
          >
            + NEW WRITEUP
          </Button>
        </div>
      </div>

      {/* Search & Categories */}
      <div className="flex flex-col lg:flex-row gap-4">
        <Card className="flex-1 bg-neutral-950 border-neutral-900">
          <CardContent className="p-3">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-neutral-600" />
              <Input
                placeholder="SEARCH WRITEUPS..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-7 h-8 bg-neutral-900 border-neutral-800 text-neutral-300 placeholder-neutral-700 text-[10px] tracking-wider"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-1 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 text-[10px] tracking-wider rounded transition-colors ${activeCategory === cat
                ? "bg-neutral-900 text-neutral-200 border border-neutral-800"
                : "text-neutral-600 hover:text-neutral-400 border border-transparent"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-3 grid grid-cols-2 lg:grid-cols-1 gap-3">
          <Card className="bg-neutral-950 border-neutral-900">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-neutral-600 tracking-wider">TOTAL</p>
                  <p className="text-xl text-neutral-100">{documents.length}</p>
                </div>
                <FileText className="w-5 h-5 text-neutral-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-neutral-950 border-neutral-900">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-neutral-600 tracking-wider">VIEWS</p>
                  <p className="text-xl text-neutral-100">0</p>
                </div>
                <Eye className="w-5 h-5 text-neutral-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-neutral-950 border-neutral-900">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-neutral-600 tracking-wider">LIKES</p>
                  <p className="text-xl text-neutral-100">0</p>
                </div>
                <ThumbsUp className="w-5 h-5 text-neutral-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-neutral-950 border-neutral-900">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-neutral-600 tracking-wider">CATEGORIES</p>
                  <p className="text-xl text-neutral-100">{categoryData.length}</p>
                </div>
                <Tag className="w-5 h-5 text-neutral-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="lg:col-span-4 bg-neutral-950 border-neutral-900">
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-[10px] text-neutral-500 tracking-[0.2em]">BY CATEGORY</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="h-40 flex items-center justify-center" style={{ minHeight: '160px' }}>
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={categoryData} layout="vertical">
                    <XAxis type="number" tick={{ fill: "#525252", fontSize: 9 }} axisLine={false} tickLine={false} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fill: "#525252", fontSize: 9 }}
                      axisLine={false}
                      tickLine={false}
                      width={60}
                    />
                    <Bar dataKey="value" fill="#525252" radius={[0, 2, 2, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-[10px] text-neutral-700 tracking-widest">NO CATEGORY DATA</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-5 bg-neutral-950 border-neutral-900">
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-[10px] text-neutral-500 tracking-[0.2em]">RECENT WRITEUPS</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-neutral-900 max-h-60 overflow-y-auto">
              {filteredDocs.length > 0 ? (
                filteredDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-start justify-between p-3 hover:bg-neutral-900/30 transition-colors cursor-pointer"
                    onClick={() => setSelectedDoc(doc)}
                  >
                    <div className="flex items-start gap-3">
                      <FileText className="w-4 h-4 text-neutral-600 mt-0.5" />
                      <div>
                        <div className="text-[10px] text-neutral-300 tracking-wider">{doc.title}</div>
                        <div className="text-[9px] text-neutral-600 mt-1">
                          {doc.id} / {doc.author}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-[9px] text-neutral-600">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {doc.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3" />
                        {doc.rating}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-[10px] text-neutral-700 tracking-widest">NO WRITEUPS FOUND</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedDoc && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="bg-neutral-950 border-neutral-800 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-neutral-900">
              <div className="flex-1">
                <CardTitle className="text-sm text-neutral-200 tracking-wider">{selectedDoc.title}</CardTitle>
                <p className="text-[10px] text-neutral-600 mt-1">ID: {selectedDoc.id}</p>
              </div>
              <Button
                variant="ghost"
                onClick={() => setSelectedDoc(null)}
                className="text-neutral-600 hover:text-neutral-300 h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {/* Writeup Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[10px]">
                <div>
                  <p className="text-neutral-600 tracking-wider mb-1">CATEGORY</p>
                  <span className="px-2 py-1 bg-neutral-800 text-neutral-300 rounded text-[10px]">
                    {selectedDoc.category}
                  </span>
                </div>
                <div>
                  <p className="text-neutral-600 tracking-wider mb-1">AUTHOR</p>
                  <p className="text-neutral-300">{selectedDoc.author}</p>
                </div>
                <div>
                  <p className="text-neutral-600 tracking-wider mb-1">DATE</p>
                  <p className="text-neutral-300">{selectedDoc.date}</p>
                </div>
                <div>
                  <p className="text-neutral-600 tracking-wider mb-1">UPVOTES</p>
                  <p className="text-neutral-300">{selectedDoc.rating}</p>
                </div>
              </div>

              {/* Full Writeup Content */}
              {(() => {
                const writeup = fullWriteupData[selectedDoc.id]
                if (!writeup) return null

                return (
                  <>
                    {writeup.challengeName && (
                      <div className="pt-2 border-t border-neutral-900">
                        <p className="text-[10px] text-neutral-600 tracking-wider mb-1">CHALLENGE</p>
                        <p className="text-xs text-neutral-300">{writeup.challengeName}</p>
                        {writeup.ctfName && (
                          <p className="text-[10px] text-neutral-500">from {writeup.ctfName}</p>
                        )}
                      </div>
                    )}

                    {writeup.difficulty && (
                      <div>
                        <p className="text-[10px] text-neutral-600 tracking-wider mb-1">DIFFICULTY</p>
                        <span className={`px-2 py-1 rounded text-[10px] ${writeup.difficulty === 'Easy' ? 'bg-green-900/30 text-green-400' :
                          writeup.difficulty === 'Medium' ? 'bg-yellow-900/30 text-yellow-400' :
                            writeup.difficulty === 'Hard' ? 'bg-orange-900/30 text-orange-400' :
                              'bg-red-900/30 text-red-400'
                          }`}>
                          {writeup.difficulty}
                        </span>
                      </div>
                    )}

                    {writeup.tags && writeup.tags.length > 0 && (
                      <div>
                        <p className="text-[10px] text-neutral-600 tracking-wider mb-2">TAGS</p>
                        <div className="flex flex-wrap gap-1">
                          {writeup.tags.map((tag, i) => (
                            <span key={i} className="px-2 py-0.5 bg-neutral-800 text-neutral-400 rounded text-[9px]">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-3 border-t border-neutral-900">
                      <p className="text-[10px] text-neutral-600 tracking-wider mb-2">WRITEUP CONTENT</p>
                      <div className="bg-neutral-900 rounded p-4 max-h-96 overflow-y-auto">
                        <pre className="text-xs text-neutral-300 whitespace-pre-wrap font-mono leading-relaxed">
                          {writeup.content}
                        </pre>
                      </div>
                    </div>
                  </>
                )
              })()}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-3">
                <Button className="flex-1 bg-emerald-900 hover:bg-emerald-800 text-neutral-100 border border-emerald-800 text-[10px] tracking-wider h-9">
                  <ThumbsUp className="w-3 h-3 mr-2" />
                  UPVOTE
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Create Writeup Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsCreateModalOpen(false)} />
          <div className="relative w-full max-w-3xl mx-4 my-8 bg-neutral-950 border border-neutral-800 rounded p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg text-neutral-100 tracking-wider">CREATE WRITEUP</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-neutral-500 hover:text-neutral-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-neutral-500 tracking-wider mb-2">TITLE *</label>
                  <Input
                    value={newWriteup.title}
                    onChange={(e) => setNewWriteup({ ...newWriteup, title: e.target.value })}
                    className="bg-neutral-900 border-neutral-800 text-neutral-100 text-sm"
                    placeholder="Writeup title"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-500 tracking-wider mb-2">CHALLENGE NAME *</label>
                  <Input
                    value={newWriteup.challengeName}
                    onChange={(e) => setNewWriteup({ ...newWriteup, challengeName: e.target.value })}
                    className="bg-neutral-900 border-neutral-800 text-neutral-100 text-sm"
                    placeholder="Challenge name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-neutral-500 tracking-wider mb-2">CTF NAME</label>
                  <Input
                    value={newWriteup.ctfName}
                    onChange={(e) => setNewWriteup({ ...newWriteup, ctfName: e.target.value })}
                    className="bg-neutral-900 border-neutral-800 text-neutral-100 text-sm"
                    placeholder="CTF name"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-500 tracking-wider mb-2">CATEGORY *</label>
                  <select
                    value={newWriteup.category}
                    onChange={(e) => setNewWriteup({ ...newWriteup, category: e.target.value as WriteupCategory })}
                    className="w-full bg-neutral-900 border border-neutral-800 text-neutral-100 text-sm rounded-md px-3 py-2"
                  >
                    <option value="Web">Web</option>
                    <option value="Pwn">Pwn</option>
                    <option value="Crypto">Crypto</option>
                    <option value="Reversing">Reversing</option>
                    <option value="Forensics">Forensics</option>
                    <option value="Misc">Misc</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Blockchain">Blockchain</option>
                    <option value="OSINT">OSINT</option>
                    <option value="Hardware">Hardware</option>
                    <option value="AI/ML">AI/ML</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-neutral-500 tracking-wider mb-2">DIFFICULTY</label>
                  <select
                    value={newWriteup.difficulty}
                    onChange={(e) => setNewWriteup({ ...newWriteup, difficulty: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 text-neutral-100 text-sm rounded-md px-3 py-2"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                    <option value="Insane">Insane</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-neutral-500 tracking-wider mb-2">TAGS (comma-separated)</label>
                <Input
                  value={newWriteup.tags}
                  onChange={(e) => setNewWriteup({ ...newWriteup, tags: e.target.value })}
                  className="bg-neutral-900 border-neutral-800 text-neutral-100 text-sm"
                  placeholder="sql-injection, xss, rce"
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-500 tracking-wider mb-2">CONTENT * (Markdown supported)</label>
                <textarea
                  value={newWriteup.content}
                  onChange={(e) => setNewWriteup({ ...newWriteup, content: e.target.value })}
                  className="w-full h-64 bg-neutral-900 border border-neutral-800 text-neutral-100 text-sm rounded-md px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  placeholder="# Challenge Overview&#10;&#10;## Solution&#10;&#10;## Flag&#10;"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-xs border-neutral-800 text-neutral-400 hover:bg-neutral-900 bg-transparent"
              >
                CANCEL
              </Button>
              <Button
                onClick={handleCreateWriteup}
                disabled={isCreating}
                className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                    CREATING...
                  </>
                ) : (
                  <>
                    <Save className="w-3 h-3 mr-2" />
                    CREATE WRITEUP
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
