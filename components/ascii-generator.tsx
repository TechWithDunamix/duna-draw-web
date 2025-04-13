"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2, Copy, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Font {
  name: string
}

interface AsciiArt {
  ascii_art: string
  font_used: string
  metadata: Record<string, any>
}

export default function AsciiGenerator() {
  const [text, setText] = useState("Hello World")
  const [font, setFont] = useState("standard")
  const [width, setWidth] = useState(80)
  const [justify, setJustify] = useState("center")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AsciiArt | null>(null)
  const [fonts, setFonts] = useState<string[]>([])
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  // Fetch fonts on component mount
  useEffect(() => {
    fetchFonts()
  }, [])

  const fetchFonts = async () => {
    try {
      const response = await fetch("/api/fonts")
      const data = await response.json()
      setFonts(data.fonts)
    } catch (error) {
      console.error("Error fetching fonts:", error)
      toast({
        title: "Error",
        description: "Failed to load fonts. Please try again.",
        variant: "destructive",
      })
    }
  }

  const generateAscii = async () => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to generate ASCII art.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          font,
          width,
          justify,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate ASCII art")
      }

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error("Error generating ASCII art:", error)
      toast({
        title: "Error",
        description: "Failed to generate ASCII art. Please try again.",
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
    <div className="space-y-8">
      <Card>
        <CardContent className="pt-6">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              generateAscii()
            }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label htmlFor="text">Text</Label>
              <Input
                id="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text to convert"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="font">Font</Label>
              <Select value={font} onValueChange={setFont}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a font" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {fonts.length > 0 ? (
                    fonts.map((fontName) => (
                      <SelectItem key={fontName} value={fontName}>
                        {fontName}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="standard">standard</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="width">Width: {width}</Label>
              <Slider
                id="width"
                min={40}
                max={200}
                step={5}
                value={[width]}
                onValueChange={(value) => setWidth(value[0])}
              />
            </div>

            <div className="space-y-2">
              <Label>Justify</Label>
              <RadioGroup value={justify} onValueChange={setJustify} className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="left" id="left" />
                  <Label htmlFor="left">Left</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="center" id="center" />
                  <Label htmlFor="center">Center</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="right" id="right" />
                  <Label htmlFor="right">Right</Label>
                </div>
              </RadioGroup>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
                </>
              ) : (
                "Generate ASCII Art"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Result (Font: {result.font_used})</h3>
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
