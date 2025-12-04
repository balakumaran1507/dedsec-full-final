"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, FileText, Eye, ThumbsUp, Tag } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"

export default function IntelligencePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDoc, setSelectedDoc] = useState<any>(null)
  const [activeCategory, setActiveCategory] = useState("all")

  const documents = [
    {
      id: "WU-001",
      title: "[WEB] SQL Injection in Login - HKCERT 2024",
      category: "WEB",
      author: "sp3c7r0",
      date: "2024-11-08",
      views: 320,
      rating: 45,
    },
    {
      id: "WU-002",
      title: "[CRYPTO] RSA Weak Exponent Attack",
      category: "CRYPTO",
      author: "n1ghtm4r3",
      date: "2024-11-07",
      views: 540,
      rating: 67,
    },
    {
      id: "WU-003",
      title: "[PWN] Stack Buffer Overflow with ROP",
      category: "PWN",
      author: "ph4nt0m",
      date: "2024-11-05",
      views: 210,
      rating: 34,
    },
    {
      id: "WU-004",
      title: "[REV] Keygen Challenge - Static Analysis",
      category: "REV",
      author: "d4rk0n3",
      date: "2024-11-03",
      views: 180,
      rating: 28,
    },
  ]

  const categoryData = [
    { cat: "WEB", count: 45 },
    { cat: "PWN", count: 32 },
    { cat: "CRYPTO", count: 38 },
    { cat: "REV", count: 28 },
    { cat: "MISC", count: 24 },
    { cat: "FORENSICS", count: 18 },
  ]

  const categories = ["all", "WEB", "PWN", "CRYPTO", "REV", "MISC", "FORENSICS"]

  const filteredDocs = documents.filter(
    (d) =>
      (activeCategory === "all" || d.category === activeCategory) &&
      (d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.id.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-lg text-neutral-200 tracking-[0.2em]">WRITEUPS</h1>
          <p className="text-[10px] text-neutral-600 tracking-wider">CHALLENGE SOLUTIONS</p>
        </div>
        <Button className="bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 text-xs tracking-wider">
          + NEW WRITEUP
        </Button>
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
              className={`px-3 py-1.5 text-[10px] tracking-wider rounded transition-colors ${
                activeCategory === cat
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
                  <p className="text-xl text-neutral-100">185</p>
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
                  <p className="text-xl text-neutral-100">12K</p>
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
                  <p className="text-xl text-neutral-100">847</p>
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
                  <p className="text-xl text-neutral-100">6</p>
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
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical">
                  <XAxis type="number" tick={{ fill: "#525252", fontSize: 9 }} axisLine={false} tickLine={false} />
                  <YAxis
                    type="category"
                    dataKey="cat"
                    tick={{ fill: "#525252", fontSize: 9 }}
                    axisLine={false}
                    tickLine={false}
                    width={60}
                  />
                  <Bar dataKey="count" fill="#525252" radius={[0, 2, 2, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-5 bg-neutral-950 border-neutral-900">
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-[10px] text-neutral-500 tracking-[0.2em]">RECENT WRITEUPS</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-neutral-900 max-h-60 overflow-y-auto">
              {filteredDocs.map((doc) => (
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
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedDoc && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="bg-neutral-950 border-neutral-800 w-full max-w-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-xs text-neutral-200 tracking-wider">{selectedDoc.title}</CardTitle>
                <p className="text-[10px] text-neutral-600 mt-1">{selectedDoc.id}</p>
              </div>
              <Button
                variant="ghost"
                onClick={() => setSelectedDoc(null)}
                className="text-neutral-600 hover:text-neutral-300 h-6 w-6 p-0"
              >
                x
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-[10px]">
                <div>
                  <p className="text-neutral-600 tracking-wider mb-1">CATEGORY</p>
                  <p className="text-neutral-300">{selectedDoc.category}</p>
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
                  <p className="text-neutral-600 tracking-wider mb-1">VIEWS</p>
                  <p className="text-neutral-300">{selectedDoc.views}</p>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 text-[10px] tracking-wider h-8">
                  <Eye className="w-3 h-3 mr-2" />
                  READ
                </Button>
                <Button className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 text-[10px] tracking-wider h-8">
                  <ThumbsUp className="w-3 h-3 mr-2" />
                  LIKE
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
