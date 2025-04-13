"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface FontListResponse {
  fonts: string[]
  count: number
}

export default function FontBrowser() {
  const [fonts, setFonts] = useState<string[]>([])
  const [filteredFonts, setFilteredFonts] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [previewText, setPreviewText] = useState("Hello")
  const [selectedFont, setSelectedFont] = useState<string | null>(null)
  const [previewResult, setPreviewResult] = useState<string | null>(null)
  const [previewLoading, setPreviewLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchFonts()
  }, [])

  useEffect(() => {
    if (fonts.length > 0) {
      setFilteredFonts(fonts.filter((font) => font.toLowerCase().includes(searchTerm.toLowerCase())))
    }
  }, [searchTerm, fonts])

  const fetchFonts = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/fonts")
      const data: FontListResponse = await response.json()
      setFonts(data.fonts)
      setFilteredFonts(data.fonts)
    } catch (error) {
      console.error("Error fetching fonts:", error)
      toast({
        title: "Error",
        description: "Failed to load fonts. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const previewFont = async (fontName: string) => {
    setSelectedFont(fontName)
    setPreviewLoading(true)

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: previewText,
          font: fontName,
          width: 80,
          justify: "center",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate preview")
      }

      const data = await response.json()
      setPreviewResult(data.ascii_art)
    } catch (error) {
      console.error("Error generating preview:", error)
      toast({
        title: "Error",
        description: "Failed to generate font preview. Please try again.",
        variant: "destructive",
      })
    } finally {
      setPreviewLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                placeholder="Search fonts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="Preview text"
                value={previewText}
                onChange={(e) => setPreviewText(e.target.value)}
                className="flex-1"
              />
            </div>

            <div className="text-sm text-slate-500">
              {loading ? "Loading fonts..." : `${filteredFonts.length} fonts available`}
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-[400px] overflow-y-auto p-1">
                {filteredFonts.map((font) => (
                  <Button
                    key={font}
                    variant={selectedFont === font ? "default" : "outline"}
                    className="justify-start overflow-hidden text-ellipsis whitespace-nowrap"
                    onClick={() => previewFont(font)}
                  >
                    {font}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedFont && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-2">Preview of "{selectedFont}" font</h3>
            <div className="bg-slate-950 text-slate-50 p-4 rounded-md overflow-x-auto min-h-[100px]">
              {previewLoading ? (
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                </div>
              ) : (
                <pre className="font-mono text-sm whitespace-pre">{previewResult}</pre>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
