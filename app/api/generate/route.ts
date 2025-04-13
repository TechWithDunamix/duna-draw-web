import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/figlet/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error generating ASCII art:", error)
    return NextResponse.json({ error: "Failed to generate ASCII art" }, { status: 500 })
  }
}
