import { NextResponse } from "next/server"

export async function GET() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/figlet/random`)

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error generating random ASCII art:", error)
    return NextResponse.json({ error: "Failed to generate random ASCII art" }, { status: 500 })
  }
}
