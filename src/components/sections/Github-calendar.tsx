import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function GithubCalendar() {
  const username = "saranshhalwai";

  return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            GitHub Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <img
              src={`https://ghchart.rshah.org/16a34a/${username}`}
              alt="GitHub contribution graph"
              className="w-full opacity-90 dark:invert-[0.85]"
          />
        </CardContent>
      </Card>
  )
}
