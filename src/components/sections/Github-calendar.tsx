import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function GithubCalendar() {
  const username = "saranshhalwai";

  return (
    <div className="px-6 max-w-7xl mx-auto mb-32">
      <Card className="border border-zinc-200 dark:border-white/10 bg-white/60 dark:bg-zinc-900/40 backdrop-blur-xl rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
        <CardHeader className="pt-8 pb-4 text-center">
          <CardTitle className="text-4xl font-serif font-medium text-zinc-900 dark:text-zinc-100 mb-2">
            GitHub Contributions
          </CardTitle>
          <div className="h-1 w-16 bg-indigo-500 rounded-full mx-auto"></div>
        </CardHeader>
        <CardContent className="overflow-x-auto px-8 pb-8 flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://ghchart.rshah.org/6366f1/${username}`}
            alt="GitHub contribution graph"
            className="w-full max-w-5xl opacity-90 dark:invert-[0.85] dark:hue-rotate-180 transition-all duration-300 ease-in-out hover:opacity-100 hover:scale-[1.01]"
          />
        </CardContent>
      </Card>
    </div>
  )
}
