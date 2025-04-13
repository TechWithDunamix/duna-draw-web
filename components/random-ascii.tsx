"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, RefreshCw, Copy, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AsciiArt {
  ascii_art: string
  font_used: string
  metadata: Record<string, any>
}

export default function RandomAscii() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AsciiArt | null>(null)
  const [customText, setCustomText] = useState("")
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const generateRandom = async () => {
    setLoading(true)
    try {
      let url = "/api/random"

      // If custom text is provided, use the generate endpoint with random font
      if (customText.trim()) {
        url = "/api/generate"
      }

      const response = await fetch(url, {
        method: customText.trim() ? "POST" : "GET",
        headers: customText.trim() ? { "Content-Type": "application/json" } : undefined,
        body: customText.trim()
          ? JSON.stringify({
              text: customText,
              // Let the server pick a random font
              width: 80,
              justify: "center",
            })
          : undefined,
      })

      if (!response.ok) {
        throw new Error("Failed to generate random ASCII art")
      }

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error("Error generating random ASCII art:", error)
      toast({
        title: "Error",
        description: "Failed to generate random ASCII art. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result.ascii_art)
      setCopied(true)
      toast({
        title: "Copied!",
        description: "ASCII art copied to clipboard",
      })
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                placeholder="Optional: Enter custom text for random font"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                className="flex-1"
              />
              <Button onClick={generateRandom} disabled={loading} className="whitespace-nowrap">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" /> Generate Random
                  </>
                )}
              </Button>
            </div>

            <p className="text-sm text-slate-500">
              {customText.trim()
                ? "Click generate to see your text in a random font"
                : "Click generate to get completely random ASCII art"}
            </p>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Random ASCII Art (Font: {result.font_used})</h3>
              <Button variant="outline" size="sm" onClick={copyToClipboard}>
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" /> Copy
                  </>
                )}
              </Button>
            </div>
            <div className="bg-slate-950 text-slate-50 p-4 rounded-md overflow-x-auto">
              <pre className="font-mono text-sm whitespace-pre">{result.ascii_art}</pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
