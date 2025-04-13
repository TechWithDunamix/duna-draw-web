import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AsciiGenerator from "@/components/ascii-generator"
import FontBrowser from "@/components/font-browser"
import RandomAscii from "@/components/random-ascii"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-200 dark:to-slate-400">
              DunaDraw 
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Create beautiful ASCII art from text using DunaDraw  hundreds of fonts
          </p>
        </header>

        <main>
          <Tabs defaultValue="generator" className="max-w-4xl mx-auto">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="generator">Generate ASCII</TabsTrigger>
              <TabsTrigger value="fonts">Browse Fonts</TabsTrigger>
              <TabsTrigger value="random">Random Art</TabsTrigger>
            </TabsList>
            <TabsContent value="generator">
              <AsciiGenerator />
            </TabsContent>
            <TabsContent value="fonts">
              <FontBrowser />
            </TabsContent>
            <TabsContent value="random">
              <RandomAscii />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
